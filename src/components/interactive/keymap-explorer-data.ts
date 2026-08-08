/**
 * Data for the keymap explorer (KeymapExplorer.tsx).
 *
 * FACT-BOUND - the most vendor-fact-dependent dataset on the site. Every row
 * carries the source it came from and the date it was checked; re-verify on the
 * monthly WIDGETS.md pass and bump `checkedAt` per tool.
 *
 * Reconciled from six independent research passes (2026-08-05):
 *   8 surfaces, 489 bindings.
 *   confidence: source-code > firsthand > documented.
 *
 * `severity` on collisions is assigned per BEHAVIOUR here, deliberately - the
 * source passes disagreed with each other on identical behaviour (Ctrl+K came
 * back destructive, harmless AND silent-difference), so it cannot be per-source.
 *
 * `intents` is the search layer. Aliases include the GUI key a reader WRONGLY
 * expects ("ctrl+x", "select all"), so searching your muscle memory lands on
 * the correction rather than on nothing.
 */

export type KmConfidence = 'source-code' | 'firsthand' | 'documented';
export type KmSeverity = 'destructive' | 'silent-difference' | 'harmless';

export interface KmBinding {
  keys: string;
  macKeys: string;
  desc: string;
  ctx: string;
  origin: string;
  conf: KmConfidence;
  action: string[] | null;
  notes: string | null;
  cmd: string | null;
  /** index into the owning tool's `sources` */
  src: number;
  intents: string[];
}

export interface KmTool {
  slug: string;
  label: string;
  surface: 'tui' | 'ide';
  host: string | null;
  version: string | null;
  versionNotes: string | null;
  checkedAt: string;
  sources: string[];
  bindings: KmBinding[];
}

export interface KmCollision {
  key: string;
  severity: KmSeverity;
  /** what a GUI/editor user expects this key to do */
  reflex: string;
  tools: Record<string, { actual: string; expect: string }>;
}

export interface KmTask {
  id: string;
  label: string;
  /** keyed by `slug:surface` */
  keys: Record<string, { k: string; m: string; all: string; d: string }>;
}

export interface KmIntent {
  id: string;
  label: string;
  /** the GUI gesture a reader would reach for instead */
  reflex: string;
  aliases: string[];
}

export const KM_TOOLS: KmTool[] = [
  {
    "slug": "claude-code",
    "label": "Claude Code",
    "surface": "tui",
    "host": null,
    "version": "2.1.222",
    "versionNotes": null,
    "checkedAt": "2026-08-05",
    "sources": [
      "https://code.claude.com/docs/en/keybindings#app-actions",
      "https://code.claude.com/docs/en/keybindings#chat-actions",
      "https://code.claude.com/docs/en/interactive-mode#reverse-search-with-ctrl-r",
      "https://code.claude.com/docs/en/keybindings#task-actions",
      "https://code.claude.com/docs/en/interactive-mode#general-controls",
      "https://code.claude.com/docs/en/interactive-mode#multiline-input",
      "https://code.claude.com/docs/en/interactive-mode#text-editing",
      "https://code.claude.com/docs/en/interactive-mode#quick-commands",
      "https://code.claude.com/docs/en/keybindings#confirmation-actions",
      "https://code.claude.com/docs/en/keybindings#permission-actions",
      "https://code.claude.com/docs/en/keybindings#transcript-actions",
      "https://code.claude.com/docs/en/interactive-mode#transcript-viewer",
      "https://code.claude.com/docs/en/keybindings#autocomplete-actions",
      "https://code.claude.com/docs/en/interactive-mode#shell-mode-with--prefix",
      "https://code.claude.com/docs/en/interactive-mode#emoji-shortcodes",
      "https://code.claude.com/docs/en/keybindings#voice-actions",
      "https://code.claude.com/docs/en/interactive-mode#mode-switching",
      "https://code.claude.com/docs/en/interactive-mode#navigation-normal-mode",
      "https://code.claude.com/docs/en/interactive-mode#editing-normal-mode",
      "https://code.claude.com/docs/en/interactive-mode#text-objects-normal-mode",
      "https://code.claude.com/docs/en/keybindings#scroll-actions",
      "https://code.claude.com/docs/en/keybindings#select-actions",
      "https://code.claude.com/docs/en/keybindings#settings-actions"
    ],
    "bindings": [
      {
        "keys": "ctrl+c",
        "macKeys": "ctrl+c",
        "desc": "Interrupt a running operation. If nothing is running, first press clears the prompt input; a second press exits Claude Code.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "app:interrupt"
        ],
        "notes": "Action `app:interrupt`, confirmed present as a string literal in the installed 2.1.222 binary. Reserved - cannot be rebound (hardcoded interrupt/cancel).",
        "src": 0,
        "cmd": null,
        "intents": [
          "interrupt"
        ]
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "Exit Claude Code. First press shows a confirmation hint, second press within 800ms exits. When the prompt has text, deletes the character after the cursor instead (classic readline forward-delete).",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "app:exit"
        ],
        "notes": "Action `app:exit`, confirmed present in the binary. Reserved - cannot be rebound (hardcoded exit). The forward-delete-when-text-present behavior mirrors readline's Ctrl+D EOF/delete dual role.",
        "src": 0,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+l",
        "macKeys": "ctrl+l",
        "desc": "Force a full terminal redraw, preserving input. In fullscreen rendering, press twice within two seconds to run /clear.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:clearInput"
        ],
        "notes": "Action `chat:clearInput`, confirmed present in the binary. Readline conventionally binds Ctrl+L to clear-screen too, so this overlaps in spirit but the double-tap-to-/clear behavior is tool-specific.",
        "src": 1,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+o",
        "macKeys": "ctrl+o",
        "desc": "Toggle the verbose transcript viewer (detailed tool usage/execution with timestamps and model per message).",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "app:toggleTranscript"
        ],
        "notes": "Action `app:toggleTranscript`, confirmed present in the binary.",
        "src": 0,
        "cmd": null,
        "intents": [
          "transcript",
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "Toggle visibility of Claude's to-do checklist (not the /tasks background-task view).",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "app:toggleTodos"
        ],
        "notes": "Action `app:toggleTodos`, confirmed present in the binary. Also reused inside the ThemePicker context as `theme:toggleSyntaxHighlighting` (that action id was not re-confirmed in the binary - see namedActionsRaw).",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "Open reverse history search over previous prompts.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "history:search"
        ],
        "notes": "Action `history:search`, confirmed present in the binary. Concept (Ctrl+R = reverse-i-search) is the classic bash/readline binding, but Claude Code implements its own search UI on top: classic renderer does inline search across ALL projects; fullscreen renderer opens a dialog where Ctrl+S cycles scope (session/project/everywhere, action `historySearch:cycleScope` - not itself confirmed in the binary). Tab/Esc accept the match, Enter executes immediately, Ctrl+C cancels.",
        "src": 2,
        "cmd": null,
        "intents": [
          "history-prev",
          "history-search"
        ]
      },
      {
        "keys": "ctrl+b",
        "macKeys": "ctrl+b",
        "desc": "Background the currently running Bash command/agent task.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "task:background"
        ],
        "notes": "Action `task:background` - only established from the docs table; the `task:` namespace was not reached by the binary string extraction pass, so this rests on documentation alone. Collides with tmux's default prefix key - tmux users must press twice. A chord alternative `ctrl+x ctrl+b` was added in v2.1.169 specifically to avoid this conflict.",
        "src": 3,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+z",
        "macKeys": "ctrl+z",
        "desc": "Suspend Claude Code to the shell (Unix only). Run `fg` to resume.",
        "ctx": "global",
        "origin": "terminal-level",
        "conf": "documented",
        "action": null,
        "notes": "No action id: this is the OS/terminal SIGTSTP behavior, not an app-level keybinding action - listed by the docs under 'terminal conflicts', not under any rebindable action table.",
        "src": 4,
        "cmd": null,
        "intents": [
          "suspend"
        ]
      },
      {
        "keys": "ctrl+s",
        "macKeys": "ctrl+s",
        "desc": "Stash the current prompt text and clear the input. Pressed again on an empty prompt, restores the stashed text, cursor position, and pasted content.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:stash"
        ],
        "notes": "Action `chat:stash`, confirmed present in the binary. Also reused as `historySearch:cycleScope` inside the HistorySearch context (fullscreen renderer) - that id itself not confirmed in the binary.",
        "src": 1,
        "cmd": null,
        "intents": [
          "clear-input"
        ]
      },
      {
        "keys": "ctrl+v",
        "macKeys": "ctrl+v (or cmd+v in iTerm2)",
        "desc": "Paste an image from the clipboard, inserting a `[Image #N]` chip at the cursor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:imagePaste"
        ],
        "notes": "Action `chat:imagePaste`, confirmed present in the binary. On Windows/WSL the default is Alt+V instead (WSL binds both Ctrl+V and Alt+V).",
        "src": 1,
        "cmd": null,
        "intents": [
          "paste-image"
        ]
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Interrupt Claude mid-turn (stop the current response/tool call, keeping work done so far), or close an open dialog (e.g. permission prompt) without interrupting.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:cancel"
        ],
        "notes": "Action `chat:cancel`, confirmed present in the binary. Before v2.1.202, Esc on some dialogs interrupted Claude AND left the dialog open (fixed since).",
        "src": 4,
        "cmd": null,
        "intents": [
          "interrupt"
        ]
      },
      {
        "keys": "esc esc",
        "macKeys": "esc esc",
        "desc": "Double-tap: if the prompt has text, clears it and saves the draft to history (Up recalls it). If the prompt is empty, opens the rewind menu to restore/summarize code and conversation from an earlier point.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No single action id documented for the double-press behavior itself - it composes `chat:cancel`/`chat:clearInput`-adjacent handling with the (undocumented) rewind menu, so left null rather than guessed. Before v2.1.216, double-Esc at an empty prompt could stop opening the rewind menu for the rest of a long session that had used background tasks (bug, since fixed).",
        "src": 4,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "Cycle permission modes (default/Manual -> acceptEdits -> plan -> any custom modes like auto/bypassPermissions).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:cycleMode"
        ],
        "notes": "Action `chat:cycleMode`, confirmed present in the binary. On Windows, when the Node/Bun runtime doesn't enable VT input mode, the default falls back to Alt+M (Meta+M) instead.",
        "src": 1,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "option+p (mac) / alt+p (win/linux)",
        "macKeys": "option+p / meta+p",
        "desc": "Open the model picker.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:modelPicker"
        ],
        "notes": "Action `chat:modelPicker`, confirmed present in the binary (default Meta+P, i.e. Option on macOS / Alt on Windows-Linux).",
        "src": 1,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "option+t (mac) / alt+t (win/linux)",
        "macKeys": "option+t / meta+t",
        "desc": "Toggle extended thinking mode. No effect on Fable 5, which always uses extended thinking.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:thinkingToggle"
        ],
        "notes": "Action `chat:thinkingToggle`, confirmed present in the binary. As of v2.1.132, works on macOS without configuring Option-as-Meta.",
        "src": 1,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "option+o (mac) / alt+o (win/linux)",
        "macKeys": "option+o / meta+o",
        "desc": "Toggle fast mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:fastMode"
        ],
        "notes": "Action `chat:fastMode`, confirmed present in the binary.",
        "src": 1,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "enter",
        "macKeys": "enter",
        "desc": "Submit the message.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:submit"
        ],
        "notes": "Action `chat:submit`, confirmed present in the binary.",
        "src": 1,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "ctrl+j",
        "macKeys": "ctrl+j",
        "desc": "Insert a newline without submitting. Works in any terminal without configuration.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:newline"
        ],
        "notes": "Action `chat:newline`, confirmed present in the binary. Other multiline-entry methods (not separately rebindable actions): `\\` + Enter (works everywhere), Option+Enter (needs Option-as-Meta on macOS), Shift+Enter (native in iTerm2/WezTerm/Ghostty/Kitty/Warp/Apple Terminal/Windows Terminal; needs `/terminal-setup` elsewhere), and direct paste of multi-line text.",
        "src": 5,
        "cmd": null,
        "intents": [
          "newline",
          "submit"
        ]
      },
      {
        "keys": "ctrl+_ / ctrl+shift+-",
        "macKeys": "ctrl+_ / ctrl+shift+-",
        "desc": "Undo last input edit - restores the previous input text and cursor position.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "chat:undo"
        ],
        "notes": "Action `chat:undo`, confirmed present in the binary. Ctrl+_ (Ctrl+Shift+- on many keyboards/terminals) is the classic readline/GNU undo binding.",
        "src": 1,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+g / ctrl+x ctrl+e",
        "macKeys": "ctrl+g / ctrl+x ctrl+e",
        "desc": "Open the current prompt in your default text editor ($VISUAL/$EDITOR).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "chat:externalEditor"
        ],
        "notes": "Action `chat:externalEditor`, confirmed present in the binary. `Ctrl+X Ctrl+E` is explicitly called out by the docs as 'the readline-native binding' (bash's edit-and-execute-command). Ctrl+G is Claude Code's own added shortcut for the same action. Turning on 'Show last response in external editor' in /config prepends Claude's previous reply as `#`-commented context.",
        "src": 4,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "ctrl+x ctrl+k",
        "macKeys": "ctrl+x ctrl+k",
        "desc": "Stop all running background subagents in this session. Press twice within 3 seconds to confirm.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "chat:killAgents"
        ],
        "notes": "Action `chat:killAgents`, confirmed present in the binary. Part of the Ctrl+X chord family alongside `ctrl+x ctrl+e` (Chat context) and `ctrl+x ctrl+b` (Task context, alternate 'background task' chord, action `task:background` - not confirmed in the binary).",
        "src": 1,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+a",
        "macKeys": "ctrl+a",
        "desc": "Move cursor to the start of the current logical line (in multiline input).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: this is raw text-buffer/line editing, not exposed as a named, rebindable action in the keybindings.json vocabulary (it doesn't appear in any context's action table). Classic emacs/readline binding. Also documented in keybindings.mdx's 'terminal conflicts' table: on real GNU screen sessions Ctrl+A is the screen prefix key, so it may not reach the app there.",
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+e",
        "macKeys": "ctrl+e",
        "desc": "Move cursor to the end of the current logical line (in multiline input).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id for the cursor-move-to-end-of-line behavior itself (raw text editing, not a keybindings.json action). The same physical key is reused for genuinely named actions in other contexts: `transcript:toggleShowAll` in the Transcript context (classic renderer only) and `confirm:toggleExplanation` in the Confirmation context (toggles a model-generated explanation of a Bash/PowerShell permission prompt) - see those contexts' own rows/entries for the actual action ids.",
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+k",
        "macKeys": "ctrl+k",
        "desc": "Delete from cursor to end of line. Stores deleted text for pasting (yank buffer).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: raw text-buffer editing, not a named keybindings.json action. Classic emacs/readline kill-line. Note: Cmd+K (`chat:clearScreen`, confirmed in the binary) is a different, tool-specific binding - do not conflate the two.",
        "src": 6,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "yank",
          "cursor-end"
        ]
      },
      {
        "keys": "ctrl+u",
        "macKeys": "ctrl+u",
        "desc": "Delete from cursor to line start. Stores deleted text for pasting; repeat to clear across lines in multiline input.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id in the public vocabulary maps to this specifically (not listed in any keybindings.mdx action table) - deliberately left null rather than guessed. Classic emacs/readline unix-line-discard. On macOS, terminal emulators including iTerm2 and Terminal.app map Cmd+Backspace to this same shortcut. Also exits shell mode (`!` prefix) when pressed on an empty prompt.",
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+w",
        "macKeys": "ctrl+w",
        "desc": "Delete the previous word. Stores deleted text for pasting.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: raw text-buffer editing. Classic emacs/readline unix-word-rubout. On macOS, Option+Delete also deletes the previous word; on Windows, Ctrl+Backspace does.",
        "src": 6,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "ctrl+y",
        "macKeys": "ctrl+y",
        "desc": "Paste (yank) text previously deleted with Ctrl+K, Ctrl+U, or Ctrl+W.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: raw text-buffer editing. Classic emacs/readline yank.",
        "src": 6,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "alt+y (after ctrl+y)",
        "macKeys": "option+y (after ctrl+y, requires Option-as-Meta)",
        "desc": "Cycle through previously deleted (killed) text after a yank.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: raw text-buffer editing. Classic emacs/readline yank-pop. Requires Option-as-Meta configured on macOS terminals.",
        "src": 6,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "alt+b",
        "macKeys": "option+b (requires Option-as-Meta)",
        "desc": "Move cursor back one word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: raw text-buffer editing. Classic emacs/readline backward-word.",
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+f",
        "macKeys": "option+f (requires Option-as-Meta)",
        "desc": "Move cursor forward one word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "No action id: raw text-buffer editing. Classic emacs/readline forward-word.",
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up / down (or ctrl+p / ctrl+n)",
        "macKeys": "up / down (or ctrl+p / ctrl+n)",
        "desc": "Move cursor within a multi-row prompt first; once the cursor is on the first/last visual row, navigates command history instead.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "history:previous",
          "history:next"
        ],
        "notes": "Both `history:previous` and `history:next` confirmed present in the binary. Ctrl+P/Ctrl+N are the classic readline previous-history/next-history bindings layered on top. As of v2.1.169, wrapped single-line input behaves the same as explicit multiline for this cursor-then-history logic.",
        "src": 4,
        "cmd": null,
        "intents": [
          "history-prev"
        ]
      },
      {
        "keys": "left / right",
        "macKeys": "left / right",
        "desc": "Cycle through dialog tabs (navigate between tabs in permission dialogs and menus).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tabs:previous",
          "tabs:next"
        ],
        "notes": "The `tabs:` namespace was not reached by the binary string extraction pass, so this rests on the docs table alone. Also reused for word-navigation-adjacent purposes in ModelPicker (`modelPicker:decreaseEffort`/`increaseEffort`), Attachments, Footer, and DiffDialog contexts with different meanings per-context (none of those confirmed in the binary either).",
        "src": 4,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "?",
        "macKeys": "?",
        "desc": "On an empty prompt, toggles the shortcut help panel. With text already in the input, types a literal '?' instead.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No confirmed action id: the docs' Help context only lists `help:dismiss` (Escape, closes the panel), not a distinct 'show/toggle' action, and the toggle-on-'?' behavior isn't attributed to a named action anywhere in the keybindings.mdx tables. The binary does contain an unmapped `app:help` string (see namedActionsRaw) that is a plausible candidate, but nothing ties it to this specific '?' keystroke, so left null rather than guessed.",
        "src": 7,
        "cmd": null,
        "intents": [
          "help"
        ]
      },
      {
        "keys": "y / n",
        "macKeys": "y / n",
        "desc": "Confirm (Y) or decline (N) a permission/confirmation dialog.",
        "ctx": "permission-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "confirm:yes",
          "confirm:no"
        ],
        "notes": "Both `confirm:yes` (Y or Enter) and `confirm:no` (N or Escape) confirmed present in the binary.",
        "src": 8,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+e",
        "macKeys": "ctrl+e",
        "desc": "Toggle a model-generated explanation of the command on Bash/PowerShell permission prompts.",
        "ctx": "permission-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "confirm:toggleExplanation"
        ],
        "notes": "Action `confirm:toggleExplanation`, confirmed present in the binary. Note: the previous default of Ctrl+D for `permission:toggleDebug` was removed in v2.1.146 because it shadowed `app:exit` (`permission:toggleDebug` itself not confirmed in the binary).",
        "src": 9,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "q / ctrl+c / esc",
        "macKeys": "q / ctrl+c / esc",
        "desc": "Exit the transcript viewer.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "transcript:exit"
        ],
        "notes": "Action `transcript:exit`, confirmed present in the binary. All three keys rebindable.",
        "src": 10,
        "cmd": null,
        "intents": [
          "quit",
          "transcript"
        ]
      },
      {
        "keys": "{ / }",
        "macKeys": "{ / }",
        "desc": "Jump to the previous/next user prompt in the transcript, like vim paragraph motion.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id given in any keybindings.mdx table - this is a fullscreen-viewer-only shortcut documented in interactive-mode.mdx without an associated rebindable action name. Requires fullscreen rendering.",
        "src": 11,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "[",
        "macKeys": "[",
        "desc": "Write the full conversation to the terminal's native scrollback so Cmd+F/tmux copy mode can search it.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id documented. Requires fullscreen rendering.",
        "src": 11,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "v",
        "macKeys": "v",
        "desc": "Write the conversation to a temp file and open it in $VISUAL/$EDITOR.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id documented. Requires fullscreen rendering.",
        "src": 11,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "?",
        "macKeys": "?",
        "desc": "Show the full shortcut reference panel inside the transcript viewer.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id documented. Requires fullscreen rendering.",
        "src": 11,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "Accept the current autocomplete suggestion (or place a prompt suggestion into the input).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "autocomplete:accept"
        ],
        "notes": "Action `autocomplete:accept`, confirmed present in the binary. Also `tabs:next` in Tabs context (not confirmed in the binary); also places a proactive prompt suggestion in the input (Tab or Right arrow) per interactive-mode docs, which is not itself a named action.",
        "src": 12,
        "cmd": null,
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "/",
        "macKeys": "/",
        "desc": "At the start of input, opens the command/skill menu.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: this is default typed-character behavior, not a rebindable keybindings.json action. In vim NORMAL mode, `/` opens history search instead (same as Ctrl+R in standard mode) - a vim-specific reassignment.",
        "src": 7,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "!",
        "macKeys": "!",
        "desc": "At the start of input, enters shell mode - runs a command directly and adds its output to context.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: default typed-character behavior. Exit shell mode with Escape, Backspace, or Ctrl+U on an empty prompt. Supports Tab-based history autocomplete and live file-path autocomplete (v2.1.193+).",
        "src": 13,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "@",
        "macKeys": "@",
        "desc": "Trigger file path autocomplete/mention.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: default typed-character behavior, not a keybindings.json action.",
        "src": 7,
        "cmd": null,
        "intents": []
      },
      {
        "keys": ":name:",
        "macKeys": ":name:",
        "desc": "Type a full :shortcode: to insert an emoji, or 2+ chars for a suggestion popup.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: governed by the `emojiCompletionEnabled` setting, not a keybindings.json action. Requires v2.1.217+.",
        "src": 14,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "space (hold or tap)",
        "macKeys": "space",
        "desc": "Voice dictation push-to-talk (hold to record, or /voice tap for tap-to-toggle).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "voice:pushToTalk"
        ],
        "notes": "Action `voice:pushToTalk` - the `voice:` namespace was not reached by the binary string extraction pass, so this rests on the docs table alone. Only active when voice dictation is enabled; rebindable.",
        "src": 15,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "In vim editing mode: switch from INSERT or VISUAL back to NORMAL mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: vim mode is documented as operating independently of the keybindings action system. Explicitly does NOT trigger `chat:cancel` while in vim mode - keybindings and vim mode operate independently per the keybindings.mdx 'Vim mode interaction' section.",
        "src": 16,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "i / I / a / A / o / O / v / V",
        "macKeys": "i / I / a / A / o / O / v / V",
        "desc": "Vim NORMAL-mode entry points into INSERT or VISUAL modes (insert before/at-line-start/after/at-line-end cursor, open line below/above, char-wise/line-wise visual select).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: standard vim semantics reimplemented by Claude Code's own vim mode, not delegated to a system vim, and explicitly not part of the keybindings.json action vocabulary. Vim keys are not remappable via keybindings.json - only a 2-key INSERT-mode-to-Escape remap is supported via the `vimInsertModeRemaps` setting (e.g. `jj` -> Escape), requires v2.1.208+.",
        "src": 16,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "h j k l, w e b, 0 $ ^, gg G, f/F/t/T{char}, ; ,",
        "macKeys": "same",
        "desc": "Vim NORMAL-mode navigation motions (left/down/up/right, word/end/back-word, line start/end/first-non-blank, buffer start/end, find-char motions, repeat motion).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: internal vim-motion engine, not keybindings.json actions. If cursor is at input start/end and can't move further, j/k and Up/Down fall through to command-history navigation. Left on an empty prompt opens agent view from NORMAL mode too (as of v2.1.219).",
        "src": 17,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "x, dd, D, dw/de/db, cc, C, cw/ce/cb, s, S, yy/Y, yw/ye/yb, p, P, >>, <<, J, u, .",
        "macKeys": "same",
        "desc": "Vim NORMAL-mode editing operators (delete char/line/to-end/word variants, change line/to-end/word variants, substitute char/line, yank line/word variants, paste after/before, indent/dedent, join lines, undo, repeat last change).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: internal vim engine. `s`/`S` (substitute) require v2.1.211+. Before v2.1.216, `.` (repeat) had bugs with change-operators and paste-repeat that have since been fixed.",
        "src": 18,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "iw/aw, iW/aW, i\"/a\", i'/a', i(/a(, i[/a[, i{/a{",
        "macKeys": "same",
        "desc": "Vim text objects (inner/around word, WORD, quotes, brackets) usable with d/c/y operators.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "No action id: internal vim engine.",
        "src": 19,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+home / ctrl+end",
        "macKeys": "ctrl+home / ctrl+end (cmd+up / cmd+down conventionally on mac, but docs specify Ctrl+Home/End)",
        "desc": "Jump to start/latest message of the conversation (fullscreen rendering).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "scroll:top",
          "scroll:bottom"
        ],
        "notes": "Actions `scroll:top`/`scroll:bottom` - the `scroll:` namespace was not reached by the binary string extraction pass, so this rests on the docs table alone. `scroll:top`/`scroll:bottom` have a DIFFERENT default (G/Home and Shift+G/End) in the DiffDialog pager context - see namedActionsRaw for the per-context split. `scroll:bottom` also re-enables auto-follow.",
        "src": 20,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pageup / pagedown",
        "macKeys": "pageup / pagedown (fn+up/down on mac laptop keyboards)",
        "desc": "Scroll up/down half the viewport height in the transcript or diff viewer.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "scroll:pageUp",
          "scroll:pageDown"
        ],
        "notes": "Actions `scroll:pageUp`/`scroll:pageDown` - not confirmed in the binary (see above).",
        "src": 20,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+shift+c / cmd+c",
        "macKeys": "cmd+c",
        "desc": "Copy the selected transcript text to the clipboard (fullscreen rendering text selection).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "selection:copy"
        ],
        "notes": "Action `selection:copy` - the `selection:` namespace was not reached by the binary string extraction pass. This is the one place plain Cmd+C/Ctrl+Shift+C is bound to an actual 'copy' - contrast with Ctrl+C in the input, which interrupts/cancels instead of copying.",
        "src": 20,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "up/down/left/right, ctrl+n/ctrl+p, j/k",
        "macKeys": "same",
        "desc": "Move selection up/down in generic select lists and the rewind/summarize message selector.",
        "ctx": "dialog",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "select:next",
          "select:previous"
        ],
        "notes": "Both `select:next`/`select:previous` (Down/J/Ctrl+N and Up/K/Ctrl+P) confirmed present in the binary. In MessageSelector context specifically the docs list separate actions `messageSelector:up`/`down`/`top`/`bottom` (not confirmed in the binary) for the same physical keys. Ctrl+N/Ctrl+P are the classic readline next-line/previous-line bindings repurposed for list navigation.",
        "src": 21,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "space",
        "macKeys": "space",
        "desc": "Toggle a checkbox/selection in confirmation dialogs, plugin dialogs, or settings.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "confirm:toggle"
        ],
        "notes": "Action `confirm:toggle`, confirmed present in the binary. Same physical key also drives `plugin:toggle` (Plugin context, not confirmed in the binary), `scroll:fullPageDown` in the DiffDialog detail-view pager context (not confirmed), and `voice:pushToTalk` in Chat (not confirmed) - same key, different meaning by context.",
        "src": 8,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "/",
        "macKeys": "/",
        "desc": "Enter search mode in the Settings menu.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "settings:search"
        ],
        "notes": "Action `settings:search` - the `settings:` namespace was not reached by the binary string extraction pass, so this rests on the docs table alone.",
        "src": 22,
        "cmd": null,
        "intents": []
      }
    ]
  },
  {
    "slug": "codex",
    "label": "Codex",
    "surface": "tui",
    "host": null,
    "version": null,
    "versionNotes": "codex-cli 0.146.0 installed locally; source verified against openai/codex main @ commit 5c44f110649f8811546745bb1635ba0b44a1639e (2026-08-05), which sits between tags rust-v0.146.0-alpha.9.2 and rust-vrust-v0.145.0-alpha.6 in the tag list at clone time. Workspace Cargo.toml pins version = \"0.0.0\" (release version is stamped at build time), so no single crate-internal version string ties main to 0.146.0 exactly, but it is the closest available source to the installed 0.146.0 binary.",
    "checkedAt": "2026-08-05",
    "sources": [
      "codex-rs/tui/src/keymap.rs:1098 (AppKeymap.open_transcript default)",
      "codex-rs/tui/src/keymap.rs:1099",
      "codex-rs/tui/src/keymap.rs:1100",
      "codex-rs/tui/src/keymap.rs:1101",
      "codex-rs/tui/src/keymap.rs:1104",
      "codex-rs/tui/src/keymap.rs:1105",
      "codex-rs/tui/src/keymap.rs:1109",
      "codex-rs/tui/src/keymap.rs:1110-1113",
      "codex-rs/tui/src/keymap.rs:1114-1117",
      "codex-rs/tui/src/keymap.rs:1118",
      "codex-rs/tui/src/keymap.rs:1121",
      "codex-rs/tui/src/keymap.rs:1122",
      "codex-rs/tui/src/keymap.rs:1123-1126",
      "codex-rs/tui/src/keymap.rs:1127",
      "codex-rs/tui/src/keymap.rs:1128",
      "codex-rs/tui/src/keymap.rs:1131-1137",
      "codex-rs/tui/src/keymap.rs:1138",
      "codex-rs/tui/src/keymap.rs:1139",
      "codex-rs/tui/src/keymap.rs:1140",
      "codex-rs/tui/src/keymap.rs:1141",
      "codex-rs/tui/src/keymap.rs:1142-1146",
      "codex-rs/tui/src/keymap.rs:1147-1151",
      "codex-rs/tui/src/keymap.rs:1152",
      "codex-rs/tui/src/keymap.rs:1153",
      "codex-rs/tui/src/keymap.rs:1154-1158",
      "codex-rs/tui/src/keymap.rs:1159-1163",
      "codex-rs/tui/src/keymap.rs:1164-1176",
      "codex-rs/tui/src/keymap.rs:1177-1185",
      "codex-rs/tui/src/keymap.rs:1186",
      "codex-rs/tui/src/keymap.rs:1188",
      "codex-rs/tui/src/keymap.rs:1189",
      "codex-rs/tui/src/chatwidget/interaction.rs on_ctrl_c(); codex-rs/tui/src/keymap.rs:1990-1992",
      "codex-rs/tui/src/chatwidget/interaction.rs:386-435; codex-rs/tui/src/bottom_pane/mod.rs:172,181",
      "codex-rs/tui/src/chatwidget/interaction.rs on_ctrl_d(); codex-rs/tui/src/keymap.rs:1993",
      "codex-rs/tui/src/keymap.rs:1994-1995; codex-rs/tui/src/clipboard_paste.rs",
      "codex-rs/tui/src/keymap.rs:1996-1999",
      "codex-rs/tui/src/keymap.rs:2001",
      "codex-rs/tui/src/keymap.rs:2002",
      "codex-rs/tui/src/keymap.rs:2003",
      "codex-rs/tui/src/keymap.rs:2004",
      "codex-rs/tui/src/keymap.rs:2005",
      "codex-rs/tui/src/keymap.rs:2006-2009",
      "codex-rs/tui/src/tui/job_control.rs SUSPEND_KEY, SuspendContext::suspend()",
      "codex-rs/tui/src/app_backtrack.rs",
      "codex-rs/tui/src/app_backtrack.rs; codex-rs/tui/src/keymap.rs:2012-2029 (TRANSCRIPT_BACKTRACK_RESERVED_BINDINGS)",
      "codex-rs/tui/src/keymap.rs:2012-2019",
      "codex-rs/tui/src/keymap.rs:2020-2024",
      "codex-rs/tui/src/keymap.rs:2025-2029",
      "codex-rs/tui/src/keymap.rs:1283",
      "codex-rs/tui/src/keymap.rs:1284",
      "codex-rs/tui/src/keymap.rs:1285-1289",
      "codex-rs/tui/src/keymap.rs:1290-1294",
      "codex-rs/tui/src/keymap.rs:1295",
      "codex-rs/tui/src/keymap.rs:1296",
      "codex-rs/tui/src/keymap.rs:1297",
      "codex-rs/tui/src/keymap.rs:1298",
      "codex-rs/tui/src/keymap.rs:1299",
      "codex-rs/tui/src/keymap.rs:1300",
      "codex-rs/tui/src/keymap.rs:1304-1309",
      "codex-rs/tui/src/keymap.rs:1310-1315",
      "codex-rs/tui/src/keymap.rs:1316",
      "codex-rs/tui/src/keymap.rs:1317",
      "codex-rs/tui/src/keymap.rs:1318",
      "codex-rs/tui/src/keymap.rs:1319",
      "codex-rs/tui/src/keymap.rs:1320",
      "codex-rs/tui/src/keymap.rs:1321",
      "codex-rs/tui/src/keymap.rs:1322",
      "codex-rs/tui/src/keymap.rs:1323",
      "codex-rs/tui/src/keymap/chords.rs LIST_RESERVED_BINDINGS",
      "codex-rs/tui/src/keymap.rs:1327-1333",
      "codex-rs/tui/src/keymap.rs:1334",
      "codex-rs/tui/src/keymap.rs:1335",
      "codex-rs/tui/src/keymap.rs:1336",
      "codex-rs/tui/src/keymap.rs:1337",
      "codex-rs/tui/src/keymap.rs:1338",
      "codex-rs/tui/src/keymap.rs:1339",
      "codex-rs/tui/src/keymap.rs:1340",
      "codex-rs/tui/src/keymap.rs:1191-1235 (VimNormalKeymap built-in defaults)",
      "codex-rs/tui/src/keymap.rs:1236-1254 (VimOperatorKeymap built-in defaults)",
      "codex-rs/tui/src/keymap.rs:1255-1281 (VimTextObjectKeymap built-in defaults)"
    ],
    "bindings": [
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "Open the transcript overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.global.open_transcript"
        ],
        "notes": "Configurable at tui.keymap.global.open_transcript. Also doubles as close_transcript inside the pager overlay (toggle open/close).",
        "src": 0,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+g",
        "macKeys": "ctrl+g",
        "desc": "Open the current draft in an external editor ($EDITOR).",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.global.open_external_editor"
        ],
        "notes": "Configurable at tui.keymap.global.open_external_editor.",
        "src": 1,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "ctrl+o",
        "macKeys": "ctrl+o",
        "desc": "Copy the last agent response to the clipboard.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.global.copy"
        ],
        "notes": "Not the readline/GUI-standard binding for anything; deliberately avoids Ctrl+C since Ctrl+C is reserved for interrupt/quit.",
        "src": 2,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+l",
        "macKeys": "ctrl+l",
        "desc": "Clear the terminal UI.",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.global.clear_terminal"
        ],
        "notes": "Matches the universal shell/readline clear-screen convention.",
        "src": 3,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+r",
        "macKeys": "option+r",
        "desc": "Toggle raw scrollback mode for copy-friendly transcript selection.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.global.toggle_raw_output"
        ],
        "notes": "Configurable at tui.keymap.global.toggle_raw_output.",
        "src": 4,
        "cmd": null,
        "intents": [
          "transcript",
          "mode-cycle"
        ]
      },
      {
        "keys": "ctrl+/",
        "macKeys": "ctrl+/",
        "desc": "Switch between a side conversation and its parent without closing either.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.global.toggle_side_conversation"
        ],
        "notes": "ctrl-7 is treated as an equivalent legacy alias because many terminals report Ctrl+/ as Ctrl+7 (keymap.rs:539,1358).",
        "src": 5,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Interrupt the active turn.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.chat.interrupt_turn"
        ],
        "notes": "When no turn is running and the composer is empty, this same Esc press instead primes/advances the backtrack (edit-previous-message) state machine - see app_backtrack.rs. It is also reserved and cannot be freely reassigned away from Esc (MAIN_RESERVED_BINDINGS, keymap.rs:2000).",
        "src": 6,
        "cmd": null,
        "intents": [
          "interrupt"
        ]
      },
      {
        "keys": "alt+,  or shift+down",
        "macKeys": "option+,  or shift+down",
        "desc": "Decrease reasoning effort.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.chat.decrease_reasoning_effort"
        ],
        "notes": "shift+down is a fallback alias and is silently dropped if the same physical key is explicitly reused elsewhere on the main input surface (keymap.rs:910-915).",
        "src": 7,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+.  or shift+up",
        "macKeys": "option+.  or shift+up",
        "desc": "Increase reasoning effort.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.chat.increase_reasoning_effort"
        ],
        "notes": "shift+up is a fallback alias, same caveat as decrease_reasoning_effort.",
        "src": 8,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+up  or shift+left",
        "macKeys": "option+up  or shift+left",
        "desc": "Edit the most recently queued message.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.chat.edit_queued_message"
        ],
        "notes": null,
        "src": 9,
        "cmd": null,
        "intents": [
          "queue"
        ]
      },
      {
        "keys": "enter",
        "macKeys": "return",
        "desc": "Submit the current composer draft.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.composer.submit"
        ],
        "notes": "Configurable at tui.keymap.composer.submit / tui.keymap.global.submit (global fallback supported).",
        "src": 10,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "Queue the draft while a task is running.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.composer.queue"
        ],
        "notes": null,
        "src": 11,
        "cmd": null,
        "intents": [
          "queue"
        ]
      },
      {
        "keys": "?  or shift+?",
        "macKeys": "?  or shift+?",
        "desc": "Show or hide the composer shortcut overlay.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.composer.toggle_shortcuts"
        ],
        "notes": "Both forms are bound because terminals disagree on whether Shift is preserved for punctuation chords.",
        "src": 12,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "Open reverse history search, or move to the previous match.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.composer.history_search_previous"
        ],
        "notes": "Matches bash/readline reverse-i-search convention (prompt history, not shell command history).",
        "src": 13,
        "cmd": null,
        "intents": [
          "history-search"
        ]
      },
      {
        "keys": "ctrl+s",
        "macKeys": "ctrl+s",
        "desc": "Move to the next match in reverse history search.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.composer.history_search_next"
        ],
        "notes": "readline uses Ctrl+S for forward-i-search too, so this is readline-adjacent, but Codex only exposes it as the next-match complement to Ctrl+R rather than a separate independent search.",
        "src": 14,
        "cmd": null,
        "intents": [
          "history-search"
        ]
      },
      {
        "keys": "ctrl+j / ctrl+m / shift+enter / alt+enter",
        "macKeys": "ctrl+j / ctrl+m / shift+return / option+return",
        "desc": "Insert a newline in the editor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.insert_newline"
        ],
        "notes": "Plain Enter is also listed as a valid trigger internally for pasted literal newlines inside a paste burst, but at the UI level plain Enter submits (composer.submit) and Shift+Enter is the advertised way to add a newline; the footer hint switches to Ctrl+J when the terminal lacks the Kitty/enhanced-keyboard protocol needed to distinguish Shift+Enter from plain Enter (chat_composer.rs use_shift_enter_hint).",
        "src": 15,
        "cmd": null,
        "intents": [
          "newline"
        ]
      },
      {
        "keys": "left / ctrl+b",
        "macKeys": "left / ctrl+b",
        "desc": "Move the cursor left.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_left"
        ],
        "notes": null,
        "src": 16,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right / ctrl+f",
        "macKeys": "right / ctrl+f",
        "desc": "Move the cursor right.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_right"
        ],
        "notes": null,
        "src": 17,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up / ctrl+p",
        "macKeys": "up / ctrl+p",
        "desc": "Move the cursor up.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_up"
        ],
        "notes": null,
        "src": 18,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "down / ctrl+n",
        "macKeys": "down / ctrl+n",
        "desc": "Move the cursor down.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_down"
        ],
        "notes": null,
        "src": 19,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+b / alt+left / ctrl+left",
        "macKeys": "option+b / option+left / ctrl+left",
        "desc": "Move to the beginning of the previous word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_word_left"
        ],
        "notes": "alt+left here is the editor-scope word-left; it is distinct from the fixed alt+left = previous_agent binding, which only fires outside text-editing focus/at the reserved-binding layer.",
        "src": 20,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "alt+f / alt+right / ctrl+right",
        "macKeys": "option+f / option+right / ctrl+right",
        "desc": "Move to the end of the next word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_word_right"
        ],
        "notes": null,
        "src": 21,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "home / ctrl+a",
        "macKeys": "home / ctrl+a",
        "desc": "Move to the beginning of the line.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_line_start"
        ],
        "notes": null,
        "src": 22,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "end / ctrl+e",
        "macKeys": "end / ctrl+e",
        "desc": "Move to the end of the line.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.move_line_end"
        ],
        "notes": null,
        "src": 23,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "backspace / shift+backspace / ctrl+h",
        "macKeys": "delete / shift+delete / ctrl+h",
        "desc": "Delete one grapheme to the left.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.delete_backward"
        ],
        "notes": null,
        "src": 24,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "delete / shift+delete / ctrl+d",
        "macKeys": "fn+delete / shift+fn+delete / ctrl+d",
        "desc": "Delete one grapheme to the right.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.delete_forward"
        ],
        "notes": "Ctrl+D only does forward-delete while the composer has text/cursor mid-line; on an empty composer with no modal open, Ctrl+D instead triggers fixed.quit (see chatwidget/interaction.rs on_ctrl_d) - the same overload readline/bash uses (EOF-on-empty-line quits the shell).",
        "src": 25,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+backspace / ctrl+backspace / ctrl+shift+backspace / ctrl+w / ctrl+alt+h",
        "macKeys": "option+delete / ctrl+delete / ctrl+shift+delete / ctrl+w / ctrl+option+h",
        "desc": "Delete the previous word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.delete_backward_word"
        ],
        "notes": "Ctrl+W here is the classic readline kill-word-backward; it is a strong GUI collision (see guiCollisions).",
        "src": 26,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "alt+delete / ctrl+delete / ctrl+shift+delete / alt+d",
        "macKeys": "option+fn+delete / ctrl+fn+delete / ctrl+shift+fn+delete / option+d",
        "desc": "Delete the next word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.delete_forward_word"
        ],
        "notes": null,
        "src": 27,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+u",
        "macKeys": "ctrl+u",
        "desc": "Delete from cursor to line start.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.kill_line_start"
        ],
        "notes": "Kill-line-start, the classic readline Ctrl+U (unix-line-discard). No default key kills the whole line at once (kill_whole_line ships unbound).",
        "src": 28,
        "cmd": null,
        "intents": [
          "clear-input"
        ]
      },
      {
        "keys": "ctrl+k",
        "macKeys": "ctrl+k",
        "desc": "Delete from cursor to line end.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.kill_line_end"
        ],
        "notes": "Classic readline kill-line.",
        "src": 29,
        "cmd": null,
        "intents": [
          "clear-input",
          "cursor-end"
        ]
      },
      {
        "keys": "ctrl+y",
        "macKeys": "ctrl+y",
        "desc": "Paste the kill buffer (yank).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "tui.keymap.editor.yank"
        ],
        "notes": "Pastes text previously removed by Ctrl+U/Ctrl+K/Ctrl+W, matching readline's kill-ring yank - not a general system-clipboard paste.",
        "src": 30,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "ctrl+c (first press)",
        "macKeys": "ctrl+c (first press)",
        "desc": "Interrupt the active turn if one is running.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": "Fixed/reserved binding, not remappable via tui.keymap. See guiCollisions for the quit-on-idle behavior.",
        "src": 31,
        "cmd": null,
        "intents": [
          "interrupt"
        ]
      },
      {
        "keys": "ctrl+c (idle, second/only press)",
        "macKeys": "ctrl+c (idle, second/only press)",
        "desc": "Quit Codex.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": "With DOUBLE_PRESS_QUIT_SHORTCUT_ENABLED currently false (bottom_pane/mod.rs:181), a single Ctrl+C while idle (no running turn, no modal/popup) calls request_quit_without_confirmation() immediately - there is no confirmation step and no second-press requirement in the shipped default, despite a double-press-armed code path (1s window, QUIT_SHORTCUT_TIMEOUT) existing behind that disabled flag.",
        "src": 32,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+d (composer empty)",
        "macKeys": "ctrl+d (composer empty)",
        "desc": "Quit Codex.",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": null,
        "notes": "Only fires when the composer is empty and no modal/popup is active - mirrors shell EOF-on-empty-line-exits behavior. With no text in the composer, this quits immediately without confirmation (same disabled double-press flag as Ctrl+C).",
        "src": 33,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+v",
        "macKeys": "cmd+v is NOT wired; use ctrl+v",
        "desc": "Paste an image from the clipboard as an attachment.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": "ctrl+alt+v is bound as an equivalent alias. This path only encodes an image from the OS clipboard as a PNG/JPEG attachment; ordinary text paste happens automatically via the terminal's bracketed-paste stream and is not this keybinding.",
        "src": 34,
        "cmd": null,
        "intents": [
          "paste-image"
        ]
      },
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "Cycle the collaboration mode.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 35,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "alt+left",
        "macKeys": "option+left",
        "desc": "Switch to the previous agent.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 36,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+right",
        "macKeys": "option+right",
        "desc": "Switch to the next agent.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 37,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "/",
        "macKeys": "/",
        "desc": "Trigger the slash-command popup (only at the start of an empty draft).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 38,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "!",
        "macKeys": "!",
        "desc": "Trigger shell-command mode (only at the start of an empty draft).",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 39,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "@",
        "macKeys": "@",
        "desc": "Trigger the file-path mention popup.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 40,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "$",
        "macKeys": "$",
        "desc": "Trigger the connector-mentions popup.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 41,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+z",
        "macKeys": "ctrl+z",
        "desc": "Suspend Codex (SIGTSTP); resume with `fg` in the shell.",
        "ctx": "global",
        "origin": "terminal-level",
        "conf": "source-code",
        "action": null,
        "notes": "Standard terminal job-control key, but Codex adds its own handling: it cleanly leaves the alt screen before suspending and reapplies raw mode + realigns the viewport after `fg`, rather than leaving redraw-after-resume to chance.",
        "src": 42,
        "cmd": null,
        "intents": [
          "suspend"
        ]
      },
      {
        "keys": "esc (backtrack step 1, main view, empty composer, no running turn)",
        "macKeys": "esc",
        "desc": "Prime edit-previous-message (backtrack) mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 43,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc (backtrack step 2)",
        "macKeys": "esc",
        "desc": "Open the transcript overlay with the last user message highlighted for editing.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 44,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "left / esc",
        "macKeys": "left / esc",
        "desc": "Select the previous (older) prior user message to edit.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 45,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right",
        "macKeys": "right",
        "desc": "Select the next (newer) prior user message to edit.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 46,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "enter",
        "macKeys": "return",
        "desc": "Fork the thread before the selected prior message and reopen it for editing.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 47,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up / k",
        "macKeys": "up / k",
        "desc": "Scroll up by one row (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.scroll_up"
        ],
        "notes": null,
        "src": 48,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "down / j",
        "macKeys": "down / j",
        "desc": "Scroll down by one row (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.scroll_down"
        ],
        "notes": null,
        "src": 49,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "pageup / shift+space / ctrl+b",
        "macKeys": "pageup / shift+space / ctrl+b",
        "desc": "Scroll up by one page (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.page_up"
        ],
        "notes": "ctrl+b/ctrl+f as page up/down echoes the `less`/`more` pager convention, not readline (readline uses these for cursor movement instead).",
        "src": 50,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "pagedown / space / ctrl+f",
        "macKeys": "pagedown / space / ctrl+f",
        "desc": "Scroll down by one page (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.page_down"
        ],
        "notes": null,
        "src": 51,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+u",
        "macKeys": "ctrl+u",
        "desc": "Scroll up by half a page (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.half_page_up"
        ],
        "notes": "Same physical chord as editor kill-line-start, but scoped to the pager context so there is no runtime collision.",
        "src": 52,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "Scroll down by half a page (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.half_page_down"
        ],
        "notes": "Matches the `less`/vim half-page-down convention (ctrl+d), distinct from the editor's ctrl+d (delete-forward) or the main-view ctrl+d (quit) - scoped to the pager context.",
        "src": 53,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "home",
        "macKeys": "home",
        "desc": "Jump to the beginning (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.jump_top"
        ],
        "notes": null,
        "src": 54,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "end",
        "macKeys": "end",
        "desc": "Jump to the end (pager/transcript overlay).",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.jump_bottom"
        ],
        "notes": null,
        "src": 55,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "q / ctrl+c",
        "macKeys": "q / ctrl+c",
        "desc": "Close the pager overlay.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.close"
        ],
        "notes": "Ctrl+C closes the pager rather than quitting Codex while the overlay has focus - scoped override of the global quit semantics.",
        "src": 56,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "Close the transcript overlay.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.pager.close_transcript"
        ],
        "notes": "Same key that opens the transcript from the main view - acts as an open/close toggle.",
        "src": 57,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "up / ctrl+p / ctrl+k / k",
        "macKeys": "up / ctrl+p / ctrl+k / k",
        "desc": "Move list selection up (popup pickers).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.move_up"
        ],
        "notes": "Plain j/k only fire when the picker is not accepting free-text search input (is_plain_text_key_event guard, keymap.rs list docs).",
        "src": 58,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "down / ctrl+n / ctrl+j / j",
        "macKeys": "down / ctrl+n / ctrl+j / j",
        "desc": "Move list selection down (popup pickers).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.move_down"
        ],
        "notes": null,
        "src": 59,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "left / ctrl+h",
        "macKeys": "left / ctrl+h",
        "desc": "Move horizontally left in list pickers (tabs/toolbars).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.move_left"
        ],
        "notes": null,
        "src": 60,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right / ctrl+l",
        "macKeys": "right / ctrl+l",
        "desc": "Move horizontally right in list pickers (tabs/toolbars).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.move_right"
        ],
        "notes": "Overlaps with the global clear_terminal (ctrl+l) chord; explicitly allow-listed as a non-conflicting overlap in validate_no_shadow_with_allowed_overlaps (keymap.rs:1503-1507) because list context takes precedence while a picker is open.",
        "src": 61,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pageup / ctrl+b",
        "macKeys": "pageup / ctrl+b",
        "desc": "Move list selection up by one page.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.page_up"
        ],
        "notes": null,
        "src": 62,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pagedown / ctrl+f",
        "macKeys": "pagedown / ctrl+f",
        "desc": "Move list selection down by one page.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.page_down"
        ],
        "notes": null,
        "src": 63,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "home",
        "macKeys": "home",
        "desc": "Jump to the first list item.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.jump_top"
        ],
        "notes": null,
        "src": 64,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "end",
        "macKeys": "end",
        "desc": "Jump to the last list item.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.jump_bottom"
        ],
        "notes": null,
        "src": 65,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "enter",
        "macKeys": "return",
        "desc": "Accept the current list selection.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.accept"
        ],
        "notes": null,
        "src": 66,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Cancel and close selection views.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.list.cancel"
        ],
        "notes": null,
        "src": 67,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+c",
        "macKeys": "ctrl+c",
        "desc": "Cancel the open list picker (resume picker etc.), does not quit Codex.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 68,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "Toggle transcript preview inside the resume/session picker.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 68,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+e",
        "macKeys": "ctrl+e",
        "desc": "Toggle expansion inside the resume/session picker.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 68,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+o",
        "macKeys": "ctrl+o",
        "desc": "Toggle density inside the resume/session picker.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": null,
        "notes": null,
        "src": 68,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+a / ctrl+shift+a",
        "macKeys": "ctrl+a / ctrl+shift+a",
        "desc": "Open approval details fullscreen.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.open_fullscreen"
        ],
        "notes": "This is a strong GUI collision inside the approval dialog specifically - see guiCollisions.",
        "src": 69,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "o",
        "macKeys": "o",
        "desc": "Open the approval's source thread, when available.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.open_thread"
        ],
        "notes": null,
        "src": 70,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "y",
        "macKeys": "y",
        "desc": "Approve the primary option.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.approve"
        ],
        "notes": null,
        "src": 71,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "a",
        "macKeys": "a",
        "desc": "Approve for the rest of the session, when available.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.approve_for_session"
        ],
        "notes": null,
        "src": 72,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "p",
        "macKeys": "p",
        "desc": "Approve with an exec-policy prefix, when available.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.approve_for_prefix"
        ],
        "notes": null,
        "src": 73,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "d",
        "macKeys": "d",
        "desc": "Choose the explicit deny option, when available.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.deny"
        ],
        "notes": null,
        "src": 74,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc / n",
        "macKeys": "esc / n",
        "desc": "Decline and provide corrective guidance.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.decline"
        ],
        "notes": null,
        "src": 75,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "c",
        "macKeys": "c",
        "desc": "Cancel an elicitation request.",
        "ctx": "approval-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.approval.cancel"
        ],
        "notes": null,
        "src": 76,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "i / insert",
        "macKeys": "i / insert",
        "desc": "Enter insert mode at the cursor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.enter_insert"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "a",
        "macKeys": "a",
        "desc": "Enter insert mode after the cursor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.append_after_cursor"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+a / A",
        "macKeys": "shift+a / A",
        "desc": "Enter insert mode at end of line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.append_line_end"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "cursor-end"
        ]
      },
      {
        "keys": "shift+i / I",
        "macKeys": "shift+i / I",
        "desc": "Enter insert mode at the first non-blank character.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.insert_line_start"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "o",
        "macKeys": "o",
        "desc": "Open a new line below and enter insert mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.open_line_below"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "newline"
        ]
      },
      {
        "keys": "shift+o / O",
        "macKeys": "shift+o / O",
        "desc": "Open a new line above and enter insert mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.open_line_above"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "newline"
        ]
      },
      {
        "keys": "h / left",
        "macKeys": "h / left",
        "desc": "Move left in Vim normal mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_left"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "l / right",
        "macKeys": "l / right",
        "desc": "Move right in Vim normal mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_right"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "k / up",
        "macKeys": "k / up",
        "desc": "Move up or recall older history in Vim normal mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_up"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "j / down",
        "macKeys": "j / down",
        "desc": "Move down or recall newer history in Vim normal mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_down"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "w",
        "macKeys": "w",
        "desc": "Move to the start of the next word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_word_forward"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "b",
        "macKeys": "b",
        "desc": "Move to the start of the previous word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_word_backward"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "e",
        "macKeys": "e",
        "desc": "Move to the end of the current or next word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_word_end"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "0",
        "macKeys": "0",
        "desc": "Move to the start of the line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_line_start"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "$ / shift+$",
        "macKeys": "$ / shift+$",
        "desc": "Move to the end of the line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.move_line_end"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "x",
        "macKeys": "x",
        "desc": "Delete the character under the cursor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.delete_char"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "s",
        "macKeys": "s",
        "desc": "Delete the character under the cursor and enter insert mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.substitute_char"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+d / D",
        "macKeys": "shift+d / D",
        "desc": "Delete from cursor to end of line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.delete_to_line_end"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "shift+c / C",
        "macKeys": "shift+c / C",
        "desc": "Change from cursor to end of line and enter insert mode.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.change_to_line_end"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "shift+y / Y",
        "macKeys": "shift+y / Y",
        "desc": "Yank the entire line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.yank_line"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "p",
        "macKeys": "p",
        "desc": "Paste after the cursor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.paste_after"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "d",
        "macKeys": "d",
        "desc": "Begin a delete operator and wait for a motion.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.start_delete_operator"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "y",
        "macKeys": "y",
        "desc": "Begin a yank operator and wait for a motion.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.start_yank_operator"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "c",
        "macKeys": "c",
        "desc": "Begin a change operator and wait for a text object.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.start_change_operator"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Cancel a pending Vim operator.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_normal.cancel_operator"
        ],
        "notes": "Vim mode is opt-in - no default toggle key ships (see tui.keymap.global.toggle_vim_mode above); once enabled via the /keymap picker or config, this is the Vim normal-mode default. Both `shift(letter)` and bare uppercase variants are bound for A/I/O/D/C/Y/W/B to cover terminals that report Shift inconsistently (keymap.rs comment at line 162).",
        "src": 77,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "d",
        "macKeys": "d",
        "desc": "Repeat delete operator to delete the whole line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.delete_line"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "y",
        "macKeys": "y",
        "desc": "Repeat yank operator to yank the whole line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.yank_line"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "h",
        "macKeys": "h",
        "desc": "Operator motion left.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_left"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "l",
        "macKeys": "l",
        "desc": "Operator motion right.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_right"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "k",
        "macKeys": "k",
        "desc": "Operator motion up.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_up"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "j",
        "macKeys": "j",
        "desc": "Operator motion down.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_down"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "w",
        "macKeys": "w",
        "desc": "Operator motion to start of next word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_word_forward"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "b",
        "macKeys": "b",
        "desc": "Operator motion to start of previous word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_word_backward"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "e",
        "macKeys": "e",
        "desc": "Operator motion to end of word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_word_end"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "0",
        "macKeys": "0",
        "desc": "Operator motion to line start.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_line_start"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "$ / shift+$",
        "macKeys": "$ / shift+$",
        "desc": "Operator motion to line end.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.motion_line_end"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": [
          "cursor-end"
        ]
      },
      {
        "keys": "i",
        "macKeys": "i",
        "desc": "Select an inner text object.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.select_inner_text_object"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "a",
        "macKeys": "a",
        "desc": "Select an around text object.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.select_around_text_object"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Cancel the pending operator.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_operator.cancel"
        ],
        "notes": "Active for one keypress after start_delete_operator/start_yank_operator/start_change_operator in Vim normal mode; repeating the operator key itself (dd, yy, cc) acts on the whole line via vim_operator.delete_line/yank_line. Esc cancels the pending operator.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "w",
        "macKeys": "w",
        "desc": "Target the current word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.word"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+w / W",
        "macKeys": "shift+w / W",
        "desc": "Target the current WORD.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.big_word"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "( / shift+( / ) / shift+) / b",
        "macKeys": "( / shift+( / ) / shift+) / b",
        "desc": "Target enclosing parentheses.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.parentheses"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "[ / ]",
        "macKeys": "[ / ]",
        "desc": "Target enclosing brackets.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.brackets"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "{ / shift+{ / } / shift+} / shift+b / B",
        "macKeys": "{ / shift+{ / } / shift+} / shift+b / B",
        "desc": "Target enclosing braces.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.braces"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "\" / shift+\"",
        "macKeys": "\" / shift+\"",
        "desc": "Target enclosing double quotes.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.double_quote"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "'",
        "macKeys": "'",
        "desc": "Target enclosing single quotes.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.single_quote"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "`",
        "macKeys": "`",
        "desc": "Target enclosing backticks.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.backtick"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Cancel the pending text object.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tui.keymap.vim_text_object.cancel"
        ],
        "notes": "Active after an operator plus an inner (`i`) or around (`a`) prefix in Vim operator-pending mode, e.g. `dip` deletes inside parentheses.",
        "src": 79,
        "cmd": null,
        "intents": []
      }
    ]
  },
  {
    "slug": "opencode",
    "label": "OpenCode",
    "surface": "tui",
    "host": null,
    "version": null,
    "versionNotes": "v1.18.13 (repo anomalyco/opencode, dev branch commit 4a57013cf8cb163f58638273fd9da8538cd33cb7; sst/opencode 301-redirects to this repo - same project, renamed). First pass used the docs mirror of the default keybinds (packages/web/src/content/docs/keybinds.mdx); this revision reads the actual dispatcher source directly: packages/tui/src/config/keybind.ts (the Definitions/CommandMap source of truth - more complete than the docs sample), packages/tui/src/keymap.tsx (registerOpencodeKeymap, the managed-textarea-layer wiring), packages/tui/src/component/prompt/index.tsx (prompt.history.previous/next decline logic), packages/tui/src/routes/session/index.tsx (session.parent/session.child.* registration), packages/tui/src/component/dialog-model.tsx and dialog-session-list.tsx (dialog-scoped action registration), packages/tui/src/feature-plugins/home/tips.tsx (tips.toggle scope), and packages/opencode/src/cli/cmd/run/footer.view.tsx (session_queued_prompts scope) - plus the underlying keymap engine, @opentui/keymap (github.com/anomalyco/opentui, packages/keymap), for its general layering/priority rules and packages/core/src/renderables/EditBufferRenderable.ts for command return-value semantics. Locally installed opencode is an older v1.4.7 with no local tui.json; not used as a source.",
    "checkedAt": "2026-08-05",
    "sources": [
      "keybinds.mdx L13,190-200; confirmed identical in packages/tui/src/config/keybind.ts L46 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L14; confirmed identical in packages/tui/src/config/keybind.ts L48 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L23, tui.mdx L72; confirmed identical in packages/tui/src/config/keybind.ts L57 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L27, tui.mdx L110-118; confirmed identical in packages/tui/src/config/keybind.ts L77 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L28, tui.mdx L231-239; confirmed identical in packages/tui/src/config/keybind.ts L78 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L31; confirmed identical in packages/tui/src/config/keybind.ts L81 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L33; confirmed identical in packages/tui/src/config/keybind.ts L83 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L35, tui.mdx L134-142; confirmed identical in packages/tui/src/config/keybind.ts L86 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L38, tui.mdx L178-186; confirmed identical in packages/tui/src/config/keybind.ts L89 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L39, tui.mdx L209-217; confirmed identical in packages/tui/src/config/keybind.ts L90 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L40; confirmed identical in packages/tui/src/config/keybind.ts L91 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L42; confirmed identical in packages/tui/src/config/keybind.ts L93 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L43; confirmed identical in packages/tui/src/config/keybind.ts L94 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L46; confirmed identical in packages/tui/src/config/keybind.ts L97 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L47, tui.mdx L88-96; confirmed identical in packages/tui/src/config/keybind.ts L99 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L50, L198; confirmed identical in packages/tui/src/config/keybind.ts L103 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L51, L198; confirmed identical in packages/tui/src/config/keybind.ts L104 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L52, L198; confirmed identical in packages/tui/src/config/keybind.ts L105 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L53, L198; confirmed identical in packages/tui/src/config/keybind.ts L106 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L55; confirmed identical in packages/tui/src/config/keybind.ts L118 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L56; confirmed identical in packages/tui/src/config/keybind.ts L119 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L57; confirmed identical in packages/tui/src/config/keybind.ts L120 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L58, tui.mdx L166-174; confirmed identical in packages/tui/src/config/keybind.ts L121 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L59; confirmed identical in packages/tui/src/config/keybind.ts L122 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L60; confirmed identical in packages/tui/src/config/keybind.ts L123 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L66; confirmed identical in packages/tui/src/config/keybind.ts L129 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L67; confirmed identical in packages/tui/src/config/keybind.ts L130 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L68; confirmed identical in packages/tui/src/config/keybind.ts L131 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L69, tui.mdx L243-249; confirmed identical in packages/tui/src/config/keybind.ts L132 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L72; confirmed identical in packages/tui/src/config/keybind.ts L135 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L73; confirmed identical in packages/tui/src/config/keybind.ts L136 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L74; confirmed identical in packages/tui/src/config/keybind.ts L137 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L75; confirmed identical in packages/tui/src/config/keybind.ts L138 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L76; confirmed identical in packages/tui/src/config/keybind.ts L139 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L77; confirmed identical in packages/tui/src/config/keybind.ts L140 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L78; confirmed identical in packages/tui/src/config/keybind.ts L141 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L79; confirmed identical in packages/tui/src/config/keybind.ts L142 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L83; confirmed identical in packages/tui/src/config/keybind.ts L146 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L84, tui.mdx L257-270; confirmed identical in packages/tui/src/config/keybind.ts L147 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L85, tui.mdx L190-205; confirmed identical in packages/tui/src/config/keybind.ts L148 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L86; confirmed identical in packages/tui/src/config/keybind.ts L149 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L98; confirmed identical in packages/tui/src/config/keybind.ts L161 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L99-102; confirmed identical in packages/tui/src/config/keybind.ts L162 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L103; confirmed identical in packages/tui/src/config/keybind.ts L163 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L104; confirmed identical in packages/tui/src/config/keybind.ts L164 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L105; confirmed identical in packages/tui/src/config/keybind.ts L165 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L106; confirmed identical in packages/tui/src/config/keybind.ts L166 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L107; confirmed identical in packages/tui/src/config/keybind.ts L167 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L108; confirmed identical in packages/tui/src/config/keybind.ts L168 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L109; confirmed identical in packages/tui/src/config/keybind.ts L169 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L110; confirmed identical in packages/tui/src/config/keybind.ts L170 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L111; confirmed identical in packages/tui/src/config/keybind.ts L171 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L112; confirmed identical in packages/tui/src/config/keybind.ts L172 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L113; confirmed identical in packages/tui/src/config/keybind.ts L173 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L114; confirmed identical in packages/tui/src/config/keybind.ts L174 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L115; confirmed identical in packages/tui/src/config/keybind.ts L175 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L116; confirmed identical in packages/tui/src/config/keybind.ts L176 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L117; confirmed identical in packages/tui/src/config/keybind.ts L177 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L118; confirmed identical in packages/tui/src/config/keybind.ts L178 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L119; confirmed identical in packages/tui/src/config/keybind.ts L179 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L120; confirmed identical in packages/tui/src/config/keybind.ts L180 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L121; confirmed identical in packages/tui/src/config/keybind.ts L181 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L122; confirmed identical in packages/tui/src/config/keybind.ts L182 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L123; confirmed identical in packages/tui/src/config/keybind.ts L183 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L124; confirmed identical in packages/tui/src/config/keybind.ts L184 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L125; confirmed identical in packages/tui/src/config/keybind.ts L185 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L126; confirmed identical in packages/tui/src/config/keybind.ts L186 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L127; confirmed identical in packages/tui/src/config/keybind.ts L187 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L128; confirmed identical in packages/tui/src/config/keybind.ts L188 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L129; confirmed identical in packages/tui/src/config/keybind.ts L189 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L130, L182-186; confirmed identical in packages/tui/src/config/keybind.ts L190 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L131; confirmed identical in packages/tui/src/config/keybind.ts L191 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L132; confirmed identical in packages/tui/src/config/keybind.ts L192 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L133; confirmed identical in packages/tui/src/config/keybind.ts L193 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L134; confirmed identical in packages/tui/src/config/keybind.ts L194 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L135; confirmed identical in packages/tui/src/config/keybind.ts L195 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L136; confirmed identical in packages/tui/src/config/keybind.ts L196 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L137; confirmed identical in packages/tui/src/config/keybind.ts L197 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L138; confirmed identical in packages/tui/src/config/keybind.ts L198 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L139; confirmed identical in packages/tui/src/config/keybind.ts L199 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L140; confirmed identical in packages/tui/src/config/keybind.ts L200 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L142; confirmed identical in packages/tui/src/config/keybind.ts L202 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L143; confirmed identical in packages/tui/src/config/keybind.ts L203 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L144; confirmed identical in packages/tui/src/config/keybind.ts L204 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L145; confirmed identical in packages/tui/src/config/keybind.ts L205 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L146; confirmed identical in packages/tui/src/config/keybind.ts L206 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L147; confirmed identical in packages/tui/src/config/keybind.ts L207 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L148; confirmed identical in packages/tui/src/config/keybind.ts L208 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L149; confirmed identical in packages/tui/src/config/keybind.ts L209 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L150; confirmed identical in packages/tui/src/config/keybind.ts L210 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L151; confirmed identical in packages/tui/src/config/keybind.ts L214 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L152; confirmed identical in packages/tui/src/config/keybind.ts L215 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L153; confirmed identical in packages/tui/src/config/keybind.ts L216 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L154; confirmed identical in packages/tui/src/config/keybind.ts L217 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L155; confirmed identical in packages/tui/src/config/keybind.ts L218 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L156; confirmed identical in packages/tui/src/config/keybind.ts L219 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L157; confirmed identical in packages/tui/src/config/keybind.ts L220 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L158; confirmed identical in packages/tui/src/config/keybind.ts L221 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L160, L182-186; confirmed identical in packages/tui/src/config/keybind.ts L223 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L162; confirmed identical in packages/tui/src/config/keybind.ts L225 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L166; confirmed identical in packages/tui/src/config/keybind.ts L229 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L167; confirmed identical in packages/tui/src/config/keybind.ts L230 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L168; confirmed identical in packages/tui/src/config/keybind.ts L231 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L169; confirmed identical in packages/tui/src/config/keybind.ts L232 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L170; confirmed identical in packages/tui/src/config/keybind.ts L233 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L171; confirmed identical in packages/tui/src/config/keybind.ts L234 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L172; confirmed identical in packages/tui/src/config/keybind.ts L235 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L173; confirmed identical in packages/tui/src/config/keybind.ts L236 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L174; confirmed identical in packages/tui/src/config/keybind.ts L237 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L175; confirmed identical in packages/tui/src/config/keybind.ts L238 (Definitions object, verified against dev branch commit 4a57013c)",
      "keybinds.mdx L176; confirmed identical in packages/tui/src/config/keybind.ts L239 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L61 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L62 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L63 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L64 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L65 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L66 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L67 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L68 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L69 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L70 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L71 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L72 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L73 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L74 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L75 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L98 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L107 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L108 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L109 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L110 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L111 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L112 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L113 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L114 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L115 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L116 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L211 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L212 (Definitions object, verified against dev branch commit 4a57013c)",
      "packages/tui/src/config/keybind.ts L213 (Definitions object, verified against dev branch commit 4a57013c)"
    ],
    "bindings": [
      {
        "keys": "ctrl+x",
        "macKeys": "ctrl+x",
        "desc": "Leader key. Activates leader mode for leader_timeout ms (default 2000); the next key pressed is interpreted as a leader combo, e.g. ctrl+x then n = new session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "leader"
        ],
        "notes": "GUI collision: ctrl+x is universally 'cut' in GUI apps; here it does nothing visible except arm leader mode. Configurable via the top-level keybinds.leader key.",
        "src": 0,
        "cmd": null,
        "intents": [
          "session-new"
        ]
      },
      {
        "keys": "ctrl+c,ctrl+d,<leader>q",
        "macKeys": "ctrl+c,ctrl+d,<leader>q",
        "desc": "app_exit - quit OpenCode.",
        "ctx": "global",
        "origin": "terminal-level",
        "conf": "source-code",
        "action": [
          "app_exit"
        ],
        "notes": "ctrl+c and ctrl+d also fire other actions (input_clear, input_delete, session_delete, stash_delete) depending on default config; the docs do not specify a priority/resolution order for the overlap, only that these are the listed defaults for each named action. Not confirmed whether a 'press twice to exit' pattern exists.",
        "src": 1,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+p",
        "macKeys": "ctrl+p",
        "desc": "command_list - open the command palette.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "command_list"
        ],
        "notes": "Same key is also the default for dialog.select.prev (move up one item once a dialog/list is already open) - not a conflict, just two different contexts (open palette vs navigate an open list).",
        "src": 2,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>e",
        "macKeys": "<leader>e",
        "desc": "editor_open - open the external $EDITOR to compose the current message.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "editor_open"
        ],
        "notes": "Also available as /editor.",
        "src": 3,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "<leader>t",
        "macKeys": "<leader>t",
        "desc": "theme_list - open theme picker.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "theme_list"
        ],
        "notes": "Also /themes.",
        "src": 4,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>b",
        "macKeys": "<leader>b",
        "desc": "sidebar_toggle - show/hide the sidebar.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "sidebar_toggle"
        ],
        "notes": null,
        "src": 5,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>s",
        "macKeys": "<leader>s",
        "desc": "status_view - open status view.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "status_view"
        ],
        "notes": null,
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>x",
        "macKeys": "<leader>x",
        "desc": "session_export - export current conversation to Markdown and open in $EDITOR.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_export"
        ],
        "notes": "Also /export.",
        "src": 7,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "<leader>n",
        "macKeys": "<leader>n",
        "desc": "session_new - start a new session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_new"
        ],
        "notes": "Also /new, /clear.",
        "src": 8,
        "cmd": null,
        "intents": [
          "session-new"
        ]
      },
      {
        "keys": "<leader>l",
        "macKeys": "<leader>l",
        "desc": "session_list - list and switch between saved sessions.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_list"
        ],
        "notes": "Also /sessions, /resume, /continue.",
        "src": 9,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>g",
        "macKeys": "<leader>g",
        "desc": "session_timeline - open session timeline view.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_timeline"
        ],
        "notes": null,
        "src": 10,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "session_rename - rename the current session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_rename"
        ],
        "notes": "Key coincides with readline's reverse-i-search but the action is unrelated (rename, not search).",
        "src": 11,
        "cmd": null,
        "intents": [
          "session-rename"
        ]
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "session_delete - delete the currently selected/open session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_delete"
        ],
        "notes": "ctrl+d is heavily overloaded by default: also input_delete (delete char forward), stash_delete, and one of the app_exit combo keys. Docs list these as parallel defaults without specifying precedence; presumably resolved by UI focus context (dialog vs input vs global) but that resolution is not documented.",
        "src": 12,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "escape",
        "macKeys": "escape",
        "desc": "session_interrupt - interrupt/cancel the model's in-flight response.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_interrupt"
        ],
        "notes": "This is the primary interrupt/cancel binding for a running turn.",
        "src": 13,
        "cmd": null,
        "intents": [
          "interrupt",
          "model-switch"
        ]
      },
      {
        "keys": "<leader>c",
        "macKeys": "<leader>c",
        "desc": "session_compact - compact/summarize the current session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_compact"
        ],
        "notes": "Also /compact, /summarize.",
        "src": 14,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>down",
        "macKeys": "<leader>down",
        "desc": "session_child_first - jump to the first child (subagent) session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_child_first"
        ],
        "notes": "Deliberately does not require the leader for the sibling actions below it; see the doc's explicit callout.",
        "src": 15,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right",
        "macKeys": "right",
        "desc": "session_child_cycle - cycle to the next child/subagent session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_child_cycle"
        ],
        "notes": "No leader required by design.",
        "src": 16,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "left",
        "macKeys": "left",
        "desc": "session_child_cycle_reverse - cycle to the previous child/subagent session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_child_cycle_reverse"
        ],
        "notes": "No leader required by design.",
        "src": 17,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up",
        "macKeys": "up",
        "desc": "session_parent - go to the parent session.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_parent"
        ],
        "notes": "Same physical key ('up') is also the default for input_move_up and history_previous; resolution is presumably context/focus-dependent, not documented explicitly.",
        "src": 18,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "stash_delete - delete a stashed prompt.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "stash_delete"
        ],
        "notes": "See ctrl+d overload note under session_delete.",
        "src": 19,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+a",
        "macKeys": "ctrl+a",
        "desc": "model_provider_list - open the model provider list.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "model_provider_list"
        ],
        "notes": "Same default key as input_line_home (readline 'move to start of line'). Docs list both as ctrl+a defaults without specifying precedence; likely resolved by whether the input box or another view has focus, but that is not documented.",
        "src": 20,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+f",
        "macKeys": "ctrl+f",
        "desc": "model_favorite_toggle - toggle a model as favorite.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "model_favorite_toggle"
        ],
        "notes": "Same default key is part of input_move_right ('right,ctrl+f', readline 'forward-char') and of permission.prompt.fullscreen. Overlap not resolved in docs; presumed context/focus-dependent.",
        "src": 21,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "<leader>m",
        "macKeys": "<leader>m",
        "desc": "model_list - list/switch available models.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "model_list"
        ],
        "notes": "Also /models.",
        "src": 22,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "f2",
        "macKeys": "f2",
        "desc": "model_cycle_recent - cycle to the next recently-used model.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "model_cycle_recent"
        ],
        "notes": null,
        "src": 23,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "shift+f2",
        "macKeys": "shift+f2",
        "desc": "model_cycle_recent_reverse - cycle to the previous recently-used model.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "model_cycle_recent_reverse"
        ],
        "notes": null,
        "src": 24,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "<leader>a",
        "macKeys": "<leader>a",
        "desc": "agent_list - list/switch agents.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "agent_list"
        ],
        "notes": null,
        "src": 25,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "agent_cycle - cycle to the next agent.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "agent_cycle"
        ],
        "notes": "Tab is also prompt.autocomplete.complete inside autocomplete popups - context-scoped, not a real conflict.",
        "src": 26,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "agent_cycle_reverse - cycle to the previous agent.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "agent_cycle_reverse"
        ],
        "notes": null,
        "src": 27,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "variant_cycle - cycle the active model's reasoning/thinking variant (e.g. effort level).",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "variant_cycle"
        ],
        "notes": "GUI collision candidate (ctrl+t = 'new tab' in every browser). Also inconsistent with the OpenCode Desktop app's own readline table in the same doc, where ctrl+t means 'transpose characters' (classic emacs binding) - the same key means different things on the TUI vs the Desktop app prompt.",
        "src": 28,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "pageup,ctrl+alt+b",
        "macKeys": "pageup,ctrl+alt+b",
        "desc": "messages_page_up - scroll transcript up one page.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_page_up"
        ],
        "notes": null,
        "src": 29,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "pagedown,ctrl+alt+f",
        "macKeys": "pagedown,ctrl+alt+f",
        "desc": "messages_page_down - scroll transcript down one page.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_page_down"
        ],
        "notes": null,
        "src": 30,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+alt+y",
        "macKeys": "ctrl+alt+y",
        "desc": "messages_line_up - scroll transcript up one line.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_line_up"
        ],
        "notes": null,
        "src": 31,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+alt+e",
        "macKeys": "ctrl+alt+e",
        "desc": "messages_line_down - scroll transcript down one line.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_line_down"
        ],
        "notes": null,
        "src": 32,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+alt+u",
        "macKeys": "ctrl+alt+u",
        "desc": "messages_half_page_up - scroll transcript up half a page.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_half_page_up"
        ],
        "notes": null,
        "src": 33,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+alt+d",
        "macKeys": "ctrl+alt+d",
        "desc": "messages_half_page_down - scroll transcript down half a page.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_half_page_down"
        ],
        "notes": null,
        "src": 34,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+g,home",
        "macKeys": "ctrl+g,home",
        "desc": "messages_first - jump to the first message in the transcript.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_first"
        ],
        "notes": "In the separate OpenCode Desktop app readline table (different surface), ctrl+g instead means 'cancel popovers / abort running response' - a functional divergence between the two OpenCode surfaces for the same key.",
        "src": 35,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+alt+g,end",
        "macKeys": "ctrl+alt+g,end",
        "desc": "messages_last - jump to the last message in the transcript.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_last"
        ],
        "notes": null,
        "src": 36,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "<leader>y",
        "macKeys": "<leader>y",
        "desc": "messages_copy - copy message(s) from the transcript.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_copy"
        ],
        "notes": null,
        "src": 37,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "<leader>u",
        "macKeys": "<leader>u",
        "desc": "messages_undo - undo the last conversation turn (git-based; reverts file changes too). Requires the project to be a git repo.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_undo"
        ],
        "notes": "Also /undo. Distinct from input_undo (ctrl+-/super+z), which undoes text edits in the input box, not conversation turns.",
        "src": 38,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>r",
        "macKeys": "<leader>r",
        "desc": "messages_redo - redo a previously undone turn.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_redo"
        ],
        "notes": "Also /redo.",
        "src": 39,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>h",
        "macKeys": "<leader>h",
        "desc": "messages_toggle_conceal - toggle concealment of message content.",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "messages_toggle_conceal"
        ],
        "notes": "Same default key (<leader>h) is also listed for tips_toggle (L162) later in the same defaults block. The docs render both with an identical default; this looks like an unresolved duplicate in the shipped default config rather than an intentional shared trigger, but that is not confirmed - flagging as-is rather than guessing which one wins.",
        "src": 40,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+c",
        "macKeys": "ctrl+c",
        "desc": "input_clear - clear the input box.",
        "ctx": "input",
        "origin": "terminal-level",
        "conf": "source-code",
        "action": [
          "input_clear"
        ],
        "notes": "ctrl+c is also one of the app_exit keys; see that entry's note on unresolved precedence.",
        "src": 41,
        "cmd": null,
        "intents": [
          "clear-input"
        ]
      },
      {
        "keys": "ctrl+v",
        "macKeys": "ctrl+v",
        "desc": "input_paste - paste clipboard contents into the input box.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_paste"
        ],
        "notes": "Matches GUI paste expectation - no collision. Shown in docs as the object form ({key, preventDefault:false}) demonstrating the advanced binding syntax.",
        "src": 42,
        "cmd": null,
        "intents": [
          "paste-text"
        ]
      },
      {
        "keys": "return",
        "macKeys": "return",
        "desc": "input_submit - submit the current message.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_submit"
        ],
        "notes": null,
        "src": 43,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "shift+return,ctrl+return,alt+return,ctrl+j",
        "macKeys": "shift+return,ctrl+return,alt+return,ctrl+j",
        "desc": "input_newline - insert a newline in the input box without submitting.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_newline"
        ],
        "notes": "Some terminals do not send Shift+Enter as a distinct sequence by default; docs include a Windows Terminal settings.json workaround to make it work.",
        "src": 44,
        "cmd": null,
        "intents": [
          "newline",
          "submit"
        ]
      },
      {
        "keys": "left,ctrl+b",
        "macKeys": "left,ctrl+b",
        "desc": "input_move_left - move cursor left one character.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_move_left"
        ],
        "notes": "ctrl+b matches classic emacs/readline backward-char.",
        "src": 45,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right,ctrl+f",
        "macKeys": "right,ctrl+f",
        "desc": "input_move_right - move cursor right one character.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_move_right"
        ],
        "notes": "ctrl+f matches classic emacs/readline forward-char, but also overlaps with model_favorite_toggle's default ctrl+f and permission.prompt.fullscreen's ctrl+f in other contexts.",
        "src": 46,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up",
        "macKeys": "up",
        "desc": "input_move_up - move cursor up a line in a multi-line input.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_move_up"
        ],
        "notes": "Shares its default key with history_previous and session_parent; documented defaults don't state the precedence. Inferred (unverified) common pattern: 'up' likely moves within multi-line text when not at the first line/char, and recalls prompt history when the cursor is already at the top of an empty/short input - this is a plausible inference from the field names, not a confirmed behavior.",
        "src": 47,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "down",
        "macKeys": "down",
        "desc": "input_move_down - move cursor down a line in a multi-line input.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_move_down"
        ],
        "notes": "Shares its default key with history_next; same unresolved-precedence caveat as input_move_up.",
        "src": 48,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+left",
        "macKeys": "shift+left",
        "desc": "input_select_left - extend selection left one character.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_left"
        ],
        "notes": null,
        "src": 49,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+right",
        "macKeys": "shift+right",
        "desc": "input_select_right - extend selection right one character.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_right"
        ],
        "notes": null,
        "src": 50,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+up",
        "macKeys": "shift+up",
        "desc": "input_select_up - extend selection up one line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_up"
        ],
        "notes": null,
        "src": 51,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+down",
        "macKeys": "shift+down",
        "desc": "input_select_down - extend selection down one line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_down"
        ],
        "notes": null,
        "src": 52,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+a",
        "macKeys": "ctrl+a",
        "desc": "input_line_home - move cursor to the start of the current line.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_line_home"
        ],
        "notes": "Matches classic emacs/readline beginning-of-line. Also see model_provider_list's default ctrl+a overlap note.",
        "src": 53,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "ctrl+e",
        "macKeys": "ctrl+e",
        "desc": "input_line_end - move cursor to the end of the current line.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_line_end"
        ],
        "notes": "Matches classic emacs/readline end-of-line.",
        "src": 54,
        "cmd": null,
        "intents": [
          "cursor-end"
        ]
      },
      {
        "keys": "ctrl+shift+a",
        "macKeys": "ctrl+shift+a",
        "desc": "input_select_line_home - select from cursor to start of line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_line_home"
        ],
        "notes": null,
        "src": 55,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "ctrl+shift+e",
        "macKeys": "ctrl+shift+e",
        "desc": "input_select_line_end - select from cursor to end of line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_line_end"
        ],
        "notes": null,
        "src": 56,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "alt+a",
        "macKeys": "alt+a",
        "desc": "input_visual_line_home - move to start of the visual (wrapped) line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_visual_line_home"
        ],
        "notes": "Distinguishes logical line vs wrapped/visual line, relevant for long multi-line prompts.",
        "src": 57,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "alt+e",
        "macKeys": "alt+e",
        "desc": "input_visual_line_end - move to end of the visual (wrapped) line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_visual_line_end"
        ],
        "notes": null,
        "src": 58,
        "cmd": null,
        "intents": [
          "cursor-end"
        ]
      },
      {
        "keys": "alt+shift+a",
        "macKeys": "alt+shift+a",
        "desc": "input_select_visual_line_home - select to start of the visual line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_visual_line_home"
        ],
        "notes": null,
        "src": 59,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "alt+shift+e",
        "macKeys": "alt+shift+e",
        "desc": "input_select_visual_line_end - select to end of the visual line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_visual_line_end"
        ],
        "notes": null,
        "src": 60,
        "cmd": null,
        "intents": [
          "cursor-end"
        ]
      },
      {
        "keys": "home",
        "macKeys": "home",
        "desc": "input_buffer_home - move cursor to the very start of the whole input buffer.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_buffer_home"
        ],
        "notes": "Also messages_first and dialog.select.home share 'home' as default in their own contexts.",
        "src": 61,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "end",
        "macKeys": "end",
        "desc": "input_buffer_end - move cursor to the very end of the whole input buffer.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_buffer_end"
        ],
        "notes": null,
        "src": 62,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+home",
        "macKeys": "shift+home",
        "desc": "input_select_buffer_home - select to the start of the whole buffer.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_buffer_home"
        ],
        "notes": null,
        "src": 63,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+end",
        "macKeys": "shift+end",
        "desc": "input_select_buffer_end - select to the end of the whole buffer.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_buffer_end"
        ],
        "notes": null,
        "src": 64,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+d",
        "macKeys": "ctrl+shift+d",
        "desc": "input_delete_line - delete the entire current line.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_delete_line"
        ],
        "notes": null,
        "src": 65,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+k",
        "macKeys": "ctrl+k",
        "desc": "input_delete_to_line_end - delete from cursor to end of line (kill-line).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_delete_to_line_end"
        ],
        "notes": "Matches classic emacs/readline kill-line.",
        "src": 66,
        "cmd": null,
        "intents": [
          "clear-input",
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "ctrl+u",
        "macKeys": "ctrl+u",
        "desc": "input_delete_to_line_start - delete from cursor to start of line (unix-line-discard).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_delete_to_line_start"
        ],
        "notes": "Matches classic emacs/readline unix-line-discard.",
        "src": 67,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "backspace,shift+backspace",
        "macKeys": "backspace,shift+backspace",
        "desc": "input_backspace - delete character before cursor.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_backspace"
        ],
        "notes": null,
        "src": 68,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+d,delete,shift+delete",
        "macKeys": "ctrl+d,delete,shift+delete",
        "desc": "input_delete - delete character after cursor (forward delete).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_delete"
        ],
        "notes": "ctrl+d component matches classic emacs/readline delete-char / terminal EOF convention. Also overloaded with session_delete/stash_delete/app_exit defaults elsewhere in the config - see session_delete's note.",
        "src": 69,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+-,super+z",
        "macKeys": "cmd+z (super+z),ctrl+-",
        "desc": "input_undo - undo the last text edit in the input box.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_undo"
        ],
        "notes": "On Windows the default is different: ctrl+z,ctrl+-,super+z (ctrl+z added because Windows terminals lack POSIX suspend, so it's safe to use there for undo). On macOS/Linux, plain ctrl+z is NOT bound to undo - it is terminal_suspend instead; only cmd+z (super+z) performs undo. See guiCollisions for the ctrl+z mismatch.",
        "src": 70,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+.,super+shift+z",
        "macKeys": "cmd+shift+z,ctrl+.",
        "desc": "input_redo - redo the last undone text edit in the input box.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_redo"
        ],
        "notes": null,
        "src": 71,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+f,alt+right,ctrl+right",
        "macKeys": "alt+f,alt+right,ctrl+right",
        "desc": "input_word_forward - move cursor forward one word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_word_forward"
        ],
        "notes": "alt+f matches classic emacs/readline forward-word.",
        "src": 72,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+b,alt+left,ctrl+left",
        "macKeys": "alt+b,alt+left,ctrl+left",
        "desc": "input_word_backward - move cursor backward one word.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_word_backward"
        ],
        "notes": "alt+b matches classic emacs/readline backward-word.",
        "src": 73,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+shift+f,alt+shift+right",
        "macKeys": "alt+shift+f,alt+shift+right",
        "desc": "input_select_word_forward - extend selection forward one word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_word_forward"
        ],
        "notes": null,
        "src": 74,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+shift+b,alt+shift+left",
        "macKeys": "alt+shift+b,alt+shift+left",
        "desc": "input_select_word_backward - extend selection backward one word.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_word_backward"
        ],
        "notes": null,
        "src": 75,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+d,alt+delete,ctrl+delete",
        "macKeys": "alt+d,alt+delete,ctrl+delete",
        "desc": "input_delete_word_forward - delete word after cursor (kill-word).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_delete_word_forward"
        ],
        "notes": "alt+d matches classic emacs/readline kill-word.",
        "src": 76,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+w,ctrl+backspace,alt+backspace",
        "macKeys": "ctrl+w,ctrl+backspace,alt+backspace",
        "desc": "input_delete_word_backward - delete word before cursor (unix-word-rubout).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "input_delete_word_backward"
        ],
        "notes": "ctrl+w matches classic emacs/readline unix-word-rubout. GUI collision: ctrl+w closes the current tab/window in virtually every browser and many desktop apps.",
        "src": 77,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "super+a",
        "macKeys": "cmd+a",
        "desc": "input_select_all - select all text in the input box.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "input_select_all"
        ],
        "notes": "This is the actual GUI-style 'select all,' but bound to super/cmd+a rather than ctrl+a (ctrl+a is taken by input_line_home). On Linux/Windows the 'super' key is often OS-reserved (Start menu / Meta), so whether this reaches the terminal app at all on those platforms is not confirmed by the docs - flagged as a gap.",
        "src": 78,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up",
        "macKeys": "up",
        "desc": "history_previous - recall the previous submitted prompt from history.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "history_previous"
        ],
        "notes": "Shares default key with input_move_up and session_parent; see input_move_up's note.",
        "src": 79,
        "cmd": null,
        "intents": [
          "submit",
          "history-prev"
        ]
      },
      {
        "keys": "down",
        "macKeys": "down",
        "desc": "history_next - recall the next submitted prompt from history.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "history_next"
        ],
        "notes": "Shares default key with input_move_down.",
        "src": 80,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "up,ctrl+p",
        "macKeys": "up,ctrl+p",
        "desc": "dialog.select.prev - move selection up in an open dialog/list.",
        "ctx": "dialog",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "dialog.select.prev"
        ],
        "notes": "ctrl+p matches classic emacs/readline previous-history / previous-line convention repurposed as 'move up in a list.'",
        "src": 81,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "down,ctrl+n",
        "macKeys": "down,ctrl+n",
        "desc": "dialog.select.next - move selection down in an open dialog/list.",
        "ctx": "dialog",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "dialog.select.next"
        ],
        "notes": "ctrl+n matches classic emacs/readline next-history / next-line convention.",
        "src": 82,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pageup",
        "macKeys": "pageup",
        "desc": "dialog.select.page_up - page up within an open dialog/list.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.select.page_up"
        ],
        "notes": null,
        "src": 83,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pagedown",
        "macKeys": "pagedown",
        "desc": "dialog.select.page_down - page down within an open dialog/list.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.select.page_down"
        ],
        "notes": null,
        "src": 84,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "home",
        "macKeys": "home",
        "desc": "dialog.select.home - jump to first item in an open dialog/list.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.select.home"
        ],
        "notes": null,
        "src": 85,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "end",
        "macKeys": "end",
        "desc": "dialog.select.end - jump to last item in an open dialog/list.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.select.end"
        ],
        "notes": null,
        "src": 86,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "return",
        "macKeys": "return",
        "desc": "dialog.select.submit - confirm the selected item in an open dialog/list.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.select.submit"
        ],
        "notes": null,
        "src": 87,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "return",
        "macKeys": "return",
        "desc": "dialog.prompt.submit - submit a text-entry dialog/prompt.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.prompt.submit"
        ],
        "notes": null,
        "src": 88,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "space",
        "macKeys": "space",
        "desc": "dialog.mcp.toggle - toggle an item in the MCP server dialog.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.mcp.toggle"
        ],
        "notes": null,
        "src": 89,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up,ctrl+p",
        "macKeys": "up,ctrl+p",
        "desc": "prompt.autocomplete.prev - move to previous autocomplete suggestion (e.g. @file references).",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "prompt.autocomplete.prev"
        ],
        "notes": null,
        "src": 90,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "down,ctrl+n",
        "macKeys": "down,ctrl+n",
        "desc": "prompt.autocomplete.next - move to next autocomplete suggestion.",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "source-code",
        "action": [
          "prompt.autocomplete.next"
        ],
        "notes": null,
        "src": 91,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "escape",
        "macKeys": "escape",
        "desc": "prompt.autocomplete.hide - dismiss the autocomplete popup.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "prompt.autocomplete.hide"
        ],
        "notes": null,
        "src": 92,
        "cmd": null,
        "intents": [
          "dismiss-suggestion"
        ]
      },
      {
        "keys": "return",
        "macKeys": "return",
        "desc": "prompt.autocomplete.select - accept the highlighted autocomplete suggestion.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "prompt.autocomplete.select"
        ],
        "notes": null,
        "src": 93,
        "cmd": null,
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "prompt.autocomplete.complete - complete/accept via Tab.",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "prompt.autocomplete.complete"
        ],
        "notes": null,
        "src": 94,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+f",
        "macKeys": "ctrl+f",
        "desc": "permission.prompt.fullscreen - expand the permission prompt to fullscreen.",
        "ctx": "permission-prompt",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "permission.prompt.fullscreen"
        ],
        "notes": "Same default key as model_favorite_toggle and part of input_move_right; scoped to when a permission prompt is showing.",
        "src": 95,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "space",
        "macKeys": "space",
        "desc": "plugins.toggle - toggle a plugin on/off in the plugins dialog.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "plugins.toggle"
        ],
        "notes": null,
        "src": 96,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+i",
        "macKeys": "shift+i",
        "desc": "dialog.plugins.install - install the selected plugin.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.plugins.install"
        ],
        "notes": null,
        "src": 97,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+z",
        "macKeys": "ctrl+z",
        "desc": "terminal_suspend - suspend OpenCode to the background (POSIX SIGTSTP, like any terminal job-control suspend; resume with `fg` in the shell).",
        "ctx": "global",
        "origin": "terminal-level",
        "conf": "source-code",
        "action": [
          "terminal_suspend"
        ],
        "notes": "Forced to 'none' on Windows (native Windows terminals don't support POSIX suspend); on Windows ctrl+z is freed up and used for input_undo instead. See guiCollisions - this is the single biggest muscle-memory trap for GUI users on macOS/Linux.",
        "src": 98,
        "cmd": null,
        "intents": [
          "suspend"
        ]
      },
      {
        "keys": "<leader>h",
        "macKeys": "<leader>h",
        "desc": "tips_toggle - toggle the tips panel.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "tips_toggle"
        ],
        "notes": "Shares its default key with messages_toggle_conceal (both default to <leader>h in the docs' own example block) - see that entry's note; flagged, not resolved.",
        "src": 99,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+k",
        "macKeys": "ctrl+alt+k",
        "desc": "which_key_toggle - toggle the 'which-key' style help overlay listing available leader combos.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_toggle"
        ],
        "notes": null,
        "src": 100,
        "cmd": null,
        "intents": [
          "help"
        ]
      },
      {
        "keys": "ctrl+alt+shift+k",
        "macKeys": "ctrl+alt+shift+k",
        "desc": "which_key_layout_toggle - toggle the which-key overlay's layout.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_layout_toggle"
        ],
        "notes": null,
        "src": 101,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+shift+p",
        "macKeys": "ctrl+alt+shift+p",
        "desc": "which_key_pending_toggle - toggle showing only pending/available combos in the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_pending_toggle"
        ],
        "notes": null,
        "src": 102,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+left,ctrl+alt+[",
        "macKeys": "ctrl+alt+left,ctrl+alt+[",
        "desc": "which_key_group_previous - previous group in the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_group_previous"
        ],
        "notes": null,
        "src": 103,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+right,ctrl+alt+]",
        "macKeys": "ctrl+alt+right,ctrl+alt+]",
        "desc": "which_key_group_next - next group in the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_group_next"
        ],
        "notes": null,
        "src": 104,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+up,ctrl+alt+p",
        "macKeys": "ctrl+alt+up,ctrl+alt+p",
        "desc": "which_key_scroll_up - scroll the which-key overlay up.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_scroll_up"
        ],
        "notes": null,
        "src": 105,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+down,ctrl+alt+n",
        "macKeys": "ctrl+alt+down,ctrl+alt+n",
        "desc": "which_key_scroll_down - scroll the which-key overlay down.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_scroll_down"
        ],
        "notes": null,
        "src": 106,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+pageup",
        "macKeys": "ctrl+alt+pageup",
        "desc": "which_key_page_up - page up in the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_page_up"
        ],
        "notes": null,
        "src": 107,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+pagedown",
        "macKeys": "ctrl+alt+pagedown",
        "desc": "which_key_page_down - page down in the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_page_down"
        ],
        "notes": null,
        "src": 108,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+home",
        "macKeys": "ctrl+alt+home",
        "desc": "which_key_home - jump to top of the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_home"
        ],
        "notes": null,
        "src": 109,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+end",
        "macKeys": "ctrl+alt+end",
        "desc": "which_key_end - jump to bottom of the which-key overlay.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "which_key_end"
        ],
        "notes": null,
        "src": 110,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "escape,q",
        "macKeys": "escape,q",
        "desc": "diff_close - close the diff viewer.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_close"
        ],
        "notes": "Not present in the keybinds.mdx docs page's sample block; found only by reading packages/tui/src/config/keybind.ts directly (the docs sample omits the whole diff-viewer command family).",
        "src": 111,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "enter,space",
        "macKeys": "enter,space",
        "desc": "diff_toggle - toggle the selected diff viewer item (e.g. expand/collapse or check off a file).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_toggle"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 112,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right",
        "macKeys": "right",
        "desc": "diff_expand - expand the selected diff viewer item.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_expand"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 113,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "E",
        "macKeys": "E",
        "desc": "diff_expand_all - expand all folders in the diff viewer file tree.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_expand_all"
        ],
        "notes": "Not in keybinds.mdx docs. Bound to bare 'E' (shift+e), not a ctrl/alt combo.",
        "src": 114,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "left",
        "macKeys": "left",
        "desc": "diff_collapse - collapse the selected diff viewer item.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_collapse"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 115,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "diff_switch_focus - switch focus between diff viewer panes (e.g. file tree vs diff body).",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_switch_focus"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 116,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "]",
        "macKeys": "]",
        "desc": "diff_next_hunk - jump to the next diff hunk.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_next_hunk"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 117,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "[",
        "macKeys": "[",
        "desc": "diff_previous_hunk - jump to the previous diff hunk.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_previous_hunk"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 118,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "n",
        "macKeys": "n",
        "desc": "diff_next_file - jump to the next file in the diff viewer.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_next_file"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 119,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "p",
        "macKeys": "p",
        "desc": "diff_previous_file - jump to the previous file in the diff viewer.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_previous_file"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 120,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "b",
        "macKeys": "b",
        "desc": "diff_toggle_file_tree - show/hide the diff viewer's file tree pane.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_toggle_file_tree"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 121,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "s",
        "macKeys": "s",
        "desc": "diff_single_patch - toggle single-patch view in the diff viewer.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_single_patch"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 122,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "d",
        "macKeys": "d",
        "desc": "diff_switch_source - switch the diff viewer's source.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_switch_source"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 123,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "v",
        "macKeys": "v",
        "desc": "diff_toggle_view - toggle diff viewer split vs unified view.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_toggle_view"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 124,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "?",
        "macKeys": "?",
        "desc": "diff_help - show more diff viewer shortcuts.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "diff_help"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 125,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+b",
        "macKeys": "ctrl+b",
        "desc": "session_background - background running synchronous subagents.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_background"
        ],
        "notes": "Not in keybinds.mdx docs. GUI collision candidate: ctrl+b toggles the bookmarks bar in most browsers. Also shares its default key with input_move_left's ctrl+b component (readline backward-char) - by the same managed-textarea-layer mechanism confirmed for ctrl+a/ctrl+f/ctrl+d (see conflictResolution), this is very likely shadowed while the prompt textarea has focus and only reachable when it is not; this specific instance was not independently re-traced to its own enabled-gate, so treat that inference as extrapolated from the confirmed general mechanism rather than independently re-verified for this exact command.",
        "src": 126,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+f",
        "macKeys": "ctrl+f",
        "desc": "session_pin_toggle - pin or unpin a session inside the session-list dialog.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_pin_toggle"
        ],
        "notes": "Not in keybinds.mdx docs. Confirmed registered as a DialogSelect action inside packages/tui/src/component/dialog-session-list.tsx - same dialog-scoping pattern as model_favorite_toggle, so it does not truly race with input_move_right's ctrl+f while typing (dialog owns focus when this key is live).",
        "src": 127,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "<leader>1",
        "macKeys": "<leader>1",
        "desc": "session_quick_switch_1 - switch to the session pinned in quick slot 1.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_1"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 128,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>2",
        "macKeys": "<leader>2",
        "desc": "session_quick_switch_2 - switch to the session pinned in quick slot 2.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_2"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 129,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>3",
        "macKeys": "<leader>3",
        "desc": "session_quick_switch_3 - switch to the session pinned in quick slot 3.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_3"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 130,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>4",
        "macKeys": "<leader>4",
        "desc": "session_quick_switch_4 - switch to the session pinned in quick slot 4.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_4"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 131,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>5",
        "macKeys": "<leader>5",
        "desc": "session_quick_switch_5 - switch to the session pinned in quick slot 5.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_5"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 132,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>6",
        "macKeys": "<leader>6",
        "desc": "session_quick_switch_6 - switch to the session pinned in quick slot 6.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_6"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 133,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>7",
        "macKeys": "<leader>7",
        "desc": "session_quick_switch_7 - switch to the session pinned in quick slot 7.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_7"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 134,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>8",
        "macKeys": "<leader>8",
        "desc": "session_quick_switch_8 - switch to the session pinned in quick slot 8.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_8"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 135,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "<leader>9",
        "macKeys": "<leader>9",
        "desc": "session_quick_switch_9 - switch to the session pinned in quick slot 9.",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "session_quick_switch_9"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 136,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "ctrl+m",
        "macKeys": "ctrl+m",
        "desc": "dialog.move_session.new - create a new project copy from the move-session dialog.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.move_session.new"
        ],
        "notes": "Not in keybinds.mdx docs.",
        "src": 137,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "dialog.move_session.delete - delete a project copy from the move-session dialog.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.move_session.delete"
        ],
        "notes": "Not in keybinds.mdx docs. Another ctrl+d default alongside session_delete/stash_delete/input_delete/app_exit - dialog-scoped, same resolution pattern as the others (see conflictResolution).",
        "src": 138,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "dialog.move_session.refresh - refresh project copies in the move-session dialog.",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "source-code",
        "action": [
          "dialog.move_session.refresh"
        ],
        "notes": "Not in keybinds.mdx docs. Another ctrl+r default alongside session_rename - dialog-scoped.",
        "src": 139,
        "cmd": null,
        "intents": []
      }
    ]
  },
  {
    "slug": "pi",
    "label": "Pi",
    "surface": "tui",
    "host": null,
    "version": "0.82.1",
    "versionNotes": "0.82.1 is what `pi --version` reports on this machine and what the locally installed docs/keybindings.md and dist/core/keybindings.js were read from (/opt/homebrew/lib/node_modules/@earendil-works/pi-coding-agent). npm registry latest and repo main/HEAD package.json both report 0.83.0 (2026-07-29), which is one release ahead but does not change any keybinding in the tables below except adding ctrl+home/ctrl+end as extra editor-accessible keys (see CHANGELOG #7574). A further 'fullscreen mode' keyset (tui.altScreen.* actions, --ui-mode fullscreen) exists only on repo main under the CHANGELOG's [Unreleased] heading as of this check (2026-08-05) - i.e. ahead of even the 0.83.0 published release, experimental, and not present in the installed 0.82.1 build. Those entries are marked confidence: documented (not source-code) and called out individually.",
    "checkedAt": "2026-08-05",
    "sources": [
      "dist/core/keybindings.js via ...TUI_KEYBINDINGS (tui.editor.cursorUp)",
      "dist/core/keybindings.js via ...TUI_KEYBINDINGS (tui.editor.cursorDown)",
      "pi-tui/dist/keybindings.js (tui.editor.cursorLeft)",
      "pi-tui/dist/keybindings.js (tui.editor.cursorRight)",
      "pi-tui/dist/keybindings.js (tui.editor.cursorWordLeft)",
      "pi-tui/dist/keybindings.js (tui.editor.cursorWordRight)",
      "pi-tui/dist/keybindings.js (tui.editor.cursorLineStart)",
      "pi-tui/dist/keybindings.js (tui.editor.cursorLineEnd)",
      "pi-tui/dist/keybindings.js (tui.editor.jumpForward)",
      "pi-tui/dist/keybindings.js (tui.editor.jumpBackward)",
      "pi-tui/dist/keybindings.js (tui.editor.pageUp)",
      "pi-tui/dist/keybindings.js (tui.editor.pageDown)",
      "pi-tui/dist/keybindings.js (tui.editor.deleteCharBackward)",
      "pi-tui/dist/keybindings.js (tui.editor.deleteCharForward)",
      "pi-tui/dist/keybindings.js (tui.editor.deleteWordBackward)",
      "pi-tui/dist/keybindings.js (tui.editor.deleteWordForward)",
      "pi-tui/dist/keybindings.js (tui.editor.deleteToLineStart)",
      "pi-tui/dist/keybindings.js (tui.editor.deleteToLineEnd)",
      "pi-tui/dist/keybindings.js (tui.input.newLine)",
      "pi-tui/dist/keybindings.js (tui.input.submit); behavior detail from WebSearch summary of docs/usage.md",
      "pi-tui/dist/keybindings.js (tui.input.tab)",
      "pi-tui/dist/keybindings.js (tui.editor.yank)",
      "pi-tui/dist/keybindings.js (tui.editor.yankPop)",
      "pi-tui/dist/keybindings.js (tui.editor.undo)",
      "pi-tui/dist/keybindings.js (tui.input.copy); dist/core/keybindings.js (app.clear)",
      "dist/core/keybindings.js (app.interrupt); pi-tui/dist/keybindings.js (tui.select.cancel)",
      "dist/core/keybindings.js (app.exit)",
      "dist/core/keybindings.js (app.suspend)",
      "dist/core/keybindings.js (app.editor.external)",
      "dist/core/keybindings.js (app.clipboard.pasteImage)",
      "dist/core/keybindings.js (app.model.cycleForward, app.session.togglePath, app.models.toggleProvider)",
      "dist/core/keybindings.js (app.model.cycleBackward)",
      "dist/core/keybindings.js (app.model.select, app.tree.filter.labeledOnly)",
      "dist/core/keybindings.js (app.thinking.cycle)",
      "dist/core/keybindings.js (app.thinking.toggle, app.tree.filter.noTools)",
      "dist/core/keybindings.js (app.tools.expand, app.tree.filter.cycleForward)",
      "dist/core/keybindings.js (app.message.copy, app.models.clearAll)",
      "dist/core/keybindings.js (app.message.followUp)",
      "dist/core/keybindings.js (app.message.dequeue, app.models.reorderUp)",
      "dist/core/keybindings.js (app.tree.foldOrUp)",
      "dist/core/keybindings.js (app.tree.unfoldOrDown)",
      "dist/core/keybindings.js (app.tree.editLabel)",
      "dist/core/keybindings.js (app.tree.toggleLabelTimestamp)",
      "dist/core/keybindings.js (app.tree.filter.all, app.models.enableAll)",
      "dist/core/keybindings.js (app.session.toggleSort, app.models.save)",
      "dist/core/keybindings.js (app.session.toggleNamedFilter)",
      "dist/core/keybindings.js (app.session.rename)",
      "dist/core/keybindings.js (app.session.deleteNoninvasive)",
      "dist/core/keybindings.js (app.tree.filter.cycleBackward)",
      "dist/core/keybindings.js (app.models.reorderDown)",
      "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md (TUI Fullscreen Viewport table); CHANGELOG #7574",
      "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md (tui.altScreen.top row of the action table)",
      "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md (tui.altScreen.bottom)",
      "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md (tui.altScreen.previousPrompt)",
      "https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md (tui.altScreen.nextPrompt)"
    ],
    "bindings": [
      {
        "keys": "up",
        "macKeys": "up",
        "desc": "Move cursor up",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorUp"
        ],
        "notes": "Also drives tui.select.up in dialogs/pickers - same physical key, different action id by context.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "down",
        "macKeys": "down",
        "desc": "Move cursor down",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorDown"
        ],
        "notes": "Also drives tui.select.down in dialogs/pickers.",
        "src": 1,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "left, ctrl+b",
        "macKeys": "left, ctrl+b",
        "desc": "Move cursor left",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorLeft"
        ],
        "notes": "ctrl+b is classic Emacs/readline binding.",
        "src": 2,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "right, ctrl+f",
        "macKeys": "right, ctrl+f",
        "desc": "Move cursor right",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorRight"
        ],
        "notes": "ctrl+f is classic Emacs/readline binding.",
        "src": 3,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+left, ctrl+left, alt+b",
        "macKeys": "option+left, ctrl+left, option+b (terminal-dependent Alt/Option mapping)",
        "desc": "Move cursor one word left",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorWordLeft"
        ],
        "notes": "alt+b is Emacs/readline; ctrl+left is common GUI/terminal convention. Whether alt/option reaches the app depends on terminal 'Use Option as Meta' settings.",
        "src": 4,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+right, ctrl+right, alt+f",
        "macKeys": "option+right, ctrl+right, option+f (terminal-dependent)",
        "desc": "Move cursor one word right",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorWordRight"
        ],
        "notes": "Same terminal-dependency caveat as cursorWordLeft.",
        "src": 5,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "home, ctrl+a",
        "macKeys": "home, ctrl+a",
        "desc": "Move to line start",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorLineStart"
        ],
        "notes": "ctrl+a here is emacs/readline 'beginning of line', NOT select-all. See guiCollisions. On main/HEAD (unreleased-ahead-of-0.83.0) this action also gains ctrl+home as an extra default key; 0.82.1 does not have it (CHANGELOG #7574).",
        "src": 6,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "end, ctrl+e",
        "macKeys": "end, ctrl+e",
        "desc": "Move to line end",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.cursorLineEnd"
        ],
        "notes": "ctrl+e is classic Emacs/readline binding.",
        "src": 7,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+]",
        "macKeys": "ctrl+]",
        "desc": "Jump forward to character",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.editor.jumpForward"
        ],
        "notes": "Not a standard readline binding.",
        "src": 8,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+]",
        "macKeys": "ctrl+option+]",
        "desc": "Jump backward to character",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.editor.jumpBackward"
        ],
        "notes": "Pairs with jumpForward.",
        "src": 9,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pageUp",
        "macKeys": "fn+up (pageUp, terminal-dependent)",
        "desc": "Scroll up by page (editor)",
        "ctx": "input",
        "origin": "terminal-level",
        "conf": "firsthand",
        "action": [
          "tui.editor.pageUp"
        ],
        "notes": "In 0.82.1 this is a plain editor binding; on main/HEAD (unreleased) fullscreen mode reroutes unmodified pageUp to scroll the transcript instead (tui.altScreen.pageUp), while ctrl+pageUp becomes an added extra default key on this same action id so the editor stays reachable.",
        "src": 10,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "pageDown",
        "macKeys": "fn+down (pageDown, terminal-dependent)",
        "desc": "Scroll down by page (editor)",
        "ctx": "input",
        "origin": "terminal-level",
        "conf": "firsthand",
        "action": [
          "tui.editor.pageDown"
        ],
        "notes": "Same fullscreen-mode caveat as pageUp.",
        "src": 11,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "backspace",
        "macKeys": "delete (backspace)",
        "desc": "Delete character backward",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.deleteCharBackward"
        ],
        "notes": null,
        "src": 12,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "delete, ctrl+d",
        "macKeys": "fn+delete (forward delete), ctrl+d",
        "desc": "Delete character forward",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.deleteCharForward"
        ],
        "notes": "ctrl+d is classic readline 'delete-char'. Collides with app.exit (ctrl+d exits when editor is empty), app.session.delete in the session picker, and app.tree.filter.default in /tree - same physical key, four different action ids depending on context/emptiness. See guiCollisions.",
        "src": 13,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+w, alt+backspace",
        "macKeys": "ctrl+w, option+delete",
        "desc": "Delete word backward",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.deleteWordBackward"
        ],
        "notes": "ctrl+w is standard readline/shell 'unix-word-rubout'. See guiCollisions for GUI ctrl+w (close tab) expectation.",
        "src": 14,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "alt+d, alt+delete",
        "macKeys": "option+d, option+fn+delete",
        "desc": "Delete word forward",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.deleteWordForward"
        ],
        "notes": "alt+d is classic Emacs/readline 'kill-word'.",
        "src": 15,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+u",
        "macKeys": "ctrl+u",
        "desc": "Delete to line start",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.deleteToLineStart"
        ],
        "notes": "Classic readline 'unix-line-discard'. Also separately reused as app.tree.filter.userOnly (toggle user-only filter) inside the /tree session navigator - same key, different action id by context.",
        "src": 16,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+k",
        "macKeys": "ctrl+k",
        "desc": "Delete to line end",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.deleteToLineEnd"
        ],
        "notes": "Classic readline 'kill-line'.",
        "src": 17,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+enter, ctrl+j",
        "macKeys": "shift+return, ctrl+j",
        "desc": "Insert new line (multiline input)",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.input.newLine"
        ],
        "notes": "Confirms Pi's input supports multiline editing; shift+enter reliability depends on terminal reporting the modified-Enter sequence.",
        "src": 18,
        "cmd": null,
        "intents": [
          "newline"
        ]
      },
      {
        "keys": "enter",
        "macKeys": "return",
        "desc": "Submit input; when the agent is already running, Enter instead queues a steering message delivered after the current tool-call turn finishes",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.input.submit"
        ],
        "notes": "Dual behavior (submit vs. queue-while-running) documented in usage.md, not just keybindings.md.",
        "src": 19,
        "cmd": null,
        "intents": [
          "submit",
          "queue"
        ]
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "Tab / autocomplete",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.input.tab"
        ],
        "notes": "Typing '/' opens command completion per usage docs.",
        "src": 20,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+y",
        "macKeys": "ctrl+y",
        "desc": "Paste (yank) most recently deleted text",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.yank"
        ],
        "notes": "Classic Emacs/readline kill-ring yank; Pi implements a real kill ring, not just OS clipboard paste.",
        "src": 21,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "alt+y",
        "macKeys": "option+y",
        "desc": "Cycle through deleted text after yank (yank-pop)",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.yankPop"
        ],
        "notes": "Classic Emacs 'yank-pop'.",
        "src": 22,
        "cmd": null,
        "intents": [
          "yank"
        ]
      },
      {
        "keys": "ctrl+-",
        "macKeys": "ctrl+-",
        "desc": "Undo last edit",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "tui.editor.undo"
        ],
        "notes": "Classic Emacs/readline undo binding (bash also binds ctrl+_/ctrl+-).",
        "src": 23,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+c",
        "macKeys": "ctrl+c",
        "desc": "Copy selection; if no selection, clears the editor",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "tui.input.copy",
          "app.clear"
        ],
        "notes": "IMPORTANT deviation from terminal-level SIGINT expectations - see guiCollisions. Two distinct action ids share this key; actual behavior likely branches on whether a selection exists.",
        "src": 24,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "escape",
        "macKeys": "esc",
        "desc": "Cancel / abort current agent turn; in dialogs/selectors, cancels the selection",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.interrupt",
          "tui.select.cancel"
        ],
        "notes": "Also restores queued messages to the editor per usage.md summary ('Escape aborts and restores queued messages to the editor').",
        "src": 25,
        "cmd": null,
        "intents": [
          "interrupt"
        ]
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "Exit pi when the editor is empty (EOF-style exit)",
        "ctx": "input",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "app.exit"
        ],
        "notes": "Classic shell/readline ctrl+d-on-empty-line-exits convention. Same physical key is also tui.editor.deleteCharForward when the line is non-empty (see its own entry above), app.session.delete in the session list, and app.tree.filter.default in /tree - four different action ids gated by context/emptiness.",
        "src": 26,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+z",
        "macKeys": "ctrl+z",
        "desc": "Suspend to background (job control)",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "firsthand",
        "action": [
          "app.suspend"
        ],
        "notes": "No default binding on native Windows (no Unix job control); normal WSL ctrl+z/fg behavior applies there. Verified in compiled source: defaultKeys is [] when process.platform === 'win32'.",
        "src": 27,
        "cmd": null,
        "intents": [
          "suspend"
        ]
      },
      {
        "keys": "ctrl+g",
        "macKeys": "ctrl+g",
        "desc": "Open current input in an external editor ($VISUAL, $EDITOR, Notepad on Windows, or nano elsewhere)",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.editor.external"
        ],
        "notes": null,
        "src": 28,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "ctrl+v",
        "macKeys": "cmd+v (native paste)/ctrl+v; alt+v on Windows",
        "desc": "Paste image from clipboard",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.clipboard.pasteImage"
        ],
        "notes": "Windows uses alt+v instead of ctrl+v for this action per docs and compiled source (process.platform === 'win32' check).",
        "src": 29,
        "cmd": null,
        "intents": [
          "paste-image"
        ]
      },
      {
        "keys": "ctrl+p",
        "macKeys": "ctrl+p",
        "desc": "Cycle to next model (when --models patterns configured); also toggles path display in the session list, and toggles all models for the current provider in the scoped-models selector",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.model.cycleForward",
          "app.session.togglePath",
          "app.models.toggleProvider"
        ],
        "notes": "Confirmed independently via `pi --help`: '--models <patterns> Comma-separated model patterns for Ctrl+P cycling'. Three distinct action ids share ctrl+p across different UI contexts (main editor vs. session list vs. scoped-models selector).",
        "src": 30,
        "cmd": null,
        "intents": [
          "session-switch",
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "shift+ctrl+p",
        "macKeys": "shift+ctrl+p",
        "desc": "Cycle to previous model",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.model.cycleBackward"
        ],
        "notes": null,
        "src": 31,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+l",
        "macKeys": "ctrl+l",
        "desc": "Open model selector",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.model.select",
          "app.tree.filter.labeledOnly"
        ],
        "notes": "Deviates from readline's ctrl+l ('clear screen'); reused for a different action. Second action id applies inside /tree, toggling the labeled-only filter.",
        "src": 32,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "Cycle thinking level (off/minimal/low/medium/high/xhigh/max)",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.thinking.cycle"
        ],
        "notes": null,
        "src": 33,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "Collapse or expand thinking blocks",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.thinking.toggle",
          "app.tree.filter.noTools"
        ],
        "notes": "Second action id applies inside /tree (toggle hide-tool-results filter) - same key, different action id by context.",
        "src": 34,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+o",
        "macKeys": "ctrl+o",
        "desc": "Collapse or expand tool output",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tools.expand",
          "app.tree.filter.cycleForward"
        ],
        "notes": "Second action id applies inside /tree.",
        "src": 35,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+x",
        "macKeys": "ctrl+x",
        "desc": "Copy the last assistant message (or the selected message in /tree)",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.message.copy",
          "app.models.clearAll"
        ],
        "notes": "Deviates hard from GUI ctrl+x ('cut'). See guiCollisions. Second action id applies inside the scoped-models selector (clear all model selections).",
        "src": 36,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "alt+enter",
        "macKeys": "option+return",
        "desc": "Queue a follow-up message, delivered after the agent finishes all current work",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.message.followUp"
        ],
        "notes": "Distinct from plain Enter, which queues a steering message delivered after the current tool-call turn (not all work). Detail from WebSearch's summary of docs/usage.md.",
        "src": 37,
        "cmd": null,
        "intents": [
          "queue"
        ]
      },
      {
        "keys": "alt+up",
        "macKeys": "option+up",
        "desc": "Restore queued messages back to the editor",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.message.dequeue",
          "app.models.reorderUp"
        ],
        "notes": "Second action id applies inside the scoped-models selector (move selected model up in cycle order).",
        "src": 38,
        "cmd": null,
        "intents": [
          "model-switch",
          "queue"
        ]
      },
      {
        "keys": "ctrl+left, alt+left",
        "macKeys": "ctrl+left, option+left",
        "desc": "Fold current tree branch segment, or jump to previous segment start",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tree.foldOrUp"
        ],
        "notes": "Applies inside the /tree session navigator, opened via app.session.tree (no default key of its own). Key order in defaultKeys is platform-dependent (alt+left first on darwin, ctrl+left first elsewhere) but both keys are always active regardless of platform.",
        "src": 39,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+right, alt+right",
        "macKeys": "ctrl+right, option+right",
        "desc": "Unfold current tree branch segment, or jump to next segment/branch end",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tree.unfoldOrDown"
        ],
        "notes": "Applies inside /tree. Same platform-ordering note as app.tree.foldOrUp.",
        "src": 40,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+l",
        "macKeys": "shift+l",
        "desc": "Edit the label on the selected tree node",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tree.editLabel"
        ],
        "notes": "Applies inside /tree.",
        "src": 41,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+t",
        "macKeys": "shift+t",
        "desc": "Toggle label timestamps in the tree",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tree.toggleLabelTimestamp"
        ],
        "notes": "Applies inside /tree.",
        "src": 42,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+a",
        "macKeys": "ctrl+a",
        "desc": "Toggle tree filter that shows all entries (inside /tree); also enables all models in the scoped-models selector",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tree.filter.all",
          "app.models.enableAll"
        ],
        "notes": "Not the main editor context - main-editor ctrl+a is tui.editor.cursorLineStart, listed separately above.",
        "src": 43,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+s",
        "macKeys": "ctrl+s",
        "desc": "Toggle sort mode in the session list; saves current model selection in the scoped-models selector",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.session.toggleSort",
          "app.models.save"
        ],
        "notes": "Terminal-level XOFF (flow control) can intercept ctrl+s in some terminal configs unless flow control is disabled - not confirmed either way for pi's terminal setup handling.",
        "src": 44,
        "cmd": null,
        "intents": [
          "session-switch",
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+n",
        "macKeys": "ctrl+n",
        "desc": "Toggle named-only filter in the session list",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.session.toggleNamedFilter"
        ],
        "notes": null,
        "src": 45,
        "cmd": null,
        "intents": [
          "session-switch"
        ]
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "Rename session",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.session.rename"
        ],
        "notes": "Deviates from readline's ctrl+r ('reverse-i-search') - no evidence Pi's main editor implements history reverse-search at all; see gaps.",
        "src": 46,
        "cmd": null,
        "intents": [
          "session-rename"
        ]
      },
      {
        "keys": "ctrl+backspace",
        "macKeys": "ctrl+delete (backspace)",
        "desc": "Delete session when the session-list query is empty",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.session.deleteNoninvasive"
        ],
        "notes": null,
        "src": 47,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+ctrl+o",
        "macKeys": "shift+ctrl+o",
        "desc": "Cycle tree filter backward",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.tree.filter.cycleBackward"
        ],
        "notes": null,
        "src": 48,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "alt+down",
        "macKeys": "option+down",
        "desc": "Move the selected model down in the cycle order (scoped-models selector)",
        "ctx": "dialog",
        "origin": "tool-specific",
        "conf": "firsthand",
        "action": [
          "app.models.reorderDown"
        ],
        "notes": null,
        "src": 49,
        "cmd": null,
        "intents": [
          "mode-cycle",
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+home",
        "macKeys": "ctrl+home",
        "desc": "Move cursor to line start / editor top (fullscreen mode)",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tui.editor.cursorLineStart"
        ],
        "notes": "UNRELEASED / experimental as of this check: an extra default key added to the existing tui.editor.cursorLineStart action, only on repo main under CHANGELOG [Unreleased] (--ui-mode fullscreen), not in the installed 0.82.1 build nor the published 0.83.0 npm release verified locally.",
        "src": 50,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+end",
        "macKeys": "ctrl+end",
        "desc": "Move cursor to editor end (fullscreen mode)",
        "ctx": "input",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tui.editor.cursorLineEnd"
        ],
        "notes": "UNRELEASED / experimental, see ctrl+home note above.",
        "src": 50,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "home (unmodified)",
        "macKeys": "home",
        "desc": "Scroll transcript to top (fullscreen mode only; controls editor in default mode)",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tui.altScreen.top"
        ],
        "notes": "UNRELEASED / experimental, gated behind --ui-mode fullscreen or /settings; not present in installed 0.82.1.",
        "src": 51,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "end (unmodified)",
        "macKeys": "end",
        "desc": "Scroll transcript to bottom and follow new output (fullscreen mode only)",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tui.altScreen.bottom"
        ],
        "notes": "UNRELEASED / experimental, see above.",
        "src": 52,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+shift+up",
        "macKeys": "ctrl+shift+up",
        "desc": "Jump to the previous marked message in the transcript (fullscreen mode)",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tui.altScreen.previousPrompt"
        ],
        "notes": "UNRELEASED / experimental, see above.",
        "src": 53,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      },
      {
        "keys": "ctrl+shift+down",
        "macKeys": "ctrl+shift+down",
        "desc": "Jump to the next marked message in the transcript (fullscreen mode)",
        "ctx": "transcript",
        "origin": "tool-specific",
        "conf": "documented",
        "action": [
          "tui.altScreen.nextPrompt"
        ],
        "notes": "UNRELEASED / experimental, see above.",
        "src": 54,
        "cmd": null,
        "intents": [
          "transcript"
        ]
      }
    ]
  },
  {
    "slug": "cursor",
    "label": "Cursor",
    "surface": "ide",
    "host": null,
    "version": null,
    "versionNotes": null,
    "checkedAt": "2026-08-05",
    "sources": [
      "https://cursor.com/docs/reference/keyboard-shortcuts"
    ],
    "bindings": [
      {
        "keys": "ctrl+i",
        "macKeys": "cmd+i",
        "desc": "Toggle Sidepanel (opens the Chat/Agent panel) - unless bound to a specific mode",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Second default binding for the same action is Cmd/Ctrl+L (see below) - Cursor ships two default keys for Toggle Sidepanel.",
        "src": 0,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "ctrl+l",
        "macKeys": "cmd+l",
        "desc": "Toggle Sidepanel (opens the Chat/Agent panel) - unless bound to a specific mode",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same action also reachable via Cmd/Ctrl+I. Cmd/Ctrl+L is also separately documented under 'Code Selection & Context' as 'Add selection to new chat' when text is selected.",
        "src": 0,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "ctrl+e",
        "macKeys": "cmd+e",
        "desc": "Toggle Agent layout",
        "ctx": "agent",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+.",
        "macKeys": "cmd+.",
        "desc": "Mode Menu (open the Agent/Ask/Plan mode selector)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+/",
        "macKeys": "cmd+/",
        "desc": "Loop between AI models",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Distinct from 'Model toggle' (Cmd/Ctrl+Opt//Alt+/) documented under Chat.",
        "src": 0,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+shift+j",
        "macKeys": "cmd+shift+j",
        "desc": "Cursor settings",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+space",
        "macKeys": "cmd+shift+space",
        "desc": "Toggle Voice Mode",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "ctrl+,",
        "macKeys": "cmd+,",
        "desc": "General settings",
        "ctx": "global",
        "origin": "vscode-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard VS Code settings binding; listed on Cursor's own shortcuts page under 'General' alongside the AI-specific bindings. Not AI-specific itself.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+p",
        "macKeys": "cmd+shift+p",
        "desc": "Command palette",
        "ctx": "global",
        "origin": "vscode-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard VS Code command palette binding, inherited unchanged. Also how a user can search for and view all keyboard shortcuts, per the page's intro text ('...or by opening command palette Cmd/Ctrl+Shift+P and searching for Keyboard Shortcuts').",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "enter",
        "macKeys": "enter",
        "desc": "Nudge (default) - send/submit the chat message",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": [
          "submit"
        ]
      },
      {
        "keys": "ctrl+enter",
        "macKeys": "ctrl+enter",
        "desc": "Queue message",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "On Mac this is documented as the physical Ctrl key (not Cmd) + Return - i.e. it is literally Ctrl+Return on Mac too, not Cmd+Return. Verified directly from the docs' raw data (mac slot = 'Ctrl Return').",
        "src": 0,
        "cmd": null,
        "intents": [
          "queue"
        ]
      },
      {
        "keys": "ctrl+enter",
        "macKeys": "cmd+enter",
        "desc": "Force send message (when typing)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+backspace",
        "macKeys": "cmd+shift+backspace",
        "desc": "Cancel generation",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same binding also documented under Inline Edit as 'Cancel'.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+l",
        "macKeys": "cmd+shift+l",
        "desc": "Add selected code as context (with code selected)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same binding also documented under 'Code Selection & Context' as 'Add selection to Chat'.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+v",
        "macKeys": "cmd+v",
        "desc": "Add clipboard as context (with code or log in clipboard)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Overloads plain paste: when the clipboard holds code/log content, a normal paste attaches it as context rather than inserting text.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+v",
        "macKeys": "cmd+shift+v",
        "desc": "Add clipboard to input box (with code or log in clipboard)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Pastes as literal text into the input rather than attaching as a context reference (contrast with plain Cmd/Ctrl+V above).",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+enter",
        "macKeys": "cmd+enter",
        "desc": "Accept all changes (with suggested changes pending)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord as Force send message and Search codebase in chat - meaning depends on UI state (whether a diff/suggestion is pending).",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+backspace",
        "macKeys": "cmd+backspace",
        "desc": "Reject all changes",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "Cycle to next message",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented with no separate Windows/Linux alt value (single 'Tab' key on all platforms).",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "Rotate between Agent modes",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented with no separate Windows/Linux alt value.",
        "src": 0,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "ctrl+alt+/",
        "macKeys": "cmd+opt+/",
        "desc": "Model toggle",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Distinct from the General-section 'Loop between AI models' (Cmd/Ctrl+/, no Opt/Alt).",
        "src": 0,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+n",
        "macKeys": "cmd+n",
        "desc": "New chat",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Cursor ships a second default for the same action, Cmd/Ctrl+R (next entry).",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+r",
        "macKeys": "cmd+r",
        "desc": "New chat",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Alternate default for the same action as Cmd/Ctrl+N. Cmd/Ctrl+R is also the chord mentioned in the page's own intro text as part of 'Cmd/Ctrl+R then Cmd/Ctrl+S' to open the full keyboard-shortcuts settings UI - i.e. this key is overloaded by context/chording.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+t",
        "macKeys": "cmd+t",
        "desc": "New chat tab",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+[",
        "macKeys": "cmd+[",
        "desc": "Previous chat",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+]",
        "macKeys": "cmd+]",
        "desc": "Next chat",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+w",
        "macKeys": "cmd+w",
        "desc": "Close chat",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Unfocus field",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+k",
        "macKeys": "cmd+k",
        "desc": "Open (Inline Edit prompt)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord (Cmd/Ctrl+K) is separately documented under Terminal as 'Open terminal prompt bar' - meaning depends on focus.",
        "src": 0,
        "cmd": null,
        "intents": [
          "inline-chat"
        ]
      },
      {
        "keys": "ctrl+shift+k",
        "macKeys": "cmd+shift+k",
        "desc": "Toggle input focus (Inline Edit)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord also documented under 'Code Selection & Context' as 'Add selection to Edit'.",
        "src": 0,
        "cmd": null,
        "intents": [
          "inline-chat"
        ]
      },
      {
        "keys": "enter",
        "macKeys": "enter",
        "desc": "Submit (Inline Edit)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": [
          "submit",
          "inline-chat"
        ]
      },
      {
        "keys": "ctrl+shift+backspace",
        "macKeys": "cmd+shift+backspace",
        "desc": "Cancel (Inline Edit)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord as Chat's 'Cancel generation'.",
        "src": 0,
        "cmd": null,
        "intents": [
          "inline-chat"
        ]
      },
      {
        "keys": "alt+enter",
        "macKeys": "opt+enter",
        "desc": "Ask quick question (Inline Edit)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": [
          "inline-chat"
        ]
      },
      {
        "keys": "@",
        "macKeys": "@",
        "desc": "@-mentions - trigger the context-attachment picker (files, docs, symbols, etc.)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Single character trigger, identical on all platforms; not a modifier chord. Documented under 'Code Selection & Context'.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "/",
        "macKeys": "/",
        "desc": "Shortcut Commands - trigger the slash-command menu in chat/agent input",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Single character trigger, identical on all platforms.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+l",
        "macKeys": "cmd+shift+l",
        "desc": "Add selection to Chat",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Duplicate of Chat section's 'Add selected code as context'.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+k",
        "macKeys": "cmd+shift+k",
        "desc": "Add selection to Edit",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Duplicate of Inline Edit section's 'Toggle input focus'.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+l",
        "macKeys": "cmd+l",
        "desc": "Add selection to new chat",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord as General section's 'Toggle Sidepanel'; behavior differs by whether code is selected.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+m",
        "macKeys": "cmd+m",
        "desc": "Toggle file reading strategies",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+right",
        "macKeys": "cmd+right",
        "desc": "Accept next word of suggestion",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented as Cmd/Ctrl + Right Arrow (rendered '→' on the Mac column). Duplicate of the Tab section's 'Accept next word'.",
        "src": 0,
        "cmd": null,
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "ctrl+enter",
        "macKeys": "cmd+enter",
        "desc": "Search codebase in chat",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord as 'Force send message' / 'Accept all changes' - meaning is state-dependent.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+c then ctrl+v",
        "macKeys": "cmd+c then cmd+v",
        "desc": "Add copied reference code as context",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Two-step sequence, not a chord: copy code (Cmd/Ctrl+C, standard copy - not Cursor-specific), then paste (Cmd/Ctrl+V) into chat/edit to attach it as a live reference to the source location rather than inserting plain text.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+c then ctrl+shift+v",
        "macKeys": "cmd+c then cmd+shift+v",
        "desc": "Add copied code as text context",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Two-step sequence: copy (standard), then Cmd/Ctrl+Shift+V to paste as inert text context instead of a live reference (contrast with the row above).",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "Accept suggestion (Tab completion)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented with no separate Windows/Linux alt value. Only intercepts Tab when an AI suggestion/ghost-text is showing; otherwise Tab keeps its normal indent behavior (same convention as VS Code IntelliSense accept-on-Tab).",
        "src": 0,
        "cmd": null,
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "ctrl+right",
        "macKeys": "cmd+right",
        "desc": "Accept next word (Tab completion, partial accept)",
        "ctx": "editor",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Duplicate of the same binding documented under 'Code Selection & Context'.",
        "src": 0,
        "cmd": null,
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "ctrl+k",
        "macKeys": "cmd+k",
        "desc": "Open terminal prompt bar (natural-language -> shell command)",
        "ctx": "terminal",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same chord as Inline Edit's 'Open' - meaning depends on whether focus is the editor or the terminal.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+enter",
        "macKeys": "cmd+enter",
        "desc": "Run generated command",
        "ctx": "terminal",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Accept command",
        "ctx": "terminal",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Counter-intuitive: Escape here ACCEPTS/inserts the AI-generated terminal command rather than dismissing it - the opposite of Escape's near-universal 'cancel' convention. See guiCollisions.",
        "src": 0,
        "cmd": null,
        "intents": []
      }
    ]
  },
  {
    "slug": "cursor",
    "label": "Cursor",
    "surface": "tui",
    "host": null,
    "version": null,
    "versionNotes": null,
    "checkedAt": "2026-08-05",
    "sources": [
      "https://cursor.com/docs/cli/using"
    ],
    "bindings": [
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "Rotate between modes (Agent, Plan, Ask)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Terminal app; documented as a single key value used identically on all platforms (no separate Mac/Windows-Linux column on this page, unlike the IDE docs). Alternates: typing '/plan' or '/ask', or starting the CLI with --mode=plan / --plan / --mode=ask.",
        "src": 0,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "shift+enter",
        "macKeys": "shift+enter",
        "desc": "Insert a newline instead of submitting (multi-line prompts)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Docs explicitly note this only works in specific terminal emulators (iTerm2, Ghostty, Kitty, Warp, Zed); other terminals (e.g. tmux) should use Ctrl+J instead.",
        "src": 0,
        "cmd": null,
        "intents": [
          "newline",
          "submit"
        ]
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "Exit the CLI",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Docs state it 'follows standard shell behavior, requiring a double-press to exit' (matches the conventional readline/bash Ctrl+D-twice-to-exit-empty-prompt convention).",
        "src": 0,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+j",
        "macKeys": "ctrl+j",
        "desc": "Insert a newline (universal alternative that works in all terminals)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented alongside a second alternative the docs render as literal text '+Enter' with no visible modifier before the '+' - almost certainly a rendering bug on Cursor's own page (the modifier glyph, likely Cmd, appears to have been dropped from the source). Could not verify what the intended modifier is; recorded as a gap rather than guessed.",
        "src": 0,
        "cmd": null,
        "intents": [
          "newline"
        ]
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "Review changes",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Opens the diff-review flow after the agent completes tasks.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "i",
        "macKeys": "i",
        "desc": "Add follow-up instructions (while in the review flow)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Single-key press, no modifier; only meaningful while the Ctrl+R review UI is active.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "up/down",
        "macKeys": "up/down",
        "desc": "Cycle through previous messages (Navigation) / scroll (during review)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented twice: once under 'Navigation' as message history recall (arrow up to cycle through previous messages), once under 'Review' as scroll during the diff-review flow.",
        "src": 0,
        "cmd": null,
        "intents": [
          "history-prev"
        ]
      },
      {
        "keys": "left/right",
        "macKeys": "left/right",
        "desc": "Switch files (during the review flow)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Only meaningful while the Ctrl+R review UI is active.",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "@",
        "macKeys": "@",
        "desc": "Select files/folders to include in context",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same @-mention convention as the IDE's Chat context-attachment. Docs also mention '/summarize' and '/compress' (alias) as slash commands to free up context window space - not keybindings.",
        "src": 0,
        "cmd": null,
        "intents": []
      }
    ]
  },
  {
    "slug": "copilot",
    "label": "Copilot",
    "surface": "ide",
    "host": "vscode",
    "version": null,
    "versionNotes": null,
    "checkedAt": "2026-08-05",
    "sources": [
      "https://docs.github.com/en/copilot/reference/keyboard-shortcuts-for-github-copilot-in-the-ide",
      "https://docs.github.com/en/copilot/how-tos/get-code-suggestions/get-ide-code-suggestions?tool=vscode",
      "https://code.visualstudio.com/docs/copilot/ai-powered-suggestions",
      "https://code.visualstudio.com/docs/agents/reference/ai-features-cheat-sheet",
      "https://github.com/microsoft/vscode/issues/230364",
      "https://code.visualstudio.com/docs/chat/chat-overview"
    ],
    "bindings": [
      {
        "keys": "tab",
        "macKeys": "tab",
        "desc": "Accept the full ghost-text inline suggestion (or its first line if multi-line)",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Only active when ghost text is visible (inlineSuggestionVisible context); otherwise Tab keeps its normal indent behavior.",
        "src": 0,
        "cmd": "editor.action.inlineSuggest.commit",
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "escape",
        "macKeys": "escape",
        "desc": "Dismiss the current inline suggestion",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Renamed from the older hideInlineCompletion command id.",
        "src": 0,
        "cmd": "editor.action.inlineSuggest.hide",
        "intents": [
          "dismiss-suggestion"
        ]
      },
      {
        "keys": "alt+]",
        "macKeys": "option+]",
        "desc": "Show next inline suggestion (cycle forward)",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": "editor.action.inlineSuggest.showNext",
        "intents": []
      },
      {
        "keys": "alt+[",
        "macKeys": "option+[",
        "desc": "Show previous inline suggestion (cycle backward)",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 0,
        "cmd": "editor.action.inlineSuggest.showPrevious",
        "intents": []
      },
      {
        "keys": "alt+\\",
        "macKeys": "option+\\",
        "desc": "Manually trigger an inline suggestion",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Command id is the conventional VS Code inline-suggest trigger command; not independently confirmed in a fetched source for this exact id, treat id as inferred.",
        "src": 0,
        "cmd": "editor.action.inlineSuggest.trigger",
        "intents": []
      },
      {
        "keys": "ctrl+right",
        "macKeys": "cmd+right",
        "desc": "Accept the suggestion word-by-word",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "This is the word-by-word accept the user asked to capture.",
        "src": 1,
        "cmd": "editor.action.inlineSuggest.acceptNextWord",
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "none (no default)",
        "macKeys": "none (no default)",
        "desc": "Accept the suggestion one line at a time",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Command exists but ships with no default keybinding; must be bound manually in keybindings.json.",
        "src": 2,
        "cmd": "editor.action.inlineSuggest.acceptNextLine",
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "ctrl+enter",
        "macKeys": "cmd+enter",
        "desc": "Open the Copilot completions panel showing multiple suggestions in a new editor tab",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 1,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "ctrl+i",
        "macKeys": "cmd+i",
        "desc": "Open inline chat at the cursor position in the editor",
        "ctx": "inline-chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same physical key also opens the terminal's inline chat when focus is in the integrated terminal, via a distinct command id.",
        "src": 3,
        "cmd": "inlineChat.start",
        "intents": [
          "external-editor",
          "inline-chat"
        ]
      },
      {
        "keys": "ctrl+i",
        "macKeys": "cmd+i",
        "desc": "Open inline chat in the integrated terminal",
        "ctx": "terminal",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Distinct command id from editor inline chat but same default key, disambiguated by focus context.",
        "src": 4,
        "cmd": "workbench.action.terminal.chat.start",
        "intents": [
          "inline-chat"
        ]
      },
      {
        "keys": "ctrl+alt+i",
        "macKeys": "ctrl+cmd+i",
        "desc": "Open/focus the Copilot Chat view (side panel)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 3,
        "cmd": "workbench.action.chat.open",
        "intents": []
      },
      {
        "keys": "ctrl+shift+alt+l",
        "macKeys": "cmd+opt+shift+l",
        "desc": "Open Quick Chat (transient inline chat popover, not the full panel)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Command id is the conventional VS Code quick-chat toggle id; not independently confirmed via a dedicated source fetch, treat id as inferred.",
        "src": 3,
        "cmd": "workbench.action.quickchat.toggle",
        "intents": [
          "inline-chat"
        ]
      },
      {
        "keys": "ctrl+n",
        "macKeys": "cmd+n",
        "desc": "Start a new chat session (clears current Chat view thread)",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Same physical shortcut as 'New File' in a plain editor context; scoped to when the Chat view has focus.",
        "src": 3,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+shift+i (win) / ctrl+shift+alt+i (linux)",
        "macKeys": "cmd+shift+i",
        "desc": "Switch the Chat view into Agent mode",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Windows and Linux defaults differ from each other (Ctrl+Shift+I vs Ctrl+Shift+Alt+I) - verify per-OS before publishing as a single row.",
        "src": 3,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "ctrl+alt+.",
        "macKeys": "option+cmd+.",
        "desc": "Open the model picker in the Chat view",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 3,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "ctrl+alt+up",
        "macKeys": "opt+cmd+up",
        "desc": "Go to the previous prompt in the current chat session",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 5,
        "cmd": null,
        "intents": [
          "history-prev"
        ]
      },
      {
        "keys": "ctrl+alt+down",
        "macKeys": "opt+cmd+down",
        "desc": "Go to the next prompt in the current chat session",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 5,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+pageup",
        "macKeys": "opt+cmd+pageup",
        "desc": "Go to the previous code block in the chat session",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 5,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+alt+pagedown",
        "macKeys": "opt+cmd+pagedown",
        "desc": "Go to the next code block in the chat session",
        "ctx": "chat",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": null,
        "src": 5,
        "cmd": null,
        "intents": []
      }
    ]
  },
  {
    "slug": "copilot",
    "label": "Copilot",
    "surface": "tui",
    "host": "copilot-cli",
    "version": null,
    "versionNotes": "@github/copilot npm package, referenced at v1.0.68 (July 2026) by a secondary source; not independently verified against a locally installed binary in this research pass",
    "checkedAt": "2026-08-05",
    "sources": [
      "https://raw.githubusercontent.com/github/docs/main/content/copilot/reference/copilot-cli-reference/cli-command-reference.md"
    ],
    "bindings": [
      {
        "keys": "shift+tab",
        "macKeys": "shift+tab",
        "desc": "Cycle between Standard, Plan, and Autopilot session modes",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "The Copilot CLI TUI has no VS Code-style command-id system; it is a bespoke terminal UI, not an Electron/VS Code extension. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "mode-cycle"
        ]
      },
      {
        "keys": "esc",
        "macKeys": "esc",
        "desc": "Cancel the current operation; press twice to interrupt the running turn, or to stop background agents when the main agent is idle",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "In diff mode (entered via /diff), Esc (or Ctrl+C) instead just exits diff mode rather than canceling the agent turn - a separate, mode-scoped meaning documented under 'Diff mode shortcuts'. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "interrupt"
        ]
      },
      {
        "keys": "ctrl+c",
        "macKeys": "ctrl+c",
        "desc": "Cancel operation / clear input. Press twice to exit",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Verbatim doc text: 'Cancel operation / clear input. Press twice to exit.' A single press does NOT quit the CLI - it cancels the in-flight operation or clears whatever is typed in the prompt; a second press within the session ends it. Also separately documented for shell-mode ('!' at an empty prompt: press Esc or Ctrl+C to exit shell mode) and for diff mode (Esc/Ctrl+C exits diff mode). [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+d",
        "macKeys": "ctrl+d",
        "desc": "Shutdown",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Verbatim doc text is just 'Shutdown.' - no press-count qualifier, no confirmation prompt, and no mention of what happens to an in-flight agent turn or unsaved input, in contrast to Ctrl+C which explicitly documents 'press twice to exit'. Best-evidence reading is a single, immediate, unconfirmed shutdown, but that is an inference from the absence of a press-count word, not an explicit statement. Two other Ctrl+D meanings exist in different sub-contexts: (1) inside the lone-'$'-spawned real interactive shell, 'Ctrl+D on Unix' exits that sub-shell back to the Copilot CLI (recoverable, not a full shutdown); (2) inside diff mode, Ctrl+D scrolls the diff view down half a page. Neither of those is the main-prompt 'Shutdown' meaning. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "quit"
        ]
      },
      {
        "keys": "ctrl+l",
        "macKeys": "ctrl+l",
        "desc": "Clear the screen",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Matches the standard bash/readline clear-screen convention. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+enter or ctrl+q",
        "macKeys": "cmd+enter or ctrl+q",
        "desc": "Queue a message to send while the agent is busy",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "queue"
        ]
      },
      {
        "keys": "ctrl+r",
        "macKeys": "ctrl+r",
        "desc": "Reverse search through command history",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Classic GNU readline reverse-i-search convention. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "history-search"
        ]
      },
      {
        "keys": "up / down",
        "macKeys": "up / down",
        "desc": "Navigate the command history",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Documented under 'Navigation shortcuts in the interactive interface'. Ctrl+P/Ctrl+N (the emacs/readline equivalents for history up/down) are not mentioned anywhere in the doc - only the arrow keys are documented for this. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+a",
        "macKeys": "ctrl+a",
        "desc": "Move to beginning of the line (when typing)",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard emacs/readline line-editing binding. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "ctrl+e",
        "macKeys": "ctrl+e",
        "desc": "Move to end of the line (when typing); when the prompt input is empty instead, this same key expands all items in the response timeline",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Two separately documented meanings depending on prompt state: 'Navigation shortcuts' table says 'Move to end of the line (when typing)'; 'Timeline shortcuts' table says 'While there is nothing in the prompt input, this expands all items in Copilot's response timeline.' Both are verbatim from the same source file. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end"
        ]
      },
      {
        "keys": "ctrl+b",
        "macKeys": "ctrl+b",
        "desc": "Move to the previous character",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard emacs/readline character-left binding. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+f",
        "macKeys": "ctrl+f",
        "desc": "Move to the next character (when typing); when the prompt input is empty instead, this same key opens timeline search",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Two separately documented meanings: 'Navigation shortcuts' table says 'Move to the next character'; 'Timeline shortcuts' table says 'Open timeline search.' This is also the key GUI users most associate with in-page Find, which this CLI does not use it for at the input-line level. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+h",
        "macKeys": "ctrl+h",
        "desc": "Delete the previous character",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard emacs/readline backspace-equivalent binding. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+k",
        "macKeys": "ctrl+k",
        "desc": "Delete from cursor to end of the line. If the cursor is at the end of the line, delete the line break",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard readline kill-to-end-of-line. No undo mechanism is documented. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "kill-to-end",
          "cursor-end",
          "newline"
        ]
      },
      {
        "keys": "ctrl+u",
        "macKeys": "ctrl+u",
        "desc": "Delete from cursor to beginning of the line",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard readline kill-to-beginning-of-line at the main prompt, no undo documented. Note: inside diff mode (/diff) this same key instead means 'Scroll up half a page' - a separate, mode-scoped meaning documented under 'Diff mode shortcuts'. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "cursor-home"
        ]
      },
      {
        "keys": "ctrl+w",
        "macKeys": "ctrl+w",
        "desc": "Delete the previous word",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard readline kill-previous-word, no undo documented. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "delete-word-back"
        ]
      },
      {
        "keys": "tab or ctrl+y",
        "macKeys": "tab or ctrl+y",
        "desc": "Accept the current inline completion suggestion",
        "ctx": "completion",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Documented under 'Navigation shortcuts' alongside the other emacs/readline bindings, but this is NOT the readline meaning of Ctrl+Y (yank/paste the most recently killed text from Ctrl+U, Ctrl+K, or Ctrl+W) - the CLI repurposes it to accept a completion instead, breaking the readline pattern the surrounding keys otherwise follow. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "accept-suggestion"
        ]
      },
      {
        "keys": "ctrl+v",
        "macKeys": "cmd+v",
        "desc": "Paste from clipboard as an attachment",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Not a plain-text paste - pastes clipboard content (e.g. a screenshot) as an attachment rather than inserting text at the cursor. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "paste-image"
        ]
      },
      {
        "keys": "ctrl+z",
        "macKeys": "ctrl+z",
        "desc": "Suspend the process to the background (Unix)",
        "ctx": "global",
        "origin": "readline-inherited",
        "conf": "documented",
        "action": null,
        "notes": "Standard Unix job-control SIGTSTP behavior (fg to resume), same as most readline-based shells/REPLs. Docs explicitly scope this to '(Unix)' - Windows behavior for this key is not stated anywhere in the reference. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "suspend"
        ]
      },
      {
        "keys": "ctrl+x then /",
        "macKeys": "ctrl+x then /",
        "desc": "Run a slash command after you have already started typing a prompt",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Two-key chord (prefix key Ctrl+X, then a follow-up key), not a simultaneous combo. Ctrl+X itself performs no action alone. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+x then e",
        "macKeys": "ctrl+x then e",
        "desc": "Edit the prompt in an external editor ($EDITOR)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Ctrl+G is documented as an alternate, single-key shortcut for this same action. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "ctrl+x then b",
        "macKeys": "ctrl+x then b",
        "desc": "Promote the running task or shell command to the background",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+x then o",
        "macKeys": "ctrl+x then o",
        "desc": "Open the most recent link from the response timeline",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+g",
        "macKeys": "ctrl+g",
        "desc": "Edit the prompt in an external editor ($EDITOR)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Duplicate action of the Ctrl+X then e chord. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "external-editor"
        ]
      },
      {
        "keys": "ctrl+o",
        "macKeys": "ctrl+o",
        "desc": "With an empty prompt input, expand the most recent item in the response timeline to show more detail",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "ctrl+t",
        "macKeys": "ctrl+t",
        "desc": "Expand/collapse the display of the model's reasoning in responses",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "model-switch"
        ]
      },
      {
        "keys": "shift+enter or alt+enter",
        "macKeys": "shift+enter or option+enter",
        "desc": "Insert a newline in the prompt input without submitting",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "newline",
          "submit"
        ]
      },
      {
        "keys": "@ then filename",
        "macKeys": "@ then filename",
        "desc": "Include a file's contents as context (input prefix, not a modifier-key binding)",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Text-input trigger character rather than a keyboard chord; listed because the task brief asked for context-attach mechanisms explicitly. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "# then number",
        "macKeys": "# then number",
        "desc": "Include a GitHub issue or pull request as context",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Text-input trigger character, not a keyboard chord. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "! then command",
        "macKeys": "! then command",
        "desc": "Execute a shell command directly, bypassing Copilot; '!' alone on an empty prompt enters shell mode for running multiple shell commands in sequence, exited via Esc or Ctrl+C",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Text-input trigger character, not a keyboard chord. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": []
      },
      {
        "keys": "$",
        "macKeys": "$",
        "desc": "Hand the terminal over to a real interactive shell ($SHELL on Unix, %COMSPEC% on Windows), suspending the CLI UI entirely so job control, full-screen apps, tab completion, and colors work natively",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "Disabled by default; must be enabled via the shellShortcut setting, and can be blocked entirely by enterprise managed settings. Only activates for a local, trusted, idle session on a real TTY. Exit via 'exit' or Ctrl+D (Unix) to return to the CLI. [Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "suspend"
        ]
      },
      {
        "keys": "?",
        "macKeys": "?",
        "desc": "Open quick help, when the prompt input is empty; press again to dismiss and insert a literal '?'",
        "ctx": "global",
        "origin": "tool-specific",
        "conf": "documented",
        "action": null,
        "notes": "[Sourced from the github/docs documentation repo, not the Copilot CLI implementation - documented, not source-verified.]",
        "src": 0,
        "cmd": null,
        "intents": [
          "dismiss-suggestion",
          "help"
        ]
      }
    ]
  }
];

export const KM_COLLISIONS: KmCollision[] = [
  {
    "key": "ctrl+k",
    "severity": "destructive",
    "reflex": "In stock VS Code, Cmd/Ctrl+K is a chord prefix (e.g. Cmd+K Cmd+S for Keyboard Shortcuts, Cmd+K Cmd+C to comment a block, Cmd+K Cmd+F to format selection, etc.) - pressing it alone does nothing visible, it just arms the second key.",
    "tools": {
      "claude-code": {
        "actual": "deletes from cursor to end of line (readline kill-line), stored in a yank buffer",
        "expect": "browser: focus search/address bar; VS Code: chord prefix"
      },
      "codex": {
        "actual": "deletes from the cursor to the end of the line (readline-inherited kill-line)",
        "expect": "focus the browser's address/search bar"
      },
      "opencode": {
        "actual": "input_delete_to_line_end - deletes from the cursor to end of the current line.",
        "expect": "varies by app (e.g. browser address bar / Slack quick switcher)"
      },
      "pi": {
        "actual": "deletes from cursor to end of line (action id tui.editor.deleteToLineEnd, readline 'kill-line') - silently destroys unsaved typed text if triggered by muscle memory from a chord-based editor.",
        "expect": "varies (browser: focus search bar; VS Code: chord prefix for many commands)"
      },
      "cursor:ide": {
        "actual": "Cursor rebinds bare Cmd/Ctrl+K (no second key needed) to immediately open Inline Edit in the editor, or the terminal AI prompt bar when the integrated terminal has focus.",
        "expect": "In stock VS Code, Cmd/Ctrl+K is a chord prefix (e.g. Cmd+K Cmd+S for Keyboard Shortcuts, Cmd+K Cmd+C to comment a block, Cmd+K Cmd+F to format selection, etc.) - pressing it alone does nothing visible, it just arms the second key."
      },
      "copilot:tui": {
        "actual": "Deletes all text from the cursor to the end of the line (and the line break itself if the cursor is already at end-of-line); no undo is documented",
        "expect": "No single consistent GUI meaning (e.g. open a command palette or insert a hyperlink in various apps)"
      }
    }
  },
  {
    "key": "ctrl+a",
    "severity": "silent-difference",
    "reflex": "Select all text in the current field",
    "tools": {
      "claude-code": {
        "actual": "moves cursor to the start of the current line - no selection occurs",
        "expect": "select all"
      },
      "codex": {
        "actual": "moves the cursor to the start of the input line (readline-inherited); inside an approval prompt it instead opens the approval details fullscreen",
        "expect": "select all"
      },
      "opencode": {
        "actual": "input_line_home - moves the cursor to the start of the current line (also model_provider_list in dialog context). Real select-all is cmd/super+a instead.",
        "expect": "select all"
      },
      "pi": {
        "actual": "in the main editor: move cursor to line start (readline 'beginning-of-line', action id tui.editor.cursorLineStart). In /tree: toggle 'show all entries' filter (app.tree.filter.all). In the scoped-models selector: enable all models (app.models.enableAll - this one DOES match 'select all' semantics).",
        "expect": "select all (text)"
      },
      "copilot:tui": {
        "actual": "Moves the cursor to the beginning of the current line; nothing is selected",
        "expect": "Select all text in the current field"
      }
    }
  },
  {
    "key": "ctrl+c",
    "severity": "destructive",
    "reflex": "Copy the current selection to the clipboard",
    "tools": {
      "claude-code": {
        "actual": "interrupt running operation, or clear input on first press with nothing running (second press exits)",
        "expect": "copy"
      },
      "codex": {
        "actual": "interrupts the running turn; if idle, quits Codex immediately with no confirmation prompt",
        "expect": "copy selected text"
      },
      "opencode": {
        "actual": "input_clear - wipes the entire input box (or, per the app_exit binding, can quit the app). A GUI user copying text before pasting elsewhere could instead lose an in-progress draft.",
        "expect": "copy"
      },
      "pi": {
        "actual": "copies selection if one exists (tui.input.copy), otherwise clears the editor (app.clear) rather than sending SIGINT/interrupt like a typical terminal ctrl+c. To actually abort/cancel the agent, use Escape (app.interrupt), not ctrl+c.",
        "expect": "copy"
      },
      "copilot:tui": {
        "actual": "Cancels the current operation or clears the prompt input on the first press; a second press ends the whole CLI session. No copy action occurs",
        "expect": "Copy the current selection to the clipboard"
      }
    }
  },
  {
    "key": "ctrl+d",
    "severity": "destructive",
    "reflex": "No universal GUI meaning; closest common expectation is 'do nothing' or, in a browser, 'bookmark this page'",
    "tools": {
      "claude-code": {
        "actual": "with empty input: exits Claude Code (double-press within 800ms); with text in the input: deletes the character after the cursor instead of exiting",
        "expect": "no strong GUI convention, but shell-savvy users expect EOF/logout"
      },
      "codex": {
        "actual": "deletes the character under/after the cursor when the composer has text; quits Codex immediately (no confirmation) when the composer is empty",
        "expect": "bookmark the page / no-op"
      },
      "opencode": {
        "actual": "Overloaded across contexts as session_delete, stash_delete, or dialog.move_session.delete (all dialog-list actions, deletes an item in the currently open list dialog), input_delete (forward-delete a character - confirmed to win while the prompt textarea has focus, since EditBufferRenderable.deleteChar() always reports the key as handled), or one of the app_exit keys when no editor is focused.",
        "expect": "no strong universal GUI meaning (browsers: bookmark page); terminal convention: EOF/close"
      },
      "pi": {
        "actual": "context-dependent: deletes the character forward if the input line is non-empty (tui.editor.deleteCharForward); exits pi entirely if the input line is empty (app.exit, EOF-style shell exit); deletes a session in the session picker (app.session.delete); sets the default filter in /tree (app.tree.filter.default). Same physical key, four different action ids, one of which (app.exit) can look like the whole app quit unexpectedly to someone expecting delete-forward.",
        "expect": "no strong universal GUI meaning; in many chat apps this key is unused"
      },
      "copilot:tui": {
        "actual": "Shuts the CLI session down. The docs give no press-count qualifier or confirmation language (unlike Ctrl+C's explicit 'press twice to exit'), so the best-evidence reading is an immediate, unconfirmed shutdown with no stated handling for an in-flight agent turn or unsaved prompt text",
        "expect": "No universal GUI meaning; closest common expectation is 'do nothing' or, in a browser, 'bookmark this page'"
      }
    }
  },
  {
    "key": "ctrl+r",
    "severity": "silent-difference",
    "reflex": "Reload the page, or redo the last undone action, in most GUI apps and browsers",
    "tools": {
      "claude-code": {
        "actual": "opens reverse history search over previous prompts",
        "expect": "browser: hard refresh/reload page"
      },
      "codex": {
        "actual": "opens reverse history search over previously submitted prompts",
        "expect": "reload the page"
      },
      "opencode": {
        "actual": "session_rename - opens a rename prompt for the current session.",
        "expect": "reload/refresh page (browser); reverse-history-search (terminal convention)"
      },
      "pi": {
        "actual": "renames the current session in the session list UI (action id app.session.rename); no evidence of a reverse-search feature in the main input (see gaps).",
        "expect": "reload page (browsers) / reverse history search (shell readline)"
      },
      "copilot:tui": {
        "actual": "Opens reverse search through the CLI's own command history",
        "expect": "Reload the page, or redo the last undone action, in most GUI apps and browsers"
      }
    }
  },
  {
    "key": "ctrl+w",
    "severity": "destructive",
    "reflex": "close tab/window (browsers, many GUI apps)",
    "tools": {
      "claude-code": {
        "actual": "deletes the previous word in the input (readline word-rubout)",
        "expect": "close tab/window"
      },
      "codex": {
        "actual": "deletes the previous word in the composer (readline-inherited kill-word-backward)",
        "expect": "close the current tab/window"
      },
      "opencode": {
        "actual": "input_delete_word_backward - deletes the word before the cursor in the input box.",
        "expect": "close current tab/window"
      },
      "pi": {
        "actual": "deletes the word immediately before the cursor (action id tui.editor.deleteWordBackward, readline 'unix-word-rubout') - a longstanding terminal-app trap where users can silently delete large chunks of a half-typed prompt.",
        "expect": "close tab/window (browsers, many GUI apps)"
      },
      "copilot:tui": {
        "actual": "Deletes the previous word in the prompt input, with no undo documented - a well-known terminal foot-gun for anyone reaching for it out of browser habit",
        "expect": "Close the current tab or window"
      }
    }
  },
  {
    "key": "ctrl+z",
    "severity": "destructive",
    "reflex": "Undo the last action",
    "tools": {
      "claude-code": {
        "actual": "suspends the entire Claude Code process to the shell (Unix SIGTSTP) - requires `fg` to resume; input/session appears to vanish",
        "expect": "undo"
      },
      "codex": {
        "actual": "suspends the entire Codex process to the shell (SIGTSTP); there is no in-app undo bound to Ctrl+Z",
        "expect": "undo the last edit"
      },
      "opencode": {
        "actual": "terminal_suspend - backgrounds the entire OpenCode process (POSIX SIGTSTP); the TUI screen disappears until the user runs `fg` in the shell. On macOS/Linux, actual undo is cmd+z (super+z), not ctrl+z.",
        "expect": "undo"
      },
      "pi": {
        "actual": "suspends the process to the background (job control, action id app.suspend), matching standard Unix shell behavior, not GUI undo. Editor undo is instead ctrl+- (tui.editor.undo).",
        "expect": "undo"
      },
      "copilot:tui": {
        "actual": "Suspends the entire CLI process to the background (standard Unix job control, resumed with 'fg' at the shell) - not scoped to a single edit, and can make the whole session appear to freeze for anyone expecting a text undo. Docs explicitly scope this to Unix; Windows behavior is unstated",
        "expect": "Undo the last action"
      }
    }
  },
  {
    "key": "ctrl+v",
    "severity": "silent-difference",
    "reflex": "Paste clipboard contents as plain text at the cursor",
    "tools": {
      "codex": {
        "actual": "pastes only an image from the clipboard as an attachment; text paste is a separate, automatic bracketed-paste path not bound to a key",
        "expect": "paste clipboard contents (text or image)"
      },
      "opencode": {
        "actual": "input_paste - pastes clipboard into the input box (matches expectation, no collision - included here only to confirm it was checked)",
        "expect": "paste"
      },
      "pi": {
        "actual": "pastes an IMAGE from clipboard (action id app.clipboard.pasteImage) with text fallback; plain text paste is presumably handled by normal terminal bracketed-paste rather than this binding, which is documented specifically as the image-paste action.",
        "expect": "paste (text)"
      },
      "copilot:tui": {
        "actual": "Pastes clipboard contents as an attachment rather than inserting them inline as text",
        "expect": "Paste clipboard contents as plain text at the cursor"
      }
    }
  },
  {
    "key": "ctrl+x",
    "severity": "silent-difference",
    "reflex": "Cut the current selection to the clipboard",
    "tools": {
      "claude-code": {
        "actual": "not a standalone binding - enters chord-wait mode as a prefix for ctrl+x ctrl+k / ctrl+x ctrl+e / ctrl+x ctrl+b; no text is cut",
        "expect": "cut"
      },
      "opencode": {
        "actual": "leader - arms leader mode and waits up to 2s for the next key; no text is cut.",
        "expect": "cut"
      },
      "pi": {
        "actual": "copies the last assistant message to the clipboard (action id app.message.copy); in /tree, copies the selected message; in the scoped-models selector, clears all model selections instead (app.models.clearAll). No 'cut' semantics anywhere.",
        "expect": "cut (text)"
      },
      "copilot:tui": {
        "actual": "Does nothing by itself - it is only a chord prefix key that waits for a follow-up key (/, e, b, or o) to run a specific action (slash command, external editor, background task, or open last link). No cut/clipboard behavior at all",
        "expect": "Cut the current selection to the clipboard"
      }
    }
  },
  {
    "key": "tab",
    "severity": "silent-difference",
    "reflex": "Inside any text input/textarea (including VS Code's own webview panels), Tab conventionally either inserts a tab character or moves focus to the next control - it does not change which message is displayed.",
    "tools": {
      "codex": {
        "actual": "queues the draft while a task is running (no literal tab character can be typed via Tab)",
        "expect": "move focus to the next field / insert a tab character"
      },
      "cursor:ide": {
        "actual": "When focus is in the Cursor Chat input, Tab is bound to 'Cycle to next message' rather than an indent/focus-move action. (Tab's editor behavior - accept AI suggestion when ghost text is showing, else indent - matches ordinary VS Code IntelliSense convention and is not flagged as a collision.)",
        "expect": "Inside any text input/textarea (including VS Code's own webview panels), Tab conventionally either inserts a tab character or moves focus to the next control - it does not change which message is displayed."
      },
      "copilot:ide": {
        "actual": "Accepts the Copilot ghost-text suggestion in full (or first line)",
        "expect": "Insert indentation / move focus to next field"
      }
    }
  },
  {
    "key": "ctrl+b",
    "severity": "silent-difference",
    "reflex": "toggle the browser's bookmarks bar (most browsers)",
    "tools": {
      "claude-code": {
        "actual": "backgrounds the current running Bash task; also collides with tmux's own Ctrl+B prefix (tmux users must press twice)",
        "expect": "bold (rich text editors)"
      },
      "opencode": {
        "actual": "session_background - backgrounds running synchronous subagents (only reachable when the prompt textarea is not focused; while typing, ctrl+b is input_move_left's readline backward-char component instead).",
        "expect": "toggle the browser's bookmarks bar (most browsers)"
      }
    }
  },
  {
    "key": "ctrl+i",
    "severity": "silent-difference",
    "reflex": "Cmd/Ctrl+I has no default binding in stock VS Code, but is widely muscle-memorized by GitHub Copilot users as 'open Copilot Inline Chat' (an inline, in-editor AI prompt at the cursor position).",
    "tools": {
      "cursor:ide": {
        "actual": "Cursor binds Cmd/Ctrl+I to 'Toggle Sidepanel', opening the docked Chat/Agent panel rather than an inline, at-cursor prompt. A Copilot user reaching for inline chat gets a different UI surface (panel vs inline).",
        "expect": "Cmd/Ctrl+I has no default binding in stock VS Code, but is widely muscle-memorized by GitHub Copilot users as 'open Copilot Inline Chat' (an inline, in-editor AI prompt at the cursor position)."
      },
      "copilot:ide": {
        "actual": "Opens Copilot inline chat (editor context) or terminal inline chat (terminal context), inserting an AI prompt box at the cursor",
        "expect": "No standard binding in the plain editor; in the integrated terminal this is unused by default"
      }
    }
  },
  {
    "key": "ctrl+o",
    "severity": "silent-difference",
    "reflex": "open a file",
    "tools": {
      "claude-code": {
        "actual": "toggles the verbose transcript viewer",
        "expect": "open file"
      },
      "codex": {
        "actual": "copies the last agent response to the clipboard",
        "expect": "open a file"
      }
    }
  },
  {
    "key": "ctrl+t",
    "severity": "silent-difference",
    "reflex": "new tab (browser)",
    "tools": {
      "claude-code": {
        "actual": "toggles Claude's to-do checklist visibility",
        "expect": "browser: new tab"
      },
      "opencode": {
        "actual": "variant_cycle - cycles the active model's reasoning/thinking variant.",
        "expect": "new tab (browser)"
      }
    }
  },
  {
    "key": "ctrl+y",
    "severity": "silent-difference",
    "reflex": "In the classic emacs/readline convention this CLI otherwise follows for Ctrl+A/E/U/K/W/B/F/H, Ctrl+Y is 'yank' - paste back the text most recently deleted by Ctrl+U, Ctrl+K, or Ctrl+W",
    "tools": {
      "claude-code": {
        "actual": "pastes (yanks) text previously deleted via Ctrl+K/Ctrl+U/Ctrl+W - unrelated to redo",
        "expect": "redo (Windows convention)"
      },
      "copilot:tui": {
        "actual": "Accepts the current inline completion suggestion instead (same action as Tab) - breaking the CLI's own readline pattern rather than colliding with a generic GUI convention",
        "expect": "In the classic emacs/readline convention this CLI otherwise follows for Ctrl+A/E/U/K/W/B/F/H, Ctrl+Y is 'yank' - paste back the text most recently deleted by Ctrl+U, Ctrl+K, or Ctrl+W"
      }
    }
  },
  {
    "key": "escape",
    "severity": "silent-difference",
    "reflex": "Escape is a near-universal 'cancel/dismiss' convention across all editors and OSes - including elsewhere in this same Cursor shortcuts table, where Escape means 'Unfocus field' (Chat) and is commonly used to dismiss dialogs.",
    "tools": {
      "cursor:ide": {
        "actual": "In the Terminal AI-command flow specifically, Escape is documented as 'Accept command' - it inserts/confirms the AI-generated shell command rather than dismissing it. A reflexive Escape press to back out of the flow instead confirms it.",
        "expect": "Escape is a near-universal 'cancel/dismiss' convention across all editors and OSes - including elsewhere in this same Cursor shortcuts table, where Escape means 'Unfocus field' (Chat) and is commonly used to dismiss dialogs."
      },
      "copilot:ide": {
        "actual": "Dismisses the active inline suggestion without any confirmation",
        "expect": "Close a widget/popup, exit an input field, or do nothing in a plain editor"
      }
    }
  }
];

export const KM_INTENTS: KmIntent[] = [
  {
    "id": "clear-input",
    "label": "Clear the whole input line",
    "reflex": "Ctrl+A then Delete, or Ctrl+X",
    "aliases": [
      "clear input",
      "cut everything",
      "delete everything i typed",
      "select all and delete",
      "erase the line",
      "start over",
      "wipe the prompt",
      "ctrl+x",
      "ctrl+a delete",
      "clear what i typed"
    ]
  },
  {
    "id": "kill-to-end",
    "label": "Delete from the cursor to end of line",
    "reflex": "Shift+End then Delete",
    "aliases": [
      "cut to end of line",
      "delete rest of the line",
      "ctrl+k",
      "kill to end"
    ]
  },
  {
    "id": "delete-word-back",
    "label": "Delete the word before the cursor",
    "reflex": "Ctrl+Backspace",
    "aliases": [
      "delete a word",
      "backspace a word",
      "ctrl+w",
      "remove last word",
      "rub out word"
    ]
  },
  {
    "id": "yank",
    "label": "Paste back text you just deleted (kill ring)",
    "reflex": "Ctrl+Z to undo the delete",
    "aliases": [
      "undo my delete",
      "get the text back",
      "paste what i cut",
      "ctrl+y",
      "restore deleted text",
      "kill ring"
    ]
  },
  {
    "id": "cursor-home",
    "label": "Move the cursor to the start of the line",
    "reflex": "Ctrl+A = select all",
    "aliases": [
      "select all",
      "ctrl+a",
      "beginning of line",
      "home",
      "go to start",
      "highlight everything"
    ]
  },
  {
    "id": "cursor-end",
    "label": "Move the cursor to the end of the line",
    "reflex": "End",
    "aliases": [
      "end of line",
      "ctrl+e",
      "go to end"
    ]
  },
  {
    "id": "paste-text",
    "label": "Paste text from the system clipboard",
    "reflex": "Ctrl+V / Cmd+V",
    "aliases": [
      "paste",
      "ctrl+v",
      "cmd+v",
      "insert clipboard",
      "paste from another window"
    ]
  },
  {
    "id": "paste-image",
    "label": "Paste an image or screenshot as an attachment",
    "reflex": "Ctrl+V",
    "aliases": [
      "paste a screenshot",
      "attach an image",
      "paste image",
      "send a picture"
    ]
  },
  {
    "id": "interrupt",
    "label": "Interrupt the running turn",
    "reflex": "Ctrl+C = copy",
    "aliases": [
      "stop the agent",
      "cancel",
      "abort",
      "make it stop",
      "ctrl+c",
      "interrupt",
      "halt"
    ]
  },
  {
    "id": "quit",
    "label": "Quit the agent",
    "reflex": "Ctrl+D = EOF in a shell",
    "aliases": [
      "exit",
      "quit",
      "close the agent",
      "ctrl+d",
      "how do i leave",
      "get out"
    ]
  },
  {
    "id": "suspend",
    "label": "Suspend the process to the shell",
    "reflex": "Ctrl+Z = undo",
    "aliases": [
      "undo",
      "ctrl+z",
      "background it",
      "it disappeared",
      "get back to my shell",
      "fg"
    ]
  },
  {
    "id": "newline",
    "label": "Insert a newline without submitting",
    "reflex": "Enter",
    "aliases": [
      "new line",
      "multiline",
      "line break",
      "shift enter",
      "write a paragraph",
      "how do i not send"
    ]
  },
  {
    "id": "submit",
    "label": "Submit the prompt",
    "reflex": "Enter",
    "aliases": [
      "send",
      "submit",
      "run it",
      "enter"
    ]
  },
  {
    "id": "history-prev",
    "label": "Recall the previous prompt",
    "reflex": "Up arrow",
    "aliases": [
      "previous prompt",
      "last thing i typed",
      "recall",
      "history",
      "up arrow"
    ]
  },
  {
    "id": "history-search",
    "label": "Search back through previous prompts",
    "reflex": "Ctrl+R = reload page",
    "aliases": [
      "search history",
      "ctrl+r",
      "find an old prompt",
      "reverse search"
    ]
  },
  {
    "id": "session-rename",
    "label": "Rename the current session",
    "reflex": "Ctrl+R = reload",
    "aliases": [
      "rename session",
      "change session name"
    ]
  },
  {
    "id": "session-new",
    "label": "Start a new session",
    "reflex": "Ctrl+N",
    "aliases": [
      "new session",
      "clear the conversation",
      "start fresh",
      "reset context",
      "new chat"
    ]
  },
  {
    "id": "session-switch",
    "label": "Switch between sessions",
    "reflex": "Ctrl+Tab",
    "aliases": [
      "switch session",
      "resume",
      "other conversation",
      "session list"
    ]
  },
  {
    "id": "transcript",
    "label": "Toggle the full transcript / verbose output",
    "reflex": "no GUI equivalent",
    "aliases": [
      "see full output",
      "verbose",
      "expand output",
      "show me everything",
      "transcript"
    ]
  },
  {
    "id": "mode-cycle",
    "label": "Cycle the approval / permission mode",
    "reflex": "no GUI equivalent",
    "aliases": [
      "plan mode",
      "auto accept",
      "yolo mode",
      "shift tab",
      "switch mode",
      "stop asking me"
    ]
  },
  {
    "id": "model-switch",
    "label": "Switch the active model",
    "reflex": "no GUI equivalent",
    "aliases": [
      "change model",
      "switch model",
      "use a different model",
      "opus",
      "sonnet"
    ]
  },
  {
    "id": "external-editor",
    "label": "Open the prompt in your $EDITOR",
    "reflex": "no GUI equivalent",
    "aliases": [
      "open in vim",
      "edit in my editor",
      "external editor",
      "write a long prompt"
    ]
  },
  {
    "id": "queue",
    "label": "Queue a message while the agent is working",
    "reflex": "no GUI equivalent",
    "aliases": [
      "queue a message",
      "send while running",
      "type while it works"
    ]
  },
  {
    "id": "accept-suggestion",
    "label": "Accept the inline suggestion",
    "reflex": "Tab = indent",
    "aliases": [
      "accept",
      "take the completion",
      "tab",
      "ghost text"
    ]
  },
  {
    "id": "dismiss-suggestion",
    "label": "Dismiss the inline suggestion",
    "reflex": "Esc",
    "aliases": [
      "dismiss",
      "reject the suggestion",
      "make it go away",
      "escape"
    ]
  },
  {
    "id": "inline-chat",
    "label": "Open inline chat / edit at the cursor",
    "reflex": "no GUI equivalent",
    "aliases": [
      "inline edit",
      "edit this line",
      "ask about this code",
      "cmd+k"
    ]
  },
  {
    "id": "help",
    "label": "Show help / the shortcut list",
    "reflex": "F1",
    "aliases": [
      "help",
      "what are the shortcuts",
      "list keys"
    ]
  }
];

export const KM_TASKS: KmTask[] = [
  {
    "id": "stop",
    "label": "Stop the agent",
    "keys": {
      "claude-code:tui": {
        "k": "Esc",
        "m": "Esc",
        "all": "esc",
        "d": "Interrupt Claude mid-turn (stop the current response/tool call, keeping work done so far), or close an open dialog (e.g. permission prompt) "
      },
      "codex:tui": {
        "k": "Esc",
        "m": "Esc",
        "all": "esc",
        "d": "Interrupt the active turn."
      },
      "copilot:tui": {
        "k": "Esc",
        "m": "Esc",
        "all": "esc",
        "d": "Cancel the current operation; press twice to interrupt the running turn, or to stop background agents when the main agent is idle"
      },
      "opencode:tui": {
        "k": "Esc",
        "m": "Esc",
        "all": "escape",
        "d": "session_interrupt - interrupt/cancel the model's in-flight response."
      },
      "pi:tui": {
        "k": "Esc",
        "m": "Esc",
        "all": "escape",
        "d": "Cancel / abort current agent turn; in dialogs/selectors, cancels the selection"
      }
    }
  },
  {
    "id": "newline",
    "label": "Newline without submitting",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+J",
        "m": "Ctrl+J",
        "all": "ctrl+j",
        "d": "Insert a newline without submitting. Works in any terminal without configuration."
      },
      "codex:tui": {
        "k": "Ctrl+J",
        "m": "Ctrl+J",
        "all": "ctrl+j / ctrl+m / shift+enter / alt+enter",
        "d": "Insert a newline in the editor."
      },
      "cursor:tui": {
        "k": "Ctrl+J",
        "m": "Ctrl+J",
        "all": "ctrl+j",
        "d": "Insert a newline (universal alternative that works in all terminals)"
      },
      "opencode:tui": {
        "k": "Ctrl+J",
        "m": "Ctrl+J",
        "all": "shift+return,ctrl+return,alt+return,ctrl+j",
        "d": "input_newline - insert a newline in the input box without submitting."
      },
      "pi:tui": {
        "k": "Ctrl+J",
        "m": "Ctrl+J",
        "all": "shift+enter, ctrl+j",
        "d": "Insert new line (multiline input)"
      }
    }
  },
  {
    "id": "newline2",
    "label": "Newline (alternative)",
    "keys": {
      "codex:tui": {
        "k": "Shift+Enter",
        "m": "Shift+Enter",
        "all": "ctrl+j / ctrl+m / shift+enter / alt+enter",
        "d": "Insert a newline in the editor."
      },
      "copilot:tui": {
        "k": "Shift+Enter",
        "m": "Shift+Enter",
        "all": "shift+enter or alt+enter",
        "d": "Insert a newline in the prompt input without submitting"
      },
      "cursor:tui": {
        "k": "Shift+Enter",
        "m": "Shift+Enter",
        "all": "shift+enter",
        "d": "Insert a newline instead of submitting (multi-line prompts)"
      },
      "opencode:tui": {
        "k": "Shift+Enter",
        "m": "Shift+Enter",
        "all": "shift+return,ctrl+return,alt+return,ctrl+j",
        "d": "input_newline - insert a newline in the input box without submitting."
      },
      "pi:tui": {
        "k": "Shift+Enter",
        "m": "Shift+Enter",
        "all": "shift+enter, ctrl+j",
        "d": "Insert new line (multiline input)"
      }
    }
  },
  {
    "id": "image",
    "label": "Paste an image",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+V",
        "m": "Ctrl+V (",
        "all": "ctrl+v",
        "d": "Paste an image from the clipboard, inserting a `[Image #N]` chip at the cursor."
      },
      "codex:tui": {
        "k": "Ctrl+V",
        "m": "Ctrl+V is not wired; use ctrl+V",
        "all": "ctrl+v",
        "d": "Paste an image from the clipboard as an attachment."
      },
      "pi:tui": {
        "k": "Ctrl+V",
        "m": "Ctrl+V",
        "all": "ctrl+v",
        "d": "Paste image from clipboard"
      }
    }
  },
  {
    "id": "killstart",
    "label": "Delete to line start",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+U",
        "m": "Ctrl+U",
        "all": "ctrl+u",
        "d": "Delete from cursor to line start. Stores deleted text for pasting; repeat to clear across lines in multiline input."
      },
      "codex:tui": {
        "k": "Ctrl+U",
        "m": "Ctrl+U",
        "all": "ctrl+u",
        "d": "Delete from cursor to line start."
      },
      "copilot:tui": {
        "k": "Ctrl+U",
        "m": "Ctrl+U",
        "all": "ctrl+u",
        "d": "Delete from cursor to beginning of the line"
      },
      "opencode:tui": {
        "k": "Ctrl+U",
        "m": "Ctrl+U",
        "all": "ctrl+u",
        "d": "input_delete_to_line_start - delete from cursor to start of line (unix-line-discard)."
      },
      "pi:tui": {
        "k": "Ctrl+U",
        "m": "Ctrl+U",
        "all": "ctrl+u",
        "d": "Delete to line start"
      }
    }
  },
  {
    "id": "killend",
    "label": "Delete to line end",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+K",
        "m": "Ctrl+K",
        "all": "ctrl+k",
        "d": "Delete from cursor to end of line. Stores deleted text for pasting (yank buffer)."
      },
      "codex:tui": {
        "k": "Ctrl+K",
        "m": "Ctrl+K",
        "all": "ctrl+k",
        "d": "Delete from cursor to line end."
      },
      "copilot:tui": {
        "k": "Ctrl+K",
        "m": "Ctrl+K",
        "all": "ctrl+k",
        "d": "Delete from cursor to end of the line. If the cursor is at the end of the line, delete the line break"
      },
      "cursor:ide": {
        "k": "Ctrl+K",
        "m": "Ctrl+K",
        "all": "ctrl+k",
        "d": "Open (Inline Edit prompt)"
      },
      "opencode:tui": {
        "k": "Ctrl+K",
        "m": "Ctrl+K",
        "all": "ctrl+k",
        "d": "input_delete_to_line_end - delete from cursor to end of line (kill-line)."
      },
      "pi:tui": {
        "k": "Ctrl+K",
        "m": "Ctrl+K",
        "all": "ctrl+k",
        "d": "Delete to line end"
      }
    }
  },
  {
    "id": "killword",
    "label": "Delete previous word",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+W",
        "m": "Ctrl+W",
        "all": "ctrl+w",
        "d": "Delete the previous word. Stores deleted text for pasting."
      },
      "codex:tui": {
        "k": "Ctrl+W",
        "m": "Ctrl+W",
        "all": "alt+backspace / ctrl+backspace / ctrl+shift+backspace / ctrl+w / ctrl+alt+h",
        "d": "Delete the previous word."
      },
      "copilot:tui": {
        "k": "Ctrl+W",
        "m": "Ctrl+W",
        "all": "ctrl+w",
        "d": "Delete the previous word"
      },
      "cursor:ide": {
        "k": "Ctrl+W",
        "m": "Ctrl+W",
        "all": "ctrl+w",
        "d": "Close chat"
      },
      "opencode:tui": {
        "k": "Ctrl+W",
        "m": "Ctrl+W",
        "all": "ctrl+w,ctrl+backspace,alt+backspace",
        "d": "input_delete_word_backward - delete word before cursor (unix-word-rubout)."
      },
      "pi:tui": {
        "k": "Ctrl+W",
        "m": "Ctrl+W",
        "all": "ctrl+w, alt+backspace",
        "d": "Delete word backward"
      }
    }
  },
  {
    "id": "yank",
    "label": "Paste back what you deleted",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+Y",
        "m": "Ctrl+Y",
        "all": "ctrl+y",
        "d": "Paste (yank) text previously deleted with Ctrl+K, Ctrl+U, or Ctrl+W."
      },
      "codex:tui": {
        "k": "Ctrl+Y",
        "m": "Ctrl+Y",
        "all": "ctrl+y",
        "d": "Paste the kill buffer (yank)."
      },
      "pi:tui": {
        "k": "Ctrl+Y",
        "m": "Ctrl+Y",
        "all": "ctrl+y",
        "d": "Paste (yank) most recently deleted text"
      }
    }
  },
  {
    "id": "home",
    "label": "Jump to line start",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+A",
        "m": "Ctrl+A",
        "all": "ctrl+a",
        "d": "Move cursor to the start of the current logical line (in multiline input)."
      },
      "codex:tui": {
        "k": "Ctrl+A",
        "m": "Ctrl+A",
        "all": "home / ctrl+a",
        "d": "Move to the beginning of the line."
      },
      "copilot:tui": {
        "k": "Ctrl+A",
        "m": "Ctrl+A",
        "all": "ctrl+a",
        "d": "Move to beginning of the line (when typing)"
      },
      "opencode:tui": {
        "k": "Ctrl+A",
        "m": "Ctrl+A",
        "all": "ctrl+a",
        "d": "input_line_home - move cursor to the start of the current line."
      },
      "pi:tui": {
        "k": "Ctrl+A",
        "m": "Ctrl+A",
        "all": "home, ctrl+a",
        "d": "Move to line start"
      }
    }
  },
  {
    "id": "end",
    "label": "Jump to line end",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+E",
        "m": "Ctrl+E",
        "all": "ctrl+e",
        "d": "Move cursor to the end of the current logical line (in multiline input)."
      },
      "codex:tui": {
        "k": "Ctrl+E",
        "m": "Ctrl+E",
        "all": "end / ctrl+e",
        "d": "Move to the end of the line."
      },
      "copilot:tui": {
        "k": "Ctrl+E",
        "m": "Ctrl+E",
        "all": "ctrl+e",
        "d": "Move to end of the line (when typing); when the prompt input is empty instead, this same key expands all items in the response timeline"
      },
      "cursor:ide": {
        "k": "Ctrl+E",
        "m": "Ctrl+E",
        "all": "ctrl+e",
        "d": "Toggle Agent layout"
      },
      "opencode:tui": {
        "k": "Ctrl+E",
        "m": "Ctrl+E",
        "all": "ctrl+e",
        "d": "input_line_end - move cursor to the end of the current line."
      },
      "pi:tui": {
        "k": "Ctrl+E",
        "m": "Ctrl+E",
        "all": "end, ctrl+e",
        "d": "Move to line end"
      }
    }
  },
  {
    "id": "hist",
    "label": "Search past prompts",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+R",
        "m": "Ctrl+R",
        "all": "ctrl+r",
        "d": "Open reverse history search over previous prompts."
      },
      "codex:tui": {
        "k": "Ctrl+R",
        "m": "Ctrl+R",
        "all": "ctrl+r",
        "d": "Open reverse history search, or move to the previous match."
      },
      "copilot:tui": {
        "k": "Ctrl+R",
        "m": "Ctrl+R",
        "all": "ctrl+r",
        "d": "Reverse search through command history"
      }
    }
  },
  {
    "id": "editor",
    "label": "Open $EDITOR",
    "keys": {
      "codex:tui": {
        "k": "Ctrl+G",
        "m": "Ctrl+G",
        "all": "ctrl+g",
        "d": "Open the current draft in an external editor ($EDITOR)."
      },
      "copilot:tui": {
        "k": "Ctrl+X then e",
        "m": "Ctrl+X then e",
        "all": "ctrl+x then e",
        "d": "Edit the prompt in an external editor ($EDITOR)"
      },
      "pi:tui": {
        "k": "Ctrl+G",
        "m": "Ctrl+G",
        "all": "ctrl+g",
        "d": "Open current input in an external editor ($VISUAL, $EDITOR, Notepad on Windows, or nano elsewhere)"
      }
    }
  },
  {
    "id": "mode",
    "label": "Cycle mode",
    "keys": {
      "claude-code:tui": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "Cycle permission modes (default/Manual -> acceptEdits -> plan -> any custom modes like auto/bypassPermissions)."
      },
      "codex:tui": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "Cycle the collaboration mode."
      },
      "copilot:tui": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "Cycle between Standard, Plan, and Autopilot session modes"
      },
      "cursor:ide": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "Rotate between Agent modes"
      },
      "cursor:tui": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "Rotate between modes (Agent, Plan, Ask)"
      },
      "opencode:tui": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "agent_cycle_reverse - cycle to the previous agent."
      },
      "pi:tui": {
        "k": "Shift+Tab",
        "m": "Shift+Tab",
        "all": "shift+tab",
        "d": "Cycle thinking level (off/minimal/low/medium/high/xhigh/max)"
      }
    }
  },
  {
    "id": "quit",
    "label": "Quit",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+D",
        "m": "Ctrl+D",
        "all": "ctrl+d",
        "d": "Exit Claude Code. First press shows a confirmation hint, second press within 800ms exits. When the prompt has text, deletes the character af"
      },
      "codex:tui": {
        "k": "Ctrl+D",
        "m": "Ctrl+D",
        "all": "ctrl+d (composer empty)",
        "d": "Quit Codex."
      },
      "copilot:tui": {
        "k": "Ctrl+D",
        "m": "Ctrl+D",
        "all": "ctrl+d",
        "d": "Shutdown"
      },
      "cursor:tui": {
        "k": "Ctrl+D",
        "m": "Ctrl+D",
        "all": "ctrl+d",
        "d": "Exit the CLI"
      },
      "opencode:tui": {
        "k": "Ctrl+D",
        "m": "Ctrl+D",
        "all": "ctrl+c,ctrl+d,<leader>q",
        "d": "app_exit - quit OpenCode."
      },
      "pi:tui": {
        "k": "Ctrl+D",
        "m": "Ctrl+D",
        "all": "ctrl+d",
        "d": "Exit pi when the editor is empty (EOF-style exit)"
      }
    }
  },
  {
    "id": "suspend",
    "label": "Suspend to shell",
    "keys": {
      "claude-code:tui": {
        "k": "Ctrl+Z",
        "m": "Ctrl+Z",
        "all": "ctrl+z",
        "d": "Suspend Claude Code to the shell (Unix only). Run `fg` to resume."
      },
      "codex:tui": {
        "k": "Ctrl+Z",
        "m": "Ctrl+Z",
        "all": "ctrl+z",
        "d": "Suspend Codex (SIGTSTP); resume with `fg` in the shell."
      },
      "copilot:tui": {
        "k": "Ctrl+Z",
        "m": "Ctrl+Z",
        "all": "ctrl+z",
        "d": "Suspend the process to the background (Unix)"
      },
      "opencode:tui": {
        "k": "Ctrl+Z",
        "m": "Ctrl+Z",
        "all": "ctrl+z",
        "d": "terminal_suspend - suspend OpenCode to the background (POSIX SIGTSTP, like any terminal job-control suspend; resume with `fg` in the shell)."
      },
      "pi:tui": {
        "k": "Ctrl+Z",
        "m": "Ctrl+Z",
        "all": "ctrl+z",
        "d": "Suspend to background (job control)"
      }
    }
  }
];
