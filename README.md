# Bookmarks Nav

一个 Chrome 扩展程序，用于快速查找和访问您的 Chrome 书签。

[🇨🇳 中文版](./README.md) | [🇺🇸 English](./README.en.md)

## 需求说明

### 核心功能
- **书签搜索**: 快速搜索所有书签和文件夹
- **频繁访问**: 智能显示最常访问的书签
- **层级展示**: 以树状结构展示书签文件夹
- **快速访问**: 一键打开书签，新标签页中打开
- **书签管理**: 支持删除不需要的书签
- **使用统计**: 记录书签访问频率，优化显示顺序

### 用户界面
- **搜索框**: 实时搜索书签标题和URL
- **频繁书签区域**: 显示访问频率最高的书签
- **书签树**: 以树状结构展示所有书签和文件夹
- **响应式设计**: 适配不同屏幕尺寸

### 性能要求
- **快速加载**: 插件启动时间 < 1秒
- **实时搜索**: 搜索响应时间 < 200ms
- **内存优化**: 合理使用 Chrome 存储空间

## 技术说明

### 技术栈
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式**: SCSS
- **Chrome API**: Manifest V3
- **存储**: Chrome Storage API

### 核心技术特性

#### Vue 3 组合式 API
- 使用 `<script setup>` 语法
- 响应式数据管理
- 组件化架构

#### TypeScript 类型安全
- 完整的类型定义
- 接口约束和类型检查
- 智能代码提示

#### Chrome 扩展架构
```typescript
// 权限配置
"permissions": [
  "bookmarks",    // 书签访问权限
  "storage",      // 存储权限
  "tabs"          // 标签页操作权限
]
```

#### 组件设计
- **单一职责**: 每个组件负责特定功能
- **递归组件**: 处理无限层级的书签嵌套
- **事件驱动**: 组件间通过事件通信

### 数据流设计

#### 书签数据获取
```typescript
// 从 Chrome API 获取书签
chrome.bookmarks.getTree((bookmarkTreeNodes) => {
  // 数据处理和转换
})
```

#### 频率统计
```typescript
// 使用 Chrome Storage 存储访问频率
chrome.storage.local.set({ [url]: frequency })
```

#### 搜索功能
```typescript
// 实时搜索实现
const searchResults = bookmarks.filter(bookmark => 
  bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
  bookmark.url?.toLowerCase().includes(query.toLowerCase())
)
```

## 项目结构

```
bookmarks-nav/
├── src/                          # 源代码目录
│   ├── components/               # Vue 组件
│   │   ├── SearchBox.vue         # 搜索框组件
│   │   ├── FrequentBookmarks.vue # 频繁访问书签组件
│   │   └── BookmarkTree.vue      # 书签树组件（包含递归组件）
│   ├── types/                    # TypeScript 类型定义
│   │   └── bookmark.ts           # 书签类型定义
│   ├── utils/                    # 工具函数
│   │   ├── bookmarkService.ts    # 书签服务
│   │   ├── bookmarkUtils.ts      # 书签工具函数
│   │   └── storageService.ts     # 存储服务
│   ├── styles/                   # 样式文件
│   │   ├── variables.scss        # SCSS 变量
│   │   └── mixins.scss           # SCSS 混合器
│   ├── App.vue                   # 主应用组件
│   └── popup.ts                  # 入口文件
├── public/                       # 静态资源
│   ├── icon16.png               # 16x16 图标
│   ├── icon48.png               # 48x48 图标
│   └── icon128.png              # 128x128 图标
├── scripts/                     # 构建脚本
│   ├── convert-icons.js         # 图标生成脚本
│   └── build-crx.js             # CRX 打包脚本
├── dist/                        # 构建输出目录
├── manifest.json                # Chrome 扩展配置
├── package.json                 # 项目依赖配置
├── vite.config.ts               # Vite 构建配置
└── tsconfig.json                # TypeScript 配置
```

### 核心文件说明

#### 组件文件
- **App.vue**: 主应用组件，整合所有功能模块
- **SearchBox.vue**: 搜索框，提供实时搜索功能
- **FrequentBookmarks.vue**: 显示最常访问的书签
- **BookmarkTree.vue**: 书签树组件，支持无限层级嵌套

#### 服务层
- **bookmarkService.ts**: 书签数据获取和处理
- **storageService.ts**: Chrome 存储 API 封装
- **bookmarkUtils.ts**: 书签操作工具函数

#### 类型定义
- **bookmark.ts**: 书签数据结构的 TypeScript 类型定义

## 插件使用

### 安装步骤

1. **下载插件**
   ```bash
   git clone <repository-url>
   cd bookmarks-nav
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建插件**
   ```bash
   npm run build
   ```

4. **加载到 Chrome**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 文件夹

### 使用方法

#### 1. 打开插件
- 点击 Chrome 工具栏中的插件图标
- 或使用快捷键（如果设置了）

#### 2. 搜索书签
- 在搜索框中输入关键词
- 支持书签标题和 URL 搜索
- 实时显示搜索结果

#### 3. 访问书签
- 点击任意书签即可在新标签页中打开
- 频繁访问的书签会显示在顶部区域

#### 4. 管理书签
- 悬停在书签上显示删除按钮
- 点击删除按钮可以删除书签
- 删除前会弹出确认对话框

### 功能特性

#### 智能排序
- 书签按照访问频率自动排序
- 频繁访问的书签优先显示

#### 层级展示
- 文件夹以树状结构展示
- 支持无限层级的嵌套
- 点击文件夹可以展开/折叠

#### 搜索优化
- 支持模糊搜索
- 搜索结果实时更新
- 高亮显示匹配内容

#### 数据同步
- 自动同步 Chrome 书签数据
- 使用频率统计持久化存储

### 故障排除

#### 常见问题
1. **插件无法加载**: 检查 `manifest.json` 配置
2. **书签不显示**: 确保已授权书签访问权限
3. **搜索无结果**: 检查书签数据是否正确加载

#### 调试方法
- 使用 Chrome 开发者工具调试插件
- 查看 Console 输出错误信息
- 检查 Network 请求和 Storage 数据

### 更新日志

#### v1.0.0
- 初始版本发布
- 基本书签搜索和访问功能
- 频繁访问统计
- 书签删除功能
- 响应式界面设计

### 许可证

MIT License

### 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目。