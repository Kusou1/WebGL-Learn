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
  0.4,
  // 东边经度
  110.4,
  // 北边维度
  81.2
);

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer", {});

  viewer.scene.globe.enableLighting = true;

  // 设置沙箱允许使用JS
  var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
  iframe.setAttribute(
    "sandbox",
    "allow-same-origin allow-scripts allow-popups allow-forms"
  );
  iframe.setAttribute("src", "");

  // // 隐藏cesiumLogo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // entity
  var entity = viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西边经度
        89.5,
        // 南边维度
        30,
        // 东边经度
        110.4,
        // 北边维度
        40
      ),
      material: Cesium.Color.RED.withAlpha(0.5),
    },
  });

  // primitive
  var instance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(
        // 西边经度
        89.5,
        // 南边维度
        10,
        // 东边经度
        110.4,
        // 北边维度
        20
      ),
      height: 1000,
      // vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
    }),
    // attributes: {
    //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED),
    // },
  });

  const instance2 = new Cesium.GeometryInstance({
    geometry: new Cesium.CircleGeometry({
      center: Cesium.Cartesian3.fromDegrees(110.4, 40, 0),
      radius: 1000000,
      // vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    }),
  });

  // var primitiveRect = new Cesium.Primitive({
  //   geometryInstances: instance,
  //   appearance: new Cesium.EllipsoidSurfaceAppearance({
  //     material: Cesium.Material.fromType("Color", {
  //       color: Cesium.Color.RED.withAlpha(0.5),
  //     }),
  //   }),
  // });

  // 使用Primitive
  var primitiveRect = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: Cesium.Material.fromType("Color", {
        color: Cesium.Color.RED.withAlpha(0.5),
      }),
    }),
  });
  viewer.scene.primitives.add(primitiveRect);
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
