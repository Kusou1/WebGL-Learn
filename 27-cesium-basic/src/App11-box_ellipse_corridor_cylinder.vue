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

  // 创建盒子
  const blueBox = viewer.entities.add({
    name: "blueBox",
    // box的位置为北京天安门
    position: Cesium.Cartesian3.fromDegrees(116.397428, 39.90923, 150),
    box: {
      // 设置box的长宽高
      dimensions: new Cesium.Cartesian3(100.0, 200.0, 300.0),
      // 设置box的颜色
      material: new Cesium.Color(0, 0, 1, 0.5),
      // 外边框
      outline: true,
      // 边框颜色
      outlineColor: Cesium.Color.WHITE,
      // 边框宽度
      // outlineWidth: 10,
      // 是否填充
      // fill: false,
    },
  });

  // 添加绿色的圆
  const greenCircle = viewer.entities.add({
    name: "greenCircle",
    position: Cesium.Cartesian3.fromDegrees(116.400538, 39.90923, 150),
    ellipse: {
      // 设置短半轴
      semiMinorAxis: 100.0,
      // 设置长半轴
      semiMajorAxis: 200.0,
      material: new Cesium.Color(0, 1, 0, 0.5),
      // height: 300.0,
      outline: true,
      outlineColor: Cesium.Color.WHITE,
      // 高度
      extrudedHeight: 400.0,
      // 设置椭圆旋转
      // rotation: Math.PI / 4,
      rotation: Cesium.Math.toRadians(45),
    },
  });

  // 添加走廊
  const corridor = viewer.entities.add({
    name: "corridor",
    corridor: {
      // 设置走廊的起点
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.417428, 39.90923, 116.430538, 39.90923, 116.430538, 39.89923,
      ]),
      // 设置走廊的颜色
      material: new Cesium.Color(1, 0, 0, 0.5),
      // 设置走廊的宽度
      width: 100,
      // 设置走廊的高度
      // height: 300.0,
      // 设置走廊的高度
      extrudedHeight: 400.0,
      // 设置转角的样式
      // cornerType: Cesium.CornerType.BEVELED,
    },
  });

  // 圆柱体
  const yellowCylinder = viewer.entities.add({
    name: "yellowCylinder",
    position: Cesium.Cartesian3.fromDegrees(116.407428, 39.90923, 150),
    cylinder: {
      topRadius: 50,
      bottomRadius: 100.0,
      material: new Cesium.Color(1, 1, 0, 0.5),
      length: 200.0,
      outline: true,
      outlineColor: Cesium.Color.WHITE,
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
