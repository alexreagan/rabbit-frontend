<template>
  <div>
    <el-row>
      <el-button>CPU配额<span>{{totalCpuCount}}</span>核</el-button>
      <el-button>Memory配额<span>{{totalMemoryCount}}</span>G</el-button>
      <el-button>共享盘<span>{{totalSharedVolume}}</span>G</el-button>
      <el-button>本地盘<span>{{totalLocalVolume}}</span>G<br></el-button>
    </el-row>
    <el-row>
      <el-button>CPU已分配<span>{{usedCpuCount}}</span>核</el-button>
      <el-button>Memory已分配<span>{{usedMemoryCount}}</span>G</el-button>
    </el-row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        totalCpuCount: 0,
        totalMemoryCount: 0,
        totalSharedVolume: 0,
        totalLocalVolume: 0,
        usedCpuCount: 0,
        usedMemoryCount: 0
      }
    },
    mounted () {
      this.getDataList()
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/api/v1/chart/container/stat'),
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          this.totalCpuCount = data.totalCpuCount
          this.totalMemoryCount = data.totalMemoryCount
          this.totalSharedVolume = data.totalSharedVolume
          this.totalLocalVolume = data.totalLocalVolume
          this.usedCpuCount = data.usedCpuCount
          this.usedMemoryCount = data.usedMemoryCount
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    }
  }
</script>
