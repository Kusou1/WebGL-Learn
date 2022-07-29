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
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
//   // 西边经度
//   89.5,
//   // 南边维度
//   0.4,
//   // 东边经度
//   110.4,
//   // 北边维度
//   81.2
// );
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = new Cesium.Rectangle(
  0.2308051452597943,
  -0.9708868758478914,
  0.7277505257203901,
  0.78817571480016838
);

onMounted(() => {
  // 初始化时间
  const clock = new Cesium.Clock({
    startTime: Cesium.JulianDate.fromIso8601("2022-05-01"),
    currentTime: Cesium.JulianDate.fromIso8601("2022-05-01"),
    stopTime: Cesium.JulianDate.fromIso8601("2022-05-03"),
    clockRange: Cesium.ClockRange.LOOP_STOP, //CLAMPED  /UNBOUNDED /LOOP_STOP
    clockStep: Cesium.ClockStep.TICK_DEPENDENT,
    multiplier: 60,
    shouldAnimate: true,
  });
  var viewer = new Cesium.Viewer("cesiumContainer", {
    clockViewModel: new Cesium.ClockViewModel(clock),
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

  let params = {
    ViewRect: () => {
      // 计算相机视角
      const currentViewRect = viewer.camera.computeViewRectangle();
      console.log(currentViewRect);
      // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = currentViewRect;
    },
  };

  // 获取相机视角
  gui.add(params, "ViewRect");
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
