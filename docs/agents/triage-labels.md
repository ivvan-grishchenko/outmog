# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker (Linear).

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## State in this workspace

**None of these five labels exist yet** in the `benrasha` workspace. The labels currently
present are `Bug`, `Feature`, `Improvement`, `openspec`, `sentry-client-monitoring` and
`sentry-server-monitoring`.

Create a missing label before applying it:

```
create_issue_label({ name: "ready-for-agent", teamId: "74239f04-073a-4f43-a517-f09d99f182b2" })
```

Pass `teamId` for a team-scoped label (team `Benrasha`, key `BEN`); omit it for a
workspace-level label that every team can see. Use `save_issue_label` to rename an
existing one and `retire_issue_label` / `restore_issue_label` for archive toggling.

## Applying a label to an issue

Use `addLabels`, never `labels`:

```
save_issue({ id: "BEN-12", addLabels: ["ready-for-agent"] })
```

`labels` replaces the whole set and would strip the issue's other labels (`Bug`, `Feature`,
`openspec`, …). `addLabels` is append-only. To drop one, use `removeLabels`.

## Labels, not statuses

The `Benrasha` team has no `Triage` status — its statuses are `Backlog`, `Todo`,
`In Progress`, `In Review`, `Done`, `Canceled`, `Duplicate`. So `needs-triage` can only be
expressed as a **label**; pair it with `state: "Backlog"` on a freshly created issue, and
move to `Todo` once the issue reaches `ready-for-agent`.
