<template>
  <div class="frequent-bookmarks">
    <h3>Frequently</h3>
    <div v-if="frequentBookmarks.length > 0" class="bookmark-list">
      <div
        v-for="bookmark in frequentBookmarks"
        :key="bookmark.url"
        class="bookmark-item"
        @click="handleBookmarkClick(bookmark.url, bookmark.title)"
      >
        <img
          v-if="bookmark.icon"
          :src="bookmark.icon"
          :alt="bookmark.title"
          class="bookmark-icon"
        />
        <span class="bookmark-title">{{ bookmark.title }}</span>
        <span class="bookmark-count">{{ bookmark.count }}</span>
        <span 
          class="delete-btn"
          @click.stop="handleDeleteBookmark(bookmark.url)"
          title="Delete"
        >×</span>
      </div>
    </div>
    <div v-else class="empty-state">
      No frequently used bookmarks
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StorageService } from '../utils/storageService'
import { BookmarkService } from '../utils/bookmarkService'
import { BookmarkUtils } from '../utils/bookmarkUtils'

interface FrequentBookmark {
  url: string
  title: string
  count: number
  icon?: string
}

const frequentBookmarks = ref<FrequentBookmark[]>([])

const loadFrequentBookmarks = async () => {
  try {
    const topBookmarks = await StorageService.getTopBookmarks()
    const bookmarkService = BookmarkService.getInstance()
    const allBookmarks = await bookmarkService.getAllBookmarks()
    
    frequentBookmarks.value = topBookmarks.map(item => {
      const bookmark = findBookmarkByUrl(allBookmarks, item.url)
      return {
        url: item.url,
        title: bookmark?.title || item.url,
        count: item.count,
        icon: bookmark?.icon
      }
    }).filter(item => item.title)
  } catch (error) {
    console.error('Failed to load frequent bookmarks:', error)
  }
}

const findBookmarkByUrl = (bookmarks: any[], url: string): any => {
  for (const bookmark of bookmarks) {
    if (bookmark.url === url) {
      return bookmark
    }
    if (bookmark.children) {
      const found = findBookmarkByUrl(bookmark.children, url)
      if (found) return found
    }
  }
  return null
}

const handleBookmarkClick = async (url: string, title: string) => {
  try {
    const bookmark = { url, title } as any
    await BookmarkUtils.openBookmark(bookmark)
  } catch (error) {
    console.error('Failed to open bookmark:', error)
  }
}

const handleDeleteBookmark = async (url: string) => {
  try {
    await StorageService.removeBookmarkFrequency(url)
    await loadFrequentBookmarks()
  } catch (error) {
    console.error('Failed to delete bookmark:', error)
  }
}

onMounted(() => {
  loadFrequentBookmarks()
})
</script>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;
@use '../styles/mixins.scss' as *;

.frequent-bookmarks {
  @include section-spacing;
  
  h3 {
    @include heading-spacing;
    font-size: $font-size-small + 4px;
    color: $text-color;
  }
  
  .bookmark-list {
    @include flex-wrap;
    gap: $spacing-sm;
  }
  
  .bookmark-item {
    @include bookmark-item-base;
    gap: $spacing-xs;
    padding: $spacing-xs $spacing-md;
    background: $background-color;
    
    &:hover {
      background: $hover-background;
    }
    
    @include delete-button-on-hover;
  }
  
  .bookmark-icon {
    @include bookmark-icon;
  }
  
  .bookmark-title {
    @include bookmark-title;
    max-width: 120px;
  }
  
  .bookmark-count {
    font-size: $font-size-tiny;
    color: $text-secondary;
    background: #ddd;
    padding: 2px 6px;
    border-radius: 10px;
  }
  
  .delete-btn {
    @include delete-button;
  }
  
  .empty-state {
    color: $text-secondary;
    font-style: italic;
    padding: $spacing-sm 0;
  }
}
</style>