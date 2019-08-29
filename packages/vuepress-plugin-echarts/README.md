# vuepress-plugin-echarts

> TODO: description

## Usage

```
const vuepressPluginEcharts = require('vuepress-plugin-echarts');

// TODO: DEMONSTRATE API
```

:::echarts 600px 400px
{
  xAxis: {
    type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line'
  }]
}
:::
