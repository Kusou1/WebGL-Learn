<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import * as dat from "dat.gui";

import gsap from "gsap";
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
// 实现圆的扩散
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

  // 添加建筑物
  // Cesium全球3.5亿做建筑物，数据来源openStreetMap地图
  let tiles3d = new Cesium.createOsmBuildings();
  var buildings = viewer.scene.primitives.add(tiles3d);

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(112.417, 23.29, 100000),
  });
  let baseLayer = viewer.imageryLayers.get(0);
  console.log(baseLayer);
  console.log(baseLayer.filterRGB);
  baseLayer.invertColor = true;
  baseLayer.filterRGB = [0, 50, 100];

  changeImageryProviderColors(viewer, baseLayer);
  // 更改 cesium 着色的方法
  function changeImageryProviderColors(viewer, baseLayer) {
    // 更改底图的着色器 代码
    const baseFragmentShaderSource =
      viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources;
    for (let i = 0; i < baseFragmentShaderSource.length; i++) {
      const oneSource = baseFragmentShaderSource[i];
      // 格式必须一致 不能多有空格 且保持版本一致性
      const strS =
        "color = czm_saturation(color, textureSaturation);\n#endif\n";
      let strT = "color = czm_saturation(color, textureSaturation);\n#endif\n";
      if (baseLayer.invertColor) {
        strT += `
          color.r = 1.0 - color.r;
          color.g = 1.0 - color.g;
          color.b = 1.0 - color.b;
        `;
        strT += `
        color.r = color.r * ${baseLayer.filterRGB[0]}.0/255.0;
        color.g = color.g * ${baseLayer.filterRGB[1]}.0/255.0;
        color.b = color.b * ${baseLayer.filterRGB[2]}.0/255.0;
        `;
      }

      if (oneSource.indexOf(strS) !== -1) {
        baseFragmentShaderSource[i] = baseFragmentShaderSource[i].replace(
          strS,
          strT
        );
      }
    }
  }
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
