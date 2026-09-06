# Authoring system

The [local write skill](../.claude/skills/write/SKILL.md) adapts book-kit's shared technical-authoring core to agentscli. It selects blog, reference, or course guidance and preserves the site's voice, MDX components, and verification commands.

General craft, evidence, selective deepening, compression, and critique have one home in book-kit's `authoring/`. Local authorities keep their existing jobs: the foundations authoring guide owns landmarks, blog-forge owns interviews/variants, and course conventions own running projects.

## Local setup

`.claude/` is ignored in this repository. The adapter payload and installer are maintained in book-kit at `integrations/agentscli/`, so a new clone needs a local installation. No absolute machine path is committed here.

Locate the book-kit checkout, then run (replace the two example paths):

```sh
python3 /path/to/book-kit/integrations/agentscli/scripts/install.py --repo /path/to/astro-starlight
python3 /path/to/book-kit/integrations/agentscli/scripts/install.py --repo /path/to/astro-starlight --apply
python3 /path/to/book-kit/integrations/agentscli/scripts/install.py --repo /path/to/astro-starlight --check
```

The first command previews changes. Applying creates a local `write/shared` link to that checkout's `authoring/`, backs up replaced files, and records installed hashes. It refuses to overwrite changed target files it cannot recognize. Relocate the kit by rerunning its installer; do not maintain a copied core.

## Use

Use the existing `write plan`, `write draft`, `write revise`, or `write judge` entry point. Existing blog-forge and foundations entry points route through the same adapter. New content stays in MDX and uses Astro's existing checks; book-kit's standalone site/EPUB builders are not agentscli's publisher.

For content changes run `pnpm verify`; instruction-only integration is validated by resolving the shared link, checking skill metadata and references, and reviewing the routing. This installation does not rewrite articles or establish that existing content has been fact-checked.
