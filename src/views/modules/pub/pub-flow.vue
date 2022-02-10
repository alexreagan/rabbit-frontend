<template>
  <div class="mod-template-add-or-update">
    <div v-if="dataForm.id">
        <pub-detail :id="dataForm.id" ref="detailForm">
        </pub-detail>
    </div>
    <div v-else>
        <pub-add ref="addForm">
        </pub-add>
    </div>

    <el-form class="flow" :model="flowForm" :rules="flowRule" ref="flowForm" @keyup.enter.native="flowFormSubmit()" label-width="100px">
        <!-- <div class="flow-panel" v-show='enableFlowHistory'> -->
        <div class="flow-panel" v-if='dataForm.id'>
            <div class="flow-title">流转记录</div>
            <div class="flow-content">
                <div class="flow-items">
                    <div class="flow-item" v-for='(item,index) in flowHistory' :key="index">
                        <div class="flow-item-icon">
                            <i class="fa el-icon-video-play text-green2 bg-white flow-icon"></i>
                        </div>
                        <div class="flow-item-desc">
                            <div class="flow-item-text">{{item.PCS_AVY_NM}}</div>
                            <div class="flow-item-time">{{item.START_TIME}}</div>
                        </div>
                        <div class="flow-item-content">
                            <div class="flow-item-image">
                                <i class="el-icon-user-solid"></i>
                            </div>
                            <div class="flow-item-info">
                                <a class="deco">{{item.EXECUTER_INFO.NAME + "(" + item.EXECUTER_INFO.BLNG_INST_NM + ")"}}</a>&nbsp;于&nbsp;
                                <span>{{item.START_TIME}}</span>&nbsp;{{item.BUTTON_NAME}}给&nbsp;
                                <span v-for="(user, index) in item.USER_INFO" :key="index">
                                    <a class="deco">{{user.NAME + "(" + user.BLNG_INST_NM + ")"}}</a>
                                </span>
                            </div>
                            <div class="flow-item-remarks"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flow-btn-groups">
            <el-button @click='clickBtnEnableFlowOperate' size='mini'><i class="el-icon-right"/>提交</el-button>
            <el-button @click='clickBtnDisableFlowOperate' size='mini'>关闭</el-button>
        </div>
        <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @enter-cancelled="enterCancelled" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave" @leave-cancelled="leaveCancelled" v-bind:css="false">
            <div class="flow-operate-panel" v-if='enableFlowOperate'>
                <div class="flow-next-node">
                    <!-- <el-form-item class="el-flow-form" label="下一步骤:" prop="nextNode">
                        <span v-for="(nextNodeInfo, index) in nextNode.NEXT_NODE_INFO" :key="index">
                            <a class="deco">{{nextNodeInfo.NODE_NAME}}</a>
                        </span>
                    </el-form-item> -->
                    <span>下一步骤:&nbsp;</span>
                    <span v-for="(nextNodeInfo, index) in nextNode.NEXT_NODE_INFO" :key="index">
                        <a class="deco">{{nextNodeInfo.NODE_NAME}}</a>
                    </span>
                </div>
                <div class="seperator"></div>
                <div class="flow-next-auditor">
                    <!-- <el-form-item label="办理人员:" prop="nextAuditor">
                        <el-select v-model="nextAuditor"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词搜索"
                            :remote-method="getNextAuditor"
                            :loading="loading">
                            <el-option
                                v-for="item in auditors"
                                :key="item.id"
                                :label="item.cnName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <span>办理人员:</span>
                    <el-select v-model="nextAuditor"
                            clearable
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词搜索"
                            :remote-method="getNextAuditor"
                            :loading="loading">
                            <el-option
                                v-for="item in auditors"
                                :key="item.id"
                                :label="item.cnName"
                                :value="item.id">
                            </el-option>
                    </el-select>
                </div>
                <div class="seperator"></div>
                <div class="audit" v-if="dataForm.id">
                    <span>审批结果:&nbsp;</span>
                    <el-radio-group v-model="dataForm.audit">
                        <el-radio label="0">不同意</el-radio>
                        <el-radio label="1">同意</el-radio>
                    </el-radio-group>
                </div>
                <el-input v-model="dataForm.auditComment" type="textarea" :rows="4" placeholder="请输入审批意见"></el-input>

                <div class="footer">
                    <el-button type="primary" size="mini" @click="flowFormSubmit()">确定</el-button>
                    <!-- <el-button size="mini" @click="visible = false">取消</el-button> -->
                </div>
            </div>
        </transition>
        <!-- 弹窗 -->
        <NextAuditor v-if="enableNextAuditor" ref="nextAuditor"></NextAuditor>
    </el-form>
  </div>
</template>

<script>
// import VueUeditorWrap from 'vue-ueditor-wrap'
import NextAuditor from './flow-select-person'
import PubDetail from './pub-detail.vue'
import PubAdd from './pub-add.vue'
export default {
  data () {
    var validateNextAuditor = (rule, value, callback) => {
      console.log("validateNextAuditor")
      if (value === '') {
        callback(new Error('请选择审核人'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      visible: false,
      dataForm: {
        id: 0
      },
      templateID: '',
      processInstID: '',
      taskID: '',
      deployUnitChoices: [],
      stateChoices: [{
        'label': '未开始',
        'value': 'unstart'
      }, {
        'label': '进行中',
        'value': 'running'
      }, {
        'label': '已完成',
        'value': 'finished'
      }, {
        'label': '裁剪',
        'value': 'trim'
      }],
      flowForm: {
        audit: '',
        auditComment: ''
      },
      enableFlowHistory: true,
      enableFlowOperate: false,
      enableNextAuditor: true,
      nextNode: {
        NEXT_NODE_INFO: [{
          multiple: null,
          USER: null,
          NODE_NAME: '申请变更开发任务需求范围'
        }]
      },
      auditors: [],
      nextAuditor: '',
      flowHistory: [
        {
          PCS_AVY_NM: '卡发中心评审',
          START_TIME: '2020-04-10 12:09',
          BUTTON_NAME: '提交',
          EXECUTER_INFO: {
            ID: "92167192",
            NAME: "张欣",
            BLNG_INST_ID: "010102913",
            BLNG_INST_NM: "中国建设银行软件中心"
          },
          USER_INFO: [{
            NAME: "周可",
            ID: "03110531",
            BLNG_INST_ID: "010200800",
            BLNG_INST_NM: "中国建设银行股份有限公司运营数据中心"
          }
          ],
          pass: '通过/不通过',
          des: 'xxxxx'
        }
      ],
      flowRule: {
        nextAuditor: [
            { required: true, message: '办理人员', validator: validateNextAuditor, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    NextAuditor,
    PubDetail,
    PubAdd
  },
  mounted () {
  },
  activated () {
    this.dataForm.id = this.$route.query.id
    this.init()
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$router.push({ name: 'pub-pub-apply' })
      }
    },
    async nextAuditor(val) {
    }
  },
  methods: {
    async getNextAuditor (query = '') {
      this.loading = true
      const {data} = await this.$http({
        url: this.$http.adornUrl('/api/v1/user/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 20,
          'name': query
        })
      })
      if (data && data.list) {
        if (data.list.length > 0) {
          this.nextAuditor = data.list[0].id
        }
        this.auditors = data.list
      } else {
        this.auditors = []
      }
      this.loading = false
    },
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
        // 当前流程信息
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/api/v1/pub/proc/info`),
            method: 'get',
            params: this.$http.adornParams({
              'id': this.dataForm.id
            })
          }).then(({data}) => {
            // process info
            this.templateID = data.templateID
            this.processInstID = data.processInstID
            this.taskID = data.taskID
          }).catch((error) => {
            this.$message.error(error.message)
          })
        } else {
          // process info
          this.templateID = '600100PubAudit'
          this.processInstID = ''
          this.taskID = ''
        }
      })
    },
    // 获取流程历史记录
    getFlowHistory() {
      this.$http({
        url: this.$http.adornUrl('/api/v1/proc/getHistDetailList'),
        method: 'post',
        params: this.$http.adornParams({})
      }).then((data) => {
        // this.flowHistory = data.PROCESS_INFO
        this.flowHistory = [
          {
            PCS_AVY_NM: '卡发中心评审',
            START_TIME: '2020-04-10 12:09',
            BUTTON_NAME: '提交',
            EXECUTER_INFO: {
              ID: "92167192",
              NAME: "张欣",
              BLNG_INST_ID: "010102913",
              BLNG_INST_NM: "中国建设银行软件中心"
            },
            USER_INFO: [{
              NAME: "周可",
              ID: "03110531",
              BLNG_INST_ID: "010200800",
              BLNG_INST_NM: "中国建设银行股份有限公司运营数据中心"
            }
            ]
          }
        ]
      }).catch((error) => {
        this.$message.error(error.message)
      })
    },
    getNextNode() {
      let params = {
        processInstID: this.processInstID,
        templateID: this.templateID,
        taskID: this.taskID
      }
      if (this.flowForm.audit) {
        params = {
          ...params,
          conditions: [{
            Key: "choice",
            Value: this.flowForm.audit
          }]}
      }

      this.$http({
        url: this.$http.adornUrl('/api/v1/proc/nextNodeInfo'),
        method: 'post',
        params: this.$http.adornParams(params)
      }).then(({data}) => {
        this.nextNode = {
          NEXT_NODE_INFO: data.NEXT_NODE_INFO
        }
      }).catch((error) => {
        this.$message.error(error.message)
      })
      this.nextNode = {
        NEXT_NODE_INFO: [{
          multiple: null,
          USER: null,
          NODE_NAME: '申请变更开发任务需求范围'
        }]
      }
    },
      // 选取下一个待办人
    clickBtnAddNextAuditor() {
      this.enableNextAuditor = true
      this.$nextTick(() => {
        this.$refs.nextAuditor.init()
      })
    },
      // 提交
    clickBtnEnableFlowOperate() {
      this.enableFlowOperate = true
      this.getNextNode()
    },
      // 关闭
    clickBtnDisableFlowOperate() {
      this.enableFlowOperate = false
    },
    beforeEnter(el) {
    //   console.log('beforeEnter')
      el.style.transition = "0.3s height ease-in-out"
      if (!el.dataset) el.dataset = {}
      el.style.height = 0
    },
    enter(el, done) {
    //   console.log('enter')
      if (el.scrollHeight !== 0) {
        el.style.height = `${el.scrollHeight + 20}px`
      } else {
        el.style.height = ''
      }
      el.style.overflow = 'hidden'
    },
    afterEnter(el) {
    //   console.log('afterEnter')
      el.style.transition = ''
      el.style.height = ''
    },
    enterCancelled(el) {
    //   console.log('enterCancelled')
    },
    beforeLeave(el) {
    //   console.log('beforeLeave')
      if (!el.dataset) el.dataset = {}
      el.style.height = `${el.scrollHeight + 20}px`
      el.style.overflow = 'hidden'
    },
    leave(el, done) {
    //   console.log('leave')
      if (el.scrollHeight !== 0) {
        el.style.transition = "0.3s height ease-in-out"
        el.style.height = 0
      }
    },
    afterLeave(el) {
    //   console.log('afterLeave')
      el.style.transition = ''
      el.style.height = ''
    },
    leaveCancelled(el) {
    //   console.log('leaveCancelled')
    },
      // 流程提交
    flowFormSubmit () {
    //   console.log('flowFormSubmit')
      let params = {
        templateID: this.templateID,
        processInstID: this.processInstID,
        taskID: this.taskID
      }
      console.log("flowFormSubmit enter", this.$refs)
      console.log("flowFormSubmit params", params)
      if (this.$refs['addForm']) {
        console.log("this.$refs.addForm", this.$refs['addForm'], this.$refs['addForm'].dataForm)
        this.$refs['addForm'].validate()
        params = {
          ...params,
          ...this.$refs['addForm'].dataForm
        }
      }
      this.$refs['flowForm'].validate((valid) => {
        console.log("nextNode: ", this.nextNode, this.nextAuditor)
        if (this.nextNode && !this.nextAuditor) {
          this.$message.error("请选择下一步审核人")
          return
        }
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/api/v1/proc/create'),
            // url: this.$http.adornUrl('/api/v1/pub/create'),
            method: 'post',
            data: this.$http.adornData(params, false)
            // params: this.$http.adornParams(params)
          }).then(({data}) => {
          }).catch((error) => {
            this.$message.error(error.message)
          })
        }
      })
    }
  }
}
</script>

<style>
a .deco {
    text-decoration: none
}
a:focus, a:hover {
    cursor:pointer;
    text-decoration: none;
}
.flow {
    border-top: 3px solid #3c8dbc
}
.seperator {
    border-bottom: 1px solid #f4f4f4
}
.flow-panel {
    margin-bottom: 20px;
}
.flow-title {
    font-size: 16px;
    line-height: 40px;
    border-bottom: 1px solid #f4f4f4;
    font-family: '微软雅黑';
    padding-left: 10px;
    margin-bottom: 20px;
}
.flow-content {
    margin: 10px 0 0 0;
    border: 1px solid #d8d8d8;
    border-radius: 2px;
    position: relative;
    padding: 5px;
}
.flow-items {
    border-right: 1px solid white;
    list-style: none;
    margin: 10px 0 0 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: hidden;
    width: 100%;
    top: 65px;
    bottom: 0;
}
.line {
    position: absolute;
    width: 1px;
    background: #ddd;
    left: 186px;
    top: 26px;
    height: 80px
}
.flow-item {
    padding: 0px 13px 5px;
    position: relative;
    border-left: 1px solid #c8c7cc;
    margin-left: 160px;
    min-height: 50px;
}
.flow-item-icon {
    float: left;
    font-size: 20px;
    margin-left: -24px;
    margin-top: 4px;
}
.text-green2 {
    color:#78d102;
}
.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
}
.flow-icon {
    height: 16px;
    line-height: 16px;
}
.flow-item-desc {
    float: left;
    margin-left: -160px;
    width: 130px;
}
.flow-item-text {
    text-align: right;
}
.flow-item-content {
    width: 100%;
    padding-right: 10px;
}
.flow-item-time {
    text-align: right;
    font-size: 12px;
    color: #c2c2c5;
    margin-top: 5px;
}
.flow-item-remarks {
    overflow-wrap:break-word;
    word-break: break-all;
    font-size: 12px;
    color: #000;
    margin-bottom: 4px;
    margin-left: 50px;
}
.flow-itemC {
    width: 6px;
    height: 6px;
    border: 1px solid #2d8cf0;
    border-radius: 100px;
    margin:0 30px;
    margin-top: 24px;
}
.flow-item-image {
    height: 40px;
    width: 40px;
    float: left;
    font-size: 40px;
}
.flow-item-info {
    float: left;
    margin-left: 10px;
    width: 94%;
}
.flow-btn-groups {
    margin: 5px;
}
.flow-next-node {
    margin: 10px;
}
.flow-next-auditor {
    margin: 10px;
}
.el-flow-form {
    text-align: left;
    margin-bottom: 0px;
}
.audit {
    margin: 10px;
}
.footer {
    margin-top: 10px;
}
.v-form{padding-bottom: 10px;}
.flow-operate-panel {
    margin-top: 0px;
}
.flow-operate-panel p {
    margin-bottom: 10px;
}
</style>

