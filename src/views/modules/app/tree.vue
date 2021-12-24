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
import TreeNode from '@/components/tree-node'
export default {
  components: {Vue2OrgTree},
  data () {
    return {
      selected: {},
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
  },
  methods: {
    getTreeNodes(tagIDs = '') {
      return this.$http({
        url: this.$http.adornUrl('/api/v3/tree/node'),
        method: 'get',
        params: this.$http.adornParams({
          'tagIDs': tagIDs
        })
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
      const treeNodes = nodes.data
      this.initNodes(treeNodes)
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
      let label = ''
      if (data.type === 'UnTaggedHost') {
        label = `${data.ip}`
      } else if (data.type === 'UnTaggedPod') {
        label = `${data.hostName}(${data.hostIp})`
      } else {
        label = `${data.cnName}`
      }
      data.label = label
      return h(TreeNode, {
        props: {
          node: data,
          selected: this.selected
        }
      })
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
      this.selected = data
      this.$set(data, 'selectedKey', !data.selectedKey)
      if (data.type === 'Children' && (!data.children || data.children.length === 0)) {
        this.getTreeNodes(data.tagIds || []).then(res => {
          if (res && res.data) {
            const addNodes = {...data, ...res.data}
            this.initNodes(addNodes)
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
  border-radius: 20px !important;
  padding: 0 !important;
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
