// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// TODO: Replace with your GitHub username and repository name
	// site: 'https://USERNAME.github.io',
	// base: '/REPO_NAME',
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