<template>
  <div class="node-item" :class="active ? 'active-node' : ''">
    <icon-svg :name="iconName" class="node-icon"></icon-svg>
    <div class="node-label">{{node.label}}</div>
  </div>
</template>

<script>
export default {
  name: 'tree-node',
  props: {
    node: {
      type: Object,
      default: {}
    },
    selected: {
      type: Object,
      default: {}
    }
  },
  computed: {
    active() {
      return this.selected.type + this.selected.id === this.node.type + this.node.id
    },
    iconName() {
      let res = 'dir'
      if (this.node.type === 'UnTaggedHost') {
        res = 'computer2'
      } else if (this.node.type === 'UnTaggedPod') {
        res = 'docker'
      }
      return res
    }
  },
  methods: {

  }
}
</script>
<style scoped>
.node-item {
  padding: 10px 15px;
  border-radius: 20px !important;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.active-node {
  background-color: #17B3A3;
  color: #ffffff;
}
.node-icon {
  margin-right: 6px;
}
.node-label {

}
</style>
