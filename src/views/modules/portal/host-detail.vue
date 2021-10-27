<template>
  <div>
    <el-descriptions title="机器信息">
      <el-descriptions-item v-for="(item, index) in hostAttr" :key="index" :label="index">{{item}}</el-descriptions-item>
    </el-descriptions>
    <iframe :src="src" ref="ifm" id="ifm" border="no" scrolling="no" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
  export default {
    data () {
      return {
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
        let id = this.$route.params.id || 1
        this.$http({
          url: this.$http.adornUrl('/api/v1/host/info/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          this.hostAttr = data

          let toTime = new Date().getTime()
          let fromTime = new Date(toTime - 24 * 60 * 60 * 1000).getTime()
          this.src = 'http://128.194.223.5:33000/d/dz3vRJIGz/singlevm?orgId=1&kiosk&var-cloudPoolName=' +
            data.cloudPoolName + '&var-prodIp=' + data.ip + '&from=' + fromTime + '&to=' + toTime
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    }
  }
</script>
