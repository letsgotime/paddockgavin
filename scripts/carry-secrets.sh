#!/usr/bin/env bash
# Carries the four variables the ranch tools need from the old deployment to
# this one, without printing them and without anybody retyping them.
#
#   ./scripts/carry-secrets.sh
#
# What it moves, and why each one matters:
#
#   RANCH_DATABASE_URL     the auth server's own connection. Not
#                          CRM_DATABASE_URL, which is the narrow crm_app role
#                          and deliberately cannot touch the neon_auth tables.
#   BETTER_AUTH_SECRET     must be the SAME value, not a new one. The signing
#                          key in neon_auth.jwks is encrypted with it, so a
#                          fresh secret cannot decrypt the existing key: every
#                          session breaks and sign in stops. This is the exact
#                          failure this estate lost a day to on 3 September.
#   BLOB_READ_WRITE_TOKEN  the private media store the uploads write to and the
#                          signer reads from. Same store, same files.
#
# What it does NOT move: TURNSTILE_SECRET. The value over there is not a key
# Cloudflare accepts, and setting it here would close the door on everybody.
#
# It also sets TURNSTILE_HOSTNAMES, which is not a secret: it is the list of
# hostnames Cloudflare is allowed to have solved the challenge on.
#
# Values are pulled into a file in a private temporary directory, used, and
# shredded. Nothing is echoed. Run it from this repository.

set -euo pipefail

HUB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="${TOOLS_DIR:-$HOME/Desktop/piston-powered-ranch}"
# TURNSTILE_SECRET is deliberately NOT in this list. The value on the old
# project is eleven characters, does not begin with 0x, and Cloudflare answers
# invalid-input-secret when it is used. Carrying it would switch the human
# check on with a key that always fails, which refuses every genuine vendor,
# sponsor and entrant. Get the real secret from the Cloudflare dashboard,
# beside the site key 0x4AAAAAAEkdaaU0WCZzdgGE, and add it by hand.
CARRY=(RANCH_DATABASE_URL BETTER_AUTH_SECRET BLOB_READ_WRITE_TOKEN)
HOSTNAMES="pistonpoweredranch.com,www.pistonpoweredranch.com,paddockgavin.com,www.paddockgavin.com"

command -v vercel >/dev/null || { echo "The Vercel CLI is not installed. npm i -g vercel"; exit 1; }
[ -d "$TOOLS_DIR/.vercel" ] || { echo "Cannot find the old project at $TOOLS_DIR. Set TOOLS_DIR and run again."; exit 1; }
[ -d "$HUB_DIR/.vercel" ] || { echo "This repository is not linked. Run: vercel link"; exit 1; }

TMP="$(mktemp -d)"
chmod 700 "$TMP"
cleanup() {
  if [ -f "$TMP/tools.env" ]; then
    command -v shred >/dev/null && shred -u "$TMP/tools.env" 2>/dev/null || rm -f "$TMP/tools.env"
  fi
  rm -rf "$TMP"
}
trap cleanup EXIT INT TERM

echo "Reading the old project's production variables."
( cd "$TOOLS_DIR" && vercel env pull "$TMP/tools.env" --environment=production --yes >/dev/null 2>&1 )
[ -s "$TMP/tools.env" ] || { echo "Nothing came back. Are you signed in? Try: vercel login"; exit 1; }

value_of() {
  # The pulled file is KEY="value". Read it without letting it reach the screen.
  sed -n "s/^$1=//p" "$TMP/tools.env" | head -1 | sed -e 's/^"//' -e 's/"$//'
}

cd "$HUB_DIR"
moved=0
for name in "${CARRY[@]}"; do
  v="$(value_of "$name")"
  if [ -z "$v" ]; then
    echo "  $name: not set on the old project, skipped"
    continue
  fi
  # Replace rather than duplicate: Vercel keeps both otherwise and the build
  # picks one of them, which is a coin toss nobody wants on a signing secret.
  vercel env rm "$name" production --yes >/dev/null 2>&1 || true
  printf '%s' "$v" | vercel env add "$name" production >/dev/null 2>&1
  unset v
  echo "  $name: carried across"
  moved=$((moved + 1))
done

vercel env rm TURNSTILE_HOSTNAMES production --yes >/dev/null 2>&1 || true
printf '%s' "$HOSTNAMES" | vercel env add TURNSTILE_HOSTNAMES production >/dev/null 2>&1
echo "  TURNSTILE_HOSTNAMES: set to $HOSTNAMES"

echo
echo "$moved of ${#CARRY[@]} carried. They take effect on the next production build."
echo
echo "Do NOT run 'vercel --prod' here: that ships whatever branch this clone is"
echo "on, straight past the release branch. Instead, in vercel.com open the"
echo "paddockgavin project, Deployments, the top Production row, the three dots,"
echo "Redeploy, and leave 'Use existing build cache' unticked."
echo
echo "Then the build log should read:"
echo "    [ranch] every ranch endpoint is served by this deployment"
echo
echo "If it still names auth, upload or media, one of the four did not land."
