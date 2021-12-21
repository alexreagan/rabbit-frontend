<template>
  <div class="mod-alarm">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.ip" placeholder="机器IP" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.physicalSystem" placeholder="物理子系统" clearable>
          <el-option
            v-for="item in physicalSystemChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.resolved" placeholder="状态" clearable>
          <el-option
            v-for="item in resolvedChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="prodIp"
        header-align="center"
        align="center"
        min-width="150"
        label="IP">
        <template slot-scope="scope">
          <a @click="clickIPHandle(scope.row.prodIp)">{{scope.row.prodIp}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="subSysEnName"
        header-align="center"
        align="center"
        min-width="150"
        label="物理子系统">
      </el-table-column>
      <el-table-column
        prop="cloudPoolName"
        header-align="center"
        align="center"
        label="资源池">
      </el-table-column>
      <el-table-column
        prop="resolved"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.resolved==true" size="small">已解决</el-tag>
          <el-tag v-if="scope.row.resolved==false" size="small">待解决</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="alertName"
        header-align="center"
        align="center"
        label="告警指标">
      </el-table-column>
      <el-table-column
        prop="firingTime"
        header-align="center"
        align="center"
        label="告警时间">
      </el-table-column>
      <el-table-column
        prop="resolvedTime"
        header-align="center"
        align="center"
        label="恢复时间">
      </el-table-column>
      <el-table-column
        prop="u1"
        header-align="center"
        align="center"
        label="一级报警人">
      </el-table-column>
      <el-table-column
        prop="u2"
        header-align="center"
        align="center"
        label="二级报警人">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {
        ip: '',
        physicalSystem: '',
        resolved: ''
      },
      orderBy: '',
      order: '',
      physicalSystemChoices: [],
      resolvedChoices: [{
        value: true,
        label: '已解决'
      }, {
        value: false,
        label: '待解决'
      }],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  components: {
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/alarm/physical_system_choices'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.physicalSystemChoices = data.list
      }).catch((error) => {
        this.$message.error(error.message)
      })
      this.$http({
        url: this.$http.adornUrl('/api/v1/alarm/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'ip': this.dataForm.ip,
          'resolved': this.dataForm.resolved,
          'physicalSystem': this.dataForm.physicalSystem,
          'orderBy': this.orderBy,
          'order': this.order
        })
      }).then(({data}) => {
        if (data && data.list) {
          this.dataList = data.list
          this.totalPage = data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    sortChangeHandle ({column, prop, order}) {
      if (!column) {
        return
      }
      this.orderBy = prop
      this.order = order.replace('ending', '')
      this.getDataList()
    },
    clickIPHandle (ip) {
      this.$router.push({ name: 'host-detail', params: {ip: ip} })
    }
  }
}
</script>
