<template>
  <div class="mod-pub-apply">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <!-- <el-input v-model="dataForm.deployUnitID" placeholder="部署单元" clearable></el-input> -->
        <el-select v-model="dataForm.deployUnitID" placeholder="部署单元" clearable style="width: 100%;">
          <el-option
            v-for="item in deployUnitChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.creator" placeholder="申请人" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新建发布单</el-button>
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
        prop="id"
        header-align="center"
        align="center"
        label="ID">
        <template slot-scope="scope">
          <a @click="clickIDHandle(scope.row.id)">{{scope.row.id}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="deployUnitName"
        header-align="center"
        align="center"
        min-width="150"
        label="部署单元">
      </el-table-column>
      <el-table-column
        prop="versionDate"
        header-align="center"
        align="center"
        min-width="150"
        label="版本日期">
      </el-table-column>
      <el-table-column
        prop="pubContent"
        header-align="center"
        align="center"
        min-width="150"
        label="版本内容">
        <template slot-scope="scope">
            <p v-html='scope.row.pubContent'></p>
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createAt"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="implementerName"
        header-align="center"
        align="center"
        label="实施人">
      </el-table-column>
      <el-table-column
        prop="implementAt"
        header-align="center"
        align="center"
        label="实施时间">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="实施状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='submitted'" size="small">待实施</el-tag>
          <el-tag v-if="scope.row.status=='success'" size="small">实施成功</el-tag>
          <el-tag v-if="scope.row.status=='failure'" size="small">实施失败</el-tag>
          <el-tag v-if="scope.row.status=='rolledback'" size="small">已回滚</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="appDesign"
        header-align="center"
        align="center"
        label="应用设计方案">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.appDesign=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.appDesign=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.appDesign=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.appDesign=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="appAssemblyTestDesign"
        header-align="center"
        align="center"
        label="应用组装测试方案">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.appAssemblyTestDesign=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestDesign=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestDesign=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestDesign=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="appAssemblyTestCase"
        header-align="center"
        align="center"
        label="应用组装测试案例">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.appAssemblyTestCase=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestCase=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestCase=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestCase=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="appAssemblyTestReport"
        header-align="center"
        align="center"
        label="应用组装测试报告">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.appAssemblyTestReport=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestReport=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestReport=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.appAssemblyTestReport=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userTestCase"
        header-align="center"
        align="center"
        label="用户测试案例">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.userTestCase=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.userTestCase=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.userTestCase=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.userTestCase=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="userTestReport"
        header-align="center"
        align="center"
        label="用户测试报告">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.userTestReport=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.userTestReport=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.userTestReport=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.userTestReport=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="codeReview"
        header-align="center"
        align="center"
        label="代码评审">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.codeReview=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.codeReview=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.codeReview=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.codeReview=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pubControlTable"
        header-align="center"
        align="center"
        label="上线控制表">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.pubControlTable=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.pubControlTable=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.pubControlTable=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.pubControlTable=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="pubShellReview"
        header-align="center"
        align="center"
        label="上线脚本评审">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.pubShellReview=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.pubShellReview=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.pubShellReview=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.pubShellReview=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="trialOperationDesign"
        header-align="center"
        align="center"
        label="试营业方案">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.trialOperationDesign=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.trialOperationDesign=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.trialOperationDesign=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.trialOperationDesign=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="trialOperationCase"
        header-align="center"
        align="center"
        label="试营业案例">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.trialOperationCase=='unstart'" size="small">未开始</el-tag>
          <el-tag v-if="scope.row.trialOperationCase=='running'" size="small">进行中</el-tag>
          <el-tag v-if="scope.row.trialOperationCase=='finished'" size="small">已完成</el-tag>
          <el-tag v-if="scope.row.trialOperationCase=='trim'" size="small">裁剪</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        min-width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('pub:pub:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('pub:pub:assign')" type="text" size="small" @click="assignHandle(scope.row.id)">实施</el-button>
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
  </div>
</template>

<script>
import AddOrUpdate from './pub-apply-add-or-update'
import Assign from './pub-apply-assign'
export default {
  data () {
    return {
      dataForm: {
        deployUnitID: '',
        creator: ''
      },
      orderBy: '',
      order: '',
      areaNameChoices: [],
      deployUnitChoices: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  components: {
    AddOrUpdate,
    Assign
  },
  activated () {
    this.init()
    this.getDataList()
  },
  created () {
  },
  mounted () {
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(`/api/v1/tag/all`),
          method: 'get',
          params: this.$http.adornParams({
            'categoryName': 'deployunit'
          })
        }).then(({data}) => {
          let deployUnitChoices = []
          data.list.forEach((data) => {
            deployUnitChoices.push({
              label: data.name,
              value: data.id
            })
          })
          this.deployUnitChoices = deployUnitChoices
        }).catch((error) => {
          this.$message.error(error.message)
        })
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/api/v1/pub/list'),
        method: 'get',
        params: this.$http.adornParams({
          creator: this.dataForm.creator,
          deployUnitID: this.dataForm.deployUnitID,
          page: this.pageIndex,
          limit: this.pageSize,
          orderBy: 'id',
          order: 'desc'
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({ name: 'pub-apply-add-or-update', query: {id: id} })
      // this.addOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.addOrUpdate.init(id)
      // })
    },
    // 点击ID
    clickIDHandle (id) {
      this.$router.push({ name: 'pub-apply-detail', query: {id: id} })
    },
    assignHandle (id) {
      this.$router.push({ name: 'pub-apply-assign', query: {id: id} })
    }
  }
}
</script>
