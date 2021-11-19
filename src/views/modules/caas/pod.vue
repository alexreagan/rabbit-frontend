<template>
  <div class="mod-pod">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.namespace" placeholder="项目空间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.serviceName" placeholder="服务名称" clearable></el-input>
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
        prop="name"
        header-align="center"
        align="center"
        min-width="150"
        label="名称">
        <template slot-scope="scope">
          <a @click="clickNameHandle(scope.row.id)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="podIp"
        header-align="center"
        align="center"
        min-width="150"
        label="pod IP">
      </el-table-column>
      <el-table-column
        prop="namespace"
        header-align="center"
        align="center"
        min-width="150"
        label="项目空间">
      </el-table-column>
      <el-table-column
        prop="serviceName"
        header-align="center"
        align="center"
        min-width="150"
        label="服务名称">
      </el-table-column>
      <el-table-column
        prop="hostIp"
        header-align="center"
        align="center"
        min-width="150"
        label="主机IP">
      </el-table-column>
      <el-table-column
        prop="hostName"
        header-align="center"
        align="center"
        min-width="150"
        label="主机名">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        min-width="150"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        min-width="150"
        label="创建时间">
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
        name: '',
        namespace: '',
        serviceName: ''
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
    let serviceId = this.$route.params.serviceId
    if (serviceId) {
      this.$http({
        url: this.$http.adornUrl('/api/v1/caas/service/info'),
        method: 'get',
        params: this.$http.adornParams({id: serviceId})
      }).then(({data}) => {
        this.dataForm.serviceName = data.serviceName
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
        url: this.$http.adornUrl('/api/v1/caas/pod/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'name': this.dataForm.name,
          'namespace': this.dataForm.namespace,
          'serviceName': this.dataForm.serviceName,
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
    clickNameHandle (id) {
      this.$router.push({ name: 'pod-detail', params: {id: id} })
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
    }
  }
}
</script>
