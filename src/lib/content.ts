// Content loader: reads YAML/Markdown files from content/ at build time
// and exposes typed collections. Edits via Sveltia CMS at /admin/.
import yaml from 'js-yaml'

/* ------------------------------------------------------------------ */
/*  Frontmatter parser (browser-safe — no Node dependencies)           */
/* ------------------------------------------------------------------ */

interface ParsedFrontmatter {
  data: Record<string, unknown>
  content: string
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { data: {}, content: raw }
  let data: Record<string, unknown> = {}
  try {
    data = (yaml.load(m[1]) as Record<string, unknown>) || {}
  } catch (e) {
    console.error('Frontmatter parse error:', e)
  }
  return { data, content: m[2] || '' }
}

/* ------------------------------------------------------------------ */
/*  Vite glob imports — eagerly load all files at build time           */
/* ------------------------------------------------------------------ */

// Each value is the raw file contents as a string.
const newsRaw = import.meta.glob('/content/news/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const announcementsRaw = import.meta.glob('/content/announcements/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const newspaperRaw = import.meta.glob('/content/newspaper/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const videosRaw = import.meta.glob('/content/videos/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

// Vacancies live in a single YAML file (simple list).
const vacanciesRaw = import.meta.glob('/content/vacancies.yml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

/* ------------------------------------------------------------------ */
/*  Typed collections                                                  */
/* ------------------------------------------------------------------ */

export interface NewsItem {
  id: string // file slug
  title: string
  date: string
  category: string
  excerpt: string
  image?: string
  body?: string
  link?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  link: string
  order: number
  active: boolean
}

export interface NewspaperIssue {
  id: string
  number: string // "№04 (65)"
  year: string
  label: string
  file: string // path to PDF
}

export interface VideoItem {
  id: string
  title: string
  description: string
  src: string
}

export interface Vacancy {
  title: string
  department: string
}

/* ------------------------------------------------------------------ */
/*  Build collections                                                  */
/* ------------------------------------------------------------------ */

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

export const news: NewsItem[] = Object.entries(newsRaw)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    return {
      id: slugFromPath(path),
      title: String(data.title || ''),
      date: String(data.date || ''),
      category: String(data.category || ''),
      excerpt: String(data.excerpt || ''),
      image: data.image ? String(data.image) : undefined,
      body: content.trim() || undefined,
      link: data.link ? String(data.link) : undefined,
    } as NewsItem
  })
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

export const announcements: Announcement[] = Object.entries(announcementsRaw)
  .map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    return {
      id: slugFromPath(path),
      title: String(data.title || ''),
      content: String(data.content || ''),
      link: String(data.link || '/'),
      order: Number(data.order || 0),
      active: data.active !== false,
    } as Announcement
  })
  .filter((a) => a.active)
  .sort((a, b) => a.order - b.order)

export const newspaper: NewspaperIssue[] = Object.entries(newspaperRaw)
  .map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    return {
      id: slugFromPath(path),
      number: String(data.number || ''),
      year: String(data.year || ''),
      label: String(data.label || ''),
      file: String(data.file || ''),
    } as NewspaperIssue
  })
  .sort((a, b) => b.id.localeCompare(a.id))

export const videos: VideoItem[] = Object.entries(videosRaw)
  .map(([path, raw]) => {
    const { data } = parseFrontmatter(raw)
    return {
      id: slugFromPath(path),
      title: String(data.title || ''),
      description: String(data.description || ''),
      src: String(data.src || ''),
    } as VideoItem
  })
  .sort((a, b) => a.id.localeCompare(b.id))

export const vacancies: Vacancy[] = (() => {
  const entries = Object.values(vacanciesRaw)
  if (entries.length === 0) return []
  try {
    const parsed = yaml.load(entries[0]) as { vacancies?: Vacancy[] }
    return parsed?.vacancies || []
  } catch (e) {
    console.error('Vacancies YAML parse error:', e)
    return []
  }
})()
