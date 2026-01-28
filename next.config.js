/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Don't fail builds on type errors (temporary for deployment)
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig