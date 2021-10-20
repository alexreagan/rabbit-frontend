<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item :label="'名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="'名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级群组" prop="parentName">
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
      <el-form-item label="图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="图标名称" class="icon-list__input"></el-input>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
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
  import Icon from '@/icons'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          name: '',
          parentName: '',
          parentId: 0,
          perms: '',
          icon: '',
          desc: '',
          iconList: []
        },
        dataRule: {
          name: [
            { required: true, message: '群组名称不能为空', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '上级群组不能为空', trigger: 'change' }
          ]
        },
        hostGroup: [],
        hostGroupTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
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
              this.dataForm.parent = data.parent
              this.dataForm.perms = data.perms
              this.dataForm.icon = data.icon
              // this.hostGroupTreeSetCurrentNode()
            }).catch((error) => {
              this.$message.error(error.message)
            })
          }
        })
      },
      // 群组树选中
      hostGroupTreeCurrentChangeHandle (data, node) {
        // console.log(data, node)
        this.dataForm.parentName = data.name
        this.dataForm.parentId = data.id
      },
      // 群组树设置当前选中节点
      hostGroupTreeSetCurrentNode () {
        this.$refs.hostGroupTree.setCurrentKey(this.dataForm.parentName)
        this.dataForm.parentName = (this.$refs.hostGroupTree.getCurrentNode() || {})['name']
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
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
                // 'parent': this.dataForm.parentName,
                'parentId': this.dataForm.parentId,
                'perms': this.dataForm.perms,
                'icon': this.dataForm.icon,
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

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
