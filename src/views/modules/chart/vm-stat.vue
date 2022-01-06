<template>
  <el-row>
    <ul>
      <li>共收纳机器<span>{{totalNodeCount}}</span>台，共<span>{{totalCpuCount}}</span>核</li>
      <li>已分配机器<span>{{usedNodeCount}}</span>台，共<span>{{usedCpuCount}}</span>核</li>
      <li>未分配机器<span>{{unUsedNodeCount}}</span>台，共<span>{{unUsedCpuCount}}</span>核</li>
    </ul>

    <el-table :data="subStat" stripe style="width: 100%">
      <el-table-column prop="name" label="物理子系统"></el-table-column>
      <el-table-column prop="totalNodeCount" label="共收纳机器"></el-table-column>
      <el-table-column prop="totalCpuCount" label="核数"></el-table-column>
      <el-table-column prop="usedNodeCount" label="已分配机器"></el-table-column>
      <el-table-column prop="usedCpuCount" label="核数"></el-table-column>
      <el-table-column prop="unUsedNodeCount" label="未分配机器"></el-table-column>
      <el-table-column prop="unUsedCpuCount" label="核数"></el-table-column>
    </el-table>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        totalNodeCount: 0,
        usedNodeCount: 0,
        unUsedNodeCount: 0,
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
          // console.log(data)
          this.totalNodeCount = data.totalNodeCount
          this.usedNodeCount = data.usedNodeCount
          this.unUsedNodeCount = data.unUsedNodeCount
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
