export interface Bookmark {
  id: string
  title: string
  url?: string
  children?: Bookmark[]
  dateAdded?: number
  icon?: string
}

export interface BookmarkStats {
  [url: string]: number
}