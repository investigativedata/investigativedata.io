export const DEFAULT_TITLE =
  "OpenAleph, the versatile open source search platform by the Data and Research Center – DARC, originally started by OCCRP as Aleph";
export const DIRECTUS_SITE =
  process.env.NEXT_PUBLIC_DIRECTUS_SITE || "investigativedata.io";
export const DIRECTUS_URL =
  process.env.DIRECTUS_URL || "https://cms.investigativedata.net";
export const ASSETS_BASE_URL =
  process.env.ASSETS_BASE_URL || "https://assets.investigativedata.org/cms/";
export const DIRECTUS_DRAFT_TOKEN =
  process.env.DIRECTUS_DRAFT_TOKEN || "secret-draft-token";
export const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN || "";

export const PREVIEW = (process.env.PREVIEW || "1") === "1";

// const status_filter = PREVIEW ? {} : { page: { status: { _eq: "published" } } };
const status_filter = PREVIEW ? {} : {};

export const DIRECTUS_DEFAULT_PAGE_FILTER = {
  ...status_filter,
  site: { name: { _eq: DIRECTUS_SITE } },
};
