const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  transpilePackages: ["next-mdx-remote"], // FIXME: https://github.com/hashicorp/next-mdx-remote/issues/381
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
  images: {
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

// static prod deploy
if (process.env.PREVIEW !== "true") {
  nextConfig.output = "export";
  nextConfig.images.loader = "custom";
  nextConfig.images.loaderFile = "./image-loader.ts";
}

module.exports = withMDX(nextConfig);
