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
  var data1 = [];
  for (let i = 0; i < 50; i++) {
    data1.push([i * 2 + 35 * Math.random(), i * 20 + Math.random() * 10]);
  }
  var data2 = [];
  for (let i = 0; i < 50; i++) {
    data2.push([i * 2 + 30 * Math.random(), i * 20 + Math.random() * 10]);
  }

  option = {
    color: [
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      "#ea7ccc",
    ],
    title: {
      text: "学习投资与薪资情况",
      x: "center",
      y: "25",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
      },
    },
    xAxis: {
      axisLabel: {
        color: "#fff",
      },
    },
    yAxis: {
      axisLabel: {
        color: "#fff",
      },
    },
    series: [
      {
        id: "男性",
        name: "男性",
        type: "scatter",
        data: data1,
        dataGroupId: "男性",
        universalTransition: {
          enabled: true,
          delay: function (idx, count) {
            return Math.random() * 400;
          },
        },
      },
      {
        id: "女性",
        name: "女性",
        type: "scatter",
        data: data2,
        dataGroupId: "女性",
        universalTransition: {
          enabled: true,
          delay: function (idx, count) {
            return Math.random() * 400;
          },
        },
      },
    ],
    grid: {
      left: "50",
      right: "20",
      top: "80",
      bottom: "30",
    },
  };

  const barOption = {
    title: {
      text: "学习投资与薪资情况",
      x: "center",
      y: "25",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      data: ["女性", "男性"],
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
    series: [
      {
        id: "total",
        data: [
          {
            value: calcAverage(data1),
            groupId: "男性",
          },
          {
            value: calcAverage(data2),
            groupId: "女性",
          },
        ],
        type: "bar",
        barWidth: "80",
        universalTransition: {
          enabled: true,
          seriesKey: ["男性", "女性"],
          delay: function (idx, count) {
            return Math.random() * 400;
          },
        },
      },
    ],
    grid: {
      top: 100,
      bottom: "25",
    },
  };

  function calcAverage(data) {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
      sum += data[i][0];
    }
    return sum / data.length;
  }

  // option && myChart.setOption(option);

  let currentOption = option;
  setInterval(() => {
    currentOption = currentOption === option ? barOption : option;
    myChart.setOption(currentOption, true);
  }, 2000);
});
</script>
