export function formatTownName(townSlug: string): string {
  if (!townSlug) return '';
  return townSlug
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
