import G6 from '@antv/g6'
import {uniqueId} from '../../utils'
const treeNode = {
  init() {
    console.log('ggggggggggg')
    G6.registerNode('treeNode', {
      draw(cfg, group) {
        console.log('eeeeeeeeee', cfg)
        let size = cfg.size
        if (!size) {
          size = [80, 20]
        }
        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0])
        const height = parseInt(size[1])
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2
        const mainId = 'rect' + uniqueId()
        const shape = group.addShape('rect', {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: '#ced4d9',
            fill: '#fff', // 此处必须有fill 不然不能触发事件
            radius: 4
          }
        })
        group.addShape('image', {
          attrs: {
            x: offsetX + 16,
            y: offsetY + 8,
            width: 20,
            height: 16,
            img: cfg.image,
            parent: mainId
          }
        })
        group.addShape('image', {
          attrs: {
            x: offsetX + width - 32,
            y: offsetY + 8,
            width: 16,
            height: 16,
            parent: mainId,
            img: cfg.stateImage
          }
        })

        if (cfg.label) {
          group.addShape('text', {
            attrs: {
              id: 'label' + uniqueId(),
              x: offsetX + width / 2,
              y: offsetY + height / 2,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.label,
              parent: mainId,
              fill: '#565758'
            }
          })
        }

        return shape
      },
      // 设置状态
      setState(name, value, item) {
        const group = item.getContainer()
        const shape = group.get('children')[0] // 顺序根据 draw 时确定

        const children = group.findAll(g => {
          return g.attrs.parent === shape.attrs.id
        })
        const circles = group.findAll(circle => {
          return circle.attrs.isInPoint || circle.attrs.isOutPoint
        })
        const selectStyles = () => {
          shape.attr('fill', '#f3f9ff')
          shape.attr('stroke', '#6ab7ff')
          shape.attr('cursor', 'move')
          children.forEach(child => {
            child.attr('cursor', 'move')
          })
          circles.forEach(circle => {
            circle.attr('opacity', 1)
          })
        }
        const unSelectStyles = () => {
          shape.attr('fill', '#fff')
          shape.attr('stroke', '#ced4d9')
          circles.forEach(circle => {
            circle.attr('opacity', 0)
          })
        }
        switch (name) {
          case 'selected':
          case 'hover':
            if (value) {
              selectStyles()
            } else {
              unSelectStyles()
            }
            break
        }
      }
    })
  }
}

export default treeNode
