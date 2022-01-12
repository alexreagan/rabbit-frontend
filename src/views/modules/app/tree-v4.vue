<template>
  <div id="container" class="mod-app-tree-v4">
    <div class="select">
      <el-select
        v-model="selectTemplate"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="getTemplateList"
        :loading="tmpLoading"
      >
        <el-option
          v-for="item in templateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <Flow />
    <div id="tree"></div>
  </div>
</template>

<script>
import Flow from '@/components/g6-editor/components/Flow/index.vue'
import G6 from '@antv/g6'
import iconDir from './icon/black_dir.svg'
import iconDocker from './icon/docker.svg'
import iconComputer from './icon/computer.svg'
// import iconTag from './icon/tag.png'
export default {
  components: {
    Flow
  },
  data() {
    return {
      data: {},
      graph: null,
      templateList: [],
      selectTemplate: 0,
      tmpLoading: false,
      counter: 0
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.getTemplateList('', true)
  },
  watch: {
    async selectTemplate(val) {
      const {data} = await this.getTreeNodes([], this.selectTemplate)
      this.data = data
      this.counter = 0
      this.transNodes(this.data)
      this.renderData(this.data)
    },
    data(val) {
      this.graph.read(this.data)
    }
  },
  methods: {
    // 根据路径和模板获取路径下所有子节点
    getTreeNodes(tagIDs = '', templateID = '') {
      return this.$http({
        url: this.$http.adornUrl('/api/v3/tree/node'),
        method: 'get',
        params: this.$http.adornParams({
          tagIDs,
          templateID
        })
      })
    },
    // 模版
    async getTemplateList(query = '', init) {
      this.tmpLoading = true
      const {data} = await this.$http({
        url: this.$http.adornUrl('/api/v1/template/all'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          limit: 20,
          name: query
        })
      })
      if (data && data.list) {
        this.templateList = data.list
        if (init && data.list.length > 0) {
          this.selectTemplate = data.list[0].id
        }
      } else {
        this.templateList = []
      }
      this.tmpLoading = false
    },
    getChildren(node) {
      let children = []
      let self = this
      if (node.next) {
        // 有子节点
        Object.values(node.next).forEach(element => {
          self.counter += 1
          element.ID = element.id
          element.id = '' + this.counter + '-' + element.name
          element.type = 'treeNode'
          element.classify = 'Children'
          element.img = iconDir
          children.push(element)
        })
        if (node.unTaggedNodes) {
          node.unTaggedNodes.forEach(element => {
            self.counter += 1
            element.ID = element.id
            element.id = '' + this.counter + '-' + element.name
            element.type = 'treeNode'
            element.classify = 'UnTaggedNode'
            element.img = iconComputer
            children.push(element)
          })
        }
        if (node.unTaggedPods) {
          node.unTaggedPods.forEach(element => {
            self.counter += 1
            element.ID = element.id
            element.id = '' + this.counter + '-' + element.name
            element.type = 'treeNode'
            element.classify = 'UnTaggedPod'
            element.img = iconDocker
            children.push(element)
          })
        }
      } else {
        // 没有子节点
        if (node.relatedNodes) {
          node.relatedNodes.forEach(element => {
            self.counter += 1
            element.ID = element.id
            element.id = '' + this.counter + '-' + element.name
            element.classify = 'RelatedNode'
            element.img = iconComputer
            children.push(element)
          })
        }
        if (node.relatedPods) {
          node.relatedPods.forEach(element => {
            self.counter += 1
            element.ID = element.id
            element.id = '' + this.counter + '-' + element.name
            element.classify = 'RelatedPod'
            element.img = iconDocker
            children.push(element)
          })
        }
      }
      children.forEach(element => {
        this.transNodes(element)
      })
      return children
    },
    // 将节点数据格式转换为g6能够识别的数据格式
    transNodes(node) {
      if (node.name === '') {
        node.name = 'ROOT'
      }
    //   this.counter += 1
    //   node.ID = node.id
    //   node.id = '' + this.counter + '-' + node.name
      node.children = this.getChildren(node)
      node.type = 'treeNode'
    },
    // 渲染
    renderData(data) {
      this.graph.data(data)
      this.graph.render()
    },
    // 初始化
    init() {
      // 提示菜单
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node'],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement('div')
          outDiv.style.width = 'fit-content'
          // outDiv.style.padding = '0px 0px 20px 0px';
          outDiv.innerHTML = ``
          if (e.item.getModel().remark !== undefined) {
            outDiv.innerHTML += `<div>描述: ${e.item.getModel().remark}</div>`
          }
          if (e.item.getModel().ip !== undefined) {
            outDiv.innerHTML += `<div>IP: ${e.item.getModel().ip}</div>`
          }
          return outDiv
        }
      })

      let self = this
      const contextMenu = new G6.Menu({
        getContent(evt) {
          const outDiv = document.createElement('div')
          outDiv.id = "contextMenu"
          outDiv.innerHTML = `
            <div style="padding: 0 10px;">
            <div style="margin-bottom: 6px;cursor: pointer;" name="tag-detail">标签详情</div>
            <div style="cursor: pointer;" name="tag-machines">查看全部机器</div>
            </div>`
          return outDiv
        },
        handleMenuClick: (target, item) => {
          const name = target.getAttribute('name')
          if (name === 'tag-detail') {
            self.$router.push({name: 'app-tag', query: {id: item.getModel().ID}})
          } else if (name === 'tag-machines') {
            self.$router.push({name: 'node-node', query: {'tagIDs': item.getModel().path}})
          }
        },
        // offsetX and offsetY include the padding of the parent container
        // 需要加上父级容器的 padding-left 16 与自身偏移量 10
        offsetX: 16 + 10,
        // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
        offsetY: 0,
        // the types of items that allow the menu show up
        // 在哪些类型的元素上响应
        itemTypes: ['node']
      })

      const container = document.getElementById('container')
      const width = container.scrollWidth
      const height = container.scrollHeight
      this.graph = new G6.TreeGraph({
        container: 'tree',
        fitView: true,
        width,
        height,
        plugins: [tooltip, contextMenu],
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
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
          defalutPosition: [],
          getId: function getId(d) {
            return d.id
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
      this.graph.node(function(node) {
        if (node.name === 'ROOT') {
          centerX = node.x
        }

        return {
          label: node.name,
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

      this.graph.on('node:click', function(evt) {
        const item = evt.item
        const nodeId = item.get('id')
        const model = item.getModel()
        if (model.classify !== 'Children') {
          return
        }
        const children = model.children
        if (!children || children.length === 0) {
          self
            .$http({
              url: self.$http.adornUrl('/api/v3/tree/node'),
              method: 'get',
              params: self.$http.adornParams({
                tagIDs: model.path,
                templateID: self.selectTemplate
              })
            })
            .then(({data}) => {
              self.transNodes(data)
              data.children.forEach(child => {
                self.graph.addChild(child, nodeId)
              })
            })
        }
      })

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!this.graph || this.graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) {
            return
          }
          this.graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
      }
    }
  }
}
</script>
<style scoped>
  #container {
    width: 100%;
    height: calc(100vh - 100px);
  }
</style>
