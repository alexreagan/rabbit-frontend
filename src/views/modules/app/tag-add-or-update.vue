<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="简称" prop="name">
        <el-input v-model="dataForm.name" placeholder="简称"></el-input>
      </el-form-item>
      <el-form-item label="中文名称" prop="cnName">
        <el-input v-model="dataForm.cnName" placeholder="中文名称"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="categoryID">
        <el-select v-model="dataForm.categoryID" placeholder="类别" clearable>
          <el-option
            v-for="item in categoryChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        visible: false,
        categoryChoices: [],
        dataForm: {
          id: 0,
          name: '',
          cnName: '',
          categoryID: '',
          remark: ''
        },
        dataRule: {
          name: [
            { required: true, message: '简称不能为空', trigger: 'blur' }
          ],
          cnName: [
            { required: true, message: '中文名称不能为空', trigger: 'blur' }
          ],
          categoryID: [
            { required: true, message: '类别不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          // 获取所有的tag类别
          this.$http({
            url: this.$http.adornUrl(`/api/v1/tag_category/all`),
            method: 'get',
            params: this.$http.adornParams({
            })
          }).then(({data}) => {
            let categoryChoices = []
            data.list.forEach((param) => {
              categoryChoices.push({
                label: param.cnName,
                value: param.id
              })
            })
            this.categoryChoices = categoryChoices
          }).catch((error) => {
            this.$message.error(error.message)
          })
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/tag/info`),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.dataForm.id
              })
            }).then(({data}) => {
              if (data && !data.error) {
                this.dataForm.name = data.name
                this.dataForm.cnName = data.cnName
                this.dataForm.categoryID = data.categoryID
                this.dataForm.remark = data.remark
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/tag/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'cnName': this.dataForm.cnName,
                'categoryID': this.dataForm.categoryID,
                'remark': this.dataForm.remark
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
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
