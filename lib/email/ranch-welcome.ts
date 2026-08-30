import type { RanchEmail, Block } from "./ranch"

/**
 * The welcome email for the five people who run the day.
 *
 * Two things it is careful about.
 *
 * Money. public.can_see_money() admits Property Owner, Owner and Brand Director
 * only, so Arnie and Josh see the Ledger with its money columns withheld. The
 * email says so plainly rather than promising a view they will not get, because
 * a half redacted page reads as broken unless somebody told you first.
 *
 * Names. The hamburger renders a pill that says "Team", so this calls it Team.
 * Inventing a nicer word for the email would mean the instructions and the
 * screen disagree on the first thing a new person looks for.
 */

const TOOLS = "https://piston-powered-ranch.vercel.app"

export interface WelcomeVars {
  name: string
  /** Property Owner, Owner and Brand Director see cost. Members do not. */
  seesMoney: boolean
  /** The address they sign in with, which is not always the one they expect. */
  signInEmail: string
}

export function welcomeEmail(v: WelcomeVars): RanchEmail & { subject: string; from: string } {
  const first = v.name.trim().split(/\s+/)[0] || "there"

  const blocks: Block[] = [
    { kind: "lead", text: `${first}, everything for the tenth of October now lives in one place, and you have an account.` },

    {
      kind: "p",
      text: "Sign in with the address below. There is no separate password to remember for this: the account is the one you already use, and signing in sends you a link or accepts your Google login.",
    },
    {
      kind: "links",
      rows: [
        {
          label: "Sign in",
          url: `${TOOLS}/hq`,
          note: `Sign in as ${v.signInEmail}. If it does not recognise you, tell Gavin rather than making a second account.`,
        },
      ],
    },

    { kind: "rule" },

    {
      kind: "p",
      text: "Once you are in, everything is behind one control. Bottom left of every page there is a pill marked Team. Press it and the whole toolset slides out: thirteen places, each with a count on it when something is waiting for you. That pill is on every page, so you never need the back button to get somewhere else.",
    },

    {
      kind: "p",
      text: "Start in two places, in this order.",
    },
    {
      kind: "links",
      rows: [
        {
          label: "First: Chat",
          url: `${TOOLS}/chat/`,
          note: "Say you are in. It is how we know you got here, and it is where the day to day happens. Photographs, video, voice notes and documents all attach, and everything you send is filed against your name.",
        },
        {
          label: "Second: Targets",
          url: `${TOOLS}/targets/`,
          note: "Who we are chasing, and where each one stands. This is the work. If you only open one thing between now and October, open this.",
        },
      ],
    },

    { kind: "rule" },

    {
      kind: "p",
      text: v.seesMoney
        ? "The Ledger is the whole plan on one page: every job, what it costs, what has been paid and what is still owed. You are one of three people who see the money columns."
        : "The Ledger is the whole plan on one page: every job, who owns it and where it stands. The money columns are held back to Oscar, Gavin and Bekah, so you will see the work without the costs. That is deliberate rather than a fault.",
    },
    {
      kind: "links",
      rows: [
        { label: "The Ledger", url: `${TOOLS}/journeys/`, note: "The whole plan, every job, in order." },
        { label: "Console", url: `${TOOLS}/console/`, note: "Entries, accounts, the run of show." },
        { label: "The Board", url: `${TOOLS}/board/`, note: "Decisions waiting on a person." },
        { label: "The Asks", url: `${TOOLS}/asks/`, note: "What we need from other people." },
        { label: "Crew", url: `${TOOLS}/crew/`, note: "Volunteers, shifts and posts." },
        { label: "Spectators", url: `${TOOLS}/rsvps/`, note: "Who is coming, and how many that really is." },
        { label: "The Awards", url: `${TOOLS}/judging/`, note: "Classes, judges and ballots." },
        { label: "Map", url: `${TOOLS}/map/`, note: "The property." },
        { label: "Site plan", url: `${TOOLS}/site-plan/`, note: "Where everything sits on the day." },
        { label: "Collateral", url: `${TOOLS}/collateral/`, note: "What to send people who ask." },
        { label: "Brand kit", url: `${TOOLS}/brand/rancho/`, note: "Logos, colours and type. Use these rather than anything from a search." },
      ],
    },

    { kind: "rule" },

    {
      kind: "p",
      text: "One last thing, and it is the one that matters most outside these walls. Whoever you are talking to, spectator, vendor or sponsor, you give them one address and nothing else. It carries the date, the entry form, the stall enquiry and the partner enquiry, and it is the only link that will still be correct in a month.",
    },
    {
      kind: "links",
      rows: [
        {
          label: "The only link you give out",
          url: "https://pistonpoweredranch.com",
          note: "Not a form link, not a Google Doc, not a screenshot of the flyer. This one, every time.",
        },
      ],
    },
  ]

  return {
    from: "The Piston Powered Ranch <hello@pistonpoweredranch.com>",
    subject: "You are in. Everything for 10 October, in one place",
    preheader: "Where to sign in, how the Team menu works, and the one link you give out.",
    eyebrow: "Welcome",
    heading: "Everything in one place",
    image: {
      src: "https://paddockgavin.com/images/email/ppr-gate-band.jpg",
      alt: "The Rancho Jaramillo gate, with the track running in past the sign",
    },
    blocks,
    signoff:
      "Anything that does not work, say so in Chat rather than working around it. A tool nobody trusts is worse than no tool, and most of what is wrong takes ten minutes to fix once somebody says it out loud.",
  }
}

/** The five, with the money boundary as the database actually enforces it. */
export const TEAM: WelcomeVars[] = [
  { name: "Oscar Jaramillo", seesMoney: true, signInEmail: "oscarmillo@icloud.com" },
  { name: "Bekah Stallard", seesMoney: true, signInEmail: "bekahstallard@gmail.com" },
  { name: "Gavin Brooks", seesMoney: true, signInEmail: "paddock20auto@gmail.com" },
  { name: "Arnie", seesMoney: false, signInEmail: "sales@trickyair.com" },
  { name: "Josh", seesMoney: false, signInEmail: "mnstr63@gmail.com" },
]
