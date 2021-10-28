<template>
  <el-descriptions title="虚拟机申请">
    <el-descriptions-item>在资源池中将机器挂载到相应的群组即可</el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
      }
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
    }
  }
}
</script>
