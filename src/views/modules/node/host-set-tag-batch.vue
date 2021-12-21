<template>
  <el-dialog
    :title="'设置'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="标签">
        <el-select v-model="dataForm.tagIDs" placeholder="标签" multiple clearable>
          <el-option
            v-for="item in tagChoices"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开发负责人">
        <el-select v-model="dataForm.devOwner" filterable remote placeholder="请选择" :remote-method="searchUser">
          <el-option v-for="item in devOwners" :key="item.jgygUserID" :label="userInfo(item.cnName, item.jgygUserID)" :value="item.jgygUserID"></el-option>
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
          tagIDs: [],
          devOwner: ''
        },
        tagChoices: [],
        devOwners: [],
        dataRule: {
          tagIDs: [
            { required: true, message: '所属标签不能为空', trigger: 'blur' }
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
      searchUser (query) {
        if (query !== '') {
          this.loading = true
          this.$http({
            url: this.$http.adornUrl('/api/v1/user/list'),
            method: 'get',
            params: this.$http.adornParams({'username': query})
          }).then(({data}) => {
            console.log(data.list)
            this.devOwners = data.list
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
              url: this.$http.adornUrl(`/api/v1/host/batch/update`),
              method: 'put',
              data: this.$http.adornData({
                'ids': this.dataForm.ids || undefined,
                'tagIDs': this.dataForm.tagIDs,
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
