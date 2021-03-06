<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="'名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="'名称'"></el-input>
      </el-form-item>
      <el-form-item :label="'类型'" prop="type">
        <el-select v-model="dataForm.type" filterable placeholder="请选择">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 'containerGroup'" :label="'开阳服务'">
        <el-select v-model="dataForm.caasServiceId" filterable placeholder="请选择" remote :remote-method="searchCaasService">
          <el-option v-for="item in caasServices" :key="item.id" :label="showCaasService(item)" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级服务组" prop="parentName">
        <el-popover
          ref="hostGroupPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="hostGroup"
            :props="hostGroupTreeProps"
            node-key="id"
            ref="hostGroupTree"
            @current-change="hostGroupTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:hostGroupPopover :readonly="true" placeholder="点击选择上级群组" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item :label="'描述'" prop="desc">
        <el-input type="textarea" v-model="dataForm.desc" :placeholder="'描述'" maxlength="255" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          type: '',
          parentName: '',
          parentId: 0,
          caasServiceId: 0,
          perms: '',
          desc: ''
        },
        dataRule: {
          name: [
            { required: true, message: '服务组名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '服务组类型不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级服务组不能为空', trigger: 'change' }
          ]
        },
        types: [{
          value: 'vmGroup',
          label: '虚拟机'
        }, {
          value: 'containerGroup',
          label: '容器'
        }],
        hostGroup: [],
        hostGroupTreeProps: {
          label: 'name',
          children: 'children'
        },
        caasServices: []
      }
    },
    created () {
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/api/v1/host_group/all'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.hostGroup = treeDataTranslate(data.list, 'id', 'parentId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.hostGroupTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/api/v1/host_group/get`),
              method: 'get',
              params: this.$http.adornParams({
                'id': id
              })
            }).then(({data}) => {
              this.dataForm.id = data.id
              this.dataForm.name = data.name
              this.dataForm.type = data.type
              this.dataForm.caasServiceId = data.caasServiceId
              this.dataForm.parentName = data.parentName
              this.dataForm.parentId = data.parentId
              this.dataForm.perms = data.perms
              this.dataForm.desc = data.desc
              // this.hostGroupTreeSetCurrentNode()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          }
        })
      },
      // 服务树选中
      hostGroupTreeCurrentChangeHandle (data, node) {
        // console.log(data, node)
        this.dataForm.parentName = data.name
        this.dataForm.parentId = data.id
      },
      // 服务组树设置当前选中节点
      hostGroupTreeSetCurrentNode () {
        this.$refs.hostGroupTree.setCurrentKey(this.dataForm.parentName)
        this.dataForm.parentName = (this.$refs.hostGroupTree.getCurrentNode() || {})['name']
      },
      // 搜索开阳服务
      searchCaasService (query) {
        if (query !== '') {
          this.$http({
            url: this.$http.adornUrl('/api/v1/caas/service/list'),
            method: 'get',
            params: this.$http.adornParams({'name': query})
          }).then(({data}) => {
            this.caasServices = data.list
          }).catch((error) => {
            this.$message.error(error.message)
          })
        }
      },
      showCaasService (item) {
        return item.serviceName + '(' + item.workspaceName + ':' + item.namespace + ':' + item.appName + ':' + item.type + ')'
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/api/v1/host_group/${!this.dataForm.id ? 'create' : 'update'}`),
              method: !this.dataForm.id ? 'post' : 'put',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'parentName': this.dataForm.parentName,
                'parentId': this.dataForm.parentId,
                'caasServiceId': this.dataForm.caasServiceId,
                'perms': this.dataForm.perms,
                'desc': this.dataForm.desc
              })
            }).then(({data}) => {
              if (!data.error) {
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
          }
        })
      }
    }
  }
</script>
