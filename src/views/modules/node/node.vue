<template>
  <div class="mod-node">
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
        <el-select v-model="dataForm.tagIDs" placeholder="标签" filterable clearable multiple>
          <el-option
            v-for="item in tagChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuCount" placeholder="CPU核数" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.areaName" placeholder="请选择区域" clearable>
          <el-option
            v-for="item in areaNameChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuAvailableLowerLimit" placeholder="CPU使用率下限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.cpuAvailableUpperLimit" placeholder="CPU使用率上限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fsAvailableLowerLimit" placeholder="磁盘使用率下限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.fsAvailableUpperLimit" placeholder="磁盘使用率上限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.memAvailableLowerLimit" placeholder="内存使用率下限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.memAvailableUpperLimit" placeholder="内存使用率上限" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.relatedTag" placeholder="是否关联标签" clearable>
          <el-option
            v-for="item in relatedTagChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('resource:node:create')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('resource:node:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button v-if="isAuth('resource:node:update')" type="warning" @click="setTagBatchHandle()" :disabled="dataListSelections.length <= 0">批量设置标签</el-button>
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
        prop="tags"
        header-align="center"
        align="center"
        label="标签">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.tags" :key="index" :label="index" size="small">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="areaName"
        header-align="center"
        align="center"
        label="区域">
      </el-table-column>
      <el-table-column
        prop="cpuCount"
        header-align="center"
        align="center"
        label="CPU核数"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="memTotalBytes"
        header-align="center"
        align="center"
        label="内存"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="cpuAvailable"
        header-align="center"
        align="center"
        label="CPU使用率"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="memAvailable"
        header-align="center"
        align="center"
        label="内存使用率"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="fileSystemAvailable"
        header-align="center"
        align="center"
        label="磁盘使用率"
        :sortable="'custom'">
      </el-table-column>
      <el-table-column
        prop="state"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state=='offline'" size="small">已下线</el-tag>
          <el-tag v-else size="small">服务中</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        min-width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('resource:node:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('resource:node:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <set-tag-batch v-if="setTagBatchVisible" ref="setTagBatch" @refreshDataList="getDataList"></set-tag-batch>
  </div>
</template>

<script>
import AddOrUpdate from './node-add-or-update'
import SetTagBatch from './node-set-tag-batch'
import Detail from './node-detail'
export default {
  data () {
    return {
      dataForm: {
        ip: '',
        physicalSystem: '',
        cpuCount: '',
        areaName: '',
        cpuAvailableUpperLimit: '',
        cpuAvailableLowerLimit: '',
        fsAvailableUpperLimit: '',
        fsAvailableLowerLimit: '',
        memAvailableUpperLimit: '',
        memAvailableLowerLimit: '',
        tagIDs: [],
        relatedTag: ''
      },
      orderBy: '',
      order: '',
      tagChoices: [],
      physicalSystemChoices: [],
      areaNameChoices: [],
      relatedTagChoices: [{
        value: 'related',
        label: '已关联标签'
      }, {
        value: 'unrelated',
        label: '未关联标签'
      }],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      setTagBatchVisible: false
    }
  },
  components: {
    AddOrUpdate,
    Detail,
    SetTagBatch
  },
  activated () {
    let tagIDs = []
    if (typeof this.$route.query.tagIDs === 'string') {
    //   this.dataForm.tagIDs = JSON.parse(this.$route.query.tagIDs)
      this.$route.query.tagIDs.split(',').forEach((tagID) => {
        tagIDs.push(parseInt(tagID))
      })
    } else if (typeof this.$route.query.tagIDs === 'number') {
      tagIDs.push(this.$route.query.tagIDs)
    } else if (typeof this.$route.query.tagIDs === 'object') {
      tagIDs = this.$route.query.tagIDs
    }
    this.dataForm.tagIDs = tagIDs
    this.getDataList()
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/node/physical_system_choices'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.physicalSystemChoices = data.list
      }).catch((error) => {
        this.$message.error(error.message)
      })
      this.$http({
        url: this.$http.adornUrl('/api/v1/tag/all'),
        method: 'get',
        params: this.$http.adornParams({
          orderBy: 'name'
        })
      }).then(({data}) => {
        let tagChoices = []
        data.list.forEach((tag) => {
          tagChoices.push({
            'label': tag.name + '(' + tag.cnName + ')',
            'value': tag.id
          })
        })
        this.tagChoices = tagChoices
      }).catch((error) => {
        this.$message.error(error.message)
      })
      this.$http({
        url: this.$http.adornUrl('/api/v1/node/area_choices'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.areaNameChoices = data.list
      }).catch(({error}) => {
        this.$message.error(error)
      })
      this.$http({
        url: this.$http.adornUrl('/api/v1/node/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'ip': this.dataForm.ip,
          'physicalSystem': this.dataForm.physicalSystem,
          'cpuCount': this.dataForm.cpuCount,
          'areaName': this.dataForm.areaName,
          'cpuAvailableLowerLimit': this.dataForm.cpuAvailableLowerLimit,
          'cpuAvailableUpperLimit': this.dataForm.cpuAvailableUpperLimit,
          'fsAvailableLowerLimit': this.dataForm.fsAvailableLowerLimit,
          'fsAvailableUpperLimit': this.dataForm.fsAvailableUpperLimit,
          'memAvailableLowerLimit': this.dataForm.memAvailableLowerLimit,
          'memAvailableUpperLimit': this.dataForm.memAvailableUpperLimit,
          'tagIDs': this.dataForm.tagIDs,
          'relatedTag': this.dataForm.relatedTag,
          'orderBy': this.orderBy,
          'order': this.order
        })
      }).then(({data}) => {
        if (data && data.list) {
          data.list.forEach(function (value, index, array) {
            value.cpuAvailable = parseFloat(value.cpuAvailable).toFixed(2) + '%'
            value.fileSystemAvailable = parseFloat(value.fileSystemAvailable).toFixed(2) + '%'
            value.memAvailable = parseFloat(value.memAvailable).toFixed(2) + '%'
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
    clickIPHandle (id) {
      this.$router.push({ name: 'node-detail', params: {id: id} })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 批量设置标签
    setTagBatchHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.setTagBatchVisible = true
      this.$nextTick(() => {
        this.$refs.setTagBatch.init(ids)
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
          url: this.$http.adornUrl('/api/v1/node/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({data}) => {
          if (data && !data.error) {
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
