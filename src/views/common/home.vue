<template>
  <div class="mod-home">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: '/home'}">工作台</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="card-todos">
      <div slot="header" class="clearfix">
        <span>待办事项</span>
      </div>
      <div class="proc-todos">
        <template>
          <el-table :data="todos" stripe border style="width: 100%">
            <el-table-column prop="date" label="流程分类">
            </el-table-column>
            <el-table-column prop="name" label="流程名称">
            </el-table-column>
            <el-table-column prop="address" label="编号"> </el-table-column>
            <el-table-column prop="address" label="标题"> </el-table-column>
            <el-table-column prop="address" label="当前环节"> </el-table-column>
            <el-table-column prop="address" label="发送人"> </el-table-column>
            <el-table-column prop="address" label="办理时间"> </el-table-column>
            <el-table-column prop="address" label="操作"> </el-table-column>
          </el-table>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      notices: [],
      todos: []
    }
  },
  activated() {
    this.init(this.$route.query.id)
  },
  methods: {
    init() {
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
          url: this.$http.adornUrl(`/api/v1/proc/todos`),
          method: 'get',
          params: this.$http.adornParams({
          })
        }).then(({data}) => {
          this.todos = data.list
        }).catch(error => {
          this.$message.error(error.messag)
        })
      })
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
</style>
