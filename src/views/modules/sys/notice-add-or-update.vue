<template>
  <div class="mod-notice-add-or-update">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <VueUeditorWrap v-model="dataForm.content" :config="editorConfig" />
      </el-form-item>
      <el-form-item label="生效时间" prop="validTime">
        <el-date-picker
          v-model="dataForm.validTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  data() {
    return {
      loading: false,
      visible: false,
      dataForm: {
        id: 0,
        title: '',
        content: '',
        validTime: []
      },
      editorConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 300,
        initialFrameWidth: '100%'
      },
      dataRule: {
        title: [{required: true, message: '标题', trigger: 'blur'}],
        content: [{required: true, message: '内容', trigger: 'blur'}],
        validTime: [{required: true, message: '有效时间', trigger: 'blur'}]
      }
    }
  },
  components: {
    VueUeditorWrap
  },
  mounted() {},
  activated() {
    this.init(this.$route.query.id)
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$router.push({name: 'sys-notice'})
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.dataForm.id = id || 0
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/api/v1/notice/info`),
            method: 'get',
            params: this.$http.adornParams({
              id: this.dataForm.id
            })
          })
            .then(({data}) => {
              this.dataForm.title = data.title
              this.dataForm.content = data.content
              this.dataForm.validTime = [data.timeBegin, data.timeEnd]
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        } else {
          this.dataForm.title = ''
          this.dataForm.content = ''
          this.dataForm.validTime = []
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/api/v1/notice/${!this.dataForm.id ? 'create' : 'update'}`
            ),
            method: !this.dataForm.id ? 'post' : 'put',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              title: this.dataForm.title,
              content: this.dataForm.content,
              time: this.dataForm.validTime
            })
          })
            .then(({data}) => {
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
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        }
      })
    }
  }
}
</script>
