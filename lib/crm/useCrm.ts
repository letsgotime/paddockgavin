"use client"

import { useCallback, useEffect, useState } from "react"
import {
  canSeeMoney,
  ensureProfile,
  eventBySlug,
  isStaff,
  whoAmI,
  type EventRow,
  type Profile,
} from "./client"

export type CrmState = {
  /** null while the first check is in flight, then true or false */
  staff: boolean | null
  money: boolean
  me: string
  profile: Profile | null
  event: EventRow | null
  /** the slug asked for resolved to nothing, which is a 404 not a permission problem */
  unknownEvent: boolean
  refresh: () => Promise<void>
}

/**
 * Everything a CRM surface needs to know before it draws: who you are, whether
 * you are staff, whether you are allowed to see money, and which event this
 * route is about.
 *
 * Deliberately one hook rather than four. Each surface used to run its own
 * is_staff() plus its own me() plus its own profile fetch, which is three round
 * trips per page and drifted between pages. This runs once per navigation.
 */
export function useCrm(slug: string): CrmState {
  const [staff, setStaff] = useState<boolean | null>(null)
  const [money, setMoney] = useState(false)
  const [me, setMe] = useState("")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [event, setEvent] = useState<EventRow | null>(null)
  const [unknownEvent, setUnknownEvent] = useState(false)

  const refresh = useCallback(async () => {
    // The event is public information, so it is read before any auth check and
    // a signed out visitor still gets a real name on the sign in screen.
    const ev = await eventBySlug(slug)
    setEvent(ev)
    setUnknownEvent(ev === null)

    const ok = await isStaff()
    setStaff(ok)
    if (!ok) {
      setMe("")
      setProfile(null)
      setMoney(false)
      return
    }
    setMe(await whoAmI())
    setMoney(await canSeeMoney())
    setProfile(await ensureProfile())
  }, [slug])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { staff, money, me, profile, event, unknownEvent, refresh }
}
