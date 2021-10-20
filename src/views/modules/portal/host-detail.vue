<template>
  <el-descriptions title="机器信息">
    <el-descriptions-item v-for="(item, index) in hostAttr" :key="index" :label="index">{{item}}</el-descriptions-item>
  </el-descriptions>
</template>

<script>
  export default {
    data () {
      return {
        hostAttr: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        let id = this.$route.params.id || 1
        this.$http({
          url: this.$http.adornUrl('/api/v1/host/info/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.hostAttr = data
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    }
  }
</script>
