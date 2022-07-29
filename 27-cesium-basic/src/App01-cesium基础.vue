<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
// 将cesium目录下的Build/Cesium  4个目录拷贝到public目录下
// 将cesium的widgets目录拷贝一份刀src下，将css文件引入
import * as Cesium from "cesium";
import "./Widgets/widgets.css"; 

// 设置cesium的token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwN2Y0MjBjYS1kMzUzLTQ2MjAtYTFlNy1lYjg0NzFiMTllOTUiLCJpZCI6MTAzMDI2LCJpYXQiOjE2NTkxMTI1Mjh9.lhLF2WVuumLOJYjW0BHO29dGrVnO6SNveE9uqGOYugk";
// 设置cesium默认资源路径，静态资源的路径
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
  // 要和id名相同
  var viewer = new Cesium.Viewer("cesiumContainer", {
    // 是否显示信息窗口
    // infoBox: false,
    // 是否创建动画
    animation: false,
    // 是否显示图层选择器
    baseLayerPicker: true,
    // 是否显示全屏按钮
    fullscreenButton: false,
    // 是否显示右上角的查询按钮,可以搜索地址
    geocoder: true,
    // 是否显示HOME按钮
    homeButton: false,
    // 是否显示场景控制按钮,控制viewer的显示模式
    sceneModePicker: false,
    // 是否显示帮助按钮
    navigationHelpButton: false,
    // 是否显示时间轴
    timeline: false,
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

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  });
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
