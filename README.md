# Fork website

The landing page for [Fork](https://github.com/harshii0509/Fork), a terminal for people who build things.

- **Download for Mac** links to `https://github.com/harshii0509/Fork/releases/latest/download/Fork.dmg`, which always serves the newest release, so the site never needs updating for a new version.
- Design: Figma file "Fork", frame `13:7616`. Illustrations live in `public/art/`.

## What's cooking (the changelog)

[/whats-cooking](https://fork-terminal.vercel.app/whats-cooking) lists everything that's gone into Fork, newest first: what changed, when, and why. Every change, to the app, this site or behind the scenes, gets an entry in `app/whats-cooking/entries.ts` (the file explains the fields). App entries without a `version` show as "on the stove" until a release ships them; add the version then, and the release to `RELEASES`.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Hosted on Vercel, connected to this repo: every push to `main` deploys.

## Analytics

PostHog, in the same project as the Fork app, so visits, downloads and app opens sit side by side. Setup is in `instrumentation-client.ts`.

- **Only the live site sends.** Local development and `localhost` never do; clicks just log `[analytics] …` in the browser console.
- **Nothing is stored on visitors' devices** (no cookies, no local storage), so no consent banner is needed. The catch: someone who visits twice counts as two visitors.
- **Requests go through `/ingest`** on this site (rewrites in `next.config.ts`), so ad blockers don't hide visits.
- **Every event carries `site: fork-website`.**

| Event | When |
|---|---|
| `$pageview` / `$pageleave` | Someone opens or leaves the page. Shows in PostHog → Web analytics (visitors, referrers, countries). |
| `download_clicked` | Download for Mac |
| `github_clicked` | View on Github |
| `social_clicked` (`network`: `x` / `linkedin`) | Footer icons |
| `snowman_poked` | First poke of the snowman in a visit |
| `snow_unlocked` | Five quick pokes: it snows |
| `cooking_clicked` (`from`: `note` / `footer`) | The sticky note on the Fork window, or "see what's cooking" in the footer |

To add one, put `data-track="event_name"` (plus optional `data-network` / `data-from`) on a link, or call `track()` from `app/track.ts`.

**Real download numbers:** GitHub counts every `Fork.dmg` download, whether from the browser, the curl install, or in-app updates:

```bash
gh api repos/harshii0509/Fork/releases --jq '.[] | .tag_name + ": " + (.assets[] | select(.name=="Fork.dmg") | .download_count | tostring)'
```
