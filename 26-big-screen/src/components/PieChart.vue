<template>
  <div class="line" ref="chartDom"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

var chartDom = ref(null);
onMounted(() => {
  console.log(chartDom);
  chartDom.value.style.width = "350px";
  chartDom.value.style.height = "400px";
  var myChart = echarts.init(chartDom.value);
  var option;

  option = {
    title: {
      text: "城市人员组成",
      x: "center",
      y: "15",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
      },
    },
    legend: {
      left: "center",
      top: "bottom",
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        type: "pie",
        radius: ["50", "110"],
        center: ["50%", "50%"],
        // 设置南丁格尔图
        roseType: "area",
        // 南丁格尔图圆角设置
        itemStyle: {
          borderRadius: 6,
        },
        data: [
          { value: 335, name: "IT" },
          { value: 310, name: "金融" },
          { value: 234, name: "互联网" },
          { value: 135, name: "医疗" },
          { value: 154, name: "其他" },
        ],
      },
    ],
  };

  option && myChart.setOption(option);
});
</script>
