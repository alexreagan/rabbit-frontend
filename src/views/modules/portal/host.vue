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
        <el-input v-model="dataForm.group" placeholder="群组名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuUsage" placeholder="CPU使用率大于" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fsUsage" placeholder="磁盘使用率大于" clearable></el-input>
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
        label="群组">
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
  </div>
</template>

<script>
import AddOrUpdate from './host-add-or-update'
import Detail from './host-detail'
export default {
  data () {
    return {
      dataForm: {
        ip: '',
        physicalSystem: '',
        cpuUsage: '',
        fsUsage: '',
        group: '',
        boundGroup: ''
      },
      orderBy: '',
      order: '',
      boundGroupChoices: [{
        value: 'bound',
        label: '已关联群组'
      }, {
        value: 'unbound',
        label: '未关联群组'
      }],
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
    AddOrUpdate,
    Detail
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
          'cpuUsage': this.dataForm.cpuUsage,
          'fsUsage': this.dataForm.fsUsage,
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
              arr[idx] = JSON.parse(val.path).join('/')
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
