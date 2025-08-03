<template>
  <div class="bookmark-tree">
    <h3>All Bookmarks</h3>
    <div class="tree-container">
      <!-- Root level bookmarks displayed horizontally -->
      <div class="root-bookmarks">
        <div
          v-for="bookmark in processedBookmarks.filter(b => b.url)"
          :key="bookmark.id"
          class="bookmark-node"
        >
          <div
            class="bookmark-item has-url"
            :title="bookmark.title"
            @click="handleBookmarkClick(bookmark)"
          >
            <img
              v-if="bookmark.icon"
              :src="bookmark.icon"
              :alt="bookmark.title"
              class="bookmark-icon"
            />
            <span class="bookmark-title">{{ bookmark.title }}</span>
            <span 
              class="delete-btn" 
              @click.stop="handleDeleteClick(bookmark)"
              title="Delete bookmark"
            >×</span>
          </div>
        </div>
      </div>
      
      <!-- Folders displayed vertically -->
      <div
        v-for="bookmark in processedBookmarks.filter(b => !b.url)"
        :key="bookmark.id"
        class="bookmark-node"
      >
        <div
          class="bookmark-item"
          :title="bookmark.title"
          @click="handleBookmarkClick(bookmark)"
        >
          <span class="folder-icon">📂</span>
          <span class="bookmark-title">{{ bookmark.title }}</span>
        </div>
        
        <div v-if="bookmark.children && bookmark.children.length > 0" class="children">
          <!-- Show bookmarks first -->
          <div
            v-for="child in bookmark.children.filter(c => c.url)"
            :key="child.id"
            class="bookmark-node"
          >
            <div
              class="bookmark-item has-url"
              :title="child.title"
              @click="handleBookmarkClick(child)"
            >
              <img
                v-if="child.icon"
                :src="child.icon"
                :alt="child.title"
                class="bookmark-icon"
              />
              <span class="bookmark-title">{{ child.title }}</span>
              <span 
                class="delete-btn" 
                @click.stop="handleDeleteClick(child)"
                title="Delete bookmark"
              >×</span>
            </div>
          </div>
          <!-- Then show folders -->
          <div
            v-for="child in bookmark.children.filter(c => !c.url)"
            :key="child.id"
            class="bookmark-node"
          >
            <div
              class="bookmark-item"
              :title="child.title"
              @click="handleBookmarkClick(child)"
            >
              <span class="folder-icon">📂</span>
              <span class="bookmark-title">{{ child.title }}</span>
            </div>
            
            <div v-if="child.children && child.children.length > 0" class="children">
              <!-- Recursive rendering for nested folders -->
              <div
                v-for="grandchild in child.children.filter(c => c.url)"
                :key="grandchild.id"
                class="bookmark-node"
              >
                <div
                  class="bookmark-item has-url"
                  :title="grandchild.title"
                  @click="handleBookmarkClick(grandchild)"
                >
                  <img
                    v-if="grandchild.icon"
                    :src="grandchild.icon"
                    :alt="grandchild.title"
                    class="bookmark-icon"
                  />
                  <span class="bookmark-title">{{ grandchild.title }}</span>
                  <span 
                    class="delete-btn" 
                    @click.stop="handleDeleteClick(grandchild)"
                    title="Delete bookmark"
                  >×</span>
                </div>
              </div>
              <div
                v-for="grandchild in child.children.filter(c => !c.url)"
                :key="grandchild.id"
                class="bookmark-node"
              >
                <div
                  class="bookmark-item"
                  :title="grandchild.title"
                  @click="handleBookmarkClick(grandchild)"
                >
                  <span class="folder-icon">📂</span>
                  <span class="bookmark-title">{{ grandchild.title }}</span>
                </div>
                
                <div v-if="grandchild.children && grandchild.children.length > 0" class="children">
                  <!-- Continue recursion for deeper nesting -->
                  <RecursiveBookmarkNode
                    v-for="deepChild in grandchild.children"
                    :key="deepChild.id"
                    :bookmark="deepChild"
                    @bookmark-click="handleBookmarkClick"
                    @bookmark-deleted="handleDeleteClick"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Bookmark } from '../types/bookmark'
import { BookmarkUtils } from '../utils/bookmarkUtils'

interface Props {
  bookmarks: Bookmark[]
}

interface Emits {
  (e: 'bookmark-click', bookmark: Bookmark): void
  (e: 'bookmark-deleted', bookmarkId: string): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

// 本地维护的书签数据，用于实时更新
const localBookmarks = ref<Bookmark[]>([...props.bookmarks])

// 监听props变化，更新本地数据
watch(() => props.bookmarks, (newBookmarks) => {
  localBookmarks.value = [...newBookmarks]
}, { deep: true })

// 处理书签数据：过滤空目录，将根级别的书签横向展示
const processedBookmarks = computed(() => {
  return localBookmarks.value
    .filter(bookmark => {
      // 如果是目录，必须包含子书签或子目录
      if (!bookmark.url) {
        return bookmark.children && bookmark.children.length > 0
      }
      // 如果是书签，保留
      return true
    })
    .map(bookmark => {
      // 如果是目录，保持原结构
      if (!bookmark.url) {
        return bookmark
      }
      // 如果是书签，返回原书签
      return bookmark
    })
})

// 递归删除书签的辅助函数
const removeBookmarkFromTree = (bookmarks: Bookmark[], bookmarkId: string): Bookmark[] => {
  return bookmarks.filter(bookmark => {
    if (bookmark.id === bookmarkId) {
      return false // 删除匹配的书签
    }
    
    // 如果是目录，递归处理子项
    if (bookmark.children) {
      bookmark.children = removeBookmarkFromTree(bookmark.children, bookmarkId)
      // 如果删除子项后目录为空，也删除这个目录
      return bookmark.children.length > 0
    }
    
    return true
  })
}

const handleBookmarkClick = async (bookmark: Bookmark) => {
  emit('bookmark-click', bookmark)
  if (bookmark.url) {
    try {
      await BookmarkUtils.openBookmark(bookmark)
    } catch (error) {
      console.error('Failed to open bookmark:', error)
    }
  }
}

const handleDeleteClick = async (bookmark: Bookmark) => {
  if (!bookmark.url) return // 确保只有书签可以删除
  
  if (BookmarkUtils.confirmDelete(bookmark)) {
    try {
      await BookmarkUtils.deleteBookmark(bookmark)
      // 删除成功后，更新本地数据并通知父组件
      localBookmarks.value = removeBookmarkFromTree(localBookmarks.value, bookmark.id)
      emit('bookmark-deleted', bookmark.id)
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
      alert('Delete failed, please try again')
    }
  }
}

// 递归组件用于处理深层嵌套
const RecursiveBookmarkNode = {
  name: 'RecursiveBookmarkNode',
  props: {
    bookmark: {
      type: Object,
      required: true
    }
  },
  emits: ['bookmark-click', 'bookmark-deleted'],
  setup(props: any, { emit }: any) {
    const handleBookmarkClick = (bookmark: Bookmark) => {
      emit('bookmark-click', bookmark)
    }
    
    const handleDeleteClick = (bookmark: Bookmark) => {
      emit('bookmark-deleted', bookmark)
    }
    
    return {
      handleBookmarkClick,
      handleDeleteClick
    }
  },
  template: `
    <div class="bookmark-node">
      <div
        class="bookmark-item"
        :class="{ 'has-url': bookmark.url }"
        :title="bookmark.title"
        @click="handleBookmarkClick(bookmark)"
      >
        <span v-if="!bookmark.url" class="folder-icon">📂</span>
        <img
          v-if="bookmark.url && bookmark.icon"
          :src="bookmark.icon"
          :alt="bookmark.title"
          class="bookmark-icon"
        />
        <span class="bookmark-title">{{ bookmark.title }}</span>
        <span 
          v-if="bookmark.url"
          class="delete-btn" 
          @click.stop="handleDeleteClick(bookmark)"
          title="Delete bookmark"
        >×</span>
      </div>
      
      <div v-if="bookmark.children && bookmark.children.length > 0" class="children">
        <RecursiveBookmarkNode
          v-for="child in bookmark.children"
          :key="child.id"
          :bookmark="child"
          @bookmark-click="handleBookmarkClick"
          @bookmark-deleted="handleDeleteClick"
        />
      </div>
    </div>
  `
}

</script>


<style scoped lang="scss">
@use '../styles/variables.scss' as *;
@use '../styles/mixins.scss' as *;

.bookmark-tree {
  h3 {
    @include heading-spacing;
    font-size: $font-size-small + 4px;
    color: $text-color;
  }
  
  .tree-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    @include flex-column;
    gap: $spacing-sm;
  }
  
  .root-bookmarks {
    @include flex-wrap;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
  }
  
  .bookmark-node {
    margin: $spacing-xs 0;
    margin-right: $spacing-sm;
  }
  
  .bookmark-item {
    @include bookmark-item-base;
    gap: $spacing-xs;
    @include bookmark-item-hover;
    
    &.has-url {
      @include bookmark-item-with-url;
    }
    
    @include delete-button-on-hover;
  }
  
  .folder-icon {
    font-size: $font-size-small;
  }
  
  .bookmark-icon {
    @include bookmark-icon;
  }
  
  .bookmark-title {
    @include bookmark-title;
    max-width: 160px;
  }
  
  .children {
    margin-top: $spacing-xs;
    margin-left: 20px;
    @include flex-wrap;
    gap: $spacing-sm;
  }

  .delete-btn {
    @include delete-button;
  }
}
</style>