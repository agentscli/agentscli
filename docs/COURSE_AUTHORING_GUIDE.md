# Course authoring guide

Write courses that help readers understand and use a coding agent on their own work. Each page must work as a direct entry point; the whole track must build coherent understanding. Use connected explanation and recognizable technical subjects without stamping pages from one template.

This guide owns course teaching principles and presentation. [The authoring entry point](AUTHORING.md) locates the shared book-kit craft, evidence, and critic references.

Editorial decision, 2026-09-20: this guide supersedes older requirements for a compulsory project story, opening metrics, and repeated lesson beats. Apply shared evidence rules and critic dimensions; use this guide where shared course defaults or older product guidance conflict on presentation. Historical exemplar reports are evidence about their reviewed revision, not a second authoring contract.

## Editorial principles

### The four principles readers should learn

Teach **capability, context, control, and cost** as a shared framework for understanding coding agents. Introduce all four in the track overview. Revisit the relevant principle by name when it explains a feature or a decision; define enough locally for a reader who skipped the overview.

| Principle | Meaning | Relevant features and decisions |
| --- | --- | --- |
| Capability | What the agent can figure out and accomplish with its model and tools | Model selection, reasoning effort, execution tools, delegation |
| Context | What information is available when the agent decides, including its relevance, accuracy, freshness, and authority | Instructions, skills, retrieval, tool results, memory, handoffs |
| Control | What guides execution, enforces boundaries, or allows intervention | Workflows, hooks, permissions, sandboxes, approvals |
| Cost | What completing the task consumes: money, compute, elapsed time, attention, and rework | Usage, retries, verification effort, caching, human correction |

Context is the organizing theme. Explain what enters the agent's context, when it arrives, what persists, and what deserves trust when those questions matter to the topic. More context is not inherently better. Intelligence sits within capability, safety within control, and latency within cost. Features can serve more than one principle.

Correctness and reliability are outcomes used to judge the result. The four principles explain the conditions and tradeoffs that shape those outcomes; they are not a scoring system for model quality.

Keep the framework visible without turning it into a repeated layout. A skills lesson may say, “A skill shapes context by making task-specific guidance available when needed,” then explain the actual loading behavior. A sandbox lesson may connect control to the concrete boundary it enforces. These are examples of the explanatory move, not sentences to paste across pages; verify tool-specific behavior before publishing.

No lesson needs all four principles, a framework box, or a token estimate. Routine installation steps can remain routine. Check framework coverage across the track rather than inserting labels into every page.

### Relationships worth returning to

Use a relationship where it explains a meaningful choice. State its conditions rather than presenting a universal law.

- **Capability and context complement each other.** Better information can help an existing model; a stronger model cannot reliably recover a missing private requirement.
- **Context selection affects cost and quality.** Relevant retrieval may reduce noise and effort; a larger window supplies capacity, not guaranteed understanding.
- **Capability and total cost can move together.** A more expensive call may save retries or human repair. Do not assume the most powerful model is always necessary or economical.
- **Guidance differs from enforcement.** An instruction expresses a constraint; a permission or configured gate enforces a specific boundary or condition. Understanding alone cannot replace that boundary.
- **Control shapes usable capability and cost.** Restrictions can block needed actions; checks add overhead but may prevent rework. Explain the actual tradeoff.
- **Feedback enables correction.** Tests, errors, diffs, and observations update context after an action. Tool access helps only if relevant results can be inspected and interpreted.
- **Verifiability and reversibility inform autonomy.** More independent action is easier to justify when success is checkable and errors are recoverable.

Teach bottlenecks and diminishing returns when relevant. These are conditional relationships, not a CAP-like impossibility theorem or a rule that one principle must always be sacrificed.

### Every page is an entry point

- Use the intended reader recorded in the plan to decide what needs explanation. A direct visitor may meet the track's stated baseline without knowing earlier lessons.
- State the local problem and intended understanding or action.
- Define unfamiliar terms briefly at first use, even if an earlier lesson introduces them.
- Supply the necessary scenario facts, files, assumptions, and starting conditions locally.
- Link to full environment setup and deeper explanations after giving the minimum needed to understand the page.
- Use descriptive links; “as discussed earlier” cannot carry a necessary explanation.

Repeat the minimum explanation; maintain the full explanation in one place. A direct visitor may need to install a tool or fetch a verified checkpoint, but should not have to reconstruct an earlier story to understand the task.

### Consistent quality, flexible presentation

- Start with the actual problem, explanation, or useful action. Do not invent suspense or a customer incident.
- Preserve correct explanations and functioning examples; revise to address identified learning or evidence gaps.
- Explain mechanisms and practical consequences before introducing abstract labels.
- Choose the form the topic needs: procedure, conceptual explanation, comparison, diagnosis, or reference.
- Use examples when they resolve confusion or make an action reproducible. Do not add a worked example merely to meet a quota.
- Include numbers only when they answer a meaningful question and have defensible evidence. An illustrative label does not make an unnecessary token count useful.
- Remove the recurring `Tokens / Turns / Blast radius / Recurs?` scorecard. Do not replace it with four new scores, numbered opening claims, or mandatory tradeoff tables.
- Use topic-specific headings. Number actual sequential steps when useful; avoid repeated teaching-beat headings, openings, and conclusions.
- Put essentials first and advanced detail later. Explain a relevant limit or recovery close to the action it affects.

The principles are reader-facing teaching content. Page-completeness checks and workflow records belong to the author. Do not confuse keeping the checklist private with hiding the framework from readers.

## Build continuity through learning

Organize each track around one tool and a progression of useful reader capabilities. Name chapters and pages with recognizable technical language. Order real knowledge and project dependencies; independent topics need no invented dependency or cliffhanger.

Reuse a companion project when it reduces setup or makes a mechanism concrete. Keep its language, identifiers, files, and state consistent wherever reused. The current `budgetcli` treatment is not the pattern to replicate: do not force every feature into a finance incident, recurring bug, or numerical transformation. Keep useful code and exercises; use a smaller local example or direct explanation when that teaches better.

Maintain conceptual continuity as well as code continuity. Explain a principle initially, apply it later, and deepen it where a new constraint changes the decision. A repeated definition can orient a direct visitor; repeating the full lesson wastes a sequential reader's attention.

Keep durable knowledge in a maintained home. Instructions, documentation, and tests can preserve repeated corrections, but their contents must stay current. Apply the same discipline to the course's terminology and shared claims using the workflow's continuity record.

## Give each lesson a clear job

Record the leading job in the working plan, not a visible lesson-type badge.

**Task:** Supply starting conditions, intended result, executable steps, verification, and relevant recovery. Place the first useful action before extended explanation. Project-dependent tasks need a verified starting checkpoint; standalone setup and configuration do not need artificial project tags.

**Concept:** Explain a mental model and the decision it changes. Use a case, worked example, comparison, or application check when needed to make the inference understandable. Explain the answer to any exercise included. No mandatory exercise ending.

**Orientation or reference:** Explain the available paths or answer a lookup question directly. Do not manufacture a code change to justify a track index or command reference.

A substantive lesson belongs when it helps the reader act or judge a situation. Move isolated facts into appropriate reference material when they have no explanatory job. Preserve learning promises and incoming links when proposing cuts or merges.

## Annotated teaching examples

These constructed excerpts demonstrate editorial choices under the current guide. They are not captured runs, verified product instructions, or complete lessons. The paired passages cover similar ground at similar length; the annotations explain what changes the reader's understanding.

### Task: supply the starting facts

**Example**

Before:

> Continue yesterday's investigation in the same project. Ask the agent to fix the remaining bug and run the familiar checks. Review its response before moving on; this gives it the context it needs to finish our work.

After:

> Start with the failing test and the function it exercises in a disposable project copy. Ask the agent to explain the failure before editing. This gives it concrete context for the repair. Inspect its diff, then rerun that test to check the result.

The revision replaces inherited-story references with local inputs and an observable check. In a full task, supply the actual starter, file paths, and test command. Necessary setup belongs beside the action; it need not become a new incident or recap of an earlier lesson.

### Concept: explain the decision

**Example**

Before:

> A stronger model improves capability, so upgrade when the agent struggles. Capability, context, control, and cost all matter to this decision. Consider the tradeoffs and choose the best balance for the task before trying the work again.

After:

> If the agent never received your private acceptance criteria, a stronger model still lacks those facts. Supply that context first. If it has the relevant evidence but struggles to reason through it, compare model capability and the total cost of another attempt.

The revision distinguishes two causes of failure and connects each to an action. The principle names explain the choice. A later lesson can add a new constraint, such as verification effort, without teaching the whole framework again.

### Reference: answer the lookup question

**Example**

Before:

> We have reached another important choice in the project. Tests, diffs, and logs each reveal useful information. Recall how we used them earlier, then choose the right view for the next step in our journey.

After:

| Reader question | Inspect | Limit |
| --- | --- | --- |
| What changed? | Diff | Does not prove correctness |
| Did the tested behavior pass? | Test result | Covers only the tested cases |
| What happened during execution? | Log | Shows only recorded events |

The table makes the lookup direct and keeps limits beside each answer. It needs neither a project story nor an obligatory principle label. A linked concept lesson can explain how these observations update context without repeating that explanation here.

## Ground tasks and claims

### Starting state and companion projects

- Provide accessible, versioned starter artifacts for project-dependent exercises. Verify repository URLs and tags before citing them.
- Identify files already present separately from files the exercise creates.
- Verify commands, functions, tests, and permissions against the stated starting state.
- State branch or reset assumptions before the dependent action. Preserve existing reader work and use disposable fixtures for destructive drills.
- Record incoming and outgoing states in the continuity record. Do not silently reintroduce a fixed defect.

A missing starter blocks the claim that its exercise is runnable; it need not block independent explanatory work. Keep the affected task draft or explicitly unverified. Publishing a repository is a separate external action, not an automatic authoring step.

### Evidence and freshness

Use the shared evidence distinctions: measured, published, derived, and illustrative. Label captured versus illustrative output in the prose before the block. Identify the version and starting state for captured output; mark omissions visibly. Do not invent transcripts, benchmarks, timings, token counts, repository tags, or passing results.

Check volatile commands, flags, settings, menus, model details, and permission behavior against current primary documentation or the relevant implementation. Record the supporting section, date, and revision where available. Link volatile claims to the specific primary page in published prose. Keep research provenance in the existing research system or the identified working evidence directory.

Verify that the recommended workflow works under the mode and permissions just described. Do not assume a mode's capabilities from its name. Scope guarantees to the actual mechanism tested.

Keep the track's verification version and date unchanged until the required track-wide checks pass. Compilation, execution, source inspection, editorial review, and visual inspection are different forms of evidence.

## Publish in the existing site

- Keep Astro/MDX, frontmatter schemas, routes, imports, component APIs, and working anchors. Map affected links before merges or moves.
- Use a readable technical frontmatter title. Configure the short sidebar label in `astro.config.mjs`; course sidebar objects own those labels.
- Use chapter indexes for orientation and useful reading order without duplicating the sidebar as decorative cards.
- Follow the course's peer-to-peer voice: second person for instructions, “we” for shared reasoning, first person only for real author experience. Use familiar terms consistently.
- Use no emojis unless requested and no em or en dashes in course prose. Avoid invented incidents, decorative taglines, and attribution to source courses, podcasts, or transcripts; primary documentation links remain appropriate.
- Read `src/components/interactive/WIDGETS.md` before changing widgets. Add interactions only for a specific explanatory need, with equivalent prose or table fallback and checked simulation assumptions.
- Use actual screenshots for claimed captures. Include informative alt text. A diagram or screenshot earns its place by explaining something the prose alone does not.

Files live under `src/content/docs/course/<tool>/`; companion staging lives under `companion-repos/`. Keep the six existing tracks unless a new one is explicitly authorized. A relevant exemplar demonstrates a technique, not a required voice, project, or page skeleton.

### Select verification by the change

The course-content checks below apply to published pages and companion artifacts and are cumulative when a change fits several rows. Use the instruction-only row for changes confined to authoring instructions. Required checks depend on the changed content and the claimed review scope, not on tool availability.

| Change or review scope | Required verification |
| --- | --- |
| Course prose or explanation | Direct-entry and sequential judge passes over affected pages and boundaries; `pnpm verify` after course edits |
| Commands, configuration, copyable files, or executable exercises | Extract current inputs and reproduce with the actual consumer and stated starting conditions; inspect setup, result, and cleanup using the execution audit |
| Companion files or project checkpoints | Run affected exercises and every recommended companion script; check incoming and outgoing state and supported branches |
| Shared technical claim, term, or prerequisite | Check evidence or canonical meaning and inspect every identified consumer, including widgets and pages outside edit scope |
| Routes, headings, sidebar order, or page merges | Check incoming links, anchors, navigation order, and affected reading boundaries; run the local section check for section reform |
| Widgets, tables, code-block layout, images, components, or other visible structure | Inspect the affected rendered pages at narrow and wide widths; for widgets also check interactions, simulation assumptions, keyboard access, and equivalent prose or table fallback |
| Full-track publication review | Apply all relevant rows across the track and visually inspect every page; a shared layout check cannot certify page-specific content |
| Instruction documents only | Check local links and anchors, reference loading, rule ownership, and consistency with shared guidance; site compilation is not required for this change alone |

Outside a full-track publication review, prose-only changes with unchanged visible structure may mark visual inspection not applicable with the reason. Suspected overflow or another visible defect makes it required. Missing a required rendered inspection leaves readiness unverified; lack of a browser does not make it optional. Read-only reviews may reuse evidence whose inputs still match.

## Ready for publication within scope

These are author checks, not sections to print on pages.

- Each page fulfills its job and works for a direct visitor.
- A track review confirms that the overview introduces the four principles and relevant lessons apply them meaningfully. A narrower review checks its own uses and records any overview work outside scope without certifying it.
- Terms, shared claims, prerequisites, navigation, and actual project states agree across affected pages.
- Required examples and technical claims have current evidence; missing checks are explicit.
- Applicable execution, companion, site, and visual checks have recorded outcomes. Required unperformed checks prevent a publication-ready verdict.
- Audit and judge findings affecting readiness are resolved on the current revision.

A review of one chapter cannot certify the rest of the track. Report the reviewed scope and remaining limitations precisely.
