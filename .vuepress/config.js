module.exports = {
  themeConfig: {
    sidebar: [
      '/',
      {
        title: 'Plugins',
        collapsable: false, // optional, defaults to true
        children: [
          {
            path: '/packages/vuepress-plugin-math/',
            title: 'Math'
          },
          {
            path: '/packages/vuepress-plugin-plantuml/',
            title: 'PlantUML'
          },
          {
            path: '/packages/vuepress-plugin-echarts/',
            title: 'ECharts'
          }
        ]
      }
    ]
  },
  plugins: [
    require('../packages/vuepress-plugin-math/lib'),
    require('../packages/vuepress-plugin-plantuml/lib'),
    require('../packages/vuepress-plugin-echarts/lib'),
    require('../packages/vuepress-plugin-gitinfo/lib')
  ]
}
