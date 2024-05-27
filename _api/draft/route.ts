import { draftMode } from "next/headers";
import { readItem } from "@directus/sdk";

import directus from "@/lib/directus";
import { DIRECTUS_DRAFT_TOKEN } from "@/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  if (token !== DIRECTUS_DRAFT_TOKEN) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!id) {
    return new Response("Missing id", { status: 401 });
  }

  const page = await directus.request(readItem("pages", id));

  if (!page) {
    return new Response("Invalid id", { status: 401 });
  }

  draftMode().enable();

  return new Response(null, {
    status: 307,
    headers: {
      Location: `/${page.slug}`,
    },
  });
}
