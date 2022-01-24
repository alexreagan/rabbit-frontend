<template>
  <div class="mod-template-add-or-update">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
  // import ueditor from 'ueditor'
  import VueUeditorWrap from 'vue-ueditor-wrap'
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
        editorConfig: {
          autoHeightEnabled: false,
          initialFrameHeight: 300,
          initialFrameWidth: '100%'
        },
        dataRule: {
          deployUnitID: [
            { required: true, message: '部署单元', trigger: 'blur' }
          ],
          versionDate: [
            { required: true, message: '版本日期', trigger: 'blur' }
          ],
          pubContent: [
            { required: true, message: '版本内容', trigger: 'blur' }
          ],
          pubStep: [
            { required: true, message: '发布步骤', trigger: 'blur' }
            // { validator: validatePubStep, trigger: 'blur' }
          ],
          rollbackStep: [
            { required: true, message: '回滚步骤', trigger: 'blur' }
            // { validator: validateRollbackStep, trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      VueUeditorWrap
    },
    mounted () {
      // this.pubStepEditor = ueditor.getEditor(this.pubStepEditorID, {
      //   zIndex: 3000
      // })
      // this.rollbackStepEditor = ueditor.getEditor(this.rollbackStepEditorID, {
      //   zIndex: 3000
      // })
    },
    activated () {
      this.init(this.$route.query.id)
    },
    watch: {
      visible (val) {
        if (!val) {
          this.$router.push({ name: 'pub-pub-apply' })
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
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
              this.dataForm.packageAddress = data.packageAddress
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
            this.dataForm.packageAddress = ''
            this.dataForm.pubContent = ''
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
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/pub/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deployUnitID': this.dataForm.deployUnitID,
                'versionDate': this.dataForm.versionDate,
                'git': this.dataForm.git,
                'commitID': this.dataForm.commitID,
                'packageAddress': this.dataForm.packageAddress,
                'pubContent': this.dataForm.pubContent,
                'pubStep': this.dataForm.pubStep,
                'rollbackStep': this.dataForm.rollbackStep,
                'requirement': this.dataForm.requirement,
                'appDesign': this.dataForm.appDesign,
                'appAssemblyTestDesign': this.dataForm.appAssemblyTestDesign,
                'appAssemblyTestCase': this.dataForm.appAssemblyTestCase,
                'appAssemblyTestReport': this.dataForm.appAssemblyTestReport,
                'userTestCase': this.dataForm.userTestCase,
                'userTestReport': this.dataForm.userTestReport,
                'codeReview': this.dataForm.codeReview,
                'pubControlTable': this.dataForm.pubControlTable,
                'pubShellReview': this.dataForm.pubShellReview,
                'trialOperationDesign': this.dataForm.trialOperationDesign,
                'trialOperationCase': this.dataForm.trialOperationCase
              })
            }).then(({data}) => {
              if (data && !data.error) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.error)
              }
            }).catch((error) => {
              this.$message.error(error.message)
            })
          }
        })
      }
    }
  }
</script>
