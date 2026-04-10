const DEMO_IMAGE_FALLBACKS: Record<string, string> = {
  "jacket-1.jpg": "/placeholders/jacket-1.svg",
  "jacket-2.jpg": "/placeholders/jacket-2.svg",
  "jacket-3.jpg": "/placeholders/jacket-3.svg",
  "finished-1.jpg": "/placeholders/finished-1.svg",
  "finished-2.jpg": "/placeholders/finished-2.svg"
};

const DEFAULT_FALLBACK = "/placeholders/jacket-default.svg";

export function normalizeImageUrl(value: string) {
  if (!value) {
    return DEFAULT_FALLBACK;
  }

  if (value.startsWith("/")) {
    return value;
  }

  const lowerValue = value.toLowerCase();

  if (lowerValue.includes("res.cloudinary.com/demo/image/upload/")) {
    const fallbackEntry = Object.entries(DEMO_IMAGE_FALLBACKS).find(([filename]) =>
      lowerValue.includes(filename)
    );

    return fallbackEntry?.[1] ?? DEFAULT_FALLBACK;
  }

  return value;
}
