<template>
  <!-- <el-descriptions title="pod详情"> -->
    <!-- <el-descriptions-item v-for="(item, index) in podAttr" :key="index" :label="index">{{item}}</el-descriptions-item> -->
  <!-- </el-descriptions> -->
  <div class="mod-pod-detail">
    <el-form ref="form" :model="formData">
      <el-form-item label="名称">
        <a @click="clickPodHandle(formData.name)">{{formData.name}}</a>
      </el-form-item>
      <el-form-item label="项目空间">{{formData.namespace}}</el-form-item>
      <el-form-item label="hostIP">{{formData.hostIp}}</el-form-item>
      <el-form-item label="hostName">{{formData.hostName}}</el-form-item>
      <el-form-item label="pod IP">{{formData.podIp}}</el-form-item>
      <el-form-item label="服务名称">
        <a @click="clickServiceHandle(formData.serviceName)">{{formData.serviceName}}</a>
      </el-form-item>
      <el-form-item label="状态">{{formData.status}}</el-form-item>
      <el-form-item label="类型">{{formData.type}}</el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        formData: {}
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        let id = this.$route.query.id || 0
        this.$http({
          url: this.$http.adornUrl('/api/v1/caas/pod/info'),
          method: 'get',
          params: this.$http.adornParams({
            id: id
          })
        }).then(({data}) => {
          this.formData = data
        }).catch((error) => {
          this.$message.error(error.message)
        })
      },
      clickPodHandle (name) {
        window.open(window.SITE_CONFIG['caasUrl'] + '/paas/service-mgmt/pod/' + name, '_blank')
      },
      clickServiceHandle (serviceName) {
        window.open(window.SITE_CONFIG['caasUrl'] + '/paas/service/' + serviceName + '?type=deployment', '_blank')
      }
    }
  }
</script>
