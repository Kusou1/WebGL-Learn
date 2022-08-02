<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as Cesium from "cesium";
import "../assets/Widgets/widgets.css";
// import * as dat from "dat.gui";
// 导入导航罗盘
import CesiumNavigation from "cesium-navigation-es6";
import CenterPosition from "../cesiumUtils/CenterPosition";
import MousePosition from "../cesiumUtils/MousePosition";
import * as utils from "../cesiumUtils/utils";
import * as uitlsMap from "../cesiumUtils/utilsMap";
import * as uitlsBuild from "../cesiumUtils/utilsBuild";
import * as utilsEffect from "../cesiumUtils/utilsEffect";
import axios from "axios";

import gsap from "gsap";
// console.log(flightData);
// const gui = new dat.GUI();

let cesiumContainer = ref(null);
// 设置cesium的token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";
// cesium默认资源路径
window.CESIUM_BASE_URL = "/Cesium/";
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
// 实现圆的扩散
onMounted(async () => {
  var viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false,
    fullscreenButton: false,
    homeButton: false,
    timeline: false,
    navigationHelpButton: false,
  });

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

  // 导航罗盘的配置
  var options = {
    defaultResetView: Cesium.Rectangle.fromDegrees(80, 22, 130, 50),
    // 是否启用罗盘
    // enableCompass: true,
    // // 是否启用缩放
    // enableZoomControls: false,
    // // 是否启用指南针外环
    // enableCompassOuterRing: false,
    // enableDistanceLegend: true,
  };
  // 设置导航罗盘
  var navigation = new CesiumNavigation(viewer, options);
  console.log(navigation);

  // 修改背景颜色
  utils.setBackground(viewer, Cesium.Color.BLACK);

  // 创建一个显示中心位置的经纬度
  var centerPosition = new CenterPosition(viewer);

  // 创建一个显示鼠标位置的经纬度
  var mousePosition = new MousePosition(viewer);

  // 地图暗黑色系
  // uitlsMap.setMapColor(viewer);
  uitlsMap.changeImageryProviderColors(viewer);

  // 设置顶级的图片
  // utils.setSingleImage(viewer, "./assets/imgs/sky_linekotsi_12.JPG");

  // 前往深圳南山
  utils.goFlyDestination(viewer);

  // 设置建筑物
  // Cesium全球3.5亿做建筑物，数据来源openStreetMap地图
  // let tiles3d = new Cesium.createOsmBuildings();
  // var buildings = viewer.scene.primitives.add(tiles3d);
  uitlsBuild.setBuilding(viewer);

  // 添加模型
  utils.addModel(viewer);

  // 加载飞线特效的服务器数据
  let result = await axios.get("./api/getLinesEffectList.json");
  console.log(result);
  let effectLines = result.data.data;
  effectLines.forEach((element, index) => {
    // console.log(setupParams);
    if (element.type == "FlyLines") {
      // 添加飞线
      utils.addFlightLine(viewer, element);
    }

    if (element.type == "RoadPic") {
      // 添加路线图片
      utils.addRoadLine(viewer, element);
    }
  });

  utilsEffect.addRadarEffect(viewer);
});
</script>

<sytle lang="less">
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</sytle>
