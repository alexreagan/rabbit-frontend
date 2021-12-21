<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="中文名称" prop="cnName">
        <el-input v-model="dataForm.cnName" placeholder="中文名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="权限">
        <el-transfer
          :data="permList"
          :titles="titleList"
          v-model="dataForm.permList"
          ref="permTransfer"
          >
        </el-transfer>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        permList: [],
        titleList: ['待选择', '已选择'],
        dataForm: {
          id: 0,
          name: '',
          cnName: '',
          remark: '',
          permList: []
        },
        dataRule: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          cnName: [
            { required: true, message: '中文名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/api/v1/perm/list'),
          method: 'get',
          params: this.$http.adornParams({
            limit: 10000
          })
        }).then(({data}) => {
          data.list.forEach(function (value, index, array) {
            value.key = value.id
            value.label = value.cnName
            array[index] = value
          })
          this.permList = data.list
        }).catch((error) => {
          this.$message.error(error.message)
        })

        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl('/api/v1/role/info'),
            method: 'get',
            params: this.$http.adornParams({
              'id': this.dataForm.id
            })
          }).then(({data}) => {
            if (!data.error) {
              this.dataForm.name = data.role.name
              this.dataForm.cnName = data.role.cnName
              this.dataForm.remark = data.role.remark
              if (data.perms) {
                let perms = []
                data.perms.forEach((perm) => {
                  perms.push(perm.id)
                })
                this.dataForm.permList = perms
              }
            }
          }).catch((error) => {
            this.$message.error(error.message)
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/role/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'cnName': this.dataForm.cnName,
                'remark': this.dataForm.remark,
                'permList': this.dataForm.permList
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
