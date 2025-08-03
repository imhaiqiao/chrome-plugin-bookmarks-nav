import { Bookmark } from '../types/bookmark'

export class BookmarkService {
  private static instance: BookmarkService
  
  public static getInstance(): BookmarkService {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService()
    }
    return BookmarkService.instance
  }

  async getAllBookmarks(): Promise<Bookmark[]> {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
          return
        }
        
        const bookmarks = this.flattenBookmarks(bookmarkTreeNodes)
        resolve(bookmarks)
      })
    })
  }

  private flattenBookmarks(nodes: chrome.bookmarks.BookmarkTreeNode[]): Bookmark[] {
    const result: Bookmark[] = []
    
    const traverse = (node: chrome.bookmarks.BookmarkTreeNode): Bookmark | null => {
      if (node.id === '0' || node.id === '1') {
        if (node.children) {
          node.children.forEach(child => {
            const bookmark = traverse(child)
            if (bookmark) result.push(bookmark)
          })
        }
        return null
      }
      
      const bookmark: Bookmark = {
        id: node.id,
        title: node.title || '',
        url: node.url,
        dateAdded: node.dateAdded,
        icon: node.url ? this.getFaviconUrl(node.url) : undefined
      }
      
      if (node.children) {
        bookmark.children = node.children
          .map(child => traverse(child))
          .filter((child): child is Bookmark => child !== null)
      }
      
      return bookmark
    }
    
    nodes.forEach(node => {
      const bookmark = traverse(node)
      if (bookmark) result.push(bookmark)
    })
    return result
  }

  private getFaviconUrl(url: string): string {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
    } catch {
      return ''
    }
  }

  async searchBookmarks(query: string): Promise<Bookmark[]> {
    const allBookmarks = await this.getAllBookmarks()
    const lowerQuery = query.toLowerCase()
    
    const searchInBookmark = (bookmark: Bookmark): Bookmark[] => {
      const matches = bookmark.title.toLowerCase().includes(lowerQuery) || 
                     (bookmark.url && bookmark.url.toLowerCase().includes(lowerQuery))
      
      if (matches) {
        return [bookmark]
      }
      
      if (bookmark.children) {
        const childMatches = bookmark.children.flatMap(child => searchInBookmark(child))
        return childMatches
      }
      
      return []
    }
    
    return allBookmarks.flatMap(bookmark => searchInBookmark(bookmark))
  }
}