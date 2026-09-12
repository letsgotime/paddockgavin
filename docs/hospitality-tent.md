# The hospitality tent

Recorded 12 September 2026 from Mikal's dictation, revised the same day
from his second pass, and once more from a third pass settled directly
with Gavin in the Claude Code session. Working brief for the next Claude
Code session. The Piston Powered Ranch, Saturday October 10, 2026, 9am to
3pm, Rancho Jaramillo, Unionville TN. Four weeks out.

## What it is

One hospitality tent: an upscale, shaded, general admission room. It sits
near the food row and up against the show field, and far enough from the VIP
compound that the two never read as the same product. Bigger and nicer than
anything else a general admission guest can step into, a place to get out of
the heat and hang out. As of now it is planned as the only place on the
field where alcohol is served to guests who are not VIP, and that holds only
once it is covered (bar deal, license, liquor liability), so public copy
stays soft on the exclusivity until it is signed.

Dictated placement, verbatim intent: "near the food, probably on top of the
show cars, but far enough away from VIP." Confirm the exact spot on the site
plan before it lands on the public map.

## Sell the sponsorship on the site

This is the round two headline, the thing we are missing. The tent's
sponsorship is for sale to a vendor, a charity, or a sponsor, and the site
barely says so.

- **The sponsor page** gets a high end visual block for the tent, loud and
  proud: photo led, premium, in the concours register, sitting with the
  sponsor tiers. Not a text line. This is the enticement piece.
- **The homepage** carries it in a secondary format: present, clickable,
  pointing at the sponsor page block, never competing with the hero or with
  VIP.
- **The pitch the block makes**, in substance: the tent's sponsor staffs it
  with their own employees and their own team, with their products in the
  room, and what they buy is a slower, better interaction with the public
  than any booth ever gets, with their name on the tent all day. If
  Mechanics on a Mission takes it, they bring a couple of their cars into
  the tent (the dictation cut off right there; confirm what follows the
  cars before that detail prints).

The visual itself sits beside this brief: `docs/PPR_HospitalityTent_Sponsor.jpg`,
rendered from the house type, the official marks and the ranch's own field
photograph (`public/images/ranch/ppr-field.webp`). It is the design
reference for the sponsor page block and is shaped for outreach. Build the
page block itself as live text over the same photograph rather than
embedding the bitmap, so the copy stays readable to search. Note: the
bitmap's $100 chip still shows round two's contents; it re-renders the
moment the third-pass packages are confirmed as final.

## The three packages, settled a third time

Round two's $100 figure (two people, free drinks through the day, a
t-shirt and a hat) turned out to shortchange that tier once checked
against $75 on a per-person basis: $50 a head for fewer drinks and less
swag than the $75 ticket gets for $75. Caught and fixed the same day,
settled directly with Gavin in the Claude Code session:

- **$25**: tent access, two cocktails, and a raffle ticket for the day's
  raffle. No product, no fulfilment, an allocation into a slot already
  on the run of show, which is the only way to genuinely cost the event
  nothing. Per ticket.
- **$75**: tent access, three cocktails, a t-shirt, and the Ranch Bottle
  (the insulated steel one already in `lib/shop/catalogue.ts` at $24.99,
  made to order, no stock to hold). Picked over the Field Parasol,
  the shop's other shade-relief item, because a bottle is easier to
  carry around a car show all day. Per ticket.
- **$100**: tent access for two people, three cocktails each (six total),
  and a t-shirt each (two total). This keeps $100 ahead of $75 on drinks
  and shirts per person, at a lower rate per head, which reads as a pair
  discount rather than a tier that quietly gives less for more.

Note: round two's hat is out. Gavin confirmed directly: "Hat's out for
now." The $100 tier is tent access for two, three cocktails each, and a
t-shirt each, nothing more.

Carried forward: drinks on all three tiers are **cocktails**.

Ruled out on purpose: the PG Trucker in the same shop catalogue is
PaddockGavin-branded (amber PG monogram on navy), not Rancho Jaramillo's.
Handing it out as tent swag would be the cross-brand leak scrubbed
everywhere else on the ranch site tonight, price aside.

Every package includes tent access. Nothing here touches free admission or
free car entry, anywhere, in any copy.

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

## The money

- Target: **$5,000** from the tent, alongside **$9,000 from VIP**. Both
  rows are in HQ's revenue sheet now (added after round one).
- Drink splits are in negotiation. Until the bar deal is signed, public copy
  stays generic about who pours and what a cocktail is. The budget already
  carries the bar vendor as TBD with liquor liability requirements
  (PaddockGavin and Rancho Jaramillo as additional insured).
- Cost context already in HQ's budget: a 20x40 tent runs about $500 a day
  (range 500 to 900) and a 40x60 about $2,000 a day (range 2,000 to 5,000),
  Nashville rates. The package math should clear the tent cost with room.
- The strategy, in Mikal's words: "this is a way for us to charge for cars
  and not charge for cars." The show stays free to enter and free to watch;
  the tent is the paid layer the car crowd can choose on their own.

## Where the build stands, checked 12 September

- HQ revenue rows: **done**. "VIP (Terrace + Owner's Table)" at $9,000 and
  "Hospitality Tent" at $5,000 are in revenue_items.
- Sponsor page block and homepage secondary mention: **done**, shipped
  the same night this pass of the brief was written. The homepage's VIP
  copy also had its own "shaded tent" language fixed, since it was
  reading as the same product as this one.
- Sales page, Stripe items, checkout kinds, map feature: **not built
  yet**. The package shapes below are now settled enough to build all
  four against.

## How it plugs into what exists

1. **Stripe**: three catalog items in `scripts/stripe-seed.mjs` under the
   existing convention: `ppr-2026-hospitality-25`, `ppr-2026-hospitality-75`,
   `ppr-2026-hospitality-100`, with matching kinds in
   `app/api/stripe/checkout/route.ts`. Neutral product names. All three
   packages are fully settled now, swag items included; nothing here
   blocks seeding real prices.
2. **A public sales page** for the three packages, in the concours register
   like the booth page (catalog item, checkout, receipt, desk email).
3. **The sponsor page block and homepage mention** described above.
   **Done.**
4. **The map**: one `map_features` row once the spot is confirmed, placed
   through `/events/pistonpoweredranch/sitemap-review` (`/site-plan/edit`
   is gone, redirected there earlier this session).
5. **Run of show** carries the tent's hours if it has any.

## Open before it ships

All three packages are fully settled: drinks, swag, and headcount. What
is left is not the packages themselves.

1. Alcohol coverage: bar deal, license, liquor liability. This gates the
   "only non-VIP alcohol on the field" line everywhere.
2. The exact tent location on the site plan.
3. Charity confirmation: Mechanics on a Mission first (which also unlocks
   the held press kit sentence about the car giveaway), Stars of Atlanta
   name, spelling, and terms as the backup. And the end of the sentence
   about MoM's "couple of cars" in the tent.

## Do not

- Do not touch free admission or free car entry.
- Do not put any charity's name into Stripe product names.
- Do not print the alcohol exclusivity, or any bar specifics, until the
  deal is signed and covered.
- Do not blur the tent with VIP. The Terrace and The Owner's Table stay
  their own product at their own altitude, and the sponsor page block sells
  the tent to sponsors while VIP keeps selling seats to guests.

---

## Merge note, 2026-09-12

This file was edited independently on `main` and on `release` and diverged. The version above is the `main` side, which read as the more advanced pass (settled directly with Gavin, more items marked done). The `release` side had its own findings not repeated above and worth checking before treating this as final:

<details><summary>release-side block 1</summary>

```
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
```

</details>

<details><summary>release-side block 2</summary>

```
## The three packages

- **$25**: hospitality tent access, two drinks, and one more small inclusion
  still to be named. Mikal's words: "something else we'll do for free," so
  the third item should cost the event nothing (a sticker, a koozie, a photo
  wall, name it and it ships).
- **$75**: tent access, a t-shirt, three drinks, and one more access
  inclusion still to be named (dictation cut off at "access to another...").
- **$100**: covers two people, with t-shirts and free drinks through the
  day. Whether that is one shirt or two was not said; confirm before copy.
```

</details>

<details><summary>release-side block 3</summary>

```
**Independent finding:** `meetingupdates` already had a *different* $25
tier drafted before this memo: "a $25 donation buys a t-shirt and a seat in
a limited hospitality tent, shade and better refreshments, capacity
capped... replaces the $20-after-100-cars idea." This memo's three-tier
structure moves the shirt up to $75. **Confirm the shirt has actually
moved off the $25 tier** rather than assuming the old draft's list still
applies to it. Relatedly, `meetingupdates` also has an open line — "Swag
budget: shirts and hats, under $750 to start" — worth checking against two
tiers now carrying a shirt (and $100 possibly needing two).
```

</details>

<details><summary>release-side block 4</summary>

```
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
```

</details>

<details><summary>release-side block 5</summary>

```
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
```

</details>

<details><summary>release-side block 6</summary>

```
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
```

</details>

<details><summary>release-side block 7</summary>

```
- Do not promise bar specifics in public copy until the split is signed.
- Do not blur the tent with VIP. The Terrace and The Owner's Table stay
  their own product at their own altitude.
- Do not place a `map_features` zone before the location is confirmed —
  guessing a polygon risks overlapping the show field or an existing zone.
```

</details>
