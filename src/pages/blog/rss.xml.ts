import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getBlogPosts } from '../../lib/blog';

// RSS feed for the blog. Replaces the feed starlight-blog used to generate at
// this same path; served at /blog/rss.xml and advertised via
// <link rel="alternate"> in the blog layouts.
export async function GET(context: APIContext) {
  const posts = await getBlogPosts();

  return rss({
    title: 'agents.cli blog',
    description:
      'Technical insights into multi-agent orchestration, local protocols, and developer-centric terminal workflows.',
    site: context.site ?? 'https://www.agentscli.com',
    items: posts.map((post) => {
      const data = post.data as any;
      return {
        title: data.seoTitle || data.title,
        description: data.description || data.excerpt || '',
        pubDate: new Date(data.date),
        link: `/blog/${post.id.replace('blog/', '')}/`,
        categories: data.tags || [],
      };
    }),
  });
}
