<template>
  <div id='container' class='mod-app-tree-v4'>
    <div class="select">
      <el-select
        v-model="selectTemplate"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="getTemplateList"
        :loading="tmpLoading">
        <el-option
          v-for="item in templateList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div id='tree'></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
export default {
  data () {
    return {
      data: {},
      graph: null,
      templateList: [],
      selectTemplate: 0,
      tmpLoading: false,
      counter: 0
    }
  },
  activated () {
    this.init()
    this.getTemplateList('', true)
  },
  watch: {
    async selectTemplate(val) {
      const {data} = await this.getTreeNodes([], this.selectTemplate)
      this.data = data
      this.transNodes(this.data)
      this.refresh()
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
    async getTemplateList (query = '', init) {
      this.tmpLoading = true
      const {data} = await this.$http({
        url: this.$http.adornUrl('/api/v1/template/all'),
        method: 'get',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 20,
          'name': query
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
    // 将节点数据格式转换为g6能够识别的数据格式
    transNodes(node) {
      if (node.name === '') {
        node.name = 'ROOT'
      }
      this.counter += 1
      node.ID = node.id
      node.id = node.name + '-' + this.counter
      let children = []
      if (node.next) {
        Object.values(node.next).forEach((element) => {
          element.type = 'Children'
          children.push(element)
        })
      }
      if (node.unTaggedHosts) {
        node.unTaggedHosts.forEach((element) => {
          element.type = 'UnTaggedHost'
          children.push(element)
        })
      }
      if (node.unTaggedPods) {
        node.unTaggedPods.forEach((element) => {
          element.type = 'UnTaggedPods'
          children.push(element)
        })
      }
      children.forEach((element) => {
        this.transNodes(element)
      })
      node.children = children
    },
    // 渲染
    refresh() {
      this.graph.data(this.data)
      this.graph.render()
    },
    // 初始化
    init() {
      const container = document.getElementById('tree')
      const width = container.scrollWidth
      const height = container.scrollHeight || 800
      this.graph = new G6.TreeGraph({
        container: 'tree',
        fitView: true,
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
          defalutPosition: [],
          getId: function getId (d) {
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
      this.graph.node(function (node) {
        if (node.name === '') {
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

    //   console.log('render...', this.data)
    //   this.graph.data(this.data)
    //   this.graph.render()
    //   this.graph.fitView()

      this.graph.on('node:click', function (evt) {
        const item = evt.item
        const nodeId = item.get('id')
        const model = item.getModel()
        const children = model.children
        if (!children || children.length === 0) {
          this.$http({
            url: this.$http.adornUrl('/api/v3/tree/node'),
            method: 'get',
            params: this.$http.adornParams({
              tagIDs: item.path,
              templateID: this.selectTemplate
            })
          }).then((data) => {
            data.list.forEach((node) => {
              this.graph.addChild(node, nodeId)
            })
          })
        }
      })

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!this.graph || this.graph.get('destroyed')) return
          if (!container || !container.scrollWidth || !container.scrollHeight) return
          this.graph.changeSize(container.scrollWidth, container.scrollHeight)
        }
      }
    }
  }
}
</script>
