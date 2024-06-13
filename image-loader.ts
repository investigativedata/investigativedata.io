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
  const baseUrl = src.replace(
    "cms.investigativedata.net/assets",
    "assets.investigativedata.org/cms",
  );
  return `${baseUrl}?width=${width}&quality=${quality || 80}`;
}
