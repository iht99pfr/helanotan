import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // /modelldata was the URL; "Metod" was what every link called it, and
        // what a Swedish reader would search for. It had 6 impressions in 90
        // days, so almost nothing to preserve — but a permanent redirect costs
        // nothing and keeps the handful of existing links working.
        source: "/modelldata",
        destination: "/metod",
        permanent: true,
      },
      {
        // The v2.0 spec page has served its purpose; the phases are built.
        source: "/version2/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/version2",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
