<template>
  <div class="tree-page">
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
    <div class="tree">
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
      collapsable: true,
      templateList: [],
      selectTemplate: 0,
      tmpLoading: false
    }
  },
  activated () {
    this.render()
  },
  mounted() {
    // this.render()
  },
  watch: {
    async selectTemplate(val) {
      console.log('this.selectTemplate', this.selectTemplate)
      const nodes = await this.getTreeNodes([], this.selectTemplate)
      const treeNodes = nodes.data
      this.initNodes(treeNodes)
      if (nodes && nodes.data) {
        const finded = this.templateList.find(item => item.id === this.selectTemplate) || {}
        // 模板名称
        nodes.data.cnName = finded.name
        nodes.data.tagIds = [nodes.data.id]
        nodes.data.expand = true
        this.data = nodes.data
      }
    }
  },
  methods: {
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
      this.getTemplateList('', true)
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
    },
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
.select {
  margin-bottom: 20px;
}
</style>
