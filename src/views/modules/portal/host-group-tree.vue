<template>
  <div class="mod-host-group">
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox
      draggable
      ref="tree"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-click="nodeClickHandle"
      @node-drag-start="dragStartHandle"
      @node-drag-enter="dragEnterHandle"
      @node-drag-leave="dragLeaveHandle"
      @node-drag-over="dragOverHandle"
      @node-drag-end="dragEndHandle"
      @node-drop="dropHandle"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <el-tooltip v-if="data.desc" class="item" effect="dark" :content="data.desc" placement="right">
          <span v-if="data.isWarning === true" class="box alarm">{{ node.label }}</span>
          <span v-else>{{ node.label }}</span>
        </el-tooltip>
        <el-tooltip v-else disabled="true" class="item" effect="dark" :content="data.desc" placement="right">
          <span v-if="data.isWarning === true" class="box alarm">{{ node.label }}</span>
          <span v-else>{{ node.label }}</span>
        </el-tooltip>
<!--        <span>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            @click="() => append(data)">-->
<!--            Append-->
<!--          </el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            size="mini"-->
<!--            @click="() => remove(node, data)">-->
<!--            Delete-->
<!--          </el-button>-->
<!--        </span>-->
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        id: 0
      },
      filterText: '',
      dataListLoading: false,
      props: {
        // isLeaf: 'isLeaf',
        children: 'children',
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
    // 获取数据列表
    // getDataList () {
    //   this.dataListLoading = true
    //   this.$http({
    //     url: this.$http.adornUrl('/api/v1/host_group/tree'),
    //     method: 'get',
    //     params: this.$http.adornParams({
    //       'id': this.dataForm.id
    //     })
    //   }).then(({data}) => {
    //     if (data && !data.error) {
    //       this.dataList = data
    //     } else {
    //       this.dataList = []
    //     }
    //     this.dataListLoading = false
    //   })
    // },
    // 点击树形结构
    nodeClickHandle (node, checked, indeterminate) {
      if (node.ip) {
        this.$router.push({ name: 'host-detail', params: {id: node.id} })
      }
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
      if (draggingNode.data.parent) {
        // 拖动host group节点
        this.$http({
          url: this.$http.adornUrl('/api/v1/host_group/move'),
          method: 'post',
          params: this.$http.adornParams({
            'id': draggingNode.data.id,
            'parent': dropNode.data.id
          })
        }).then(() => {
          dropNode.data.isLeaf = false
          dropNode.loaded = false
          dropNode.expand()
        }).catch((error) => {
          this.$message.error(error.message)
        })
      } else {
        // 拖动host节点
        this.$http({
          url: this.$http.adornUrl('/api/v1/host_group/bind_host'),
          method: 'post',
          params: this.$http.adornParams({
            'hostId': draggingNode.data.id,
            'groupId': dropNode.data.id
          })
        }).then(() => {
          dropNode.data.isLeaf = true   // 目标节点设置为叶子节点
          dropNode.loaded = false
          dropNode.expand()
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    },
    allowDrop (draggingNode, dropNode, type) {
      // console.log(draggingNode, dropNode, type)
      if (type !== 'inner') {
        return false
      }
      if (!dropNode.data.children && !dropNode.data.ip) {
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
      // console.log(node)
      if (node.level === 0) {
        this.$http({
          url: this.$http.adornUrl('/api/v1/host_group/tree'),
          method: 'get',
          params: this.$http.adornParams({
            'id': this.dataForm.id
          })
        }).then(({data}) => {
          resolve(data)
        }).catch((error) => {
          this.$message.error(error.message)
        })
      } else if (node.data.isLeaf === false) {
        this.$http({
          url: this.$http.adornUrl('/api/v1/host_group/children'),
          method: 'get',
          params: this.$http.adornParams({
            'id': node.data.id
          })
        }).then(({data}) => {
          if (data) {
            resolve(data)
          } else {
            resolve([])
          }
        }).catch((error) => {
          this.$message.error(error.message)
        })
      } else if (node.data.isLeaf === true) {
        this.$http({
          url: this.$http.adornUrl('/api/v1/host_group/hosts'),
          method: 'get',
          params: this.$http.adornParams({
            'id': node.data.id
          })
        }).then(({data}) => {
          if (data) {
            resolve(data)
          } else {
            resolve([])
          }
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
      resolve([])
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
