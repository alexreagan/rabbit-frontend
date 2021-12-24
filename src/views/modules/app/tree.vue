<template>
  <div class="tree-page">
    <vue2-org-tree
      :data="data"
      :props="{label: 'name', children: 'children', expand: 'expand'}"
      :horizontal="horizontal"
      :collapsable="collapsable"
      :label-class-name="labelClassName"
      :render-content="renderContent"
      selected-class-name="bg-tomato"
      selected-key="selectedKey"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
    />
  </div>
</template>

<script>
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'
export default {
  components: {Vue2OrgTree},
  data () {
    return {
      selectedKey: '',
      props: {label: 'name', children: 'children', expand: 'expand'},
      data: {},
      expandAll: false,
      horizontal: true,
      collapsable: true
    }
  },
  activated () {
    this.render()
  },
  mounted() {
    // this.render()
  },
  watch: {
    selectedKey(val) {
      console.log('selectedKey', this.selectedKey)
      // 根据点击选中的节点，获取子节点数据
    }
  },
  methods: {
    getTreeNodes(tagIDs = '') {
      console.log('tagIDstagIDs', tagIDs)
      return this.$http({
        url: this.$http.adornUrl('/api/v3/tree/node' + (tagIDs ? `?tagIDs[]=${tagIDs || ''}` : '')),
        method: 'get'
      })
    },
    initNodes(treeNodes) {
      if (treeNodes && treeNodes.children) {
        treeNodes.children.map(item => {
          const parentTagIds = treeNodes.tagIds || []
          item.tagIds = [...parentTagIds, item.id]
          item.expand = true
          if (item.children && item.children.length > 0) {
            this.initNodes(item)
          }
          return item
        })
      }
    },
    async render () {
      const nodes = await this.getTreeNodes()
      console.log('nodes', nodes.data)
      const treeNodes = nodes.data
      this.initNodes(treeNodes)
      console.log('treeNodes', treeNodes)
      if (nodes && nodes.data) {
        // 模板名称
        nodes.data.cnName = '测试模板'
        nodes.data.name = 'test tmp'
        nodes.data.tagIds = [nodes.data.id]
        nodes.data.expand = true
        this.data = nodes.data
      }
    },
    labelClassName: function(data) {
      return 'clickable-node'
    },
    renderContent: function(h, data) {
      if (data.type === 'UnTaggedHost') {
        return `${data.ip}`
      } else if (data.type === 'UnTaggedPod') {
        return `${data.hostName}(${data.hostIp})`
      } else {
        return `${data.cnName}`
      }
    },
    onExpand: function(e, data) {
      if ('expand' in data) {
        data.expand = !data.expand

        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    onNodeClick: function(e, data) {
      console.log('onNodeClick: %o', data)
      this.selectedKey = data.id
      this.$set(data, 'selectedKey', !data.selectedKey)
      if (!data.children || data.children.length === 0) {
        this.getTreeNodes(data.tagIds || []).then(res => {
          if (res && res.data) {
            const addNodes = res.data
            this.initNodes(addNodes)
            console.log('addNodesaddNodes', addNodes)
            this.$set(data, 'children', addNodes.children)
          }
        })
      }
    },
    collapse: function(list) {
      var _this = this
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false
        }

        child.children && _this.collapse(child.children)
      })
    },
    expandChange: function() {
      this.toggleExpand(this.data, this.expandAll)
    },
    toggleExpand: function(data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    }
  }
}
</script>
<style>
.org-tree-node-label-inner {
  border-radius: 20px;
}
.clickable-node {
  cursor: pointer;
}
.bg-tomato {
  /* background-color: tomato;
  color: #ffffff; */
}
</style>
<style scoped>
.tree-page {
  width: 100%;
  height: 100%;
}

</style>
