<template>
  <div>
    <G6Editor mode="edit" :data="templateInfo" :height="height" :style="`height:${height}px;`"> </G6Editor>
  </div>
</template>

<script>
import G6Editor from '@/components/g6-editor/components/G6Editor'
export default {
  components: {G6Editor},
  data() {
    return {
      templateInfo: null,
      height: 0
    }
  },
  watch: {
  },
  computed: {},
  created() {
    this.height = document.documentElement.clientHeight - 150
  },
  activated() {
    this.height = document.documentElement.clientHeight - 150
    this.getData()
  },
  mounted() {},
  methods: {
    getData() {
      const id = this.$route.query.id || 0
      this.$http({
        url: this.$http.adornUrl(`/api/v1/template/info?id=${id}`),
        method: 'get'
      }).then(({data}) => {
        if (data) {
          const content = JSON.parse(data.content)
          const edges = []
          content.edges.forEach(item => {
            edges.push({
              ...item,
              source: item.source + '',
              target: item.target + ''
            })
          })
          content.edges = edges
          this.templateInfo = content
        }
      })
    }
  }
}
</script>
