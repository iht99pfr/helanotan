import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { unsubscribeToken } from "@/app/lib/email";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe, reachable by GET (the link in the mail) and POST
 * (Gmail's List-Unsubscribe-Post). The token is an HMAC of the address, so
 * knowing someone's email is not enough to unsubscribe them.
 */
async function unsubscribe(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("e") || "";
  const token = req.nextUrl.searchParams.get("t") || "";
  if (!email || token !== unsubscribeToken(email)) {
    return new NextResponse("Ogiltig avregistreringslänk.", {
      status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const sql = getDb();
  await sql`DELETE FROM car_watchers WHERE lower(email) = lower(${email})`;
  await sql`DELETE FROM deal_subscriptions WHERE lower(email) = lower(${email})`;
  return new NextResponse(
    `Klart. ${email} får inga fler utskick från Hela Notan.`,
    { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
}

export async function GET(req: NextRequest) {
  return unsubscribe(req);
}

export async function POST(req: NextRequest) {
  return unsubscribe(req);
}
