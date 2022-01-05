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
import iconDir from './icon/dir.png'
import iconDocker from './icon/docker.png'
import iconTag from './icon/tag.png'
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
      if (node.next) {
        // 有子节点
        Object.values(node.next).forEach(element => {
          element.classify = 'Children'
          element.img = iconDir
          children.push(element)
        })
        if (node.unTaggedHosts) {
          node.unTaggedHosts.forEach(element => {
            element.classify = 'UnTaggedHost'
            element.img = iconTag
            children.push(element)
          })
        }
        if (node.unTaggedPods) {
          node.unTaggedPods.forEach(element => {
            element.classify = 'UnTaggedPod'
            element.img = iconDocker
            children.push(element)
          })
        }
      } else {
        // 没有子节点
        if (node.relatedHosts) {
          node.relatedHosts.forEach(element => {
            element.classify = 'RelatedHost'
            element.img = iconTag
            children.push(element)
          })
        }
        if (node.relatedPods) {
          node.relatedPods.forEach(element => {
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
      this.counter += 1
      node.ID = node.id
      node.id = '' + this.counter + '-' + node.name
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
      const container = document.getElementById('container')
      const width = container.scrollWidth
      const height = container.scrollHeight
      this.graph = new G6.TreeGraph({
        container: 'tree',
        fitView: true,
        width,
        height,
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

      let self = this
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
