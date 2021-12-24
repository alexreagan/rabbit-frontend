<template>
  <div class="mod-tree-v3">
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox
      draggable
      ref="tree"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :expand-on-click-node="false"
      @node-click="nodeClickHandle"
      @node-drag-start="dragStartHandle"
      @node-drag-enter="dragEnterHandle"
      @node-drag-leave="dragLeaveHandle"
      @node-drag-over="dragOverHandle"
      @node-drag-end="dragEndHandle"
      @node-drop="dropHandle"
      @check-change="checkChangeHandle"
      @node-collapse="nodeCollapseHandle"
      @node-expand="nodeExpandHandle"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-tooltip v-if="data.remark" class="item" effect="dark" :content="data.remark" placement="right">
          <span>
            <icon-svg v-if="data.ip" name="computer" class="site-sidebar__menu-icon"></icon-svg>
            <icon-svg v-else-if="data.podIp" name="docker" class="site-sidebar__menu-icon"></icon-svg>
            <icon-svg v-else name="tag" class="site-sidebar__menu-icon"></icon-svg>
            {{ nodeName(node, data) }}
            <el-button v-if="data.ip === undefined" type="text" @click="tagClickHandle(node, data)" size="mini"><icon-svg name="eye"></icon-svg></el-button>
          </span>
        </el-tooltip>
        <el-tooltip v-else disabled class="item" effect="dark" :content="data.remark" placement="right">
          <span>
            <icon-svg v-if="data.ip" name="computer" class="site-sidebar__menu-icon"></icon-svg>
            <icon-svg v-else-if="data.podIp" name="docker" class="site-sidebar__menu-icon"></icon-svg>
            <icon-svg v-else name="tag" class="site-sidebar__menu-icon"></icon-svg>
            {{ nodeName(node, data) }}
            <el-button v-if="data.ip === undefined" type="text" @click="tagClickHandle(node, data)" size="mini"><icon-svg name="eye"></icon-svg></el-button>
          </span>
        </el-tooltip>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        id: 0,
        nodeType: 'vmGroup'
      },
      filterText: '',
      dataListLoading: false,
      props: {
        children: 'subTags',
        label: 'name'
      }
    }
  },
  components: {
  },
  activated () {
    // this.getDataList()
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 点击树形结构
    nodeClickHandle (node, checked, indeterminate) {
      console.log('nodeClickHandle', node)
      if (node.ip) {
        this.$router.push({ name: 'host-detail', params: {id: node.id} })
      }
    },
    // 点击tag
    tagClickHandle (node, data) {
      let categoryIDs = []
      let tagIDs = []
      let n = node
      while (n.data) {
        categoryIDs.push(n.data.categoryID)
        tagIDs.push(n.data.id)
        if (n.parent) {
          n = n.parent
        } else {
          break
        }
      }
      this.$router.push({ name: 'node-host', params: {tagIDs: JSON.stringify(tagIDs.reverse())} })
    },
    checkChangeHandle (data, checked, node) {
      // console.log('checkChangeHandle')
    },
    nodeCollapseHandle (data, node, arg) {
      // console.log('nodeCollapseHandle')
    },
    nodeExpandHandle (data, node, arg) {
      // console.log('nodeExpandHandle')
      node.loaded = false
      node.expand()
    },
    dragStartHandle (node, ev) {
      // console.log(node, ev)
    },
    dragEnterHandle (draggingNode, dropNode, ev) {
      // 拖拽进入其他节点时触发的事件
      // console.log(draggingNode, dropNode, ev)
    },
    dragLeaveHandle (draggingNode, dropNode, ev) {
      // 拖拽离开某个节点时触发的事件
      // console.log(draggingNode, dropNode, ev)
    },
    dragOverHandle (draggingNode, dropNode, ev) {
      // 在拖拽节点时触发的事件（类似浏览器的mouseover事件）
      // console.log(draggingNode, dropNode, ev)
    },
    dragEndHandle (draggingNode, dropNode, dropType, ev) {
      // 拖拽结束时（可能未成功）触发的事件
      // console.log(draggingNode, dropNode, dropType, ev)
    },
    dropHandle (draggingNode, dropNode, dropType, ev) {
      // 拖拽成功完成时触发的事件
      // console.log(draggingNode, dropNode, dropType, ev)
      this.$http({
        url: this.$http.adornUrl('/api/v1/tree/dragging'),
        method: 'post',
        params: this.$http.adornParams({
          'draggingNodeID': draggingNode.data.id,
          'draggingNodeType': draggingNode.data.type,
          'dropNodeID': dropNode.data.id,
          'dropNodeType': dropNode.data.type
        })
      }).then(() => {
        dropNode.loaded = false
        dropNode.expand()
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    allowDrop (draggingNode, dropNode, type) {
      // console.log(draggingNode, dropNode, type)
      if (type !== 'inner') {
        return false
      }
      if (dropNode.data.type && !dropNode.data.children) {
        // 拖到host group节点
        return true
      } else {
        // 拖到host节点
        return false
      }
    },
    allowDrag (draggingNode) {
      return true
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    loadNode (node, resolve) {
      // console.log('loadNode', node)
      if ((node.data && node.data.ip) || (node.data && node.data.podIp)) {
        return resolve([])
      }
      // console.log(node)
      let categoryIDs = []
      let tagIDs = []
      let n = node
      while (n.data) {
        categoryIDs.push(n.data.categoryID)
        tagIDs.push(n.data.id)
        if (n.parent) {
          n = n.parent
        } else {
          break
        }
      }
      this.$http({
        url: this.$http.adornUrl('/api/v3/tree/children'),
        method: 'get',
        params: this.$http.adornParams({
          'categoryIDs': categoryIDs.reverse(),
          'tagIDs': tagIDs.reverse()
        })
      }).then(({data}) => {
        if (!data) {
          return resolve([])
        }
        resolve(data)
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    nodeName (node, data) {
      if (data.ip) {
        // 机器
        return data.ip
      } else {
        // 标签
        return data.name
      }
    },
    append (data) {
      const newChild = {label: '', children: []}
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>

<style>
@keyframes fade {
  from {
    opacity: 1.0;
  }
  50% {
    opacity: 0.2;
  }
  to {
    opacity: 1.0;
  }
}
@-webkit-keyframes fade {
  from {
    opacity: 1.0;
  }
  50% {
    opacity: 0.2;
  }
  to {
    opacity: 1.0;
  }
}
.box.alarm {
  color: red;
  animation: fade 1000ms infinite;
  -webkit-animation: fade 1000ms infinite;
}
</style>
