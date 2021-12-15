<template>
  <div id="app" style="height:400px">
    <BaseFlow mode="edit" :data=data :getData=getData>
    </BaseFlow>
  </div>
</template>

<script>
  import Vue from 'vue'
  // import G6Editor from 'rt-vue-g6-editor'
  import g6 from 'vue-g6-editor'
  import 'vue-g6-editor/lib/BaseFlow.css'
  Vue.use(g6)
  export default {
    data () {
      return {
        data: {}
      }
    },
    activated () {
    },
    components: {
    },
    methods: {
      getData (data) {
        console.log(data)
      }
    }
  }
</script>
