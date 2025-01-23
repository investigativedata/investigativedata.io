/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.EXPORT === "1" ? "export" : "standalone",
  trailingSlash: true,
  transpilePackages: ["next-mdx-remote"], // FIXME: https://github.com/hashicorp/next-mdx-remote/issues/381
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.investigativedata.net",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
