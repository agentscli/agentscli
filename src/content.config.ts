import { defineCollection, z } from 'astro:content';
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
      extend: (context) =>
        blogSchema(context).and(
          z.object({
            seoTitle: z.string().max(70).optional(),
            seoDescription: z.string().max(160).optional(),
          }),
        ),
    }),
  }),
  toolInstructions: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/tool-instructions' }),
    schema: z.object({}).passthrough(),
  }),
};
