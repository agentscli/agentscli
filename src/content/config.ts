import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { blogSchema } from 'starlight-blog/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: blogSchema,
});

const toolInstructions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tool-instructions' }),
  schema: z.object({}).passthrough(),
});

export const collections = {
  docs,
  toolInstructions,
};
