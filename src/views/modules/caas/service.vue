<template>
  <div class="mod-service">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.serviceName" placeholder="服务" clearable></el-input>
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
        prop="serviceName"
        header-align="center"
        align="center"
        min-width="150"
        label="服务名称">
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
        min-width="150"
        label="集群名称">
      </el-table-column>
      <el-table-column
        prop="physicalSystemName"
        header-align="center"
        align="center"
        min-width="150"
        label="物理子系统">
      </el-table-column>
      <el-table-column
        prop="imageName"
        header-align="center"
        align="center"
        min-width="150"
        label="镜像名称">
      </el-table-column>
      <el-table-column
        prop="imageTag"
        header-align="center"
        align="center"
        label="镜像版本">
      </el-table-column>
      <el-table-column
        prop="replicas"
        header-align="center"
        align="center"
        label="副本数">
      </el-table-column>
      <el-table-column
        prop="nowReplicas"
        header-align="center"
        align="center"
        label="运行态副本数">
      </el-table-column>
      <el-table-column
        prop="cpu"
        header-align="center"
        align="center"
        label="cpu">
      </el-table-column>
      <el-table-column
        prop="gpu"
        header-align="center"
        align="center"
        label="gpu">
      </el-table-column>
      <el-table-column
        prop="memory"
        header-align="center"
        align="center"
        label="内存">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="数据更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('caas:service:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
        </template>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './service-add-or-update'
export default {
  data () {
    return {
      dataForm: {
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
    AddOrUpdate
  },
  activated () {
    // get data
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/caas/service/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
