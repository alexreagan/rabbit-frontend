<template>
  <div class="mod-home">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/home'}">工作台</el-breadcrumb-item>
    </el-breadcrumb> -->
    <el-card class="card-todos">
      <div slot="header" class="clearfix">
        <span>待办事项</span>
      </div>
      <div class="proc-todos">
        <template>
          <el-table :data="todos" stripe border style="width: 100%">
            <el-table-column prop="PRJ_BELONG_TYPE" label="流程分类"></el-table-column>
            <el-table-column prop="PRJ_TYPE" label="流程名称"></el-table-column>
            <el-table-column prop="PROCESS_INST_ID" label="编号"> </el-table-column>
            <el-table-column prop="PRJ_NM" label="标题"> </el-table-column>
            <el-table-column prop="PCS_AVY_NM" label="当前环节"> </el-table-column>
            <el-table-column prop="WF_EXTR_NM" label="发送人"> </el-table-column>
            <el-table-column prop="TODO_START_TM" label="办理时间"> </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="procTodoHandle(scope.row.TEMPLATE_ID, scope.row.PROCESS_INST_ID, scope.row.TASK_ID, scope.row.TODO_SN, scope.row.PRJ_SN)">办理</el-button>
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
        </template>
      </div>
    </el-card>
    <el-card class="card-system-notice">
      <div slot="header" class="clearfix">
        <span>系统公告</span>
      </div>
      <div class="notice-item">
        <ul>
            <li v-for="(item, index) in notices" :key="index">
                <a class="deco" @click="clickNotice(item.id)">{{item.title}}
                </a>
            </li>
        </ul>
      </div>
    </el-card>

    <el-card class="card-hasDone">
      <div slot="header" class="clearfix">
        <span>已办事项</span>
      </div>
      <div class="proc-hasDone">
        <template>
          <el-table :data="hasDone" stripe border style="width: 100%">
            <el-table-column prop="PRJ_BELONG_TYPE" label="流程分类"></el-table-column>
            <el-table-column prop="PRJ_TYPE" label="流程名称"></el-table-column>
            <el-table-column prop="PROCESS_INST_ID" label="编号"> </el-table-column>
            <el-table-column prop="PRJ_NM" label="标题"> </el-table-column>
            <el-table-column prop="PCS_AVY_NM" label="当前环节"> </el-table-column>
            <el-table-column prop="WF_EXTR_NM" label="发送人"> </el-table-column>
            <el-table-column prop="TODO_START_TM" label="办理时间"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="procHasDoneHandle(scope.row.TEMPLATE_ID, scope.row.PROCESS_INST_ID, scope.row.TASK_ID, scope.row.TODO_SN, scope.row.PRJ_SN)">办理</el-button>
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
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notices: [],
      todos: [],
      hasDone: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  activated() {
    this.init(this.$route.query.id)
  },
  methods: {
    init() {
      this.dataListLoading = true
      this.$nextTick(() => {
        // 系统公告
        this.$http({
          url: this.$http.adornUrl(`/api/v1/notice/list`)
        }).then(({data}) => {
          this.notices = data.list
        }).catch(error => {
          this.$message.error(error.message)
        })
        // 待办消息
        this.$http({
          url: this.$http.adornUrl(`/api/v1/wfe/todos`),
          method: 'post',
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize
          })
        }).then(({data}) => {
          this.dataListLoading = false
          let todos = []
          if (data.TX_BODY.ENTITY.TODO_INFO) {
            todos = data.TX_BODY.ENTITY.TODO_INFO
          }
          let totalPage = 0
          if (data.TX_BODY.COMMON.COMB.TOTAL_PAGE) {
            totalPage = data.TX_BODY.COMMON.COMB.TOTAL_PAGE
          }
          this.todos = todos
          this.totalPage = totalPage
        }).catch(error => {
          this.dataListLoading = false
          this.$message.error(error.messag)
          this.todos = []
          this.pageIndex = 1
          this.pageSize = 10
          this.totalPage = 0
        })
        // 已办消息
        this.$http({
          url: this.$http.adornUrl(`/api/v1/wfe/hasDone`),
          method: 'post',
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize
          })
        }).then(({data}) => {
          this.dataListLoading = false
          let hasDone = []
          if (data.TX_BODY.ENTITY.HASDONE_INFO) {
            hasDone = data.TX_BODY.ENTITY.HASDONE_INFO
          }
          let totalPage = 0
          if (data.TX_BODY.COMMON.COMB.TOTAL_PAGE) {
            totalPage = data.TX_BODY.COMMON.COMB.TOTAL_PAGE
          }
          this.hasDone = hasDone
          this.totalPage = totalPage
        }).catch(error => {
          this.dataListLoading = false
          this.$message.error(error.messag)
          this.hasDone = []
          this.pageIndex = 1
          this.pageSize = 10
          this.totalPage = 0
        })
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
    // 处理待办
    procTodoHandle (templateID, processInstID, taskID, todoID, prjSN) {
      this.$router.push({name: 'pub-flow', query: {'templateID': templateID, 'processInstID': processInstID, 'taskID': taskID, 'todoID': todoID, 'prjSN': prjSN}})
      console.log(processInstID)
    },
    // 处理已办
    procHasDoneHandle (templateID, processInstID, taskID, todoID, prjSN) {
      // this.$router.push({name: 'pub-flow', query: {'templateID': templateID, 'processInstID': processInstID, 'taskID': taskID, 'todoID': todoID, 'prjSN': prjSN}})
      console.log(processInstID)
    },
    clickNotice(id) {
      this.$router.push({name: 'sys-notice', query: {id: id}})
    }
  }
}
</script>

<style>
.el-breadcrumb {
  font-size: 14px;
  line-height: 1;
  padding-bottom: 10px;
}
.mod-home {
  line-height: 1.5;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.card-todos {
  float: left;
  margin-right: 10px;
  width: 79%;
}
.card-system-notice {
  width: 19%;
}
a .deco {
    text-decoration: none
}
a:focus, a:hover {
    cursor:pointer;
    text-decoration: none;
}
.notice-item ul {
    margin: 6px;
    padding-left: 6px;
}
.notice-item ul li{
    list-style-type: none;
    margin-bottom: 2px;
}
.card-hasDone {
  float: left;
  margin-top: 10px;
  margin-right: 10px;
  width: 79%;
}
</style>
