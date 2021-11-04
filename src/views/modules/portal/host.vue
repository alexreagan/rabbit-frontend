<template>
  <div class="mod-host">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.ip" placeholder="机器IP" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.physicalSystem" placeholder="物理子系统" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.group" placeholder="服务组名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuNumber" placeholder="CPU核数" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.areaName" placeholder="请选择" clearable>
          <el-option
            v-for="item in areaNameChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuUsageLowerLimit" placeholder="CPU使用率下限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuUsageUpperLimit" placeholder="CPU使用率上限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fsUsageLowerLimit" placeholder="磁盘使用率下限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fsUsageUpperLimit" placeholder="磁盘使用率上限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.memoryUsageLowerLimit" placeholder="内存使用率下限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.memoryUsageUpperLimit" placeholder="内存使用率上限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.boundGroup" placeholder="请选择" clearable>
          <el-option
            v-for="item in boundGroupChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="warning" @click="setGroupBatchHandle()" :disabled="dataListSelections.length <= 0">批量设置服务组</el-button>
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
        prop="ip"
        header-align="center"
        align="center"
        min-width="150"
        label="IP">
        <template slot-scope="scope">
          <a @click="clickIPHandle(scope.row.id)">{{scope.row.ip}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        min-width="150"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="physicalSystem"
        header-align="center"
        align="center"
        label="物理子系统">
      </el-table-column>
      <el-table-column
        prop="groups"
        header-align="center"
        align="center"
        label="服务组">
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="区域">
      </el-table-column>
      <el-table-column
        prop="cpuNumber"
        header-align="center"
        align="center"
        label="CPU核数"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="cpuUsage"
        header-align="center"
        align="center"
        label="CPU使用率"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="memoryUsage"
        header-align="center"
        align="center"
        label="内存使用率"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="fsUsage"
        header-align="center"
        align="center"
        label="磁盘使用率"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        min-width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <set-group-batch v-if="setGroupBatchVisible" ref="setGroupBatch" @refreshDataList="getDataList"></set-group-batch>
  </div>
</template>

<script>
import AddOrUpdate from './host-add-or-update'
import SetGroupBatch from './host-set-group-batch'
import Detail from './host-detail'
export default {
  data () {
    return {
      dataForm: {
        ip: '',
        physicalSystem: '',
        cpuNumber: '',
        areaName: '',
        cpuUsageUpperLimit: '',
        cpuUsageLowerLimit: '',
        fsUsageUpperLimit: '',
        fsUsageLowerLimit: '',
        memoryUsageUpperLimit: '',
        memoryUsageLowerLimit: '',
        group: '',
        boundGroup: ''
      },
      orderBy: '',
      order: '',
      areaNameChoices: [{
        value: '外部客户托管区',
        label: '外部客户托管区'
      }, {
        value: '环境内部管理区域',
        label: '环境内部管理区域'
      }, {
        value: '公有云功能测试区',
        label: '公有云功能测试区'
      }, {
        value: '开发区域',
        label: '开发区域'
      }, {
        value: '管理工具运营区',
        label: '管理工具运营区'
      }, {
        value: '功能测试区域',
        label: '功能测试区域'
      }, {
        value: '环境特殊管理区域',
        label: '环境特殊管理区域'
      }, {
        value: '子公司托管区',
        label: '子公司托管区'
      }, {
        value: '非功能测试区域',
        label: '非功能测试区域'
      }],
      boundGroupChoices: [{
        value: 'bound',
        label: '已关联服务组'
      }, {
        value: 'unbound',
        label: '未关联服务组'
      }],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      setGroupBatchVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Detail,
    SetGroupBatch
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/host/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'ip': this.dataForm.ip,
          'physicalSystem': this.dataForm.physicalSystem,
          'cpuNumber': this.dataForm.cpuNumber,
          'areaName': this.dataForm.areaName,
          'cpuUsageLowerLimit': this.dataForm.cpuUsageLowerLimit,
          'cpuUsageUpperLimit': this.dataForm.cpuUsageUpperLimit,
          'fsUsageLowerLimit': this.dataForm.fsUsageLowerLimit,
          'fsUsageUpperLimit': this.dataForm.fsUsageUpperLimit,
          'memoryUsageLowerLimit': this.dataForm.memoryUsageLowerLimit,
          'memoryUsageUpperLimit': this.dataForm.memoryUsageUpperLimit,
          'group': this.dataForm.group,
          'boundGroup': this.dataForm.boundGroup,
          'orderBy': this.orderBy,
          'order': this.order
        })
      }).then(({data}) => {
        if (data && data.list) {
          data.list.forEach(function (value, index, array) {
            if (value.groups === '') {
              value.groups = '[]'
            }
            value.groups.forEach(function (val, idx, arr) {
              // arr[idx] = JSON.parse(val.path).join('/')
              arr[idx] = val.path
            })
            value.groups = value.groups.join(',')
            value.cpuUsage = value.cpuUsage + '%'
            value.fsUsage = value.fsUsage + '%'
            value.memoryUsage = value.memoryUsage + '%'
            array[index] = value
          })
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
    // // 设置列的排序规则
    // headerCellClass ({column}) {
    //   column.order = column.multiOrder
    // },
    // // 点击表头
    // headerClickHandle (column) {
    //   if (column.sortable !== 'custom') {
    //     return
    //   }
    //   if (!column.multiOrder) {
    //     column.multiOrder = 'DESC'
    //   } else if (column.multiOrder === 'DESC') {
    //     column.multiOrder = 'ASC'
    //   } else {
    //     column.multiOrder = ''
    //   }
    //   this.orderChangeHandle(column.property, column.multiOrder)
    // },
    // orderChangeHandle (prop, order) {
    //   let result = this.orderList.find(item => item.prop === prop)
    //   if (result) {
    //     if (order) {
    //       result.order = order
    //     } else {
    //       for (let i = 0; i < this.orderList.length; i++) {
    //         if (this.orderList[i].prop === prop) {
    //           this.orderList.splice(i, 1)
    //         }
    //       }
    //     }
    //   } else {
    //     this.orderList.push({
    //       prop: prop,
    //       order: order
    //     })
    //   }
    //   for (let i = 0; i < this.orderList.length; i++) {
    //     console.log(this.orderList[i].prop, this.orderList[i].order)
    //   }
    //   this.getDataList()
    // },
    clickIPHandle (id) {
      // this.$nextTick(() => {
      //   this.$refs.Detail.init(id)
      // })
      this.$router.push({ name: 'host-detail', params: {id: id} })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    setGroupBatchHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.setGroupBatchVisible = true
      this.$nextTick(() => {
        this.$refs.setGroupBatch.init(ids)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.ID
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/api/v1/host/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
