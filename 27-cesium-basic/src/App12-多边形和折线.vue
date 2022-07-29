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

  // 创建1个多边形
  // const bluePolygon = viewer.entities.add({
  //   name: "bluePolygon",
  //   polygon: {
  //     // 多边形顶点属性设置
  //     hierarchy: Cesium.Cartesian3.fromDegreesArray([
  //       116.39, 39.9, 116.38, 39.85, 116.41, 39.86, 116.41, 39.88,
  //     ]),
  //     material: Cesium.Color.BLUE.withAlpha(0.5),
  //   },
  // });

  // const bluePolygon = viewer.entities.add({
  //   name: "bluePolygon",
  //   polygon: {
  //     // 多边形顶点属性设置
  //     hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       116.39, 39.9, 100, 116.38, 39.85, 300, 116.41, 39.86, 600, 116.41,
  //       39.88, 900,
  //     ]),
  //     material: Cesium.Color.BLUE.withAlpha(0.5),
  //     // 是否使用预先设置的高度
  //     perPositionHeight: true,
  //     // 挤出高度
  //     extrudedHeight: 0,
  //   },
  // });

  // 设置多边形打洞多边形
  // const bluePolygon = viewer.entities.add({
  //   name: "bluePolygon",
  //   polygon: {
  //     // 多边形顶点属性设置
  //     hierarchy: {
  //       positions: Cesium.Cartesian3.fromDegreesArray([
  //         116.39, 39.9, 116.38, 39.85, 116.41, 39.86, 116.41, 39.88,
  //       ]),
  //       holes: [
  //         {
  //           positions: Cesium.Cartesian3.fromDegreesArray([
  //             116.385, 39.88, 116.385, 39.865, 116.388, 39.865, 116.388, 39.88,
  //           ]),
  //         },
  //       ],
  //     },
  //     material: Cesium.Color.BLUE.withAlpha(0.5),
  //   },
  // });

  // 设置折线飞线的发光效果
  // const redLine = viewer.entities.add({
  //   name: "redLine",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArray([
  //       116.39, 39.9, 116.38, 39.85, 116.41, 39.86, 116.41, 39.88,
  //     ]),
  //     width: 10,
  //     material: Cesium.Color.RED.withAlpha(0.5),
  //     // 设置折线固定在地面上
  //     // clampToGround: true,
  //   },
  // });

  // const redLine = viewer.entities.add({
  //   name: "redLine",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       116.39, 39.9, 100, 116.38, 39.85, 100, 116.41, 39.86, 100, 116.41,
  //       39.88, 100,
  //     ]),
  //     width: 10,
  //     // 飞线效果
  //     material: new Cesium.PolylineGlowMaterialProperty({
  //       glowPower: 0.5,
  //       // 设置锥型的比例
  //       taperPower: 0.5,
  //       color: Cesium.Color.RED,
  //     }),
  //     // 设置折线固定在地面上
  //     // clampToGround: true,
  //   },
  // });

  // const redLine = viewer.entities.add({
  //   name: "redLine",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       116.39, 39.9, 100, 116.38, 39.85, 100, 116.41, 39.86, 100, 116.41,
  //       39.88, 100,
  //     ]),
  //     width: 5,
  //     // 飞线效果
  //     material: new Cesium.PolylineDashMaterialProperty({
  //       dashLength: 20,
  //       color: Cesium.Color.RED,
  //       // 设置中间间隙的颜色
  //       gapColor: Cesium.Color.WHITE,
  //     }),
  //     // 设置折线固定在地面上
  //     // clampToGround: true,
  //   },
  // });

  // const redLine = viewer.entities.add({
  //   name: "redLine",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       116.39, 39.9, 100, 116.38, 39.85, 100, 116.41, 39.86, 100, 116.41,
  //       39.88, 100,
  //     ]),
  //     width: 20,
  //     // 飞线效果
  //     material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.SKYBLUE),
  //     // 设置折线固定在地面上
  //     // clampToGround: true,
  //   },
  // });

  const redLine = viewer.entities.add({
    name: "redLine",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        116.39, 39.9, 100, 116.38, 39.85, 100, 116.41, 39.86, 100, 116.41,
        39.88, 100,
      ]),
      width: 10,
      // 飞线效果
      material: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.RED,
        // 设置中间间隙的颜色
        outlineWidth: 5,
        outlineColor: Cesium.Color.WHITE,
      }),
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
