<template>
  <div class="mod-app">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.appName" placeholder="名称" clearable></el-input>
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
        prop="appName"
        header-align="center"
        align="center"
        min-width="150"
        label="应用名称">
        <template slot-scope="scope">
          <a @click="clickAppHandle(scope.row.id)">{{scope.row.appName}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        header-align="center"
        align="center"
        min-width="150"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="namespaceName"
        header-align="center"
        align="center"
        min-width="150"
        label="项目空间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        min-width="150"
        label="数据更新时间">
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
        namespace: '',
        appName: ''
      },
      orderBy: '',
      order: '',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
  },
  activated () {
    let appID = this.$route.params.appID
    if (appID) {
      this.$http({
        url: this.$http.adornUrl('/api/v1/caas/app/info'),
        method: 'get',
        params: this.$http.adornParams({id: appID})
      }).then(({data}) => {
        this.dataForm.appName = data.appName
        this.getDataList()
      })
    } else {
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/caas/app/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'appName': this.dataForm.appName,
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
    // 点击应用名称
    clickAppHandle (id) {
      window.open(window.SITE_CONFIG['caasUrl'] + '/paas/service-mgmt/application/' + id, '_blank')
    }
  }
}
</script>
