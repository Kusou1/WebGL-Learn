<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";

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

  // new Cesium.createOsmBuildings()使用cesium自带的模型，不需要自己加载模型文件
  // Cesium全球3.5亿做建筑物，数据来源openStreetMap地图
  var buildings = viewer.scene.primitives.add(new Cesium.createOsmBuildings());

  // 天安门位置
  var position = Cesium.Cartesian3.fromDegrees(116.397428, 39.908738, 100);

  // 广州塔位置
  var position2 = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 2000);

  // 创建点实体
  var point = viewer.entities.add({
    // 点的位置
    position: position2,
    // 点的样式
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE, //边框颜色
      outlineWidth: 2,//边框宽度
    },
  });

  viewer.flyTo(point);
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
