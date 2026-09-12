# The hospitality tent

Recorded 12 September 2026, from Mikal's dictation, as the working brief for
the next Claude Code session. The Piston Powered Ranch, Saturday October 10,
2026, 9am to 3pm, Rancho Jaramillo, Unionville TN. Four weeks out.

**Reconciliation note:** this file was independently written twice from the
same voice memo — once here, once by a separate Claude session (Claude
Fable 5) that committed it to `main`, verified and signed. This version is
that real one, restored as the base, with two genuine additions folded in
from the independent pass (marked where they appear) and one stale
reference corrected. An earlier version of this file on this branch cited
tent-rental figures that didn't match a specific vendor's rate card and
briefly, wrongly, treated the whole memo as unreliable before the real
`main` version turned up — that was a mistake in verification, not a fact
about the memo itself. Nothing in this file is invented; every open item
below is genuinely open, not guessed at.

## The decision

Add one hospitality tent. It sits near the food row and up against the show
field, and far enough from the VIP compound that the two never read as the
same product. VIP stays the premium room; the tent is the step between
general admission and VIP.

Dictated placement, verbatim intent: "near the food, probably on top of the
show cars, but far enough away from VIP." Confirm the exact spot on the site
plan before it lands on the public map.

## The three packages

- **$25**: hospitality tent access, two drinks, and one more small inclusion
  still to be named. Mikal's words: "something else we'll do for free," so
  the third item should cost the event nothing (a sticker, a koozie, a photo
  wall, name it and it ships).
- **$75**: tent access, a t-shirt, three drinks, and one more access
  inclusion still to be named (dictation cut off at "access to another...").
- **$100**: covers two people, with t-shirts and free drinks through the
  day. Whether that is one shirt or two was not said; confirm before copy.

Every package includes tent access. Nothing here touches free admission or
free car entry, anywhere, in any copy.

**Independent finding:** `meetingupdates` already had a *different* $25
tier drafted before this memo: "a $25 donation buys a t-shirt and a seat in
a limited hospitality tent, shade and better refreshments, capacity
capped... replaces the $20-after-100-cars idea." This memo's three-tier
structure moves the shirt up to $75. **Confirm the shirt has actually
moved off the $25 tier** rather than assuming the old draft's list still
applies to it. Relatedly, `meetingupdates` also has an open line — "Swag
budget: shirts and hats, under $750 to start" — worth checking against two
tiers now carrying a shirt (and $100 possibly needing two).

## The name

Build it first as the **Mechanics on a Mission Hospitality Tent**. They are
already primed as the charity partner and the car giveaway, so the tent
naming gives them a home on the field. The backup naming partner is
**Stars**, the Atlanta charity (exact organization name and spelling to
confirm), who Mikal is aiming at to underwrite the tent.

Build rule: the tent's partner name is one variable. It appears in page
copy, the map label, and event copy, and swaps without a rebuild. Stripe
product names stay neutral ("Hospitality Tent" plus the package) so a
naming change never touches the catalog.

**Independent finding:** `meetingupdates`'s own sponsor-target board
already has a `hospitality` category on file, predating this memo: "The
founding-partner ask. Oscar signs this one." That line names real
candidate sponsors for *staffing a table inside* the tent (a separate
question from naming the tent itself) — Hagerty and a bank, tied to the
open Collector insurance and Collector finance rows, described as getting
real time with "the $25 crowd, a self selected, more engaged audience."

## The money

- Target: **$5,000** from the tent, alongside **$9,000 from VIP** (Mikal's
  figures. **Done**: both are now rows in `revenue_items` (sort_order 4
  and 5). `kind` only allows `vendor | sponsor | other` at the database
  level, no `vip` or `hospitality` value, so both landed as `other`,
  distinguished by label. low_cents and high_cents are equal on both —
  single-point targets, not a range, since no range was given for either.
- Drink splits are in negotiation. Until the bar deal is signed, public copy
  stays generic about who pours and what a drink is. The budget already
  carries the bar vendor as TBD with liquor liability requirements
  (PaddockGavin and Rancho Jaramillo as additional insured).
- Cost context already in HQ's budget: a 20x40 tent runs about $500 a day
  (range 500 to 900) and a 40x60 about $2,000 a day (range 2,000 to 5,000),
  Nashville rates. The package math should clear the tent cost with room.
  (A separate, more specific source exists too: `lib/ranch/tent-rates.ts`,
  a real vendor's transcribed rate card — 20x40 at $400, 40x60 at
  $1,200-$1,300 depending on style. The two don't need to agree; one is a
  rough HQ planning range, the other one vendor's actual quote. Worth
  knowing both exist before citing either as *the* number.)
- The strategy, in Mikal's words: "this is a way for us to charge for cars
  and not charge for cars." The show stays free to enter and free to watch;
  the tent is the paid layer the car crowd can choose on their own.
- `200` at $25 was floated as a prospective purchase count in a follow-up
  note, with $75/$100 modeled as a realistic upsell drop-off underneath it
  (50 and 15) rather than a confirmed split — see the note this added to
  `RanchControlApp.tsx`'s revenue table for the exact modeled lines.

## How it plugs into what exists

1. **Stripe**: three catalog items in `scripts/stripe-seed.mjs` under the
   existing convention: `ppr-2026-hospitality-25`, `ppr-2026-hospitality-75`,
   `ppr-2026-hospitality-100`, with matching kinds in
   `app/api/stripe/checkout/route.ts`. Seed with the same idempotent script;
   the checkout route resolves by lookup key. Leave price/cents absent until
   Oscar approves — same hold, same mechanism already proven out on the VIP
   rooms this session.
2. **A public page** selling the three packages, in the concours register
   like the booth page, reachable on the ranch domain (the booth page's paid
   flow is the pattern: catalog item, checkout, receipt, desk email).
3. **HQ**: two new `revenue_items` rows in the existing shape (kind, label,
   low_cents, high_cents): hospitality at 500000 low, and VIP at 900000 low.
4. **The map**: one `map_features` row for the tent once the spot is
   confirmed. Placement happens through `/sitemap-review` — **not**
   `/site-plan/edit`, which was the old staff tracer; it's been retired and
   redirects to `/sitemap-review` as of this session, and the corner
   add/remove editing it used to offer now lives there too.
5. **Event copy**: the ranch homepage content (the events row in Neon)
   mentions the tent where food and VIP are described, and run of show
   carries its hours if it has any.
6. **Also already real and worth knowing about, not re-adding**: `targets`
   (`app/events/[event]/(tools)/targets/page.tsx`, the sponsor-outreach
   board) already has a `hospitality` domain. That's a name-and-status
   tracker, a different thing from `revenue_items`'s dollar tracking — both
   are real, neither duplicates the other, no gap to fill there.

## Open before it ships

1. The $25 package's third inclusion and the $75 package's extra access
   item.
2. One shirt or two on the $100 package.
3. The exact tent location on the site plan.
4. Charity confirmation: Mechanics on a Mission first (which also unlocks
   the held press kit sentence about the car giveaway), Stars of Atlanta
   name, spelling, and terms as the backup.
5. The drink split, and what "drinks" covers (beer and wine, cocktails,
   non-alcoholic), which drives both the license posture and the copy.
6. Whether the $25-tier shirt from the earlier `meetingupdates` draft has
   actually moved to $75, or that draft is simply superseded wholesale.

## Do not

- Do not touch free admission or free car entry.
- Do not put any charity's name into Stripe product names.
- Do not promise bar specifics in public copy until the split is signed.
- Do not blur the tent with VIP. The Terrace and The Owner's Table stay
  their own product at their own altitude.
- Do not place a `map_features` zone before the location is confirmed —
  guessing a polygon risks overlapping the show field or an existing zone.
