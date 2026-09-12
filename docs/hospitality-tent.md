# The hospitality tent

Recorded 12 September 2026, from Mikal's dictation, as the working brief for
the next Claude Code session. The Piston Powered Ranch, Saturday October 10,
2026, 9am to 3pm, Rancho Jaramillo, Unionville TN. Four weeks out.

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

- Target: **$5,000** from the tent, alongside **$9,000 from VIP** (Mikal's
  figures. HQ's revenue sheet currently has no VIP or hospitality line, so
  add both rows and the sheet will finally show what he is pointing at).
- Drink splits are in negotiation. Until the bar deal is signed, public copy
  stays generic about who pours and what a drink is. The budget already
  carries the bar vendor as TBD with liquor liability requirements
  (PaddockGavin and Rancho Jaramillo as additional insured).
- Cost context already in HQ's budget: a 20x40 tent runs about $500 a day
  (range 500 to 900) and a 40x60 about $2,000 a day (range 2,000 to 5,000),
  Nashville rates. The package math should clear the tent cost with room.
- The strategy, in Mikal's words: "this is a way for us to charge for cars
  and not charge for cars." The show stays free to enter and free to watch;
  the tent is the paid layer the car crowd can choose on their own.

## How it plugs into what exists

1. **Stripe**: three catalog items in `scripts/stripe-seed.mjs` under the
   existing convention: `ppr-2026-hospitality-25`, `ppr-2026-hospitality-75`,
   `ppr-2026-hospitality-100`, with matching kinds in
   `app/api/stripe/checkout/route.ts`. Seed with the same idempotent script;
   the checkout route resolves by lookup key.
2. **A public page** selling the three packages, in the concours register
   like the booth page, reachable on the ranch domain (the booth page's paid
   flow is the pattern: catalog item, checkout, receipt, desk email).
3. **HQ**: two new `revenue_items` rows in the existing shape (kind, label,
   low_cents, high_cents): hospitality at 500000 low, and VIP at 900000 low.
4. **The map**: one `map_features` row for the tent once the spot is
   confirmed; the site-plan tracer at `/site-plan/edit` places it on the
   aerial.
5. **Event copy**: the ranch homepage content (the events row in Neon)
   mentions the tent where food and VIP are described, and run of show
   carries its hours if it has any.

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

## Do not

- Do not touch free admission or free car entry.
- Do not put any charity's name into Stripe product names.
- Do not promise bar specifics in public copy until the split is signed.
- Do not blur the tent with VIP. The Terrace and The Owner's Table stay
  their own product at their own altitude.
