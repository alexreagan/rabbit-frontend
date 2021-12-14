<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="服务名" prop="serviceName" :class="{ 'is-required': !dataForm.id }">
        <el-input v-if="dataForm.id" v-model="dataForm.serviceName" placeholder="服务名" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.serviceName" placeholder="服务名"></el-input>
      </el-form-item>
      <el-form-item label="项目空间" prop="namespace">
        <el-input v-if="dataForm.id" v-model="dataForm.namespace" placeholder="项目空间" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.namespace" placeholder="项目空间"></el-input>
      </el-form-item>
      <el-form-item label="组织空间" prop="workspaceName">
        <el-input v-if="dataForm.id" v-model="dataForm.workspaceName" placeholder="组织空间" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.workspaceName" placeholder="组织空间"></el-input>
      </el-form-item>
      <el-form-item label="集群名称" prop="clusterName">
        <el-input v-if="dataForm.id" v-model="dataForm.clusterName" placeholder="集群名称" :disabled="true"></el-input>
        <el-input v-else v-model="dataForm.clusterName" placeholder="集群名称"></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tagIDs">
        <el-select v-model="dataForm.tagIDs" placeholder="标签" multiple clearable style="width: 100%;">
          <el-option
            v-for="item in tagChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开发负责人" prop="owner">
        <el-select v-model="dataForm.owner" filterable remote placeholder="请选择" :remote-method="searchUser">
          <el-option v-for="item in owners" :key="item.jgygUserId" :label="userInfo(item.cnName, item.jgygUserId)" :value="item.jgygUserId"></el-option>
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
        serviceName: '',
        namespace: '',
        workspaceName: '',
        clusterName: '',
        tagIDs: [],
        owner: ''
      },
      owners: [],
      tagChoices: [],
      dataRule: {
        serviceName: [
          { required: true, message: '服务名不能为空', trigger: 'blur' }
        ],
        owner: [
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
          url: this.$http.adornUrl('/api/v1/tag/list'),
          method: 'get',
          params: this.$http.adornParams({
            orderBy: 'name',
            limit: 10000
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

      this.$http({
        url: this.$http.adornUrl(`/api/v1/caas/service/info`),
        method: 'get',
        params: this.$http.adornParams({
          'id': this.dataForm.id
        })
      }).then(({data}) => {
        this.dataForm.id = data.id
        this.dataForm.serviceName = data.serviceName
        this.dataForm.namespace = data.namespace
        this.dataForm.workspaceName = data.workspaceName
        this.dataForm.clusterName = data.clusterName
        let tagIDs = []
        data.tags.forEach((tag) => {
          tagIDs.push(tag.id)
        })
        this.dataForm.tagIDs = tagIDs
        this.dataForm.owner = data.owner
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
          this.owners = data.list
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
            url: this.$http.adornUrl(`/api/v1/caas/service/${!this.dataForm.id ? 'create' : 'update'}`),
            method: !this.dataForm.id ? 'post' : 'put',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'serviceName': this.dataForm.serviceName,
              'namespace': this.dataForm.namespace,
              'workspaceName': this.dataForm.workspaceName,
              'clusterName': this.dataForm.clusterName,
              'tagIDs': this.dataForm.tagIDs,
              'owner': this.dataForm.owner
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
