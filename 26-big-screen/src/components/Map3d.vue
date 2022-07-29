<template>
  <div class="mapLine" ref="mapDom" :style="styleObj"></div>
</template>

<script setup>
import { appendToMemberExpression } from "@babel/types";
import { ref, onMounted, reactive } from "vue";
let styleObj = reactive({
  width: "1920px",
  height: "1080px",
});
let mapDom = ref(null);

var bloomEffect = new mapvgl.BloomEffect({
  blurSize: 30,
  threshold: 0.5,
});

var brightEffect = new mapvgl.BrightEffect({
  threshold: 0.5,
  blurSize: 5,
  clarity: 1,
});
onMounted(() => {
  console.log(mapDom);
  fetch("./assets/mapstyle/custom_map_config.json")
    .then((res) => res.json())
    .then((res) => {
      // console.log(res)
      map.setMapStyleV2({ styleJson: res });
      var logo = document.querySelector(".anchorBL img");
      logo.parentElement.removeChild(logo);
    });
  var map = new BMapGL.Map(mapDom.value);
  var point = new BMapGL.Point(106.542353, 29.565448);
  map.centerAndZoom(point, 17);

  map.enableScrollWheelZoom(true);
  map.setTilt(80);
  map.setHeading(0);

  // 关键帧动画
  var keyFrames = [
    {
      center: new BMapGL.Point(106.542353, 29.565448),
      zoom: 17,
      tilt: 80,
      heading: 0,
      percentage: 0,
    },
    {
      center: new BMapGL.Point(106.545353, 29.565448),
      zoom: 17,
      tilt: 80,
      heading: 0,
      percentage: 0.5,
    },
    {
      center: new BMapGL.Point(106.542353, 29.565448),
      zoom: 17,
      tilt: 80,
      heading: 0,
      percentage: 1,
    },
  ];
  var opts = {
    interation: 2,
    duration: 8000,
  };
  var animation = new BMapGL.ViewAnimation(keyFrames, opts);
  map.startViewAnimation(animation);

  var view = new mapvgl.View({
    effects: [bloomEffect, brightEffect],
    map: map,
  });
  var sparkDatas = [[], [], [], []];
  var sparkLayers = [];
  var randomNum = 30;
  var randomSize = 0.05;

  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < randomNum; j++) {
      var coord = [
        point.lng + (Math.random() - 0.5) * randomSize,
        point.lat + (Math.random() - 0.5) * randomSize,
      ];
      sparkDatas[i].push({
        geometry: {
          type: "point",
          coordinates: coord,
        },
        properties: {
          height: 400 + parseInt(Math.random() * 200),
        },
      });
    }
    var layer = new mapvgl.SparkLayer({
      height: (data) => {
        return data.properties.height;
      },
      data: sparkDatas[i],
      setp: 0.1,
      startTime: Math.random() * 3,
      endTime: 7 + Math.random() * 3,
      color: `rgba(${parseInt(200 + Math.random() * 55)},${parseInt(
        200 + Math.random() * 55
      )},${parseInt(200 + Math.random() * 55)},0.8)`,
    });
    sparkLayers.push(layer);
    view.addLayer(layer);
  }

  fetch("./json/chongqing.json")
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      var data = res;
      var polygons = [];
      for (var i = 0; i < data.length; i++) {
        var line = data[i];
        var ploygon = [];
        var pt = [line[1] * 512, line[2] * 512];
        for (var j = 3; j < line.length; j += 2) {
          pt[0] += line[j] / 100 / 2;
          pt[1] += line[j + 1] / 100 / 2;
          ploygon.push([pt[0], pt[1]]);
        }

        if (Math.random() > 0.5) {
          polygons.push({
            geometry: {
              type: "Polygon",
              coordinates: [ploygon],
            },
            properties: {
              height: line[0] / 2,
            },
          });
        }
      }

      var shapeLayer = new mapvgl.ShapeLayer({
        color: "rgba(194,147,75,0.8)",
        enablePicked: false,
        selectedIndex: -1,
        selectedColor: "rgba(194,10,10,0.8)",
        autoSelect: true,
        onClick: function (e) {
          console.log("选中建筑");
        },
      });
      view.addLayer(shapeLayer);
      shapeLayer.setData(polygons);

      map.setDefaultCursor("default");
    });
});
</script>
