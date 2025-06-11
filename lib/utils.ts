/**
 * Generates a slug from a string (e.g., "Ayn Rand" -> "ayn-rand")
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

// Performance monitoring utilities
export function measurePerformance<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

// Cache invalidation helper
export function shouldInvalidateCache(lastUpdate: number, cacheDuration: number): boolean {
  return Date.now() - lastUpdate > cacheDuration;
}

// Debounce utility for performance-sensitive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 