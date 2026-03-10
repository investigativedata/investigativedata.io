"""Asset URL resolution — mirrors getFileUrl() from lib/directus.tsx."""

from build.directus import ASSETS_BASE_URL


def get_file_url(file_id: str | None, base_url: str = ASSETS_BASE_URL) -> str:
    """Convert a Directus file ID to a full asset URL."""
    if not file_id or not isinstance(file_id, str):
        return ""
    if file_id.startswith("http"):
        return file_id
    return base_url + file_id


# Fields that contain file IDs needing resolution
_FILE_FIELDS = {"src", "image", "backgroundImage", "file", "logo", "icon"}
_NESTED_IMAGE_FIELDS = {"heroImage", "articleImage"}


def resolve_file_urls(obj, base_url: str = ASSETS_BASE_URL):
    """Recursively walk a data structure and resolve all file ID fields to URLs."""
    if isinstance(obj, dict):
        result = {}
        for k, v in obj.items():
            if k in _FILE_FIELDS and isinstance(v, str):
                result[k] = get_file_url(v, base_url)
            elif k == "mediaSrc" and isinstance(v, str):
                result[k] = get_file_url(v, base_url)
            elif k in _NESTED_IMAGE_FIELDS and isinstance(v, dict):
                result[k] = resolve_file_urls(v, base_url)
            elif isinstance(v, (dict, list)):
                result[k] = resolve_file_urls(v, base_url)
            else:
                result[k] = v
        return result
    elif isinstance(obj, list):
        return [resolve_file_urls(item, base_url) for item in obj]
    return obj
