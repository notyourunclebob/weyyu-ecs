import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'krjl10kdwkveuqax.public.blob.vercel-storage.com'
    }]
  }
};

export default nextConfig;
