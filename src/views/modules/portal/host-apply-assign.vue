<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '处理'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-if="dataForm.id" v-model="dataForm.name" placeholder="名称" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="CPU配额" prop="cpu">
        <el-input v-model="dataForm.cpu" placeholder="CPU配额" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="memory配额" prop="memory">
        <el-input v-model="dataForm.memory" placeholder="memory配额" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="释放时间" prop="releaseAt">
        <el-date-picker
          v-model="dataForm.releaseAt"
          type="date"
          placeholder="选择日期"
          :disabled="true">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="负责人" prop="applier">
        <el-input v-model="dataForm.applier" placeholder="备注" :disabled="true"></el-input>
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
      <el-form-item label="机器列表" prop="hostIDs">
        <el-select v-model="dataForm.hostIDs" placeholder="请输入关键词" multiple clearable  filterable
                   reserve-keyword remote :remote-method="remoteHandler" :loading="loading"
                   style="width: 100%;">
          <el-option
            v-for="item in hostChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批意见" prop="state">
        <el-select v-model="dataForm.state" placeholder="审批意见">
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
      var validateHostIDs = (rule, value, callback) => {
        if (this.dataForm.state === 'success' && !/\S/.test(value)) {
          callback(new Error('机器不能为空'))
        } else {
          callback()
        }
      }
      var validateTagIDs = (rule, value, callback) => {
        if (this.dataForm.state === 'success' && !/\S/.test(value)) {
          callback(new Error('标签不能为空'))
        } else {
          callback()
        }
      }
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
          releaseAt: '',
          hostIDs: [],
          tagIDs: [],
          state: ''
        },
        stateChoices: [{
          value: 'success',
          label: '通过'
        }, {
          value: 'failure',
          label: '不通过'
        }],
        hostChoices: [],
        titleChoices: ['待选择', '已选择'],
        tagChoices: [],
        appliers: [],
        dataRule: {
          hostIDs: [
            { validator: validateHostIDs, trigger: 'blur' }
          ],
          tagIDs: [
            { validator: validateTagIDs, trigger: 'blur' }
          ],
          state: [
            { required: true, message: '审批意见不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/api/v1/host_apply_request/info`),
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

            this.$http({
              url: this.$http.adornUrl('/api/v1/tag/list'),
              method: 'get',
              params: this.$http.adornParams({
                orderBy: 'name',
                'limit': 10000
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

            this.$http({
              url: this.$http.adornUrl('/api/v1/host/select'),
              method: 'get',
              params: this.$http.adornParams({
              })
            }).then(({data}) => {
              let hostChoices = []
              data.list.forEach((host) => {
                hostChoices.push({
                  value: host.id,
                  label: host.ip + '(' + host.physicalSystem + ')'
                })
              })
              this.hostChoices = hostChoices
            }).catch((error) => {
              this.$message.error(error.message)
            })
          }
        })
      },
      remoteHandler (query) {
        this.hostChoices = []
        if (query !== '') {
          this.$http({
            url: this.$http.adornUrl('/api/v1/host/select'),
            method: 'get',
            params: this.$http.adornParams({
              query: query
            })
          }).then(({data}) => {
            let hostChoices = []
            data.list.forEach((host) => {
              hostChoices.push({
                value: host.id,
                label: host.ip + '(' + host.physicalSystem + ')'
              })
            })
            this.hostChoices = hostChoices
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
              url: this.$http.adornUrl(`/api/v1/host_apply_request/assign`),
              method: 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'hostIDs': this.dataForm.hostIDs,
                'tagIDs': this.dataForm.tagIDs,
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
