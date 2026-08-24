import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'host.docker.internal' },
    ],
  },
  webpack: (config) => {
    // Explicit '@' alias (mirrors tsconfig paths). Declared here so it resolves
    // reliably across environments (notably the production Docker build).
    config.resolve.alias['@'] = path.join(__dirname, 'src')
    return config
  },
  experimental: {
    optimizePackageImports: ['react-aria-components', 'lucide-react'],
  },
}

export default nextConfig
