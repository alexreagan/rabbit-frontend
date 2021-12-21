<template>
  <div class="mod-template-add-or-update">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-if="dataForm.id" v-model="dataForm.name" placeholder="名称" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-if="dataForm.id" type="textarea" v-model="dataForm.remark" placeholder="描述" :disabled="true"></el-input>
        <el-input v-else type="textarea" v-model="dataForm.remark" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="dataForm.state" placeholder="状态" clearable>
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
  export default {
    data () {
      return {
        loading: false,
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          remark: '',
          state: ''
        },
        stateChoices: [{
          'label': '启用',
          'value': 'enable'
        }, {
          'label': '禁用',
          'value': 'disable'
        }],
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      visible (val) {
        console.log(val)
        if (!val) {
          this.$router.push({ name: 'app-template' })
        }
      }
    },
    activated () {
      this.init(this.$route.query.id)
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/template/info`),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.dataForm.id
              })
            }).then(({data}) => {
              this.dataForm.name = data.name
              this.dataForm.remark = data.remark
              this.dataForm.state = data.state
            }).catch((error) => {
              this.$message.error(error.message)
            })
          } else {
            this.dataForm.id = 0
            this.dataForm.name = ''
            this.dataForm.remark = ''
            this.dataForm.state = 'disable'
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/template/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'remark': this.dataForm.remark,
                'state': this.dataForm.state
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
