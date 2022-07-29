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

  // 创建一个盒子放置在广州塔
  var box = viewer.entities.add({
    name: "广州塔",
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 0),
    box: {
      dimensions: new Cesium.Cartesian3(100.0, 100.0, 1000),
      material: Cesium.Color.RED.withAlpha(0),
    },
  });

  var gravityVector = new Cesium.Cartesian3();
  var graviry = -6;
  var particlesSystem = viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      image: "./Assets/particles/12.png",
      // 设置初始颜色
      startColor: Cesium.Color.WHITE,
      // 设置结束的颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.1),
      // 设置粒子的最大数量
      // imageSize: new Cesium.Cartesian2(40, 40),
      // 设置发射器
      // 圆形发射器
      // emitter: new Cesium.CircleEmitter(200),
      // 矩形发射器
      emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(1000, 1000, 1000)),
      // 锥型设置
      // emitter: new Cesium.ConeEmitter(Math.PI / 4),
      // 球体发射器
      // emitter: new Cesium.SphereEmitter(500),
      startScale: 1.0,
      endScale: 4.0,
      particleLife: 5.0,
      // speed: 1.0,
      // 设置随机的速度
      minimumSpeed: 1.0,
      maximumSpeed: 5.0,
      // 每秒钟设置粒子发射的数量
      emissionRate: 1000,
      // 控制发射在不同阶段的数量
      bursts: [
        new Cesium.ParticleBurst({
          time: 0.0,
          minimum: 2,
          maximum: 5,
        }),
        new Cesium.ParticleBurst({
          time: 10.0,
          minimum: 100,
          maximum: 150,
        }),
        new Cesium.ParticleBurst({
          time: 15.0,
          minimum: 5,
          maximum: 10,
        }),
      ],
      lifetime: 15.0,

      // 设置粒子随机的大小
      minimumImageSize: new Cesium.Cartesian2(10, 10),
      maximumImageSize: new Cesium.Cartesian2(40, 40),
      modelMatrix: box.computeModelMatrix(
        viewer.clock.startTime,
        new Cesium.Matrix4()
      ),
      updateCallback: (p, dt) => {
        var position = p.position;
        Cesium.Cartesian3.normalize(position, gravityVector);
        Cesium.Cartesian3.multiplyByScalar(
          gravityVector,
          graviry,
          gravityVector
        );

        p.velocity = Cesium.Cartesian3.add(
          p.velocity,
          gravityVector,
          p.velocity
        );
      },
    })
  );

  var particlesSystem2 = viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      image: "./texture/smoke.png",
      // 设置初始颜色
      startColor: Cesium.Color.YELLOW,
      // 设置结束的颜色
      endColor: Cesium.Color.WHITE.withAlpha(0.1),
      // 设置粒子的最大数量
      imageSize: new Cesium.Cartesian2(40, 40),
      // 设置发射器
      // 圆形发射器
      // emitter: new Cesium.CircleEmitter(200),
      // 矩形发射器
      // emitter: new Cesium.BoxEmitter(new Cesium.Cartesian3(100, 100, 1000)),
      // 锥型设置
      // emitter: new Cesium.ConeEmitter(Math.PI / 4),
      // 球体发射器
      emitter: new Cesium.SphereEmitter(500),
      startScale: 1.0,
      endScale: 4.0,
      particleLife: 5.0,
      speed: 1.0,

      emissionRate: 6,

      lifetime: 15.0,
      modelMatrix: box.computeModelMatrix(
        viewer.clock.startTime,
        new Cesium.Matrix4()
      ),
    })
  );

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
