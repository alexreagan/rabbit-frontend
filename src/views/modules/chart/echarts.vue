<template>
  <div class="mod-demo-echarts">
<!--    <el-alert-->
<!--      title="提示："-->
<!--      type="warning"-->
<!--      :closable="false">-->
<!--      <div slot-scope="description">-->
<!--        <p class="el-alert__description">1. 此Demo只提供ECharts官方使用文档，入门部署和体验功能。具体使用请参考：http://echarts.baidu.com/index.html</p>-->
<!--      </div>-->
<!--    </el-alert>-->

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div id="J_chartBarBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartPieBox" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartBarData: {
          legend: null,
          xAxis: null,
          series: null
        },
        chartPieData: {
          title: 'Customized Pie',
          series: {
            data: []
          }
        },
        chartBar: null,
        chartPie: null
      }
    },
    mounted () {
      this.initChartBar()
      this.initChartPie()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartBar) {
        this.chartBar.resize()
      }
      if (this.chartPie) {
        this.chartPie.resize()
      }
    },
    methods: {
      // 柱状图
      initChartBar () {
        this.$http({
          url: this.$http.adornUrl('/api/v1/chart/bar'),
          method: 'get'
        }).then(({data}) => {
          this.chartBarData.legend = data.legend
          this.chartBarData.xAxis = data.xAxis
          this.chartBarData.series = data.series
          this.initChartBarCore()
        }).catch((error) => {
          this.$message.error(error.message)
        })
      },
      initChartBarCore () {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: this.chartBarData.legend,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: this.chartBarData.xAxis,
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: this.chartBarData.series
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'))
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      // 饼状图
      initChartPie () {
        this.$http({
          url: this.$http.adornUrl('/api/v1/chart/pie'),
          method: 'get'
        }).then(({data}) => {
          this.chartPieData.title = data.title
          this.chartPieData.series.name = data.series.name
          this.chartPieData.series.data = data.series.data
          this.initChartPieCore()
        }).catch((error) => {
          this.$message.error(error.message)
        })
      },
      initChartPieCore () {
        var option = {
          backgroundColor: '#2c343c',
          title: {
            text: this.chartPieData.title,
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: this.chartPieData.series.name,
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: this.chartPieData.series.data.sort(function (a, b) { return a.value - b.value }),
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              itemStyle: {
                normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200
              }
            }
          ]
        }
        this.chartPie = echarts.init(document.getElementById('J_chartPieBox'))
        this.chartPie.setOption(option)
        window.addEventListener('resize', () => {
          this.chartPie.resize()
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
