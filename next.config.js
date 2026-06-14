/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "sharp", "pdf-lib", "mammoth", "pdf-parse", "xlsx", "docx", "mysql2", "bcryptjs", "pdfjs-dist", "pdf2json",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent pdf-parse from trying to load its test files
      config.externals = [...(config.externals || []), "pdf-parse"];
    }
    // Ignore canvas (optional dep of some pdf libs)
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
