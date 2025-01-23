import { IFileItem } from "@/lib/types";
import Link from "next/link";
import { getFileUrl } from "@/lib/directus";

export default function File({
  file,
  name,
  mimetype,
}: React.PropsWithChildren<IFileItem>) {
  const url = getFileUrl(file);
  return (
    <Link href={url}>
      {name} ({mimetype.toUpperCase()})
    </Link>
  );
}
