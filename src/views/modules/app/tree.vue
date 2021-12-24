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
    this.render()
  },
  watch: {
    selectedKey(val) {
      console.log('selectedKey', this.selectedKey)
      // 根据点击选中的节点，获取子节点数据
    }
  },
  methods: {
    getTreeNodes(tagIDs) {
      return this.$http({
        url: this.$http.adornUrl('/api/v3/tree/node?tagIDs=' + tagIDs),
        method: 'get'
      })
    },
    async render () {
      // const nodes = await this.getTreeNodes()
      // console.log('nodes', nodes)
      this.data = this.mockData()
    },
    labelClassName: function(data) {
      return 'clickable-node'
    },
    renderContent: function(h, data) {
      return data.name
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
    },
    mockData() {
      return {
        "id": 1,
        "name": "TEST1",
        "cnName": "测试1",
        // "shape": "treeNode",
        "children": [
          {
            "id": 2,
            "name": "TEST2",
            "cnName": "测试2",
            // "shape": "treeNode",
            "children": [
              {
                "id": 4,
                "name": "TEST4",
                "cnName": "测试4",
                // "shape": "treeNode",
                "children": []
              },
              {
                "id": 5,
                "name": "TEST5",
                "cnName": "测试5",
                // "shape": "treeNode",
                "children": []
              }
            ]
          },
          {
            "id": 3,
            "name": "TEST3",
            "cnName": "测试3",
            // "shape": "treeNode",
            "children": []
          }
        ]
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
