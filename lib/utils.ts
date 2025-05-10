/**
 * Generates a slug from a string (e.g., "Ayn Rand" -> "ayn-rand")
 */
export function generateSlug(name: unknown): string {
  if (typeof name !== 'string' || !name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
} 