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
      extend: (context) => blogSchema(context),
    }),
  }),
  toolInstructions: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/tool-instructions' }),
    schema: z.object({}).passthrough(),
  }),
};
