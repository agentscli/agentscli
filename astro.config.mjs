// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';
import starlightSidebarTopics from 'starlight-sidebar-topics';
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
			// NOTE: the sidebar is intentionally NOT set here. starlight-sidebar-topics
			// owns the sidebar and splits the site into separate topics (Course /
			// Foundations / Tool guides), each with its own isolated sidebar. The plugin
			// throws if a top-level `sidebar` is also configured.
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
				starlightSidebarTopics(
					[
						{
							label: 'Course',
							link: '/course/claude-code/',
							icon: 'open-book',
							items: [
								{ label: 'Overview', slug: 'course/claude-code' },
								{
									label: 'Getting started',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/getting-started' },
										{ label: 'Install · launch in your repo', slug: 'course/claude-code/getting-started/install' },
										{ label: 'Sign in · first prompt', slug: 'course/claude-code/getting-started/authenticate' },
										{ label: 'First change · read→edit→approve', slug: 'course/claude-code/getting-started/first-change' },
										{ label: 'Review · diff, undo, commit', slug: 'course/claude-code/getting-started/review' },
										{ label: 'Editor · IDE integration', slug: 'course/claude-code/getting-started/editor' },
									],
								},
								{
									label: 'Sessions & context',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/sessions-context' },
										{ label: 'Resume · --continue / --resume', slug: 'course/claude-code/sessions-context/resume' },
										{ label: '/clear · reset window', slug: 'course/claude-code/sessions-context/clear' },
										{ label: '/rewind · undo a run', slug: 'course/claude-code/sessions-context/rewind' },
										{ label: 'Branch · checkpoints + git', slug: 'course/claude-code/sessions-context/branch' },
										{ label: '/context · /usage', slug: 'course/claude-code/sessions-context/inspect' },
										{ label: '/compact · shrink thread', slug: 'course/claude-code/sessions-context/compact' },
									],
								},
								{
									label: 'Permissions & modes',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/permissions-modes' },
										{ label: 'Default · reads free, asks to act', slug: 'course/claude-code/permissions-modes/default' },
										{ label: 'Shift+Tab · accept edits', slug: 'course/claude-code/permissions-modes/modes-ladder' },
										{ label: 'Allow rules · ! shell', slug: 'course/claude-code/permissions-modes/rules' },
										{ label: 'Deny rules · protected paths', slug: 'course/claude-code/permissions-modes/deny' },
										{ label: 'Auto vs bypass · hands-off', slug: 'course/claude-code/permissions-modes/autonomous' },
									],
								},
								{
									label: 'Planning',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/planning' },
										{ label: 'Enter · Shift+Tab / /plan', slug: 'course/claude-code/planning/enter' },
										{ label: 'Approve · review, then build', slug: 'course/claude-code/planning/approve' },
										{ label: 'Persist · save + resume a plan', slug: 'course/claude-code/planning/persist' },
										{ label: 'Ultraplan · plan in the cloud', slug: 'course/claude-code/planning/ultraplan' },
									],
								},
								{
									label: 'Rules & memory',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/rules-memory' },
										{ label: 'Init · /init drafts CLAUDE.md', slug: 'course/claude-code/rules-memory/init' },
										{ label: 'Good rules · what earns its place', slug: 'course/claude-code/rules-memory/good-rules' },
										{ label: 'Hierarchy · how rules layer', slug: 'course/claude-code/rules-memory/hierarchy' },
										{ label: 'Memory · auto memory & /memory', slug: 'course/claude-code/rules-memory/memory' },
									],
								},
								{
									label: 'Models & thinking',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/models-thinking' },
										{ label: '/model · pick the right brain', slug: 'course/claude-code/models-thinking/switch' },
										{ label: 'Thinking · reason before acting', slug: 'course/claude-code/models-thinking/thinking' },
										{ label: 'Cost & speed · spend on purpose', slug: 'course/claude-code/models-thinking/cost' },
									],
								},
								{
									label: 'Subagents',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/subagents' },
										{ label: 'Delegate · isolated context', slug: 'course/claude-code/subagents/delegate' },
										{ label: 'Fan out · parallel slices', slug: 'course/claude-code/subagents/fan-out' },
										{ label: 'Background · Ctrl+B', slug: 'course/claude-code/subagents/background' },
										{ label: 'Custom · reusable agent', slug: 'course/claude-code/subagents/custom' },
									],
								},
								{
									label: 'Skills',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/skills' },
										{ label: 'Create · SKILL.md', slug: 'course/claude-code/skills/create' },
										{ label: 'Trigger · the description', slug: 'course/claude-code/skills/trigger' },
										{ label: 'Choose · skill vs command vs subagent', slug: 'course/claude-code/skills/vs' },
									],
								},
								{
									label: 'Extending Claude Code',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/extending' },
										{ label: 'MCP · claude mcp add', slug: 'course/claude-code/extending/mcp-connect' },
										{ label: 'MCP · scope & trust', slug: 'course/claude-code/extending/mcp-scope' },
										{ label: 'Hooks · PreToolUse gate', slug: 'course/claude-code/extending/hooks-gate' },
										{ label: 'Hooks · vs rules & permissions', slug: 'course/claude-code/extending/hooks-vs' },
										{ label: 'Plugins · bundle the setup', slug: 'course/claude-code/extending/plugins-bundle' },
										{ label: 'Plugins · marketplace & ship', slug: 'course/claude-code/extending/plugins-marketplace' },
									],
								},
								{
									label: 'Automation',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/automation' },
										{ label: 'Headless · -p, output formats', slug: 'course/claude-code/automation/headless' },
										{ label: 'Headless permissions · dontAsk, allow, deny', slug: 'course/claude-code/automation/permissions' },
										{ label: 'CI · GitHub Actions on every PR', slug: 'course/claude-code/automation/ci' },
										{ label: 'Loops · nightly job, guardrails', slug: 'course/claude-code/automation/loops' },
									],
								},
								{
									label: 'Daily workflow',
									items: [
										{ label: 'Module intro', slug: 'course/claude-code/daily-workflow' },
										{ label: 'Inline · ! @ paste', slug: 'course/claude-code/daily-workflow/inline-input' },
										{ label: 'Flow · /btw /recap history', slug: 'course/claude-code/daily-workflow/staying-in-flow' },
										{ label: 'Ergonomics · vim · /config', slug: 'course/claude-code/daily-workflow/ergonomics' },
									],
								},
							],
						},
						{
							label: 'Foundations',
							link: '/foundations/',
							icon: 'add-document',
							items: [
								{ label: 'Overview', slug: 'foundations' },
								{ label: 'How agents work', slug: 'foundations/how-agents-work' },
								{ label: 'Rules', slug: 'foundations/rules' },
								{ label: 'Subagents', slug: 'foundations/subagents' },
								{ label: 'Model selection', slug: 'foundations/model-selection' },
								{ label: 'Slash commands', slug: 'foundations/slash-commands' },
								{ label: 'Skills', slug: 'foundations/skills' },
								{ label: 'MCP servers', slug: 'foundations/mcp-servers' },
								{ label: 'Hooks', slug: 'foundations/hooks' },
								{ label: 'Permissions & sandboxing', slug: 'foundations/permissions' },
								{ label: 'Plan mode', slug: 'foundations/plan-mode' },
								{ label: 'Context window management', slug: 'foundations/context-management' },
								{ label: 'Configuration', slug: 'foundations/configuration' },
								{ label: 'Headless & CI', slug: 'foundations/headless' },
								{ label: 'Plugins & marketplaces', slug: 'foundations/plugins' },
							],
						},
						// NOTE: the legacy "Tool guides" topic (/guide/*) is parked until those
						// pages are committed. Re-add the topic block here when /guide/ lands.
					],
					{
						// The blog has its own sidebar from starlight-blog; keep it out of topics.
						// /guide/** is excluded while its pages are uncommitted (present on disk
						// locally) so the topics plugin's "every page matches a topic" check passes.
						exclude: ['/blog', '/blog/', '/blog/**', '/guide', '/guide/', '/guide/**'],
					},
				),
			],
		}),
	],
});
