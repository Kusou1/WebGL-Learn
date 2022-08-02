<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import * as dat from "dat.gui";
// console.log(flightData);
const gui = new dat.GUI();

// 设置cesium的token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";
// cesium默认资源路径
window.CESIUM_BASE_URL = "/";
// 设置默认的视角为中国
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西边经度
  89.5,
  // 南边维度
  20.4,
  // 东边经度
  110.4,
  // 北边维度
  61.2
);

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer", {
    infoBox: true,
    terrainProvider: new Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    }),
  });

  // 设置沙箱允许使用JS
  var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
  iframe.setAttribute(
    "sandbox",
    "allow-same-origin allow-scripts allow-popups allow-forms"
  );
  iframe.setAttribute("src", "");

  // // 隐藏cesiumLogo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // Cesium全球3.5亿做建筑物，数据来源openStreetMap地图
  let tiles3d = new Cesium.createOsmBuildings();
  tiles3d.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [
        ["${feature['building']} === 'office'", "color('red')"],
        ["${feature['building']} === 'commercial'", "color('orange')"],
        // ["${feature['building']} === 'residential'", "color('yellow',0.8)"],
        ["true", "color('skyblue',0.8)"],
      ],
    },
  });
  console.log(tiles3d);
  var buildings = viewer.scene.primitives.add(tiles3d);

  let params = {
    heightColor: function () {
      tiles3d.style = new Cesium.Cesium3DTileStyle({
        // 颜色设置，颜色名称/16进制颜色值/rgba颜色值
        color: {
          // 条件判断
          conditions: [
            ["${feature['cesium#estimatedHeight']} > 300", "color('#0000CD')"],
            ["${feature['cesium#estimatedHeight']} > 200", "color('#4169E1')"],
            ["${feature['cesium#estimatedHeight']} > 100", "color('#1E90FF')"],
            ["${feature['cesium#estimatedHeight']} > 50", "color('#00BFFF')"],
            ["${feature['cesium#estimatedHeight']} > 20", "color('#87CEEB')"],
            ["true", "color('#ADD8E6',0.8)"],
          ],
        },
      });
    },
    distanceColor: function () {
      tiles3d.style = new Cesium.Cesium3DTileStyle({
        defines: {
          distance:
            "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191, 23.109))",
        },
        color: {
          conditions: [
            ["${distance} < 0.005", "color('#0000CD')"],
            ["${distance} < 0.01", "color('#4169E1')"],
            ["${distance} < 0.015", "color('#1E90FF')"],
            ["${distance} < 0.02", "color('#00BFFF')"],
            ["${distance} < 0.025", "color('#87CEEB')"],
            ["true", "color('#ADD8E6',0.8)"],
          ],
        },
      });
    },
  };
  gui.add(params, "heightColor");
  gui.add(params, "distanceColor");

  // 创建一个盒子放置在广州塔
  var box = viewer.entities.add({
    name: "广州塔",
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 0),
    // position: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 0),
    box: {
      dimensions: new Cesium.Cartesian3(100.0, 100.0, 1000),
      material: Cesium.Color.RED.withAlpha(0),
    },
  });

  viewer.zoomTo(viewer.entities);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
