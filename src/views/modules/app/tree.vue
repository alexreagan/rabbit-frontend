<template>
  <div id='container' class='mod-host-apply'>
  </div>
</template>

<script>
import G6 from '@antv/g6'
export default {
  data () {
    return {}
  },
  activated () {
    this.render()
  },
  methods: {
    getTreeNodes(tagIDs) {
      return this.$http({
        url: this.$http.adornUrl('/api/v3/tree/node?tagIDs=' + tagIDs),
        method: 'get'
      })
    },
    async render () {
      const nodes = await this.getTreeNodes()
      console.log('nodes', nodes)
      const data = nodes.data
      data.name = '根节点'

      const container = document.getElementById('container')
      const width = container.scrollWidth
      const height = container.scrollHeight || 800
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange (item, collapsed) {
                const data = item.get('model')
                data.collapsed = collapsed
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ]
        },
        defaultEdge: {
          type: 'cubic-horizontal'
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          radial: true,
          defalutPosition: [],
          getId: (d) => {
            console.log('ddd', d)
            return d.name
          },
          getHeight: () => {
            return 16
          },
          getWidth: () => {
            return 16
          },
          getVGap: () => {
            return 10
          },
          getHGap: () => {
            return 50
          },
          getSide: () => {
            return 'right'
          }
        }
      })

      let centerX = 0
      graph.node(function (node) {
        if (node.id === 'Modeling Methods') {
          centerX = node.x
        }

        return {
          label: node.id,
          labelCfg: {
            position:
              node.children && node.children.length > 0
                ? 'left'
                : node.x > centerX
                ? 'right'
                : 'left',
            offset: 5
          }
        }
      })

      graph.data(data)
      graph.render()
      graph.fitView()

      let count = 0
      graph.on('node:click', function (evt) {
        const item = evt.item

        const nodeId = item.get('id')
        const model = item.getModel()
        const children = model.children
        if (!children || children.length === 0) {
          const childData = {
            id: 'child-data-' + count,
            type: 'rect',
            children: [
              {
                id: 'x-' + count
              },
              {
                id: 'y-' + count
              }
            ]
          }
          graph.addChild(childData, nodeId)
          count++
        }
      })

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph || graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) return
          graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
      }
    }
  }
}
</script>
