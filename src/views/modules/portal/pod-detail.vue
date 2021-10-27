<template>
  <el-descriptions title="pod信息">
    <el-descriptions-item v-for="(item, index) in podAttr" :key="index" :label="index">{{item}}</el-descriptions-item>
  </el-descriptions>
</template>

<script>
  export default {
    data () {
      return {
        podAttr: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        let id = this.$route.params.id || 1
        this.$http({
          url: this.$http.adornUrl('/api/v1/caas/pod/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.podAttr = data
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    }
  }
</script>
