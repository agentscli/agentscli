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
				light: './src/assets/logo-light.png',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			// Apply custom dark/purple theme globally to all pages
			customCss: ['./src/styles/theme.css'],
			components: {
				ThemeSelect: './src/components/ThemeSelect.astro',
				// Custom Sidebar override. It wins over starlight-sidebar-topics'
				// own Sidebar override (the plugin merges user components last) and
				// swaps the flat topic switcher for one that nests the course
				// topics (Claude Code, Codex) under the "Courses" parent.
				Sidebar: './src/components/Sidebar.astro',
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/agentscli' }],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						type: 'image/svg+xml',
						href: '/favicon.svg',
					},
				},
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
			// owns the sidebar and splits the site into separate topics, each with its
			// own isolated sidebar. The plugin throws if a top-level `sidebar` is also
			// configured. The two course topics (Claude Code, Codex) are siblings of
			// the "Courses" hub; the custom Sidebar override nests them under it in the
			// switcher so each course opens in isolation.
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
							label: 'Courses',
							link: '/course/',
							icon: 'open-book',
							items: [
								{ label: 'Claude Code', link: '/course/claude-code/' },
								{ label: 'Codex', link: '/course/codex/' },
								{ label: 'GitHub Copilot', link: '/course/copilot/' },
							],
						},
						{
							label: 'Claude Code',
							link: '/course/claude-code/',
							icon: 'open-book',
							items: [
								{ label: 'Claude Code overview', slug: 'course/claude-code' },
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
							label: 'Codex',
							link: '/course/codex/',
							icon: 'open-book',
							items: [
								{ label: 'Codex overview', slug: 'course/codex' },
								{
									label: 'Getting started',
									items: [
										{ label: 'Module intro', slug: 'course/codex/getting-started' },
										{ label: 'Install · the CLI & surfaces', slug: 'course/codex/getting-started/install' },
										{ label: 'Authenticate · sign-in vs API key', slug: 'course/codex/getting-started/authenticate' },
										{ label: 'The loop · read→propose→approve', slug: 'course/codex/getting-started/the-loop' },
										{ label: 'First change · fix, review, commit', slug: 'course/codex/getting-started/first-change' },
										{ label: 'Editor · IDE integration', slug: 'course/codex/getting-started/editor' },
									],
								},
								{
									label: 'Sessions & context',
									items: [
										{ label: 'Module intro', slug: 'course/codex/sessions-context' },
										{ label: 'Resume · codex resume / --last', slug: 'course/codex/sessions-context/resume' },
										{ label: '/fork · two approaches', slug: 'course/codex/sessions-context/fork' },
										{ label: '/side · quick tangent', slug: 'course/codex/sessions-context/side' },
										{ label: '/compact · shrink thread', slug: 'course/codex/sessions-context/compact' },
										{ label: '/status · window usage', slug: 'course/codex/sessions-context/status' },
										{ label: '/new & /clear · reset', slug: 'course/codex/sessions-context/reset' },
									],
								},
								{
									label: 'Approvals & sandbox',
									items: [
										{ label: 'Module intro', slug: 'course/codex/approvals-sandbox' },
										{ label: 'Two axes · -a × -s', slug: 'course/codex/approvals-sandbox/two-axis' },
										{ label: 'Sandbox levels · the wall', slug: 'course/codex/approvals-sandbox/sandbox-modes' },
										{ label: 'Approval policies · the checkpoint', slug: 'course/codex/approvals-sandbox/approval-modes' },
										{ label: 'Network & dirs · network-off default', slug: 'course/codex/approvals-sandbox/network-and-dirs' },
										{ label: 'Profiles · trust as one flag', slug: 'course/codex/approvals-sandbox/profiles-for-trust' },
									],
								},
								{
									label: 'Rules (AGENTS.md)',
									items: [
										{ label: 'Module intro', slug: 'course/codex/rules' },
										{ label: 'First AGENTS.md · capture facts', slug: 'course/codex/rules/first-agents-md' },
										{ label: 'Hierarchy · how rules layer', slug: 'course/codex/rules/the-hierarchy' },
										{ label: 'Good rules · what Codex follows', slug: 'course/codex/rules/good-rules' },
										{ label: 'Not a boundary · size cap & limits', slug: 'course/codex/rules/not-a-boundary' },
									],
								},
								{
									label: 'Models & effort',
									items: [
										{ label: 'Module intro', slug: 'course/codex/models-effort' },
										{ label: 'The effort dial · think as hard as needed', slug: 'course/codex/models-effort/the-effort-dial' },
										{ label: 'Switch models · /model & --model', slug: 'course/codex/models-effort/switch-models' },
										{ label: 'Profiles · a whole posture', slug: 'course/codex/models-effort/profiles' },
										{ label: 'Cost-aware · spend where it pays', slug: 'course/codex/models-effort/cost-aware' },
									],
								},
								{
									label: 'Subagents',
									items: [
										{ label: 'Module intro', slug: 'course/codex/subagents' },
										{ label: 'Delegate · isolated context', slug: 'course/codex/subagents/delegate' },
										{ label: 'Fan out · parallel slices', slug: 'course/codex/subagents/fan-out' },
										{ label: 'Worktrees · conflict-free edits', slug: 'course/codex/subagents/worktrees' },
										{ label: 'Orchestrate · gate and merge', slug: 'course/codex/subagents/orchestrate' },
									],
								},
								{
									label: 'Skills',
									items: [
										{ label: 'Module intro', slug: 'course/codex/skills' },
										{ label: 'Create · SKILL.md', slug: 'course/codex/skills/create' },
										{ label: 'Trigger · the description', slug: 'course/codex/skills/trigger' },
										{ label: 'Choose · Skill vs rule vs prompt', slug: 'course/codex/skills/vs' },
									],
								},
								{
									label: 'Extending Codex',
									items: [
										{ label: 'Module intro', slug: 'course/codex/extending' },
										{ label: 'MCP · connect a server', slug: 'course/codex/extending/mcp-connect' },
										{ label: 'MCP · Codex as a server', slug: 'course/codex/extending/mcp-serve' },
										{ label: 'Hooks · the determinism gate', slug: 'course/codex/extending/hooks-gate' },
										{ label: 'Hooks · vs judgment & permissions', slug: 'course/codex/extending/hooks-vs' },
									],
								},
								{
									label: 'Automation',
									items: [
										{ label: 'Module intro', slug: 'course/codex/automation' },
										{ label: 'Headless · codex exec', slug: 'course/codex/automation/headless' },
										{ label: 'CI · GitHub, unattended', slug: 'course/codex/automation/ci' },
										{ label: 'Reproducible · ignore config & rules', slug: 'course/codex/automation/reproducible' },
										{ label: 'Agents SDK · beyond exec', slug: 'course/codex/automation/sdk' },
									],
								},
								{
									label: 'Daily workflow',
									items: [
										{ label: 'Module intro', slug: 'course/codex/daily-workflow' },
										{ label: 'Profiles · the two-profile habit', slug: 'course/codex/daily-workflow/profiles-habit' },
										{ label: 'Prompting · brief well, edit fast', slug: 'course/codex/daily-workflow/prompting-ergonomics' },
										{ label: 'Finale · the whole arc', slug: 'course/codex/daily-workflow/finale' },
									],
								},
							],
						},
						{
							label: 'GitHub Copilot',
							link: '/course/copilot/',
							icon: 'open-book',
							items: [
								{ label: 'GitHub Copilot overview', slug: 'course/copilot' },
								{
									label: 'Getting started',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/getting-started' },
										{ label: 'Setup · install & sign in', slug: 'course/copilot/getting-started/setup' },
										{ label: 'Two surfaces · completions vs chat', slug: 'course/copilot/getting-started/completions-vs-chat' },
										{ label: 'First change · a small reviewed edit', slug: 'course/copilot/getting-started/first-change' },
									],
								},
								{
									label: 'The modes',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/modes' },
										{ label: 'Ask · understand before you touch', slug: 'course/copilot/modes/ask' },
										{ label: 'Edit · a scoped change', slug: 'course/copilot/modes/edit' },
										{ label: 'Agent · hand off the whole task', slug: 'course/copilot/modes/agent' },
										{ label: 'Plan · see the plan first', slug: 'course/copilot/modes/plan' },
										{ label: 'Switch · match the mode to the risk', slug: 'course/copilot/modes/switching' },
									],
								},
								{
									label: 'Rules (custom instructions)',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/rules' },
										{ label: 'Repo-wide · copilot-instructions.md', slug: 'course/copilot/rules/copilot-instructions' },
										{ label: 'The bridge · AGENTS.md & CLAUDE.md', slug: 'course/copilot/rules/the-bridge' },
										{ label: 'Path-specific · applyTo globs', slug: 'course/copilot/rules/path-specific' },
										{ label: 'Hierarchy · personal, repo, org', slug: 'course/copilot/rules/hierarchy' },
										{ label: 'Good rules · what earns its place', slug: 'course/copilot/rules/good-rules' },
									],
								},
								{
									label: 'Prompt files & slash commands',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/prompt-files' },
										{ label: 'Create · .prompt.md & /create-prompt', slug: 'course/copilot/prompt-files/create' },
										{ label: 'Prompt vs rule · invoked vs always-on', slug: 'course/copilot/prompt-files/vs-rules' },
										{ label: 'Wire it · arguments, agent, tools', slug: 'course/copilot/prompt-files/wire-it' },
									],
								},
								{
									label: 'Custom agents & subagents',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/custom-agents' },
										{ label: 'Create · .agent.md & /create-agent', slug: 'course/copilot/custom-agents/create' },
										{ label: 'A reviewer · a persona for shared-lib', slug: 'course/copilot/custom-agents/a-reviewer' },
										{ label: 'Subagents · fan out across consumers', slug: 'course/copilot/custom-agents/subagents' },
										{ label: 'Handoffs · chaining agents', slug: 'course/copilot/custom-agents/handoffs-plan' },
									],
								},
								{
									label: 'Skills',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/skills' },
										{ label: 'Create · SKILL.md', slug: 'course/copilot/skills/create' },
										{ label: 'Trigger · the description does the work', slug: 'course/copilot/skills/trigger' },
										{ label: 'The standard · the cross-tool skill', slug: 'course/copilot/skills/the-standard' },
									],
								},
								{
									label: 'Extending: MCP',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/extending' },
										{ label: 'Connect · .vscode/mcp.json', slug: 'course/copilot/extending/connect' },
										{ label: 'Trust · confirm before it runs', slug: 'course/copilot/extending/trust' },
										{ label: 'Scope · per-agent servers', slug: 'course/copilot/extending/scope' },
									],
								},
								{
									label: 'Permissions & autonomy',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/permissions' },
										{ label: 'Levels · default, bypass, autopilot', slug: 'course/copilot/permissions/levels' },
										{ label: 'The checkpoint · risky commands', slug: 'course/copilot/permissions/the-checkpoint' },
										{ label: 'Match · autonomy to blast radius', slug: 'course/copilot/permissions/match-to-stakes' },
									],
								},
								{
									label: 'Models & credits',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/models' },
										{ label: 'Picker · choose per request', slug: 'course/copilot/models/picker' },
										{ label: 'Credits · spend where it pays', slug: 'course/copilot/models/credits' },
									],
								},
								{
									label: 'Automation: cloud coding agent',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/automation' },
										{ label: 'Assign · hand an issue to Copilot', slug: 'course/copilot/automation/assign' },
										{ label: 'Draft PRs · it proposes, you merge', slug: 'course/copilot/automation/draft-prs' },
										{ label: 'Environment · copilot-setup-steps.yml', slug: 'course/copilot/automation/environment' },
									],
								},
								{
									label: 'Beyond VS Code',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/beyond-vscode' },
										{ label: 'JetBrains · near-parity, called out', slug: 'course/copilot/beyond-vscode/jetbrains' },
										{ label: 'CLI · the terminal footnote', slug: 'course/copilot/beyond-vscode/cli' },
									],
								},
								{
									label: 'Daily workflow',
									items: [
										{ label: 'Module intro', slug: 'course/copilot/daily-workflow' },
										{ label: 'A day · careful lib, fast app', slug: 'course/copilot/daily-workflow/a-day' },
										{ label: 'The arc · and where to go next', slug: 'course/copilot/daily-workflow/the-arc' },
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
					],
					{
						// The blog has its own sidebar from starlight-blog; keep it out of topics.
						exclude: ['/blog', '/blog/', '/blog/**'],
					},
				),
			],
		}),
	],
});
