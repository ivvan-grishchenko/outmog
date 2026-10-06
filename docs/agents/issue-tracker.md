# Issue tracker: Linear

Issues for this repo live in Linear, reached through the **Linear MCP server**.

## The identifiers you actually need

| Thing | Value |
| ----- | ----- |
| Workspace | `benrasha` |
| Team | `Benrasha`, key **`BEN`**, id `74239f04-073a-4f43-a517-f09d99f182b2` |
| Project | **`Outmog`**, identifier `P-BEN-3`, uuid `7b7bd9ff-0ad5-4132-a28a-cf13f414b5a8` |
| Project URL | https://linear.app/benrasha/project/outmog-40c22df8ac64 |

`Benrasha` is currently the **only** team in the workspace, so every issue key is
`BEN-<n>` (e.g. `BEN-1`) — not `ENG-` or anything else. `P-BEN-3` is the *project*
identifier; a `P-` prefix means project, never issue. Every issue created for this repo
goes in the `Outmog` project.

As of setup the project has **no issues**; `BEN-2`, `BEN-3` and `BEN-4` are Linear's own
workspace-onboarding issues and are unrelated to this codebase.

## Tool surface

Read: `get_workspace`, `get_team`, `list_teams`, `get_project`, `list_projects`,
`list_issues`, `get_issue`, `list_comments`, `list_issue_statuses`, `list_issue_labels`,
`list_users`, `get_user`, `list_documents`, `get_document`.

Write: `save_issue` (create **and** update), `save_comment`, `save_project`,
`create_issue_label`, `save_issue_label`, `save_document`.

There is no `delete_issue` tool. The only destructive operations exposed are
`delete_comment`, `delete_attachment` and `delete_status_update` — still get the user's
explicit go-ahead before using them.

## Behaviours that will bite you

- **`save_issue` is both create and update.** Pass `id` to update; omit it to create. On
  create, `team` is required (`"Benrasha"`); `project: "Outmog"` sets the project.
- **Use `addLabels`, never `labels`, for triage.** `labels` *replaces* the entire label
  set, so passing `labels: ["ready-for-agent"]` silently strips any existing `Bug` or
  `Feature` label. `addLabels` is append-only.
- **Send literal newlines.** `description`, `comment body`, and every `patch` string are
  Markdown. Do not escape them — real newlines, not `\n`. Mention a user as `@displayName`.
- **Use `patch` to append to an existing ticket.** `patch` takes
  `{op: "append" | "prepend" | "insert_before" | "insert_after" | "replace" | "replace_range", ...}`
  and applies partial edits atomically; each anchor must match the current content exactly
  once. Prefer it over re-sending a whole `description`, which risks clobbering edits made
  in the Linear UI.
- **Statuses are the seven team defaults**, resolvable by name or type via
  `list_issue_statuses({team: "Benrasha"})`: `Backlog` (backlog), `Todo` (unstarted),
  `In Progress` (started), `In Review` (started), `Done` (completed), `Canceled`
  (canceled), `Duplicate` (duplicate). Note there is **no `Triage` status**, so
  `needs-triage` is necessarily a *label*, never a state.
- **Blocking is native.** `save_issue` takes `blockedBy`, `blocks` and `relatedTo` (plus
  `removeBlockedBy` / `removeBlocks` / `removeRelatedTo`); read them back with
  `get_issue({id, includeRelations: true})`.

## When a skill says "publish to the issue tracker"

Create an issue with `save_issue`: `team: "Benrasha"`, `project: "Outmog"`, a `title`
carrying the feature's intent, and a `description` holding the full spec or ticket brief.
Apply triage labels per `docs/agents/triage-labels.md`. Report the created key and URL
back to the user — and only after the tool call actually returned them.

## When a skill says "fetch the relevant ticket"

`get_issue({id})` with the key or URL, adding `includeRelations: true` when dependencies
matter. Use `list_issues({project: "Outmog", state, label, assignee})` for open-ended
sweeps. A bare number with no team key (`123`) is ambiguous — ask which team rather than
guessing, though with `Benrasha` the only team `BEN-123` is the obvious reading.

## Wayfinding operations

Used by `/wayfinder`. Linear has no filesystem, so the map is an issue too.

- **Map**: one issue in `Outmog` titled `Wayfinder: <effort>`, whose body holds the
  Notes / Decisions-so-far / Fog sections.
- **Child ticket**: one issue per decision ticket. A `Type:` line (`research` / `prototype` /
  `grilling` / `task`) and a `Status:` line (`claimed` / `resolved`) sit near the top of the
  body.
- **Blocking**: set real Linear relations via `save_issue({id, blockedBy: [...]})` — those are
  the source of truth. Also mirror them as a `Blocked by: BEN-7, BEN-9` line in the body, so
  the dependency survives being read outside Linear or through a summary.
- **Frontier**: child issues whose `Status` line isn't `resolved`, whose `blockedBy`
  relations are all `resolved`, and which have no assignee. Lowest key wins.
- **Claim**: assign the issue (`save_issue({id, assignee: "me"})`) and set `Status: claimed`
  before starting any work.
- **Resolve**: append the answer with `patch: [{op: "append", text: "\n\n## Answer\n…"}]`,
  set `Status: resolved` in the body, then add a context pointer (gist + link) to the map's
  Decisions-so-far.
