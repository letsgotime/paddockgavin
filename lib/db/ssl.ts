/**
 * pg warns on every connection that sslmode=require will change meaning in
 * its next major version, and that today's behaviour is verify-full. Naming
 * verify-full changes nothing and silences the warning.
 */
export function verifyFull(url: string): string {
  return url.replace(/([?&])sslmode=(require|prefer|verify-ca)\b/, "$1sslmode=verify-full")
}
