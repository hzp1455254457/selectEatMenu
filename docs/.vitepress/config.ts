import { defineConfig } from 'vitepress'

const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  lang: 'zh-CN',
  title: 'SelectEatMenu 文档',
  description: '项目文档预览与跳转',
  base: isGithubActions ? '/selectEatMenu/' : '/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速搭建', link: '/framework-setup' },
      { text: 'PRD', link: '/PRD' },
      { text: 'UI 线框图', link: '/UI-Wireframe' }
    ],
    sidebar: [
      {
        text: '文档',
        items: [
          { text: '概览', link: '/' },
          { text: '快速搭建', link: '/framework-setup' },
          { text: 'PRD', link: '/PRD' },
          { text: 'UI 线框图', link: '/UI-Wireframe' }
        ]
      }
    ],
    outline: 'deep',
    search: { provider: 'local' }
  }
})
