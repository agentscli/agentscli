import { defineCollection } from 'astro:content';
// Zod comes from `astro/zod` rather than `astro:content`: Astro 7 deprecates the
// `astro:content` re-export, and Starlight's own schema types are built against
// the `astro/zod` instance, so sharing it keeps the extended types assignable.
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
  docs: defineCollection({
    // Blog posts are rendered by custom routes under src/pages/blog/.
    // Excluding them here prevents Starlight's catch-all route from claiming
    // the same URLs and emitting route-conflict warnings during the build.
    loader: glob({ pattern: ['**/[^_]*.{md,mdx}', '!blog/**'], base: './src/content/docs' }),
    schema: docsSchema(),
  }),
  blog: defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/docs/blog' }),
    schema: docsSchema({
      // `title` and `description` are the on-page headline and subtitle, and
      // they are written as claims. `seoTitle` and `seoDescription` are the
      // search surface, written the way a reader would phrase the query. Both
      // are optional and fall back to their on-page counterpart.
      //
      // The blog fields are added with `.extend()`, not `.and()`. Starlight
      // 0.42 narrowed the schemas its `extend` option accepts to objects and
      // unions of objects, so an intersection still validates at runtime but
      // resolves to the bare docs schema in types, which drops `date` and the
      // SEO fields from `entry.data`.
      extend: (context) =>
        blogSchema(context).extend({
          seoTitle: z.string().max(70).optional(),
          seoDescription: z.string().max(160).optional(),
        }),
    }),
  }),
  toolInstructions: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/tool-instructions' }),
    // Zod 4 deprecates `.passthrough()`; `looseObject` is the replacement for
    // an object schema that keeps unknown keys.
    schema: z.looseObject({}),
  }),
};
