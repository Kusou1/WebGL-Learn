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

  let areas = [
    "越秀区",
    "海珠区",
    "黄浦区",
    "萝岗区",
    "天河区",
    "白云区",
    "南沙区",
    "从化区",
    "增城区",
  ];

  let series = areas.map((area, index) => {
    let data = [];
    for (let i = 0; i < 7; i++) {
      data.push((Math.random() - 0.5) * 300 + i * (100 + index * 20) + 100);
    }

    return {
      name: area,
      type: "line",
      data: data,
    };
  });

  option = {
    title: {
      text: "各区GDP增长情况",
      x: "center",
      y: "15",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
      },
    },
    legend: {
      data: [
        "越秀区",
        "海珠区",
        "黄浦区",
        "萝岗区",
        "天河区",
        "白云区",
        "南沙区",
        "从化区",
        "增城区",
      ],
      left: "center",
      top: "50",
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      data: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"],
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
      },
    },
    series: series,
    grid: {
      left: "50",
      right: "10",
      top: "130",
      bottom: "30",
    },
  };

  option && myChart.setOption(option);
});
</script>
