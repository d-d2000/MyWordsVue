<template>
  <div :style="{ height: contentHeight + 'px' }">
    <el-row>
      <el-col style="height: 400px" :span="12"
        ><v-chart class="chart" :option="option"
      /></el-col>
      <el-col style="height: 400px" :span="12"
        ><v-chart class="chart" :option="option1"
      /></el-col>
    </el-row>
  </div>
</template>
<script>
// @ is an alias to /src
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
export default {
  props: {
    windowHeight: {
      type: Number,
    },
    windowWidth: {
      type: Number,
    },
  },
  data() {
    return {
      option: {
        title: {
          text: "单词记忆占比分析-饼图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {d}%",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [],
        },
        series: [
          {
            name: "单词记忆占比分析-饼图",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0,0,0,0.5)",
              },
            },
          },
        ],
      },
      option1: {
        title: {
          text: "单词记忆占比分析-柱状图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: { data: [] },
        yAxis: {},
        series: [
          {
            name: "单词记忆占比分析",
            type: "bar",
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.contentHeight = this.windowHeight - 155;
    this.loadData();
  },
  mounted() {},
  methods: {
    loadData() {
      var args = {};
      console.info("查询", args);
      this.$axios({
        url: "myServer/yipai/wordsInfo/getCharts",
        params: args,
      }).then(
        (response) => {
          console.log("response", response);
          var stateList = response.data.stateList;
          var timeList = response.data.timeList;

          var count = stateList[0].c1 + stateList[1].c1;
          var complete = stateList[0].c1 / count;
          var uncomplete = stateList[1].c1 / count;

          this.option.series[0].data = [{
            name: "已记住",
            value: complete
          }, {
            name: "未记住",
            value: uncomplete
          }];

          this.option1.xAxis.data = ["已记住","未记住"];
          this.option1.series[0].data = [stateList[0].c1, stateList[1].c1];


          // var data1 = [];
          // var data2 = [];
          // var data3 = [];
          // res.forEach((item) => {
          //   data1.push({
          //     name: item.content,
          //     value: item.nums,
          //   });
          //   data3.push({
          //     name: item.content,
          //     value: item.nums,
          //     itemStyle: {
          //       color: this.randomHexColor(),
          //       shadowColor: this.randomHexColor(),
          //       borderType: "dashed",
          //       opacity: 0.5,
          //     },
          //   });
          //   data2.push(item.content);
          // });
          // this.option.series[0].data = data1;
          // this.option1.series[0].data = data3;
          // this.option.legend.data = data2;
          // this.option1.xAxis.data = data2;

          return response.data;
        },
        (error) => {
          console.log("错误", error.message);
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
