<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="IP" prop="ip" :class="{ 'is-required': !dataForm.id }">
        <el-input v-if="dataForm.id" v-model="dataForm.ip" placeholder="IP" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.ip" placeholder="IP"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-if="dataForm.id" v-model="dataForm.name" placeholder="名称" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-form>
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
          name: ''
        },
        tagChoices: [],
        dataRule: {
          ip: [
            { required: true, message: 'ip不能为空', trigger: 'blur' }
          ],
          physicalSystem: [
            { required: true, message: '物理子系统', trigger: 'blur' }
          ],
          devOwner: [
            { required: true, message: '开发负责人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl('/api/v1/tag/all'),
            method: 'get',
            params: this.$http.adornParams({
              orderBy: 'name'
            })
          }).then(({data}) => {
            let tagChoices = []
            data.list.forEach((tag) => {
              tagChoices.push({
                'label': tag.name + '(' + tag.cnName + ')',
                'value': tag.id
              })
            })
            this.tagChoices = tagChoices
          }).catch((error) => {
            this.$message.error(error.message)
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/node/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name
              })
            }).then(({data}) => {
              if (data && !data.error) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
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
