import { getCollection } from 'astro:content';

// Number of posts shown per blog listing page.
export const PAGE_SIZE = 10;

// True for blog entries that are publishable: dated AND not draft.
// Content collections do NOT auto-exclude drafts - every route that lists or
// renders posts must go through this predicate or drafts leak into prod.
export function isPublishedPost(doc: { data: Record<string, unknown> }): boolean {
  return 'date' in doc.data && Boolean(doc.data.date) && !doc.data.draft;
}

// All published blog posts, newest first.
export async function getBlogPosts() {
  const allPosts = await getCollection('blog');
  return allPosts
    .filter(isPublishedPost)
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
