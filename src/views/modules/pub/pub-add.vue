<template>
  <div class="page-pub-add">
    <slot>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
            <el-form-item label="部署单元" prop="deployUnitID">
                <el-select v-model="dataForm.deployUnitID" filterable clearable>
                <el-option
                    v-for="item in deployUnitChoices"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="版本日期" prop="versionDate">
                <el-date-picker
                v-model="dataForm.versionDate"
                type="datetime"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="git地址" prop="git">
                <el-input v-model="dataForm.git" placeholder="git地址"></el-input>
            </el-form-item>
            <el-form-item label="commit id" prop="commitID">
                <el-input v-model="dataForm.commitID" placeholder="commit id"></el-input>
            </el-form-item>
            <el-form-item label="版本包" prop="packageAddress">
                <el-input v-model="dataForm.packageAddress" placeholder="版本包地址(http/ftp)"></el-input>
            </el-form-item>
            <el-form-item label="版本内容" prop="pubContent">
                <VueUeditorWrap v-model="dataForm.pubContent" :config="editorConfig"/>
            </el-form-item>
            <el-form-item label="发布步骤" prop="pubStep">
                <VueUeditorWrap v-model="dataForm.pubStep" :config="editorConfig"/>
            </el-form-item>
            <el-form-item label="回滚步骤" prop="rollbackStep">
                <VueUeditorWrap v-model="dataForm.rollbackStep" :config="editorConfig"/>
            </el-form-item>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span> -->
    </slot>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        deployUnitID: '',
        deployUnitName: '',
        versionDate: '',
        git: '',
        commitID: '',
        packageAddress: '',
        pubContent: '',
        pubStep: '',
        rollbackStep: ''
      },
      deployUnitChoices: [],
      stateChoices: [
        {
          label: '未开始',
          value: 'unstart'
        },
        {
          label: '进行中',
          value: 'running'
        },
        {
          label: '已完成',
          value: 'finished'
        },
        {
          label: '裁剪',
          value: 'trim'
        }
      ],
      editorConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 300,
        initialFrameWidth: '100%'
      },
      dataRule: {
        deployUnitID: [{required: true, message: '部署单元', trigger: 'blur'}],
        versionDate: [{required: true, message: '版本日期', trigger: 'blur'}],
        pubContent: [{required: true, message: '版本内容', trigger: 'blur'}],
        git: [{required: true, message: 'git地址', trigger: 'blur'}],
        commitID: [{required: true, message: 'commit id', trigger: 'blur'}],
        packageAddress: [{required: true, message: '版本包地址(http/ftp)', trigger: 'blur'}],
        pubStep: [
          {required: true, message: '发布步骤', trigger: 'blur'}
        ],
        rollbackStep: [
          {required: true, message: '回滚步骤', trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    VueUeditorWrap
  },
  mounted() {
  },
  activated() {
    this.init(this.$route.query.id)
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$router.push({name: 'pub-pub-apply'})
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.dataForm.id = id || 0
      this.$nextTick(() => {
        this.$http({
          url: this.$http.adornUrl(`/api/v1/tag/all`),
          method: 'get',
          params: this.$http.adornParams({
            categoryName: 'deployunit'
          })
        })
          .then(({data}) => {
            let deployUnitChoices = []
            data.list.forEach((data) => {
              deployUnitChoices.push({
                label: data.name,
                value: data.id
              })
            })
            this.deployUnitChoices = deployUnitChoices
          })
          .catch((error) => {
            this.$message.error(error.message)
          })
      })
    },
    // 表单校验
    validate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        }
      })
    }
  }
}
</script>
