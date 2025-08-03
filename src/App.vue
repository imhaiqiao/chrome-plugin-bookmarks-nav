<template>
  <div class="app">
    <SearchBox @search="handleSearch" />
    <FrequentBookmarks />
    <BookmarkTree 
      :bookmarks="displayBookmarks" 
      @bookmark-click="handleBookmarkClick"
      @bookmark-deleted="handleBookmarkDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchBox from './components/SearchBox.vue'
import FrequentBookmarks from './components/FrequentBookmarks.vue'
import BookmarkTree from './components/BookmarkTree.vue'
import { BookmarkService } from './utils/bookmarkService'
import { StorageService } from './utils/storageService'
import { Bookmark } from './types/bookmark'

const bookmarkService = BookmarkService.getInstance()
const allBookmarks = ref<Bookmark[]>([])
const displayBookmarks = ref<Bookmark[]>([])

const loadBookmarks = async () => {
  try {
    console.log('Starting to load bookmarks...')
    const bookmarks = await bookmarkService.getAllBookmarks()
    console.log('Number of bookmarks loaded:', bookmarks.length)
    console.log('Bookmark data:', bookmarks)
    allBookmarks.value = bookmarks
    displayBookmarks.value = bookmarks
  } catch (error) {
    console.error('Failed to load bookmarks:', error)
  }
}

const handleSearch = async (query: string) => {
  if (!query.trim()) {
    displayBookmarks.value = allBookmarks.value
    return
  }
  
  try {
    const searchResults = await bookmarkService.searchBookmarks(query)
    displayBookmarks.value = searchResults
  } catch (error) {
    console.error('Failed to search bookmarks:', error)
  }
}

const handleBookmarkClick = async (bookmark: Bookmark) => {
  if (bookmark.url) {
    try {
      await StorageService.incrementBookmarkFrequency(bookmark.url)
    } catch (error) {
      console.error('Failed to record bookmark click:', error)
    }
  }
}

const handleBookmarkDeleted = async (bookmarkId: string) => {
  await loadBookmarks()
}

onMounted(() => {
  loadBookmarks()
})
</script>

<style scoped lang="scss">
@use './styles/variables.scss' as *;
@use './styles/mixins.scss' as *;

.app {
  width: 100%;
  height: 100%;
  padding: $spacing-lg;
  font-family: $font-family;
  font-size: $font-size-small;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  @include flex-column;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>