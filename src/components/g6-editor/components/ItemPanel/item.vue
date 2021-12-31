<template>
  <div class="itempannel">
    <el-input
      placeholder="搜索"
      v-model="searchKey"
      size="small"
      prefix-icon="el-icon-search"
      clearable>
    </el-input>
    <ul>
      <li
        v-for="(item, index) in filteredList"
        :key="index"
        class="getItem"
        :data-shape="item.shape"
        :data-type="item.type"
        :data-size="item.size"
        draggable
        @dragstart="handleDragstart"
        @dragend="handleDragEnd($event, item)"
      >
        <span
          class="pannel-type-icon"
          :style="{background: 'url(' + item.image + ')'}"
        ></span>
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import eventBus from '../../utils/eventBus'
import okSvg from '../../assets/icons/ok.svg'
import tagItemSvg from '../../assets/icons/tag-item.svg'
export default {
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      list: [],
      filteredList: [],
      searchKey: ''
    }
  },
  watch: {
    list(val) {
      this.filteredList = val
    },
    searchKey(val) {
      if (val) {
        const res = this.list.filter(item => item.cnName.indexOf(val) > -1 || item.name.indexOf(val) > -1)
        this.filteredList = res
      } else {
        this.filteredList = this.list
      }
    }
  },
  created() {
    this.bindEvent()
    this.getAllTag()
  },
  methods: {
    getAllTag() {
      // 获取所有节点
      this.$http({
        url: this.$http.adornUrl('/api/v1/tag/all'),
        method: 'get',
        params: this.$http.adornParams({
          orderBy: 'name'
        })
      }).then(({data}) => {
        if (data && data.totalCount > 0) {
          const res = data.list.map(item => {
            item.id = item.id.toString()
            return {
              ...item,
              label: item.name,
              size: '170*34',
              color: '#1890ff',
              image: tagItemSvg,
              shape: 'customNode',
              stateImage: okSvg,
              inPoints: [[0, 0.5]],
              outPoints: [[1, 0.5]]
            }
          })
          this.list = res
          eventBus.$emit('allTag', res)
        } else {
          this.list = []
        }
      })
    },
    handleDragstart(e) {
      this.offsetX = e.offsetX
      this.offsetY = e.offsetY
    },
    handleDragEnd(e, item) {
      let data = {...item}
      Object.assign(data, item)
      data.offsetX = this.offsetX
      data.offsetY = this.offsetY
      if (this.page) {
        const graph = this.page.graph
        // const size = e.target.dataset.size.split("*");
        const xy = graph.getPointByClient(e.x, e.y)
        data.x = xy.x
        data.y = xy.y
        data.size = item.size.split('*')
        data.type = 'node'
        this.command.executeCommand('add', [data])
      }
    },
    bindEvent() {
      eventBus.$on('afterAddPage', page => {
        this.page = page
        this.command = page.command
      })
    }
  }
}
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  border-right: 1px solid #e6e9ed;
  overflow: auto;
  padding: 8px 10px 10px 10px;
}
.itempannel ul {
  padding: 0px;
  /* padding-left: 16px; */
}
.itempannel li {
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 170px;
  height: 28px;
  line-height: 26px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
  background-color: rgba(55, 55, 55, 0.1);
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 30px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(14, 48, 88, 0.4);
}
</style>
