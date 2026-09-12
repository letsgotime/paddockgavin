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

## The three packages, settled a third time

Round two's $100 figure (two people, free drinks through the day, a
t-shirt and a hat) turned out to shortchange that tier once checked
against $75 on a per-person basis: $50 a head for fewer drinks and less
swag than the $75 ticket gets for $75. Caught and fixed the same day,
settled directly with Gavin in the Claude Code session:

- **$25**: tent access, two cocktails, and one swag item. Per ticket.
- **$75**: tent access, three cocktails, a t-shirt, and another swag item.
  Per ticket.
- **$100**: tent access for two people, three cocktails each (six total),
  and a t-shirt each (two total). This keeps $100 ahead of $75 on drinks
  and shirts per person, at a lower rate per head, which reads as a pair
  discount rather than a tier that quietly gives less for more.

Note: round two's hat is out. Gavin confirmed directly: "Hat's out for
now." The $100 tier is tent access for two, three cocktails each, and a
t-shirt each, nothing more.

Carried forward: drinks on all three tiers are **cocktails**, and the
non-drink inclusions are swag items (the $25 one should cost the event
nothing).

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
- Homepage: mentions "hospitality" twice, but both are the VIP room's
  hospitality language. The tent as its own named product is **not there**;
  add it in the secondary format above.
- Sponsor page: **no mention at all**. The loud and proud visual block is
  the gap this brief exists to close.
- Sales page, Stripe items, checkout kinds, map feature: **not built yet**.

## How it plugs into what exists

1. **Stripe**: three catalog items in `scripts/stripe-seed.mjs` under the
   existing convention: `ppr-2026-hospitality-25`, `ppr-2026-hospitality-75`,
   `ppr-2026-hospitality-100`, with matching kinds in
   `app/api/stripe/checkout/route.ts`. Neutral product names. The package
   shapes are settled enough to seed; only the swag item names are still
   open, and they do not block a price.
2. **A public sales page** for the three packages, in the concours register
   like the booth page (catalog item, checkout, receipt, desk email).
3. **The sponsor page block and homepage mention** described above.
4. **The map**: one `map_features` row once the spot is confirmed, placed
   through `/events/pistonpoweredranch/sitemap-review` (`/site-plan/edit`
   is gone, redirected there earlier this session).
5. **Run of show** carries the tent's hours if it has any.

## Open before it ships

1. The swag items: what the $25 tier's item and the $75 tier's second
   item actually are. The $100 tier is fully settled: two shirts, no
   hat, one per person.
2. Alcohol coverage: bar deal, license, liquor liability. This gates the
   "only non-VIP alcohol on the field" line everywhere.
3. The exact tent location on the site plan.
4. Charity confirmation: Mechanics on a Mission first (which also unlocks
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
