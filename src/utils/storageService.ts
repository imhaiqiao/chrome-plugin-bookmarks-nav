export class StorageService {
  private static readonly FREQUENCY_KEY = 'bookmark_frequency'
  private static readonly MAX_ITEMS = 10

  static async getBookmarkFrequency(): Promise<Record<string, number>> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.FREQUENCY_KEY], (result) => {
        resolve(result[this.FREQUENCY_KEY] || {})
      })
    })
  }

  static async incrementBookmarkFrequency(url: string): Promise<void> {
    const frequency = await this.getBookmarkFrequency()
    frequency[url] = (frequency[url] || 0) + 1
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.FREQUENCY_KEY]: frequency }, () => {
        resolve()
      })
    })
  }

  static async getTopBookmarks(): Promise<Array<{ url: string; count: number }>> {
    const frequency = await this.getBookmarkFrequency()
    return Object.entries(frequency)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, this.MAX_ITEMS)
  }

  static async removeBookmarkFrequency(url: string): Promise<void> {
    const frequency = await this.getBookmarkFrequency()
    delete frequency[url]
    
    return new Promise((resolve) => {
      chrome.storage.local.set({ [this.FREQUENCY_KEY]: frequency }, () => {
        resolve()
      })
    })
  }
}