<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
// 飞机飞行数据
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

  // 设置样本属性，将轨迹点添加至样本属性SampledPositionProperty
  // JulianDate儒略日，天文学家专门用于计算时间的一种数学表示方法
  // 起点时间是在公元前4713年1月1日，终点时间是在公元前4713年1月1日，时间间隔是1秒
  const positionProperty = new Cesium.SampledPositionProperty();
  // 时间的间隔
  const timeStepInSeconds = 30;
  // 整个飞行花费的时间
  const totalSeconds = (flightData.length - 1) * timeStepInSeconds;
  // 设置起点时间
  const time = new Date("2020-03-09T23:10:00Z");
  // console.log(time);
  const start = Cesium.JulianDate.fromDate(time);
  // 设置终点时间
  const stop = Cesium.JulianDate.addSeconds(
    start,
    totalSeconds,
    new Cesium.JulianDate()
  );

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  // 设置进度条，从哪里开始到哪里结束,控制当前时间
  viewer.timeline.zoomTo(start, stop);

  for (let i = 0; i < flightData.length; i++) {
    const dataPoint = flightData[i];
    // 采样时间
    const time = Cesium.JulianDate.addSeconds(
      start,
      i * timeStepInSeconds,
      new Cesium.JulianDate()
    );
    // 计算当前的3D坐标
    const position = Cesium.Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height
    );

    // 添加轨迹采样点
    positionProperty.addSample(time, position);

    // 添加物体点
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: 10,
        color: new Cesium.Color(0.7, 0.8, 0, 0.7),
      },
    });
  }

  // 创建飞机模型
  const airplaneEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: start,
        stop: stop,
      }),
    ]),
    position: positionProperty,
    model: {
      uri: "./model/Air.glb",
      // 设置飞机的最小像素
      minimumPixelSize: 128,
      // 设置飞机的轮廓
      silhouetteSize: 10,
      // 设置轮廓的颜色
      silhouetteColor: Cesium.Color.WHITE.withAlpha(0.5),
      // 设置相机距离飞机的距离范围
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
        0,
        20000
      ),
    },
    // 自动计算前进方向
    // VelocityOrientationProperty会自动根据采样点，计算出飞机的速度和方向
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    // 绘制轨迹线
    path: new Cesium.PathGraphics({
      width: 3,
    }),
  });

  // 设置相机追踪运动物体
  viewer.trackedEntity = airplaneEntity;

  // 设置时间速率
  viewer.clock.multiplier = 10;

  // 设置自动播放
  // viewer.clock.shouldAnimate = true;
  setTimeout(() => {
    viewer.clock.shouldAnimate = true;
  }, 5000);
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
