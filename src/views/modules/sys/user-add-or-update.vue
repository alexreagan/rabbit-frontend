<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="dataForm.name" disabled placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleList">
        <el-transfer
          :data="roleList"
          :titles="titleList"
          v-model="dataForm.roleList"
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
  export default {
    data () {
      return {
        visible: false,
        titleList: ['待选择', '已选择'],
        roleList: [],
        dataForm: {
          id: 0,
          name: '',
          roleList: []
        },
        dataRule: {
          name: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$http({
          url: this.$http.adornUrl('/api/v1/role/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (!data.error) {
            let roleList = []
            data.list.forEach((role) => {
              roleList.push({
                key: role.id,
                label: role.name
              })
            })
            this.roleList = roleList
          }
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/user/info`),
              method: 'get',
              params: this.$http.adornParams({
                'id': this.dataForm.id
              })
            }).then(({data}) => {
              if (data && !data.error) {
                this.dataForm.name = data.user.username
                if (data.roles) {
                  let roles = []
                  data.roles.forEach((role) => {
                    roles.push(role.id)
                  })
                  this.dataForm.roleList = roles
                }
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
              url: this.$http.adornUrl(`/api/v1/user/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'roleList': this.dataForm.roleList
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
