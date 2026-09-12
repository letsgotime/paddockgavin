# Hospitality tent

Recorded from Gavin's own voice memo, 11 September 2026, cross-checked against
what was already on record in `meetingupdates` and `targets` before this file
existed. Nothing below is invented: where the dictation was unclear or where
it conflicts with an earlier draft, that is called out explicitly rather than
resolved by guessing. A prior AI-generated summary of this same memo claimed
this file already existed with specific tent-rental cost figures ($500/day
for a 20x40, $2,000/day for a 40x60) — it did not exist, and those figures do
not match the real rate card at `lib/ranch/tent-rates.ts` (Franklin's sheet:
20x40 runs $400, 40x60 runs $1,200-$1,300 depending on style). Treat that
summary as unreliable; this file replaces it.

## What it is

A hospitality tent, ticketed, three packages. Distinct from the VIP rooms
(Terrace/Owner's Table) and from general admission, which stays free. In
Gavin's own words: "a way for us to charge for cars and not charge for cars."

**This supersedes an earlier draft**, not just adds to it. `meetingupdates`
already had a single $25 tier drafted: "a $25 donation buys a t-shirt and a
seat in a limited hospitality tent, shade and better refreshments, capacity
capped... replaces the $20-after-100-cars idea." Today's dictation is three
tiers, and moves the t-shirt from the $25 tier up to the $75 tier. **Confirm
with Gavin that the shirt has actually moved**, rather than assuming the old
draft's inclusion list still applies to the new $25 tier.

## Location

Gavin's words, verbatim, because the dictation was genuinely unclear here:
"near the food, um, I guess, probably on top of the show cars is what I'm
thinking... So near the food, but so far enough away from VIP." The "on top
of the show cars" phrase does not resolve into a coherent site-plan
instruction as spoken — it may have been a self-correction that trailed off.

**Confirmed intent:** near the food row, clearly separated from VIP so the
two never blur into each other.
**Not confirmed:** whether it sits on, beside, or away from the show field
itself.

Do not place a `map_features` zone for this until Gavin confirms the actual
spot against the real site plan (`/sitemap-review`). Guessing a polygon here
risks conflicting with the show field or an existing zone.

## The three packages

| Tier | Includes | Open item |
|---|---|---|
| $25 | Tent access, two drinks, + one more inclusion | Gavin: "something else will do for free" — read as: a third inclusion that costs the event nothing to provide. Not named. Do not invent one. |
| $75 | T-shirt, three drinks, tent access, + one more inclusion | Gavin: "access another... a thing" — the dictation cuts off here. Genuinely unknown, not a placeholder for something implied. |
| $100 | T-shirt, unlimited/free drinks, covers **two people** | Unclear whether "covers two people" means two shirts or one shared shirt. Also unclear whether "free drinks" at this tier differs from "three drinks" at $75 in practice (unlimited vs. a set count). |

Cross-check against the real swag budget before locking in shirts for two
tiers: `meetingupdates` already has "Swag budget: shirts and hats, under $750
to start. Need a vendor and a quality bar" as an open line. Two tiers with a
shirt (and the $100 tier possibly needing two) changes that math meaningfully
before deciding how many people can actually be sold this package.

## Naming and sponsorship

Two names in play, not yet decided between:

- **Mechanics on a Mission** — Gavin's stated starting point: "they have
  them pretty much prime to give away a car," meaning this partner is
  already lined up for the live car giveaway, so pairing the tent under the
  same name is a natural fit. This is also a name already established
  elsewhere in this event's content (the car giveaway act).
- **STARS (Atlanta)** — a charity Gavin named as a second option, described
  as "the backup."

Separately, `meetingupdates`'s own sponsor-target board already has a
`hospitality` category on file: **"The founding-partner ask. Oscar signs
this one."** That line predates today's dictation and names real candidate
sponsors for staffing a table inside the tent (not the same as naming the
tent) — Hagerty and a bank, tied to the open Collector insurance and
Collector finance rows. Whoever backs the tent gets real time with what that
note calls "the $25 crowd, a self selected, more engaged audience."

**Build rule:** whichever name is finally confirmed, keep it as a single
swappable value (a constant or a CMS/content field), never hardcoded into
Stripe product names, checkout copy, or the catalog keys below. A sponsor
change should never require touching the payment plumbing.

**Do not publicly announce or imply either name is confirmed** until Oscar
signs off — same standing rule as the VIP pricing hold and the unannounced
live-music headliner.

## The money

- Tent target: **$5,000**.
- VIP target: **$9,000** — this checks out against the real catalog: 20
  Terrace seats at $249 + 10 Owner's Table seats at $399 = $8,970, so
  Gavin's number is grounded in the actual sell-out math, not a round guess.
- Drink sales split with whoever supplies the bar: **still being
  negotiated**. Do not put any specific split, vendor name, or drink-pricing
  detail into public copy until that's settled — same handling as any other
  undecided commercial term on this event.

## What's already real and shouldn't be re-invented

- `targets` (the sponsor-target board, `app/events/[event]/(tools)/targets/page.tsx`)
  already has a `hospitality` domain (`#9B7FE0`, "Food, drink and the hosted
  areas"). No new domain needs adding there. It does **not** have a separate
  `vip` domain — worth asking Gavin whether VIP tracking belongs under
  `sponsor` or needs its own line, rather than assuming either way.
- Tent rental cost reality lives at `lib/ranch/tent-rates.ts`, Franklin's
  real rate card (270 772 1122). It is vendor cost, gated behind
  `can_see_money()`, and must stay that way — reference the file, do not
  copy its figures into any public-facing surface.
- `lib/ranchcontrol/data.ts` already budgets "twenty tables for hospitality"
  into the banquet-table count. Worth checking this still makes sense once
  a real capacity number exists for the tent.

## Wiring, once the open items above are answered

Follow the existing catalog conventions in `lib/stripe/catalog.ts` exactly —
they were written for precisely this situation (an item that's structurally
ready but not yet priced or approved):

1. Three new `CatalogItem` entries under `pistonpoweredranch`, `ledger:
   "other"` (or a new `"hospitality"` ledger value if that reads better
   against the existing `vendor_setup | sponsorship | vip | other` set —
   Claude Code's call at build time), `audience: "public"`.
2. Lookup keys following the house pattern: `ppr-2026-hospitality-25`,
   `ppr-2026-hospitality-75`, `ppr-2026-hospitality-100`.
3. Leave `priceId`/`cents` absent until Oscar approves, exactly like the VIP
   rooms were held pending approval — same hold, same mechanism, already
   proven out this session.
4. A public sales page, modeled on the existing booth-purchase flow
   (`app/events/pistonpoweredranch/vendor/booth/BoothPicker.tsx` is the
   closest existing pattern: footprint cards, a price that reads TBD until
   `isOnSale()` is true).
5. Once the location is confirmed: a `map_features` zone, not before.
6. A homepage mention — likely as a new `act` (matching the existing acts
   pattern already on the page) or folded into the VIP act's neighboring
   content, once naming and packages are locked.
7. Revenue tracking: confirm with Gavin whether hospitality/VIP need their
   own rows in whatever revenue view he's picturing, since `targets` already
   has hospitality as a category — this may already be enough, or he may
   want a dedicated dollar-tracking surface distinct from `targets`'
   name-and-status tracking. Don't assume which.

## Open questions (answer any of these and the brief updates)

1. $25 tier's third inclusion — what is it, given it must cost the event
   nothing?
2. $75 tier's fourth inclusion — the dictation cut off mid-sentence.
3. $100 tier — one shirt covering two people, or two shirts?
4. Exact tent placement on the real site plan.
5. Mechanics on a Mission vs. STARS (Atlanta) — which one, and has either
   actually said yes yet?
6. Drink-sale split terms, once negotiated.
7. Does VIP need its own `targets` domain, or does it sit under `sponsor`?
