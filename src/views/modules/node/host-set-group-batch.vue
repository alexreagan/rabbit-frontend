<template>
  <el-dialog
    :title="'设置'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="服务组" prop="groups">
        <el-cascader ref="groupCascader" v-model="dataForm.groups" :options="dataForm.groupOptions" :props="dataForm.groupProps" @change="groupChangeHandle" placeholder="请选择" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="开发负责人" prop="devOwner">
        <el-select v-model="dataForm.devOwner" filterable remote placeholder="请选择" :remote-method="searchUser">
          <el-option v-for="item in dataForm.devOwners" :key="item.jgygUserID" :label="userInfo(item.cnName, item.jgygUserID)" :value="item.jgygUserID"></el-option>
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
          ids: [],
          groups: [],
          groupIds: [],
          devOwner: '',
          groupProps: {
            value: 'name',
            label: 'name',
            children: 'children',
            checkStrictly: true,
            multiple: true
          },
          path: [],
          groupOptions: [],
          devOwners: []
        },
        dataRule: {
          groups: [
            { required: true, message: '所属组不能为空', trigger: 'blur' }
          ],
          devOwner: [
            { required: true, message: '开发负责人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (ids) {
        this.visible = true
        this.dataForm.ids = ids || 0
        this.$http({
          url: this.$http.adornUrl('/api/v1/tree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataForm.groupOptions = data
        }).catch((error) => {
          this.$message.error(error.message)
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
            this.dataForm.devOwners = data.list
          }).catch((error) => {
            this.$message.error(error.message)
          })
        }
      },
      groupChangeHandle (nodes) {
        this.dataForm.groupIds = []
        let that = this
        this.$refs.groupCascader.getCheckedNodes().forEach(function (value, index, array) {
          that.dataForm.groupIds.push(value.data.id)
        })
      },
      userInfo (name, other) {
        return name + '(' + other + ')'
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/host/batch/update`),
              method: 'put',
              data: this.$http.adornData({
                'ids': this.dataForm.ids || undefined,
                'groups': this.dataForm.groups,
                'groupIds': this.dataForm.groupIds,
                'devOwner': this.dataForm.devOwner
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
