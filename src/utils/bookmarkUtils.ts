import { Bookmark } from '../types/bookmark'
import { StorageService } from './storageService'

export class BookmarkUtils {
  static async openBookmark(bookmark: Bookmark): Promise<void> {
    if (!bookmark.url) return
    
    try {
      // Record frequency for analytics
      await StorageService.incrementBookmarkFrequency(bookmark.url)
      
      // Open the bookmark in a new tab
      chrome.tabs.create({ url: bookmark.url })
    } catch (error) {
      console.error('Failed to open bookmark:', error)
      throw error
    }
  }
  
  static async deleteBookmark(bookmark: Bookmark): Promise<void> {
    if (!bookmark.url) return
    
    try {
      await chrome.bookmarks.remove(bookmark.id)
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
      throw error
    }
  }
  
  static confirmDelete(bookmark: Bookmark): boolean {
    if (!bookmark.url) return false
    
    return confirm(`Are you sure you want to delete "${bookmark.title}"? This action cannot be undone.`)
  }
}