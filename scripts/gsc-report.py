#!/usr/bin/env python3
"""Weekly Search Console report for helanotan.se.

Organic acquisition is the site's binding constraint: 101 impressions and 5
clicks across sixteen months, against an average position of 7.9. Ranking is
not the problem — having pages that answer a query anyone types is. The
/bilar/[modell] pages are the bet against that, and impressions accumulate in
the hundreds long before clicks do, so this is the only instrument with enough
volume to judge them in weeks rather than months.

Usage:
    python3 scripts/gsc-report.py [--days 28] [--inspect]

Credentials come from GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY in the
environment, or from ~/projects/upnorthai/.env.local as a fallback. Reading
requires the service account to hold at least "Full" on the property; --inspect
additionally requires "Owner".
"""
from __future__ import annotations

import argparse
import base64
import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

SITE = "sc-domain:helanotan.se"
ENV_FALLBACK = os.path.expanduser("~/projects/upnorthai/.env.local")
MODEL_PREFIX = "/bilar"


def credentials() -> tuple[str, str]:
    email = os.environ.get("GOOGLE_CLIENT_EMAIL")
    key = os.environ.get("GOOGLE_PRIVATE_KEY")
    if email and key:
        return email, key.replace("\\n", "\n")
    if not os.path.exists(ENV_FALLBACK):
        sys.exit("No GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY, and no .env.local")
    env = {}
    for line in open(ENV_FALLBACK, encoding="utf-8"):
        m = re.match(r"^([A-Z_]+)=(.*)$", line.strip())
        if m:
            v = m.group(2)
            if v.startswith('"') and v.endswith('"'):
                v = v[1:-1]
            env[m.group(1)] = v.replace("\\n", "\n").strip()
    return env["GOOGLE_CLIENT_EMAIL"], env["GOOGLE_PRIVATE_KEY"]


def access_token(email: str, private_key: str) -> str:
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    def b64(d: bytes) -> bytes:
        return base64.urlsafe_b64encode(d).rstrip(b"=")

    now = int(time.time())
    header = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claims = b64(json.dumps({
        "iss": email,
        "scope": "https://www.googleapis.com/auth/webmasters",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600, "iat": now,
    }).encode())
    signing_input = header + b"." + claims
    key = serialization.load_pem_private_key(private_key.encode(), password=None)
    sig = key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256())
    body = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": (signing_input + b"." + b64(sig)).decode(),
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=body)
    return json.load(urllib.request.urlopen(req))["access_token"]


def call(token: str, url: str, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {token}", "Content-Type": "application/json",
    })
    try:
        return json.load(urllib.request.urlopen(req, timeout=30))
    except urllib.error.HTTPError as e:
        return {"__error__": e.code, "body": e.read().decode()[:300]}


def search_analytics(token, start, end, dims, limit=25):
    url = ("https://www.googleapis.com/webmasters/v3/sites/"
           + urllib.parse.quote(SITE, safe="") + "/searchAnalytics/query")
    r = call(token, url, {"startDate": start, "endDate": end,
                          "dimensions": dims, "rowLimit": limit})
    return r.get("rows") or []


def inspect(token, url):
    r = call(token, "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
             {"inspectionUrl": url, "siteUrl": SITE, "languageCode": "sv"})
    if "__error__" in r:
        return {"coverage": f"FEL {r['__error__']}", "crawled": "—"}
    s = r["inspectionResult"]["indexStatusResult"]
    return {
        "coverage": s.get("coverageState", "?"),
        "crawled": (s.get("lastCrawlTime") or "aldrig")[:10],
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--inspect", action="store_true",
                    help="Check index status per URL (needs Owner permission)")
    args = ap.parse_args()

    token = access_token(*credentials())
    today = datetime.date.today()
    # Search Console lags roughly two days; asking for today yields empty rows
    # and makes a healthy week look dead.
    end = (today - datetime.timedelta(days=2)).isoformat()
    start = (today - datetime.timedelta(days=args.days + 2)).isoformat()

    print(f"HELANOTAN.SE — Search Console, {start} → {end}\n")

    rows = search_analytics(token, start, end, [], limit=1)
    if rows:
        d = rows[0]
        print(f"  visningar {int(d['impressions']):>6}   klick {int(d['clicks']):>4}   "
              f"CTR {d['ctr']*100:5.2f}%   position {d['position']:.1f}")
    else:
        print("  inga rader i perioden")

    pages = search_analytics(token, start, end, ["page"], limit=200)
    model = [p for p in pages if MODEL_PREFIX in p["keys"][0]]
    other = [p for p in pages if MODEL_PREFIX not in p["keys"][0]]

    def block(title, rows_):
        imp = sum(int(r["impressions"]) for r in rows_)
        clk = sum(int(r["clicks"]) for r in rows_)
        print(f"\n  {title}: {len(rows_)} sidor, {imp} visningar, {clk} klick")
        for r in sorted(rows_, key=lambda r: -r["impressions"])[:12]:
            path = r["keys"][0].replace("https://helanotan.se", "") or "/"
            print(f"    {path[:48]:48} vis={int(r['impressions']):>4} "
                  f"klick={int(r['clicks']):>3} pos={r['position']:.1f}")

    block("MODELLSIDOR", model)
    block("ÖVRIGA SIDOR", other)

    queries = search_analytics(token, start, end, ["query"], limit=25)
    print(f"\n  SÖKFRÅGOR (över anonymiseringströskeln): {len(queries)}")
    for r in queries[:15]:
        print(f"    {r['keys'][0][:48]:48} vis={int(r['impressions']):>4} "
              f"klick={int(r['clicks']):>3} pos={r['position']:.1f}")

    sm = call(token, "https://www.googleapis.com/webmasters/v3/sites/"
              + urllib.parse.quote(SITE, safe="") + "/sitemaps")
    for s in sm.get("sitemap", []):
        c = (s.get("contents") or [{}])[0]
        print(f"\n  SITEMAP {s['path']}")
        print(f"    inskickad {s.get('lastSubmitted','?')[:10]}  "
              f"hämtad {s.get('lastDownloaded','aldrig')[:10]}  "
              f"URL:er {c.get('submitted','?')}  fel {s.get('errors','?')}")

    if args.inspect:
        print("\n  INDEXSTATUS")
        targets = ["https://helanotan.se/", "https://helanotan.se/bilar"]
        targets += [p["keys"][0] for p in model[:8]]
        seen = set()
        for u in targets:
            if u in seen:
                continue
            seen.add(u)
            r = inspect(token, u)
            path = u.replace("https://helanotan.se", "") or "/"
            print(f"    {path[:44]:44} {r['coverage'][:38]:38} crawlad {r['crawled']}")
            time.sleep(1)


if __name__ == "__main__":
    main()
