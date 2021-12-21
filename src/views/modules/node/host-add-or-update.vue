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
      <el-form-item label="开发负责人" prop="devOwner">
        <el-select v-model="dataForm.devOwner" filterable remote placeholder="请选择" :remote-method="searchUser">
          <el-option v-for="item in devOwners" :key="item.jgygUserID" :label="userInfo(item.cnName, item.jgygUserID)" :value="item.jgygUserID"></el-option>
        </el-select>
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
          tagIDs: [],
          devOwner: '',
          state: ''
        },
        devOwners: [],
        tagChoices: [],
        stateChoices: [{
          'label': '服务中',
          'value': 'servicing'
        }, {
          'label': '已下线',
          'value': 'offline'
        }],
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

        this.$http({
          url: this.$http.adornUrl(`/api/v1/host/info`),
          method: 'get',
          params: this.$http.adornParams({
            'id': this.dataForm.id
          })
        }).then(({data}) => {
          this.dataForm.name = data.name
          this.dataForm.ip = data.ip
          this.dataForm.physicalSystem = data.physicalSystem
          let tagIDs = []
          data.tags.forEach((tag) => {
            tagIDs.push(tag.id)
          })
          this.dataForm.tagIDs = tagIDs
          this.dataForm.state = data.state
          this.dataForm.devOwner = data.devOwner
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
            this.devOwners = data.list
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
                'tagIDs': this.dataForm.tagIDs,
                'state': this.dataForm.state,
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
