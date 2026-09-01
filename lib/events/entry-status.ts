/**
 * What each state of an entry means, in the words the emails already use.
 *
 * Pure on purpose. It sits apart from entry.ts because that module opens a
 * Postgres pool at the top level, and importing one value pulls the whole
 * module: the status page and the portal both want these words in the
 * browser, and pg has no business there.
 *
 * Nothing here promises a date we have not set. "Pending" says we will write
 * either way rather than inventing a week, because the entry emails say the
 * same, and two answers that disagree is worse than one that is vague.
 */

export function statusCopy(status: string): { head: string; line: string; tone: "wait" | "yes" | "hold" | "no" } {
  switch ((status || "").toLowerCase()) {
    case "approved":
    case "accepted":
      return {
        head: "You are in",
        line: "Your car has a place on the field. Everything you need for the day comes by email nearer the time, and there is nothing to book.",
        tone: "yes",
      }
    case "waitlisted":
      return {
        head: "On the waiting list",
        line: "Three hundred places and more cars than that. You are on the list, and if a place opens we will write to you before we write to anybody else.",
        tone: "hold",
      }
    case "declined":
    case "rejected":
      return {
        head: "Not this time",
        line: "We could not fit your car in this year. That is a decision about one field on one Saturday and nothing else, and you are welcome to come and look.",
        tone: "no",
      }
    default:
      return {
        head: "With the judges",
        line: "Your entry is in and nobody has decided yet. Every car is looked at one at a time, and you will hear either way rather than being left in silence.",
        tone: "wait",
      }
  }
}
