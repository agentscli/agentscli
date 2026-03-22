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
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
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
						james: {
							name: 'James Dalton',
							title: 'Lead Engineer',
							picture: '/authors/james.jpg',
						},
						elena: {
							name: 'Elena Luo',
							title: 'Rust Developer',
							picture: '/authors/elena.jpg',
						},
						marcus: {
							name: 'Marcus Kovic',
							title: 'Technical Writer',
							picture: '/authors/marcus.jpg',
						},
					},
				}),
			],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Getting Started', slug: 'guides/getting-started' },
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});