<template>
  <div class="line" ref="chartDom"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";

const schema = [
  {
    name: "PM25",
    type: "number",
  },
  {
    name: "PM10",
    type: "number",
  },
  {
    name: "SO2",
    type: "number",
  },
  {
    name: "NO2",
    type: "number",
  },
  {
    name: "O3",
    type: "number",
  },
];

let lists = [];
for (let i = 0; i < 3; i++) {
  let list = [];
  for (let j = 1; j <= 31; j++) {
    let item = {
      index: j,
      date: `2022-04-${j}`,
      PM25: Math.random() * 100,
      PM10: Math.random() * 100,
      SO2: Math.random() * 100,
      NO2: Math.random() * 100,
      O3: Math.random() * 100,
    };
    item.aqi = Math.round(
      (item.PM25 + item.PM10 + item.SO2 + item.NO2 + item.O3) / 5
    );
    list.push(item);
  }
  lists.push(list);
  console.log(lists);
}

console.log(lists);

let datas = [];
lists.forEach((list, i) => {
  let data = [];
  list.forEach((item, j) => {
    data.push([item.index, item.aqi]);
  });
  datas.push(data);
});

var chartDom = ref(null);
onMounted(() => {
  console.log(chartDom);
  chartDom.value.style.width = "350px";
  chartDom.value.style.height = "400px";
  var myChart = echarts.init(chartDom.value);
  var option;

  option = {
    title: {
      text: "AQI城市空气指数",
      x: "center",
      y: "25",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
      },
    },
    color: ["#dd4444", "#fec42c", "#80F1BE"],
    legend: {
      top: "30",
      data: ["北京", "深圳", "广州"],
    },
    grid: {
      top: "50",
      left: "10",
      right: "10",
      bottom: "30",
    },
    xAxis: {
      type: "value",
      name: "日期",
      nameGap: 16,
      nameTextStyle: {
        fontSize: 16,
        color: "#fff",
      },
      axisLabel: {
        color: "#fff",
      },
    },

    yAxis: {
      type: "value",
      name: "AQI指数",
      nameLocation: "end",
      nameGap: 20,
      nameTextStyle: {
        color: "#fff",
      },
      axisLabel: {
        color: "#fff",
      },
    },
    series: [
      {
        name: "北京",
        type: "scatter",
        itemStyle: {
          normal: {
            color: "#ff0000",
          },
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        data: datas[0],
      },
      {
        name: "深圳",
        type: "scatter",
        itemStyle: {
          normal: {
            color: "#00ff44",
          },
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        data: datas[1],
      },
      {
        name: "广州",
        type: "scatter",
        itemStyle: {
          normal: {
            color: "#4444ff",
          },
          opacity: 0.8,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        data: datas[2],
      },
    ],
    grid: {
      top: "50",
      left: "10",
      right: "10",
      bottom: "30",
    },
    tooltip: {
      backgroundColor: "rgba(255,255,255,0.7)",
      formatter: function (params) {
        console.log(params);
        return `
        <div>
            <p>城市：${params.seriesName}</p>
          <p>日期：${lists[params.seriesIndex][params.dataIndex].date}</p>
          <p>AQI指数：${lists[params.seriesIndex][params.dataIndex].aqi}</p>
          <p>PM25指数：${lists[params.seriesIndex][
            params.dataIndex
          ].PM25.toFixed(2)}</p>
          <p>SO2指数：${lists[params.seriesIndex][params.dataIndex].SO2.toFixed(
            2
          )}</p>
        </div>
        
        `;
      },
    },
  };

  option && myChart.setOption(option);
});
</script>
