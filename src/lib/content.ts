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

// Consumer news (отдельная коллекция).
const consumerNewsRaw = import.meta.glob('/content/consumer-news/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

// Документы (по 3 категориям + акционеры + закупки)
const docsAnticorruptionRaw = import.meta.glob('/content/documents/anticorruption/*.md', {
  eager: true, query: '?raw', import: 'default',
}) as Record<string, string>
const docsAntiterrorRaw = import.meta.glob('/content/documents/antiterror/*.md', {
  eager: true, query: '?raw', import: 'default',
}) as Record<string, string>
const docsTechRaw = import.meta.glob('/content/documents/tech/*.md', {
  eager: true, query: '?raw', import: 'default',
}) as Record<string, string>
const docsShareholdersRaw = import.meta.glob('/content/documents/shareholders/*.md', {
  eager: true, query: '?raw', import: 'default',
}) as Record<string, string>
const docsProcurementRaw = import.meta.glob('/content/documents/procurement/*.md', {
  eager: true, query: '?raw', import: 'default',
}) as Record<string, string>

// Контакты — единый YAML
const contactsRaw = import.meta.glob('/content/contacts.yml', {
  eager: true, query: '?raw', import: 'default',
}) as Record<string, string>

// Собрания акционеров
const shareholdersMeetingsRaw = import.meta.glob('/content/shareholders-meetings.yml', {
  eager: true, query: '?raw', import: 'default',
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
  salary?: string
  address?: string
}

export interface VacanciesData {
  conditions: string[]
  vacancies: Vacancy[]
}

// Документ (общий формат для всех типов документов)
export interface DocumentItem {
  id: string
  title: string
  file: string
  date?: string
  size?: string
  section?: string // регуляторные/локальные/защищённость и т.д.
  order: number
}

// Собрание акционеров
export interface ShareholderMeeting {
  date: string
  type: string
  status: string
}

// Производственное подразделение (РЭК)
export interface ProductionUnit {
  name: string
  address: string
  phones?: string[]
  head?: string
  ext?: string
}

// Специализированная служба
export interface SpecializedService {
  name: string
  address: string
  phone?: string
  phones?: string[]
  head?: string
  headTitle?: string
  ext?: string
  headExt?: string
}

// Полные контакты сайта
export interface ContactsData {
  mainAddress: string
  receptionHours: string[]
  mainPhone: string
  chancelleryEmail: string
  tsop: { address: string; phone: string; email: string }
  passOffice: { address: string; phone: string }
  socialLinks: { name: string; url: string }[]
  requisites: { inn: string; kpp: string; okpo: string; ogrn: string; legalAddress: string }
  productionUnits: ProductionUnit[]
  specializedServices: SpecializedService[]
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

// Парсим один раз: достаём conditions + vacancies из одного YAML
const vacanciesData: VacanciesData = (() => {
  const entries = Object.values(vacanciesRaw)
  if (entries.length === 0) return { conditions: [], vacancies: [] }
  try {
    const parsed = yaml.load(entries[0]) as Partial<VacanciesData>
    return {
      conditions: parsed?.conditions || [],
      vacancies: parsed?.vacancies || [],
    }
  } catch (e) {
    console.error('Vacancies YAML parse error:', e)
    return { conditions: [], vacancies: [] }
  }
})()

export const vacancies: Vacancy[] = vacanciesData.vacancies
export const vacancyConditions: string[] = vacanciesData.conditions

/* ------------------------------------------------------------------ */
/*  Дополнительные коллекции                                           */
/* ------------------------------------------------------------------ */

// Новости для потребителей
export const consumerNews: NewsItem[] = Object.entries(consumerNewsRaw)
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

// Универсальный загрузчик документов
function loadDocuments(raw: Record<string, string>): DocumentItem[] {
  return Object.entries(raw)
    .map(([path, fileRaw]) => {
      const { data } = parseFrontmatter(fileRaw)
      return {
        id: slugFromPath(path),
        title: String(data.title || ''),
        file: String(data.file || ''),
        date: data.date ? String(data.date) : undefined,
        size: data.size ? String(data.size) : undefined,
        section: data.section ? String(data.section) : undefined,
        order: Number(data.order || 99),
      } as DocumentItem
    })
    .sort((a, b) => a.order - b.order)
}

export const documentsAnticorruption = loadDocuments(docsAnticorruptionRaw)
export const documentsAntiterror = loadDocuments(docsAntiterrorRaw)
export const documentsTech = loadDocuments(docsTechRaw)
export const documentsShareholders = loadDocuments(docsShareholdersRaw)
export const documentsProcurement = loadDocuments(docsProcurementRaw)

// Контакты — целиком из YAML
export const contacts: ContactsData = (() => {
  const entries = Object.values(contactsRaw)
  if (entries.length === 0) {
    return {
      mainAddress: '',
      receptionHours: [],
      mainPhone: '',
      chancelleryEmail: '',
      tsop: { address: '', phone: '', email: '' },
      passOffice: { address: '', phone: '' },
      socialLinks: [],
      requisites: { inn: '', kpp: '', okpo: '', ogrn: '', legalAddress: '' },
      productionUnits: [],
      specializedServices: [],
    }
  }
  try {
    return yaml.load(entries[0]) as ContactsData
  } catch (e) {
    console.error('Contacts YAML parse error:', e)
    throw e
  }
})()

// Собрания акционеров
export const shareholderMeetings: ShareholderMeeting[] = (() => {
  const entries = Object.values(shareholdersMeetingsRaw)
  if (entries.length === 0) return []
  try {
    const parsed = yaml.load(entries[0]) as { meetings?: ShareholderMeeting[] }
    return parsed?.meetings || []
  } catch (e) {
    console.error('Shareholder meetings YAML parse error:', e)
    return []
  }
})()
