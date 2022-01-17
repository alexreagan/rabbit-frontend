import G6 from '@antv/g6'
import {uniqueId} from '../../utils'
const treeNode = {
  init() {
    G6.registerNode('treeNode', {
      draw(cfg, group) {
        let size = cfg.size
        if (!size) {
          size = 8
        }
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -size
        const offsetY = -size
        const mainId = 'rect' + uniqueId()
        const shape = group.addShape('circle', {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            r: size,
            lineWidth: 0.5,
            stroke: '#ced4d9',
            opacity: 0.7,
            fill: '#fff' // 此处必须有fill 不然不能触发事件
          }
        })
        group.addShape('image', {
          attrs: {
            x: offsetX - 5,
            y: offsetY - 5,
            width: 10,
            height: 10,
            img: cfg.img,
            parent: mainId
          }
        })

        if (cfg.label) {
          group.addShape('text', {
            attrs: {
              id: 'label' + uniqueId(),
              x: offsetX,
              y: offsetY + size + 7,
              textAlign: 'center',
              textBaseline: 'middle',
              text: cfg.label,
              fontSize: 8,
              parent: mainId,
              fill: '#565758'
            }
          })
        }

        return shape
      }
    })
  }
}

export default treeNode
