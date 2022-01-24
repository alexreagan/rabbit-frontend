<template>
  <div class="mod-template-add-or-update">
    <el-form v-if="dataForm.id" :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="部署单元" prop="deployUnitID">
        <span v-html="dataForm.deployUnitName"></span>
      </el-form-item>
      <el-form-item label="版本日期" prop="versionDate">
        <span v-html="dataForm.versionDate"></span>
      </el-form-item>
      <el-form-item label="git地址" prop="git">
        <span v-html="dataForm.git"></span>
      </el-form-item>
      <el-form-item label="commit id" prop="commitID">
        <span v-html="dataForm.commitID"></span>
      </el-form-item>
      <el-form-item label="版本包" prop="packageAddress">
        <span v-html="dataForm.packageAddress"></span>
      </el-form-item>
      <el-form-item label="版本内容" prop="pubContent">
        <span v-html="dataForm.pubContent"></span>
      </el-form-item>
      <el-form-item label="发布步骤" prop="pubStep">
        <span v-html="dataForm.pubStep"></span>
      </el-form-item>
      <el-form-item label="回滚步骤" prop="rollbackStep">
        <span v-html="dataForm.rollbackStep"></span>
      </el-form-item>
      <el-form-item label="需求说明书" prop="requirement">
        <span v-html="dataForm.rollbackStep"></span>
      </el-form-item>
      <el-form-item label="应用设计方案" prop="appDesign">
        <span v-if="dataForm.appDesign=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.appDesign=='running'" size="small">进行中</span>
        <span v-if="dataForm.appDesign=='finished'" size="small">已完成</span>
        <span v-if="dataForm.appDesign=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="应用组装测试方案" prop="appAssemblyTestDesign">
        <span v-if="dataForm.appAssemblyTestDesign=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.appAssemblyTestDesign=='running'" size="small">进行中</span>
        <span v-if="dataForm.appAssemblyTestDesign=='finished'" size="small">已完成</span>
        <span v-if="dataForm.appAssemblyTestDesign=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="应用组装测试案例" prop="appAssemblyTestCase">
        <span v-if="dataForm.appAssemblyTestCase=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.appAssemblyTestCase=='running'" size="small">进行中</span>
        <span v-if="dataForm.appAssemblyTestCase=='finished'" size="small">已完成</span>
        <span v-if="dataForm.appAssemblyTestCase=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="应用组装测试报告" prop="appAssemblyTestReport">
        <span v-if="dataForm.appAssemblyTestReport=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.appAssemblyTestReport=='running'" size="small">进行中</span>
        <span v-if="dataForm.appAssemblyTestReport=='finished'" size="small">已完成</span>
        <span v-if="dataForm.appAssemblyTestReport=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="用户测试案例" prop="userTestCase">
        <span v-if="dataForm.userTestCase=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.userTestCase=='running'" size="small">进行中</span>
        <span v-if="dataForm.userTestCase=='finished'" size="small">已完成</span>
        <span v-if="dataForm.userTestCase=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="用户测试报告" prop="userTestReport">
        <span v-if="dataForm.userTestReport=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.userTestReport=='running'" size="small">进行中</span>
        <span v-if="dataForm.userTestReport=='finished'" size="small">已完成</span>
        <span v-if="dataForm.userTestReport=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="代码评审" prop="codeReview">
        <span v-if="dataForm.codeReview=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.codeReview=='running'" size="small">进行中</span>
        <span v-if="dataForm.codeReview=='finished'" size="small">已完成</span>
        <span v-if="dataForm.codeReview=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="上线控制表" prop="pubControlTable">
        <span v-if="dataForm.pubControlTable=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.pubControlTable=='running'" size="small">进行中</span>
        <span v-if="dataForm.pubControlTable=='finished'" size="small">已完成</span>
        <span v-if="dataForm.pubControlTable=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="上线脚本评审" prop="pubShellReview">
        <span v-if="dataForm.pubShellReview=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.pubShellReview=='running'" size="small">进行中</span>
        <span v-if="dataForm.pubShellReview=='finished'" size="small">已完成</span>
        <span v-if="dataForm.pubShellReview=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="试营业方案" prop="trialOperationDesign">
        <span v-if="dataForm.trialOperationDesign=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.trialOperationDesign=='running'" size="small">进行中</span>
        <span v-if="dataForm.trialOperationDesign=='finished'" size="small">已完成</span>
        <span v-if="dataForm.trialOperationDesign=='trim'" size="small">裁剪</span>
      </el-form-item>
      <el-form-item label="试营业案例" prop="trialOperationCase">
        <span v-if="dataForm.trialOperationCase=='unstart'" size="small">未开始</span>
        <span v-if="dataForm.trialOperationCase=='running'" size="small">进行中</span>
        <span v-if="dataForm.trialOperationCase=='finished'" size="small">已完成</span>
        <span v-if="dataForm.trialOperationCase=='trim'" size="small">裁剪</span>
      </el-form-item>
    </el-form>
    <el-form v-else :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="部署单元" prop="deployUnitID">
        <el-select v-model="dataForm.deployUnitID" filterable clearable>
          <el-option
            v-for="item in deployUnitChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本日期" prop="versionDate">
        <el-date-picker
          v-model="dataForm.versionDate"
          type="datetime"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="git地址" prop="git">
          <el-input v-model="dataForm.git" placeholder="git地址"></el-input>
      </el-form-item>
      <el-form-item label="commit id" prop="commitID">
          <el-input v-model="dataForm.commitID" placeholder="commit id"></el-input>
      </el-form-item>
      <el-form-item label="版本包" prop="packageAddress">
          <el-input v-model="dataForm.packageAddress" placeholder="版本包地址(http/ftp)"></el-input>
      </el-form-item>
      <el-form-item label="版本内容" prop="pubContent">
        <VueUeditorWrap v-model="dataForm.pubContent" :config="editorConfig"/>
        <!-- <el-input v-model="dataForm.pubContent" type="textarea" placeholder="版本内容"></el-input> -->
      </el-form-item>
      <el-form-item label="发布步骤" prop="pubStep">
        <VueUeditorWrap v-model="dataForm.pubStep" :config="editorConfig"/>
      </el-form-item>
      <el-form-item label="回滚步骤" prop="rollbackStep">
        <VueUeditorWrap v-model="dataForm.rollbackStep" :config="editorConfig"/>
      </el-form-item>
      <el-form-item label="需求说明书" prop="requirement">
        <el-input v-model="dataForm.requirement" type="textarea" placeholder="需求说明书"></el-input>
      </el-form-item>
      <el-form-item label="应用设计方案" prop="appDesign">
        <el-select v-model="dataForm.appDesign" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用组装测试方案" prop="appAssemblyTestDesign">
        <el-select v-model="dataForm.appAssemblyTestDesign" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用组装测试案例" prop="appAssemblyTestCase">
        <el-select v-model="dataForm.appAssemblyTestCase" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用组装测试报告" prop="appAssemblyTestReport">
        <el-select v-model="dataForm.appAssemblyTestReport" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户测试案例" prop="userTestCase">
        <el-select v-model="dataForm.userTestCase" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户测试报告" prop="userTestReport">
        <el-select v-model="dataForm.userTestReport" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代码评审" prop="codeReview">
        <el-select v-model="dataForm.codeReview" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线控制表" prop="pubControlTable">
        <el-select v-model="dataForm.pubControlTable" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上线脚本评审" prop="pubShellReview">
        <el-select v-model="dataForm.pubShellReview" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试营业方案" prop="trialOperationDesign">
        <el-select v-model="dataForm.trialOperationDesign" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试营业案例" prop="trialOperationCase">
        <el-select v-model="dataForm.trialOperationCase" clearable>
          <el-option
            v-for="item in stateChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-form class="flow" :model="flowForm" :rules="flowRule" ref="flowForm" @keyup.enter.native="flowFormSubmit()" label-width="100px">
        <div class="flow-panel" v-show='enableFlowHistory'>
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
            <el-button size='mini'><i class="el-icon-right"/>转办</el-button> 
            <el-button @click='clickBtnDisableFlowOperate' size='mini'>关闭</el-button>
        </div>
        <div class="flow-operate-panel" v-if='enableFlowOperate'>
            <div class="flow-next-node">
                <span>下一步骤:&nbsp;</span>
                <span v-for="(nextNodeInfo, index) in nextNode.NEXT_NODE_INFO" :key="index">
                    <a class="deco">{{nextNodeInfo.NODE_NAME}}</a>
                </span>
            </div>
            <div class="seperator"></div>
            <div class="flow-next-auditor">
                <span>办理人员:</span>
                <!-- <el-button size='mini' @click="clickBtnAddNextAuditor"><i class="el-icon-plus"></i></el-button> -->
                <el-select v-model="selectAuditor"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getNextAuditor"
                    :loading="loading">
                    <el-option
                        v-for="item in auditorList"
                        :key="item.id"
                        :label="item.cnName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="seperator"></div>
            <div class="audit" v-if="taskID">
                <span>审批结果:&nbsp;</span>
                <el-radio-group v-model="dataForm.audit">
                    <el-radio label="0">不同意</el-radio>
                    <el-radio label="1">同意</el-radio>
                </el-radio-group>
            </div>
            <el-input v-model="dataForm.auditComment" type="textarea" :rows="4" placeholder="请输入审批意见"></el-input>

            <div class="footer">
                <el-button type="primary" size="mini" @click="flowFormSubmit()">确定</el-button>
                <el-button size="mini" @click="visible = false">取消</el-button>
            </div>
        </div>
        <!-- 弹窗 -->
        <NextAuditor v-if="enableNextAuditor" ref="nextAuditor"></NextAuditor>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import NextAuditor from './flow-select-person'
export default {
  data () {
    return {
      loading: false,
      visible: false,
      dataForm: {
        id: 0,
        deployUnitID: '',
        deployUnitName: '',
        versionDate: '',
        git: '',
        commitID: '',
        packageAddress: '',
        pubContent: '',
        pubStep: '',
        rollbackStep: '',
        requirement: '',
        appDesign: '',
        appAssemblyTestDesign: '',
        appAssemblyTestCase: '',
        appAssemblyTestReport: '',
        userTestCase: '',
        userTestReport: '',
        codeReview: '',
        pubControlTable: '',
        pubShellReview: '',
        trialOperationDesign: '',
        trialOperationCase: ''
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
        audit: '0',
        auditComment: ''
      },
      enableFlowHistory: true,
      enableFlowOperate: false,
      enableNextAuditor: false,
      nextNode: {
        NEXT_NODE_INFO: [{
          multiple: null,
          USER: null,
          NODE_NAME: '申请变更开发任务需求范围'
        }]
      },
      auditorList: [],
      selectAuditor: '',
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
        deployUnitID: [
            { required: true, message: '部署单元', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    VueUeditorWrap,
    NextAuditor
  },
  mounted () {
    this.getNextNode()
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
    async selectAuditor(val) {
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
          this.selectAuditor = data.list[0].id
        }
        this.auditorList = data.list
      } else {
        this.auditorList = []
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
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/api/v1/pub/info`),
            method: 'get',
            params: this.$http.adornParams({
              'id': this.dataForm.id
            })
          }).then(({data}) => {
            this.dataForm.deployUnitID = data.deployUnitID
            this.dataForm.deployUnitName = data.deployUnitName
            this.dataForm.versionDate = data.versionDate
            this.dataForm.git = data.git
            this.dataForm.commitID = data.commitID
            this.dataForm.pubContent = data.pubContent
            this.dataForm.pubStep = data.pubStep
            this.dataForm.rollbackStep = data.rollbackStep
            this.dataForm.requirement = data.requirement
            this.dataForm.appDesign = data.appDesign
            this.dataForm.appAssemblyTestDesign = data.appAssemblyTestDesign
            this.dataForm.appAssemblyTestCase = data.appAssemblyTestCase
            this.dataForm.appAssemblyTestReport = data.appAssemblyTestReport
            this.dataForm.userTestCase = data.userTestCase
            this.dataForm.userTestReport = data.userTestReport
            this.dataForm.codeReview = data.codeReview
            this.dataForm.pubControlTable = data.pubControlTable
            this.dataForm.pubShellReview = data.pubShellReview
            this.dataForm.trialOperationDesign = data.trialOperationDesign
            this.dataForm.trialOperationCase = data.trialOperationCase
            // process info
            this.templateID = data.templateID
            this.processInstID = data.processInstID
            this.taskID = data.taskID
          }).catch((error) => {
            this.$message.error(error.message)
          })
        } else {
          this.dataForm.deployUnitID = ''
          this.dataForm.deployUnitName = ''
          this.dataForm.versionDate = ''
          this.dataForm.git = ''
          this.dataForm.commitID = ''
          this.dataForm.content = ''
          this.dataForm.pubStep = ''
          this.dataForm.rollbackStep = ''
          this.dataForm.requirement = ''
          this.dataForm.appDesign = ''
          this.dataForm.appAssemblyTestDesign = ''
          this.dataForm.appAssemblyTestCase = ''
          this.dataForm.appAssemblyTestReport = ''
          this.dataForm.userTestCase = ''
          this.dataForm.userTestReport = ''
          this.dataForm.codeReview = ''
          this.dataForm.pubControlTable = ''
          this.dataForm.pubShellReview = ''
          this.dataForm.trialOperationDesign = ''
          this.dataForm.trialOperationCase = ''
          // process info
          this.templateID = ''
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
      this.$http({
        url: this.$http.adornUrl('/api/v1/proc/nextNodeInfo'),
        method: 'post',
        params: this.$http.adornParams({
          processInstID: this.processInstID,
          templateID: this.templateID,
          taskID: this.taskID,
          conditions: [{
            Key: "choice",
            Value: this.flowForm.audit
          }]
        })
      }).then(({data}) => {
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
    },
      // 关闭
    clickBtnDisableFlowOperate() {
      this.enableFlowOperate = false
    },
      // 流程提交
    flowFormSubmit () {
      this.$refs['flowForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/api/v1/pub/create'),
            method: 'post',
            params: this.$http.adornParams({
            })
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
.audit {
    margin: 10px;
}
.footer {
    margin-top: 10px;
}
.v-form{padding-bottom: 10px;}
.flow-operate-panel {
    margin-top: 20px; 
}
.flow-operate-panel p {
    margin-bottom: 10px;
}
</style>

