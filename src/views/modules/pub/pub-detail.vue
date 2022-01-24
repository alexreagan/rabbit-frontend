<template>
    <div class="page-pub-detail">
        <slot>
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
        </slot>
    </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'
  export default {
    data () {
      return {
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
        }]
      }
    },
    components: {
      VueUeditorWrap
    },
    props: ['id'],
    mounted () {
    },
    activated () {
    },
    created () {
    //   console.log('id: ', this.$props.id)
      let id = this.$props.id
      this.init(id)
    },
    watch: {
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
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
          }
        })
      }
    }
  }
</script>
