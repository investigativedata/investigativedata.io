"use client";

// https://nextjs.org/docs/app/building-your-application/deploying/static-exports
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `${src}?width=${width}&quality=${quality || 80}`;
}
