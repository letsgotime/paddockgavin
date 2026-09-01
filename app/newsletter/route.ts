import type { NextRequest } from "next/server"
import { previewResponse } from "@/lib/email/preview"

/**
 * The weekly letter, at an address a person can read out loud.
 *
 * Same document as /api/newsletter, which stays because that is where the
 * send lives. Nothing is sent from here under any method.
 */

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  return previewResponse(req)
}
