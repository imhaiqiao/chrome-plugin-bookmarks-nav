<template>
  <div class="search-box">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search bookmarks title or url..."
      @input="handleSearch"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
}>()

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<style scoped lang="scss">
@use '../styles/variables.scss' as *;
@use '../styles/mixins.scss' as *;

.search-box {
  margin-bottom: $spacing-lg;
  
  input {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    font-size: $font-size;
    
    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }
}
</style>