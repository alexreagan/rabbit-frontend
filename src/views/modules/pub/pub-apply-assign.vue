<template>
  <div class="mod-pub-apply-assign">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="部署单元" prop="deployUnitID">
        <span v-html="dataForm.deployUnitName"></span>
      </el-form-item>
      <el-form-item label="git地址" prop="git">
        <span v-html="dataForm.git"></span>
      </el-form-item>
      <el-form-item label="commit id" prop="commitID">
        <span v-html="dataForm.commitID"></span>
      </el-form-item>
      <el-form-item label="版本日期" prop="versionDate">
        <div v-html="dataForm.versionDate"></div>
      </el-form-item>
      <el-form-item label="版本内容" prop="pubContent">
        <div v-html="dataForm.pubContent"></div>
      </el-form-item>
      <el-form-item label="发布步骤" prop="pubStep">
        <div v-html="dataForm.pubStep"></div>
      </el-form-item>
      <el-form-item label="回滚步骤" prop="rollbackStep">
        <div v-html="dataForm.rollbackStep"></div>
      </el-form-item>
      <el-form-item label="需求说明书" prop="requirement">
        <div v-html="dataForm.rollbackStep"></div>
      </el-form-item>
      <el-form-item label="实施状态" prop="status">
        <el-select v-model="dataForm.status" clearable>
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
          pubContent: '',
          pubStep: '',
          rollbackStep: '',
          status: ''
        },
        deployUnitChoices: [],
        stateChoices: [{
          'label': '待实施',
          'value': 'submitted'
        }, {
          'label': '实施成功',
          'value': 'success'
        }, {
          'label': '实施失败',
          'value': 'failure'
        }, {
          'label': '已回滚',
          'value': 'rolledback'
        }],
        editorConfig: {
          autoHeightEnabled: false,
          initialFrameHeight: 300,
          initialFrameWidth: '100%'
        },
        dataRule: {
          status: [
            { required: true, message: '实施状态', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      VueUeditorWrap
    },
    mounted () {
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
              this.dataForm.pubContent = data.pubContent
              this.dataForm.pubStep = data.pubStep
              this.dataForm.rollbackStep = data.rollbackStep
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
            this.dataForm.status = ''
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/pub/assign`),
              method: 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'status': this.dataForm.status
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
