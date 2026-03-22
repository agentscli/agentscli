import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { blogSchema } from 'starlight-blog/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: blogSchema,
});

export const collections = {
  docs,
};
