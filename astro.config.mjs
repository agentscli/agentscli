// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import react from '@astrojs/react';

// Cloudflare Web Analytics beacon token (public value — safe to commit).
// Get it from the Cloudflare dashboard → Web Analytics → add agentscli.com → copy token.
// Set CF_BEACON_TOKEN in the build env, or paste the token as the '' fallback below.
// Leave empty to disable the beacon (keeps local dev clean).
const CF_BEACON_TOKEN = process.env.CF_BEACON_TOKEN ?? '';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.agentscli.com',
	integrations: [
		react(),
		starlight({
			title: 'agents.cli',
			logo: {
				src: './public/logo.svg',
				replacesTitle: true,
			},
			// Apply custom dark/purple theme globally to all pages
			customCss: ['./src/styles/theme.css'],
			components: {
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/agentscli' }],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: 'anonymous',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&display=swap',
					},
				},
				// Cloudflare Web Analytics — privacy-friendly, cookieless. Only emitted
				// when CF_BEACON_TOKEN is set, so local dev and untokened builds stay clean.
				...(CF_BEACON_TOKEN
					? [
							{
								tag: 'script',
								attrs: {
									defer: true,
									src: 'https://static.cloudflareinsights.com/beacon.min.js',
									'data-cf-beacon': `{"token": "${CF_BEACON_TOKEN}"}`,
								},
							},
						]
					: []),
			],
			plugins: [
				starlightBlog({
					authors: {
						sourabh: {
							name: 'Sourabh Kushwah',
							title: 'Software Engineer',
						},
						sanjay: {
							name: 'Sanjay Kushwah',
							title: 'Software Engineer',
						},
					},
				}),
			],
			sidebar: [
				{
					label: 'Foundations',
					items: [
						{ label: 'Overview', slug: 'foundations' },
						{ label: 'Rules', slug: 'foundations/rules' },
						{ label: 'Subagents', slug: 'foundations/subagents' },
						{ label: 'Model selection', slug: 'foundations/model-selection' },
						{ label: 'Slash commands', slug: 'foundations/slash-commands' },
						{ label: 'Skills', slug: 'foundations/skills' },
						{ label: 'MCP servers', slug: 'foundations/mcp-servers' },
						{ label: 'Hooks', slug: 'foundations/hooks' },
						{ label: 'Permissions & sandboxing', slug: 'foundations/permissions' },
						{ label: 'Plan mode', slug: 'foundations/plan-mode' },
						{ label: 'Configuration', slug: 'foundations/configuration' },
						{ label: 'Headless & CI', slug: 'foundations/headless' },
						{ label: 'Plugins & marketplaces', slug: 'foundations/plugins' },
					],
				},
			],
		}),
	],
});