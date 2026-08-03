import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectDetail } from "@/components/project-detail"
import { MainLayout } from "@/components/main-layout"
import { PROJECTS, getProjectById } from "@/lib/project-data"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = getProjectById(id)
  if (!project) return {}
  return {
    title: `${project.title} — PaddockGavin`,
    description: project.caption ?? `${project.title} — built by PaddockGavin. Nashville, Tennessee.`,
    openGraph: {
      title: `${project.title} — PaddockGavin`,
      description: project.caption ?? `${project.title} — built by PaddockGavin.`,
      url: `https://paddockgavin.com/work/${id}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: project.title }],
    },
    twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
  }
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <MainLayout>
      <ProjectDetail project={project} />
    </MainLayout>
  )
}
