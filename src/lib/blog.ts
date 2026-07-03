import { getCollection } from 'astro:content';

// Number of posts shown per blog listing page.
export const PAGE_SIZE = 10;

// All blog posts (docs with a date), newest first.
export async function getBlogPosts() {
  const allDocs = await getCollection('docs');
  return allDocs
    .filter(doc => 'date' in doc.data && doc.data.date)
    .sort((a, b) =>
      new Date((b.data as any).date).valueOf() - new Date((a.data as any).date).valueOf()
    );
}

// Unique tags across all posts, for the filter pills.
export function getAllTags(posts: any[]): string[] {
  return [...new Set(posts.flatMap(p => (p.data as any).tags || []))];
}

// Build the /blog URL for a given 1-indexed page (page 1 => /blog).
export function pageUrl(page: number): string {
  return page <= 1 ? '/blog' : `/blog/${page}`;
}
