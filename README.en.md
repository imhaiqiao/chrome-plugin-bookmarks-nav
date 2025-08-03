# Bookmarks Nav

A Chrome extension for quickly finding and accessing your Chrome bookmarks.

[🇨🇳 中文版](./README.md) | [🇺🇸 English](./README.en.md)

## Requirements

### Core Features
- **Bookmark Search**: Quickly search all bookmarks and folders
- **Frequent Access**: Intelligently display most frequently accessed bookmarks
- **Hierarchical Display**: Show bookmark folders in tree structure
- **Quick Access**: One-click bookmark opening in new tabs
- **Bookmark Management**: Support for deleting unwanted bookmarks
- **Usage Statistics**: Record bookmark access frequency for optimized display

### User Interface
- **Search Box**: Real-time search for bookmark titles and URLs
- **Frequent Bookmarks Area**: Display most frequently accessed bookmarks
- **Bookmark Tree**: Show all bookmarks and folders in tree structure
- **Responsive Design**: Adapt to different screen sizes

### Performance Requirements
- **Fast Loading**: Plugin startup time < 1 second
- **Real-time Search**: Search response time < 200ms
- **Memory Optimization**: Reasonable use of Chrome storage space

## Technical Specifications

### Tech Stack
- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS
- **Chrome API**: Manifest V3
- **Storage**: Chrome Storage API

### Core Technical Features

#### Vue 3 Composition API
- Using `<script setup>` syntax
- Reactive data management
- Component-based architecture

#### TypeScript Type Safety
- Complete type definitions
- Interface constraints and type checking
- Intelligent code completion

#### Chrome Extension Architecture
```typescript
// Permission configuration
"permissions": [
  "bookmarks",    // Bookmark access permissions
  "storage",      // Storage permissions
  "tabs"          // Tab operation permissions
]
```

#### Component Design
- **Single Responsibility**: Each component handles specific functionality
- **Recursive Components**: Handle unlimited levels of bookmark nesting
- **Event-Driven**: Components communicate through events

### Data Flow Design

#### Bookmark Data Retrieval
```typescript
// Get bookmarks from Chrome API
chrome.bookmarks.getTree((bookmarkTreeNodes) => {
  // Data processing and transformation
})
```

#### Frequency Statistics
```typescript
// Store access frequency using Chrome Storage
chrome.storage.local.set({ [url]: frequency })
```

#### Search Functionality
```typescript
// Real-time search implementation
const searchResults = bookmarks.filter(bookmark => 
  bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
  bookmark.url?.toLowerCase().includes(query.toLowerCase())
)
```

## Project Structure

```
bookmarks-nav/
├── src/                          # Source code directory
│   ├── components/               # Vue components
│   │   ├── SearchBox.vue         # Search box component
│   │   ├── FrequentBookmarks.vue # Frequent bookmarks component
│   │   └── BookmarkTree.vue      # Bookmark tree component (includes recursive component)
│   ├── types/                    # TypeScript type definitions
│   │   └── bookmark.ts           # Bookmark type definitions
│   ├── utils/                    # Utility functions
│   │   ├── bookmarkService.ts    # Bookmark service
│   │   ├── bookmarkUtils.ts      # Bookmark utility functions
│   │   └── storageService.ts     # Storage service
│   ├── styles/                   # Style files
│   │   ├── variables.scss        # SCSS variables
│   │   └── mixins.scss           # SCSS mixins
│   ├── App.vue                   # Main application component
│   └── popup.ts                  # Entry file
├── public/                       # Static assets
│   ├── icon16.png               # 16x16 icon
│   ├── icon48.png               # 48x48 icon
│   └── icon128.png              # 128x128 icon
├── scripts/                     # Build scripts
│   ├── convert-icons.js         # Icon generation script
│   └── build-crx.js             # CRX packaging script
├── dist/                        # Build output directory
├── manifest.json                # Chrome extension configuration
├── package.json                 # Project dependency configuration
├── vite.config.ts               # Vite build configuration
└── tsconfig.json                # TypeScript configuration
```

### Core File Descriptions

#### Component Files
- **App.vue**: Main application component, integrates all functional modules
- **SearchBox.vue**: Search box, provides real-time search functionality
- **FrequentBookmarks.vue**: Displays most frequently accessed bookmarks
- **BookmarkTree.vue**: Bookmark tree component, supports unlimited level nesting

#### Service Layer
- **bookmarkService.ts**: Bookmark data retrieval and processing
- **storageService.ts**: Chrome Storage API wrapper
- **bookmarkUtils.ts**: Bookmark operation utility functions

#### Type Definitions
- **bookmark.ts**: TypeScript type definitions for bookmark data structure

## Extension Usage

### Installation Steps

1. **Download Extension**
   ```bash
   git clone <repository-url>
   cd bookmarks-nav
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build Extension**
   ```bash
   npm run build
   ```

4. **Load to Chrome**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked extension"
   - Select the `dist` folder

### How to Use

#### 1. Open Extension
- Click the extension icon in the Chrome toolbar
- Or use keyboard shortcuts (if configured)

#### 2. Search Bookmarks
- Enter keywords in the search box
- Supports bookmark title and URL search
- Real-time search results display

#### 3. Access Bookmarks
- Click any bookmark to open it in a new tab
- Frequently accessed bookmarks are displayed in the top area

#### 4. Manage Bookmarks
- Hover over bookmarks to show delete button
- Click delete button to remove bookmarks
- Confirmation dialog appears before deletion

### Feature Highlights

#### Smart Sorting
- Bookmarks are automatically sorted by access frequency
- Frequently accessed bookmarks are prioritized

#### Hierarchical Display
- Folders are displayed in tree structure
- Supports unlimited level nesting
- Click folders to expand/collapse

#### Search Optimization
- Supports fuzzy search
- Search results update in real-time
- Highlights matching content

#### Data Synchronization
- Automatically syncs Chrome bookmark data
- Usage frequency statistics are persistently stored

### Troubleshooting

#### Common Issues
1. **Extension won't load**: Check `manifest.json` configuration
2. **Bookmarks not showing**: Ensure bookmark access permissions are granted
3. **No search results**: Check if bookmark data is loading correctly

#### Debug Methods
- Use Chrome Developer Tools to debug the extension
- Check Console for error messages
- Inspect Network requests and Storage data

### Changelog

#### v1.0.0
- Initial version release
- Basic bookmark search and access functionality
- Frequent access statistics
- Bookmark deletion feature
- Responsive interface design

### License

MIT License

### Contributing

Welcome to submit Issues and Pull Requests to improve this project.

### Contact

For questions or suggestions, please contact:
- GitHub Issues
- Email: [your-email@example.com]