// Cover image resolver for blog posts.
//
// Convention: src/assets/blog/<slug>/hero.{webp,png,jpg}
// Centralized so a future R2 migration (or change of convention) is one edit
// here, not a sweep across every page that renders a card.

import type { ImageMetadata } from "astro";

// Eagerly load all hero images at build time so the resolver is synchronous
// and works inside Astro components that can't await.
const heroes = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/blog/*/hero.{webp,png,jpg,jpeg}",
  { eager: true },
);

/**
 * Resolve a blog post's hero image by slug.
 *
 * @param postId - Either a raw slug ("the-gap") or a content-collection id
 *                 ("blog/the-gap"). Both forms accepted.
 * @returns The ImageMetadata if a hero file exists, otherwise null. Callers
 *          should render a styled fallback when null.
 */
export function getHero(postId: string): ImageMetadata | null {
  const slug = postId.replace(/^blog\//, "");
  const needle = `/blog/${slug}/hero.`;
  for (const path in heroes) {
    if (path.includes(needle)) {
      return heroes[path].default;
    }
  }
  return null;
}
