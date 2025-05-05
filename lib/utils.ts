/**
 * Generates a slug from a string (e.g., "Ayn Rand" -> "ayn-rand")
 */
export function generateSlug(name: string): string {
  if (!name) return ''; // Handle cases where name might be undefined or empty
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
} 