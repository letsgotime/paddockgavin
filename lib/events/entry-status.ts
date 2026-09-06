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

export type StatusCopy = { head: string; line: string; tone: "wait" | "yes" | "hold" | "no" }

/**
 * The same link serves a stall enquiry and a partner enquiry, and for a
 * month it told both of them their car was with the judges. The words now
 * follow the kind of submission; a car keeps the words it always had.
 */
export function statusCopy(status: string, type = "vehicle"): StatusCopy {
  const s = (status || "").toLowerCase()
  if (type === "vendor") {
    switch (s) {
      case "approved":
      case "accepted":
        return { head: "You have a place on the row", line: "Your stall has a place on vendor row. The site plan with your pitch marked goes out in the last week of September, once the field is set.", tone: "yes" }
      case "waitlisted":
        return { head: "On the waiting list", line: "The row is kept short so every stall is worth walking to. You are on the list, and if a space opens we will write to you before we write to anybody else.", tone: "hold" }
      case "declined":
      case "rejected":
        return { head: "Not this time", line: "We could not fit your stall on the row this year. That is a decision about one row on one Saturday and nothing else, and you are welcome to come and look.", tone: "no" }
      default:
        return { head: "With the desk", line: "Your stall enquiry is in and being read. Bekah Stallard will come back to you with what is available, and you will hear either way.", tone: "wait" }
    }
  }
  if (type === "sponsor") {
    switch (s) {
      case "approved":
      case "accepted":
        return { head: "We are on", line: "Your position is agreed. What comes next arrives by email from the desk.", tone: "yes" }
      case "waitlisted":
        return { head: "Under discussion", line: "We are working out where you fit on the day. You will hear from the desk either way.", tone: "hold" }
      case "declined":
      case "rejected":
        return { head: "Not this time", line: "We could not find the right position this year. That is a decision about one day and nothing else, and you are welcome to come and look.", tone: "no" }
      default:
        return { head: "With the desk", line: "Your enquiry is in and being read. Every enquiry is answered, and you will hear either way.", tone: "wait" }
    }
  }
  switch (s) {
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
