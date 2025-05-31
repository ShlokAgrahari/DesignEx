import type { NextConfig } from "next";

const nextConfig = {
  env: {
    MONGO_URL: process.env.MONGO_URL,
  },
  images:{
    remotePatterns:[
    {
      protocol:'https',
      hostname:'liveblocks.io',
      port:''
    }
  ]
  }
  
  
};

export default nextConfig;
