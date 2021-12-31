export default {
  getEvents() {
    return {
      'node:mouseover': 'onMouseover',
      'node:mouseleave': 'onMouseleave',
      'node:mousedown': 'onMousedown',
      'node:mouseup': 'onMouseup',
      mouseup: 'onMouseup'
    }
  },
  onMouseover(e) {
    // console.log('hover-node: onMouseover')
    const self = this
    const item = e.item
    const graph = self.graph
    const group = item.getContainer()
    if (e.target.attrs.isOutPointOut || e.target.attrs.isOutPoint) {
      group.find(g => {
        if (g.attrs.isInPoint || g.attrs.isOutPoint) {
          g.attr('fill', '#fff')
        }
        if (g.attrs.isOutPoint) {
          if (g.attrs.id === e.target.attrs.parent) {
            group.find(gr => {
              if (gr.attrs.id === g.attrs.id) {
                gr.attr('fill', '#1890ff')
                gr.attr('opacity', 1)
              }
            })
          }
          if (g.attrs.id === e.target.attrs.id) {
            g.attr('fill', '#1890ff')
            g.attr('opacity', 1)
          }
        }
      })
      e.target.attr('cursor', 'crosshair')
      this.graph.paint()
    }
    if (item.hasState('selected')) {
      return
    } else {
      if (self.shouldUpdate.call(self, e)) {
        graph.setItemState(item, 'hover', true)
      }
    }
    graph.paint()
  },
  onMouseleave(e) {
    // console.log('hover-node: onMouseleave')
    const self = this
    const item = e.item
    const graph = self.graph
    const group = item.getContainer()
    group.find(g => {
      if (g.attrs.isInPoint || g.attrs.isOutPoint) {
        g.attr('fill', '#fff')
      }
    })
    if (self.shouldUpdate.call(self, e)) {
      if (!item.hasState('selected')) graph.setItemState(item, 'hover', false)
    }
    graph.paint()
  },
  onMousedown(e) {
    // 鼠标按钮在节点上按下（左键或者右键）时触发，不能通过键盘触发
    // console.log('hover-node: onMousedown')
    if (e.target.attrs.isOutPoint || e.target.attrs.isOutPointOut) {
      this.graph.setMode('addEdge')
    } else {
      this.graph.setMode('moveNode')
    }
  },
  onMouseup(e) {
    // 节点上按下的鼠标按钮被释放弹起时触发，不能通过键盘触发
    // console.log('hover-node: onMouseup')
  }
}
