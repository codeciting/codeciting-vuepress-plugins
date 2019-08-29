const loadScript = require('../node_modules/load-script2/index')

export default {
  updated () {
    this._loading = Promise.resolve().then(async () => {
      await loadEChartsScript()
      this._echartInstances = []
      const nodes = findEChartsNodes()
      if (nodes.length === 0) {
        return
      }
      nodes.forEach(node => {
        const { echartsWidth, echartsHeight } = node.dataset
        const div = document.createElement('div')
        div.style.width = echartsWidth
        div.style.height = echartsHeight
        div.style.margin = '12px auto'
        div.style.overflow = 'scroll'
        node.parentElement.replaceChild(div, node)
        const ei = echarts.init(div, 'default')
        this._echartInstances.push({
          instance: ei,
          originalNode: node,
          instanceNode: div
        })
        try {
          const json = eval(`(${node.innerText})`)
          ei.setOption(json)
        } catch (e) {
          console.error(e)
        }
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    this._loading.then(() => {
      if (!this._echartInstances || !this._echartInstances.length) {
        next()
        return
      }
      this._echartInstances.forEach(instance => {
        instance.instance.dispose()
        instance.instanceNode.parentElement.replaceChild(instance.originalNode, instance.instanceNode)
      })
      next()
    })
  }
}

let echartLoaded = false

function loadEChartsScript () {
  if (echartLoaded) {
    return echartLoaded
  }
  const link = document.getElementById('echarts-lib')
  if (!link) {
    return Promise.reject(new Error('Could not found echarts version info.'))
  }
  return echartLoaded = loadScript(link.href)
    .then(() => {
      window.echarts.registerTheme('default', {
        'seriesCnt': '3',
        'backgroundColor': 'rgba(255,255,255,0)',
        'titleColor': '#666666',
        'subtitleColor': '#999999',
        'textColorShow': false,
        'textColor': '#333',
        'markTextColor': '#ffffff',
        'color': [
          '#4ea397',
          '#22c3aa',
          '#7bd9a5',
          '#d0648a',
          '#f58db2',
          '#f2b3c9'
        ],
        'borderColor': '#ccc',
        'borderWidth': 0,
        'visualMapColor': [
          '#d0648a',
          '#22c3aa',
          '#adfff1'
        ],
        'legendTextColor': '#999999',
        'kColor': '#d0648a',
        'kColor0': 'transparent',
        'kBorderColor': '#d0648a',
        'kBorderColor0': '#22c3aa',
        'kBorderWidth': '1',
        'lineWidth': '3',
        'symbolSize': '8',
        'symbol': 'emptyCircle',
        'symbolBorderWidth': '2',
        'lineSmooth': false,
        'graphLineWidth': '1',
        'graphLineColor': '#cccccc',
        'mapLabelColor': '#28544e',
        'mapLabelColorE': 'rgb(52,158,142)',
        'mapBorderColor': '#999999',
        'mapBorderColorE': '#22c3aa',
        'mapBorderWidth': 0.5,
        'mapBorderWidthE': 1,
        'mapAreaColor': '#eeeeee',
        'mapAreaColorE': 'rgba(34,195,170,0.25)',
        'axes': [
          {
            'type': 'all',
            'name': '通用坐标轴',
            'axisLineShow': true,
            'axisLineColor': '#cccccc',
            'axisTickShow': false,
            'axisTickColor': '#333',
            'axisLabelShow': true,
            'axisLabelColor': '#999999',
            'splitLineShow': true,
            'splitLineColor': [
              '#eeeeee'
            ],
            'splitAreaShow': false,
            'splitAreaColor': [
              'rgba(250,250,250,0.05)',
              'rgba(200,200,200,0.02)'
            ]
          },
          {
            'type': 'category',
            'name': '类目坐标轴',
            'axisLineShow': true,
            'axisLineColor': '#333',
            'axisTickShow': true,
            'axisTickColor': '#333',
            'axisLabelShow': true,
            'axisLabelColor': '#333',
            'splitLineShow': false,
            'splitLineColor': [
              '#ccc'
            ],
            'splitAreaShow': false,
            'splitAreaColor': [
              'rgba(250,250,250,0.3)',
              'rgba(200,200,200,0.3)'
            ]
          },
          {
            'type': 'value',
            'name': '数值坐标轴',
            'axisLineShow': true,
            'axisLineColor': '#333',
            'axisTickShow': true,
            'axisTickColor': '#333',
            'axisLabelShow': true,
            'axisLabelColor': '#333',
            'splitLineShow': true,
            'splitLineColor': [
              '#ccc'
            ],
            'splitAreaShow': false,
            'splitAreaColor': [
              'rgba(250,250,250,0.3)',
              'rgba(200,200,200,0.3)'
            ]
          },
          {
            'type': 'log',
            'name': '对数坐标轴',
            'axisLineShow': true,
            'axisLineColor': '#333',
            'axisTickShow': true,
            'axisTickColor': '#333',
            'axisLabelShow': true,
            'axisLabelColor': '#333',
            'splitLineShow': true,
            'splitLineColor': [
              '#ccc'
            ],
            'splitAreaShow': false,
            'splitAreaColor': [
              'rgba(250,250,250,0.3)',
              'rgba(200,200,200,0.3)'
            ]
          },
          {
            'type': 'time',
            'name': '时间坐标轴',
            'axisLineShow': true,
            'axisLineColor': '#333',
            'axisTickShow': true,
            'axisTickColor': '#333',
            'axisLabelShow': true,
            'axisLabelColor': '#333',
            'splitLineShow': true,
            'splitLineColor': [
              '#ccc'
            ],
            'splitAreaShow': false,
            'splitAreaColor': [
              'rgba(250,250,250,0.3)',
              'rgba(200,200,200,0.3)'
            ]
          }
        ],
        'axisSeperateSetting': false,
        'toolboxColor': '#999999',
        'toolboxEmpasisColor': '#666666',
        'tooltipAxisColor': '#cccccc',
        'tooltipAxisWidth': 1,
        'timelineLineColor': '#4ea397',
        'timelineLineWidth': 1,
        'timelineItemColor': '#4ea397',
        'timelineItemColorE': '#4ea397',
        'timelineCheckColor': '#4ea397',
        'timelineCheckBorderColor': 'rgba(60,235,210,0.3)',
        'timelineItemBorderWidth': 1,
        'timelineControlColor': '#4ea397',
        'timelineControlBorderColor': '#4ea397',
        'timelineControlBorderWidth': 0.5,
        'timelineLabelColor': '#4ea397',
        'datazoomBackgroundColor': 'rgba(255,255,255,0)',
        'datazoomDataColor': 'rgba(222,222,222,1)',
        'datazoomFillColor': 'rgba(114,230,212,0.25)',
        'datazoomHandleColor': '#cccccc',
        'datazoomHandleWidth': '100',
        'datazoomLabelColor': '#999999'
      })
    })
}

function findEChartsNodes () {
  return document.querySelectorAll('[data-echarts]')
}
