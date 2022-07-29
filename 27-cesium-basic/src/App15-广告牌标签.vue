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
    infoBox: false,
    terrainProvider: new Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    }),
  });

  // 设置沙箱允许使用JS
  // var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
  // iframe.setAttribute(
  //   "sandbox",
  //   "allow-same-origin allow-scripts allow-popups allow-forms"
  // );
  // iframe.setAttribute("src", "");

  // // 隐藏cesiumLogo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // Cesium全球3.5亿做建筑物，数据来源openStreetMap地图
  var buildings = viewer.scene.primitives.add(new Cesium.createOsmBuildings());

  const label = viewer.entities.add({
    name: "天安门广场",
    position: Cesium.Cartesian3.fromDegrees(116.397428, 39.908738, 100),
    label: {
      text: "天安门广场",
      // 字体大小
      font: "24px sans-serif",
      // FILL填充/OUTLINE描边/FILL_AND_OUTLINED填充描边
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      // 描边颜色
      outlineColor: Cesium.Color.WHITE,
      // 描边宽度
      outlineWidth: 5,
      // 字体颜色
      fillColor: Cesium.Color.RED,
      pixelOffset: new Cesium.Cartesian2(0, -50),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
    },
    // 广告牌
    billboard: {
      // 图片
      image: "./Assets/Images/park.png",
      // 图片大小
      width: 100,
      height: 100,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
      // 图片偏移量
      // pixelOffset: new Cesium.Cartesian2(0, -50),
    },
  });

  // cesium屏幕事件处理
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((movement) => {
    // console.log(movement);
    // 通过鼠标的屏幕坐标，获取是否有选中的元素
    var pickedObject = viewer.scene.pick(movement.position);

    if (
      pickedObject &&
      pickedObject.id &&
      pickedObject.id.name == "天安门广场"
    ) {
      console.log("选中了标签");
      pickedObject.id.label.fillColor = Cesium.Color.YELLOW;
    } else {
      label.label.fillColor = Cesium.Color.RED;
    }
    console.log(pickedObject);
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

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
