/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }, { hostname: "via.placeholder.com" }],
  },
};

export default nextConfig;
