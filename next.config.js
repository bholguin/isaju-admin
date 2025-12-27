/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    domains: ['localhost'],
    // Para desarrollo, permitir imágenes locales
    unoptimized: process.env.NODE_ENV === 'development',
    // Configuración adicional para imágenes locales
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig

