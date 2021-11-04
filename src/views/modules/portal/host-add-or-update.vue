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
      <el-form-item label="物理子系统" prop="physicalSystem">
        <el-input v-if="dataForm.id" v-model="dataForm.physicalSystem" placeholder="物理子系统" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.physicalSystem" placeholder="物理子系统"></el-input>
      </el-form-item>
      <el-form-item label="服务组" prop="groups">
        <el-cascader ref="groupCascader" v-model="dataForm.groups" :options="dataForm.groupOptions" :props="dataForm.groupProps" @change="groupChangeHandle" placeholder="请选择" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="开发负责人" prop="devOwner">
        <el-select v-model="dataForm.devOwner" filterable remote placeholder="请选择" :remote-method="searchUser">
          <el-option v-for="item in dataForm.devOwners" :key="item.jgygUserId" :label="userInfo(item.cnName, item.jgygUserId)" :value="item.jgygUserId"></el-option>
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
          physicalSystem: '',
          ip: '',
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
          ip: [
            { required: true, message: 'ip不能为空', trigger: 'blur' }
          ],
          physicalSystem: [
            { required: true, message: '物理子系统', trigger: 'blur' }
          ],
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
      init (id) {
        this.visible = true
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/api/v1/tree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          this.dataForm.groupOptions = data
        }).catch((error) => {
          this.$message.error(error.message)
        })

        this.$http({
          url: this.$http.adornUrl(`/api/v1/host/info/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          data.groups.forEach(function (value, index, array) {
            array[index] = JSON.parse(value.path)
          })
          this.dataForm.name = data.name
          this.dataForm.ip = data.ip
          this.dataForm.physicalSystem = data.physicalSystem
          this.dataForm.groups = data.groups
          this.dataForm.devOwner = data.devOwner
        }).catch((error) => {
          this.$message.error(error.message)
        })
      },
      searchTenant (query) {
        if (query !== '') {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/api/v1/tenant/list'),
            method: 'get',
            params: this.$http.adornParams({'name': query})
          }).then(({data}) => {
            this.dataForm.tenants = data.list
          }).catch((error) => {
            this.$message.error(error.message)
          })
        }
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
              url: this.$http.adornUrl(`/api/v1/host/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'physicalSystem': this.dataForm.physicalSystem,
                'ip': this.dataForm.ip,
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
