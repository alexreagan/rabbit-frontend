<template>
  <el-row>
    <el-button>共收纳机器<span>{{totalHostCount}}</span>台，共<span>{{totalCpuCount}}</span>核</el-button>
    <el-button>已分配机器<span>{{usedHostCount}}</span>台，共<span>{{usedCpuCount}}</span>核</el-button>
    <el-button>未分配机器<span>{{unUsedHostCount}}</span>台，共<span>{{unUsedCpuCount}}</span>核<br></el-button>
    <ul>
      <li v-for="(item, index) in subStat" :key="index">
        <el-button>物理子系统: {{item.name}}</el-button>
        <el-button>共收纳机器<span>{{item.totalHostCount}}</span>台，共<span>{{item.totalCpuCount}}</span>核</el-button>
        <el-button>已分配机器<span>{{item.usedHostCount}}</span>台，共<span>{{item.usedCpuCount}}</span>核</el-button>
        <el-button>未分配机器<span>{{item.unUsedHostCount}}</span>台，共<span>{{item.unUsedCpuCount}}</span>核</el-button>
      </li>
    </ul>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        totalHostCount: 0,
        usedHostCount: 0,
        unUsedHostCount: 0,
        totalCpuCount: 0,
        usedCpuCount: 0,
        unUsedCpuCount: 0,
        subStat: []
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
          url: this.$http.adornUrl('/api/v1/chart/vm/stat'),
          method: 'get'
        }).then(({data}) => {
          console.log(data)
          this.totalHostCount = data.totalHostCount
          this.usedHostCount = data.usedHostCount
          this.unUsedHostCount = data.unUsedHostCount
          this.totalCpuCount = data.totalCpuCount
          this.usedCpuCount = data.usedCpuCount
          this.unUsedCpuCount = data.unUsedCpuCount
          this.subStat = data.subStat
        }).catch((error) => {
          this.$message.error(error.message)
        })
      }
    }
  }
</script>
