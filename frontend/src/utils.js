// helper to resolve image paths returned by DRF ImageField
export function resolveImage(img) {
  const placeholder = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=60";
  if (!img) return placeholder;
  if (img.startsWith("http")) return img;
  const base = import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace("/api", "") : "http://127.0.0.1:8000";
  return base + img;
}

