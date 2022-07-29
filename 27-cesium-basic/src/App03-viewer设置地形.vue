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
    // 是否显示信息窗口
    // infoBox: false,
    // 是否创建动画
    // animation: false,
    // // 是否显示图层选择器
    // baseLayerPicker: false,
    // // 是否显示全屏按钮
    // fullscreenButton: false,
    // // 是否显示右上角的查询按钮
    // geocoder: false,
    // // 是否显示HOME按钮
    // homeButton: false,
    // // 是否显示场景控制按钮
    // sceneModePicker: false,
    // // 是否显示帮助按钮
    // navigationHelpButton: false,
    // // 是否显示时间轴
    // timeline: false,

    //设置地形，就可以看到山脉的效果了
    terrainProvider: Cesium.createWorldTerrain({
      // 添加水面的效果
      requestWaterMask: true,
      // 添加地形光照的效果，添加法线
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

  //   viewer.camera.flyTo({
  //     // 设置相机前往的位置
  //     destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000),
  //     // 相机的朝向
  //     orientation: {
  //       heading: Cesium.Math.toRadians(0),
  //       pitch: Cesium.Math.toRadians(-90),
  //       roll: 0.0,
  //     },
  //     duration: 10,
  //     complete: function () {
  //       // 在相机移动完成后执行
  //       console.log("已抵达北京天安门");
  //     },
  //   });
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
