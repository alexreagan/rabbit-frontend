<template>
  <div>
    <el-descriptions title="机器信息">
      <el-descriptions-item v-for="(item, index) in hostAttr" :key="index" :label="index">{{item}}</el-descriptions-item>
    </el-descriptions>
    <el-link type="primary" target="_blank" :underline="false" :href="detailSrc">grafana详情</el-link>
    <iframe :src="src" ref="ifm" id="ifm" border="no" scrolling="no" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        detailSrc: '',
        src: '',
        hostAttr: []
      }
    },
    activated () {
      this.getDataList()
    },
    mounted () {
      function changeIframeSize () {
        const ifm = document.getElementById('ifm')
        const deviceWidth = document.body.clientWidth
        const deviceHeight = document.body.clientHeight
        ifm.style.width = Number(deviceWidth) + 'px'
        ifm.style.height = Number(deviceHeight) + 'px'
      }
      changeIframeSize()
      window.onresize = function () {
        changeIframeSize()
      }
    },
    methods: {
      getDataList () {
        let id = this.$route.params.id
        let ip = this.$route.params.ip
        this.$http({
          url: this.$http.adornUrl('/api/v1/host/detail'),
          method: 'get',
          params: this.$http.adornParams({
            'id': id,
            'ip': ip
          })
        }).then(({data}) => {
          // console.log(data)
          this.hostAttr = data

          let toTime = new Date().getTime()
          let fromTime = new Date(toTime - 24 * 60 * 60 * 1000).getTime()
          this.detailSrc = window.SITE_CONFIG['grafanaUrl'] + '/d/dz3vRJIGz/singlevm?orgId=1&var-cloudPoolName=' +
            data.cloudPoolName + '&var-prodIp=' + data.ip + '&from=' + fromTime + '&to=' + toTime
          this.src = this.detailSrc + '&kiosk'
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    }
  }
</script>
