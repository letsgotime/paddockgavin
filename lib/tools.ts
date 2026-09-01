/**
 * The toolset, defined once.
 *
 * There were five lists of what tools exist: the rail on the tools site, the
 * rail in the CRM, the roles sheet, and two more that only needed the names.
 * They drifted, as five copies do. The CRM rail called the property Grounds
 * while the roles sheet called it Map; one said Budget and the other Planning;
 * one said The Ledger and the other Journeys. Worse, the CRM rail was written
 * from what the CRM would eventually have rather than what it has, so eight of
 * its ten entries answered 404.
 *
 * One list, with a flag for which deployment holds each surface. A tool moves
 * into the CRM by changing `where` from "tools" to "crm", in one place, and
 * every menu follows.
 */

export type Where = "crm" | "tools"

export interface Tool {
  key: string
  /** What it is called, everywhere it is named. */
  label: string
  /** The half line under the label. Lower case, no full stop. */
  note: string
  /** Which deployment serves it today. */
  where: Where
  /** A segment under /events/[slug]/ when crm, an absolute path when tools. */
  path: string
  /** An SVG path, drawn on a 24 by 24 grid with stroke, no fill. */
  icon: string
  /** Cost and margin. can_see_money() decides who is shown this. */
  money?: boolean
}

/** The tools deployment, which still holds most of the toolset. */
export const TOOLS_ORIGIN = "https://piston-powered-ranch.vercel.app"

export const TOOLS: Tool[] = [
  { key: "hq", label: "HQ", note: "where the day stands", where: "crm", path: "hq",
    icon: "M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" },

  { key: "journeys", label: "Journeys", note: "the whole plan", where: "tools", path: "/journeys/",
    icon: "M4 19h16 M4 19V5 M8 15l4-5 3 3 4-6" },

  { key: "ledger", label: "The Ledger", note: "money in and out", where: "tools", path: "/journeys/#ledger",
    icon: "M4 5h16M4 12h16M4 19h10", money: true },

  { key: "entries", label: "Entries queue", note: "cars, vendors and sponsors", where: "tools", path: "/console/#/ops",
    icon: "M4 6h16 M4 12h16 M4 18h9 M18 16l2 2 3-4" },

  { key: "targets", label: "Targets", note: "who we are chasing", where: "crm", path: "targets",
    icon: "M12 3v18 M3 12h18 M12 7a5 5 0 100 10 5 5 0 000-10z" },

  { key: "board", label: "The Board", note: "decisions waiting on a person", where: "tools", path: "/board/",
    icon: "M4 4h6v7H4z M14 4h6v11h-6z M4 15h6v5H4z M14 19h6" },

  { key: "asks", label: "The Asks", note: "what we need from other people", where: "tools", path: "/asks/",
    icon: "M9 6h11 M9 12h11 M9 18h11 M4 6h.01 M4 12h.01 M4 18h.01" },

  { key: "crew", label: "Crew", note: "volunteers, shifts and posts", where: "tools", path: "/crew/",
    icon: "M17 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9.5 6.5a3 3 0 106 0 3 3 0 00-6 0" },

  { key: "awards", label: "The Awards", note: "classes, judges and ballots", where: "tools", path: "/judging/",
    icon: "M8 4h8v5a4 4 0 01-8 0z M12 13v4 M9 21h6 M5 5h3 M16 5h3" },

  { key: "map", label: "Map", note: "the property", where: "tools", path: "/map/",
    icon: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z M9 4v14 M15 6v14" },

  { key: "siteplan", label: "Site plan", note: "where it all sits on the day", where: "tools", path: "/site-plan/",
    icon: "M4 4h16v16H4z M4 10h16 M10 10v10" },

  { key: "rsvps", label: "Spectators", note: "who is coming, and how many", where: "tools", path: "/rsvps/",
    icon: "M16 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M9 6.5a3 3 0 106 0 3 3 0 00-6 0 M19 8v6 M22 11h-6" },

  { key: "planning", label: "Planning", note: "jobs, dates and cost", where: "tools", path: "/console/planning/",
    icon: "M3 6h18v12H3z M3 10h18 M7 14h4", money: true },

  { key: "collateral", label: "Collateral", note: "what to send people who ask", where: "tools", path: "/collateral/",
    icon: "M4 4h11l5 5v11H4z M15 4v5h5 M8 13h8 M8 17h5" },

  { key: "brand", label: "Brand kit", note: "logos, colours and type", where: "tools", path: "/brand/rancho/",
    icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5" },

  { key: "chat", label: "Chat", note: "the team, day to day", where: "tools", path: "/chat/",
    icon: "M21 11.5a8.4 8.4 0 01-9 8.4 9.9 9.9 0 01-3.8-.7L3 21l1.9-4.9A8.3 8.3 0 013.6 11.5a8.4 8.4 0 019-8.4 8.4 8.4 0 019 8.4z" },
]

const BY_KEY = new Map(TOOLS.map((t) => [t.key, t]))

export function tool(key: string): Tool | undefined {
  return BY_KEY.get(key)
}

/** Where a tool actually lives right now. */
export function toolHref(t: Tool, slug: string): string {
  return t.where === "crm" ? `/events/${slug}/${t.path}` : TOOLS_ORIGIN + t.path
}

/** The order the CRM rail shows them in. */
export const RAIL: string[] = [
  "hq", "journeys", "ledger", "entries", "targets", "board",
  "asks", "crew", "awards", "map", "siteplan", "rsvps", "planning", "chat",
]

/**
 * What each role sees first.
 *
 * Nothing is hidden by this, only ranked: every tool stays reachable from every
 * page. At six in the morning on the tenth somebody will need a page that is
 * not theirs, and a menu that hid it would be a menu they route around.
 */
export const FOCUS: Record<string, string[]> = {
  Owner: ["journeys", "entries", "targets", "board", "planning", "chat"],
  "Property Owner": ["journeys", "map", "siteplan", "crew", "rsvps", "chat"],
  "Brand Director": ["targets", "entries", "collateral", "brand", "asks", "chat"],
  Member: ["targets", "crew", "board", "asks", "chat"],
}

/** The tools a role leads with, resolved and in order. */
export function focusFor(role: string): Tool[] {
  return (FOCUS[role] ?? FOCUS.Member).map((k) => BY_KEY.get(k)).filter((t): t is Tool => Boolean(t))
}
