import { getGalleryItems } from "@/lib/social"
import { GalleryClient } from "./GalleryClient"

/**
 * The gallery, rendered on the server.
 *
 * It used to fetch its three feeds in the browser, which cost the page the two
 * things that matter most for a page whose entire content is photographs: a
 * search engine saw no images and no captions, and a link shared by message
 * previewed as an empty page. The tag routing and the aspect maths are
 * unchanged, they just run before the HTML is sent.
 *
 * When no feed is configured, or Behold does not answer, this returns nothing
 * and the client falls back to its seed tiles, which is what ships today.
 */
export default async function GalleryPage() {
  const { items, profile } = await getGalleryItems()
  return <GalleryClient initialItems={items} initialProfile={profile} />
}
