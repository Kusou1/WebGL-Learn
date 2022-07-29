<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import flightData from "@/assets/json/plane.json";
// console.log(flightData);

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
  var buildings = viewer.scene.primitives.add(new Cesium.createOsmBuildings());

  // const greenTube = viewer.entities.add({
  //   name: "Green Line",
  //   polylineVolume: {
  //     positions: Cesium.Cartesian3.fromDegreesArray([
  //       116.39, 39.9, 116.38, 39.85, 116.41, 39.86, 116.41, 39.88,
  //     ]),
  //     material: Cesium.Color.GREEN.withAlpha(0.5),
  //     shape: [
  //       new Cesium.Cartesian2(0, 0),
  //       new Cesium.Cartesian2(0, 100),
  //       new Cesium.Cartesian2(100, 100),
  //       new Cesium.Cartesian2(100, 0),
  //     ],
  //   },
  // });

  function computedCircle(radius) {
    var positions = [];
    for (var i = 0; i < 36; i++) {
      var radian = Cesium.Math.toRadians(i * 10);
      var x = radius * Math.cos(radian);
      var y = radius * Math.sin(radian);
      positions.push(new Cesium.Cartesian2(x, y));
    }
    return positions;
  }

  const greenTube = viewer.entities.add({
    name: "Green Line",
    polylineVolume: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.39, 39.9, 116.38, 39.85, 116.41, 39.86, 116.41, 39.88,
      ]),
      material: Cesium.Color.GREEN.withAlpha(0.5),
      shape: computedCircle(100),
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
