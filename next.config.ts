import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN devices to connect during development
  allowedDevOrigins: ["192.168.50.247"],
};

export default nextConfig;
