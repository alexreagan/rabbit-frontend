<template>
  <div class="mod-namespace">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.namespace" placeholder="项目空间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.workspaceName" placeholder="组织空间" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.clusterName" placeholder="集群" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.physicalSystemName" placeholder="物理子系统" clearable></el-input>
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
        prop="namespace"
        header-align="center"
        align="center"
        min-width="150"
        label="项目空间">
      </el-table-column>
      <el-table-column
        prop="workspaceName"
        header-align="center"
        align="center"
        min-width="150"
        label="组织空间">
      </el-table-column>
      <el-table-column
        prop="clusterName"
        header-align="center"
        align="center"
        label="集群">
      </el-table-column>
      <el-table-column
        prop="physicalSystemName"
        header-align="center"
        align="center"
        label="物理子系统">
      </el-table-column>
      <el-table-column
        prop="cpu"
        header-align="center"
        align="center"
        label="CPU配额"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="memory"
        header-align="center"
        align="center"
        label="内存配额"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="gpu"
        header-align="center"
        align="center"
        label="gpu配额"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="sharedVolume"
        header-align="center"
        align="center"
        label="共享存储配额"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        fixed="localVolume"
        header-align="center"
        align="center"
        min-width="100"
        label="本地存储配额">
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
        workspaceName: '',
        clusterName: '',
        physicalSystemName: ''
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
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/caas/namespace/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'namespace': this.dataForm.namespace,
          'physicalSystemName': this.dataForm.physicalSystemName,
          'clusterName': this.dataForm.clusterName,
          'workspaceName': this.dataForm.workspaceName,
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
    }
  }
}
</script>
