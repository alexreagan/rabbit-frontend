<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-if="dataForm.id" v-model="dataForm.name" placeholder="名称" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="CPU配额" prop="cpu">
        <el-input v-model="dataForm.cpu" placeholder="CPU配额"></el-input>
      </el-form-item>
      <el-form-item label="memory配额" prop="memory">
        <el-input v-model="dataForm.memory" placeholder="memory配额"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="释放时间" prop="releaseAt">
        <el-date-picker
          v-model="dataForm.releaseAt"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="负责人" prop="applier">
        <el-select v-model="dataForm.applier" filterable remote placeholder="请选择" :remote-method="searchUser">
          <el-option v-for="item in appliers" :key="item.jgygUserID" :label="userInfo(item.cnName, item.jgygUserID)" :value="item.jgygUserID"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
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
          cpu: '',
          memory: '',
          remark: '',
          applier: '',
          releaseAt: ''
        },
        appliers: [],
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          applier: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ],
          releaseAt: [
            { required: true, message: '释放时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/node_apply_request/info`),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.dataForm.id
              })
            }).then(({data}) => {
              this.dataForm.name = data.name
              this.dataForm.cpu = data.cpu
              this.dataForm.memory = data.memory
              this.dataForm.remark = data.remark
              this.dataForm.applier = data.applier
              this.dataForm.releaseAt = data.releaseAt
            }).catch((error) => {
              this.$message.error(error.message)
            })
          }
        })
      },
      searchUser (query) {
        if (query !== '') {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/api/v1/user/list'),
            method: 'get',
            params: this.$http.adornParams({'username': query})
          }).then(({data}) => {
            this.appliers = data.list
          }).catch((error) => {
            this.$message.error(error.message)
          })
        }
      },
      userInfo (name, other) {
        return name + '(' + other + ')'
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/node_apply_request/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'remark': this.dataForm.remark,
                'cpu': this.dataForm.cpu,
                'memory': this.dataForm.memory,
                'applier': this.dataForm.applier,
                'releaseAt': this.dataForm.releaseAt
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
