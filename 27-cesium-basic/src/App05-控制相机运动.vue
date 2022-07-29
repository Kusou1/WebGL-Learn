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
    //设置地形
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

  //01-屏幕坐标系统
  //02-笛卡尔空间直角坐标系
  //03-WGS-84坐标系
  // 坐标系数据的转换空间坐标系

  // 如果围绕z轴旋转，翻滚角
  // 如果围绕x轴旋转，俯仰角
  // 如果围绕y轴旋转，偏航角
  var position = Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000);
  console.log(position);
  // viewer.camera.flyTo({
  //   // 设置相机前往的位置
  //   destination: position,
  //   // 相机的朝向
  //   orientation: {
  //     // 如果围绕y轴旋转，偏航角
  //     heading: Cesium.Math.toRadians(0),
  //     // 如果围绕x轴旋转，俯仰角
  //     pitch: Cesium.Math.toRadians(-90),
  //     // 如果围绕z轴旋转，翻滚角
  //     roll: 0.0,
  //   },
  //   duration: 10,
  //   complete: function () {
  //     // 在相机移动完成后执行
  //     console.log("已抵达北京天安门");
  //   },
  // });

  // 将角度转换为弧度
  // var rotation = Cesium.Math.toRadians(0);
  // console.log(rotation);
  // // setView快速切换至指定的视角，没有过程中的动画
  // viewer.camera.setView({
  //   destination: position,
  //   orientation: {
  //     heading: rotation,
  //     // 俯仰角，垂直看向地面是-90度
  //     pitch: Cesium.Math.toRadians(-10),
  //     roll: 0.0,
  //   },
  // });

  //设置相机环绕物体，定点浏览,没有动画的过程
  // let position = Cesium.Cartesian3.fromDegrees(116.39, 39.9, 1000);
  // viewer.camera.viewBoundingSphere(
  //   new Cesium.BoundingSphere(position, 1000),
  //   new Cesium.HeadingPitchRange(0, Math.PI / 4, 5000)
  // );

  // 通过键盘移动相机查看视域,w,s,a,d
  document.addEventListener("keydown", function (e) {
    // console.log(e);
    //  获取相机离地面的高度
    var height = viewer.camera.positionCartographic.height;
    // console.log(height);
    // 设置相机移动的比例
    var moveRate = height / 100;
    if (e.key == "a") {
      // A键左移
      viewer.camera.moveLeft(moveRate);
    } else if (e.key == "w") {
      //w键向前移动相机
      // console.log("上");
      //
      viewer.camera.moveForward(moveRate);
    } else if (e.key == "d") {
      // d键右移
      viewer.camera.moveRight(moveRate);
    } else if (e.key == "s") {
      // s键后移动相机
      viewer.camera.moveBackward(moveRate);
    } else if (e.key == "q") {
      // q键向左旋转相机
      // 相机绕地球旋转
      // viewer.camera.rotateLeft(Cesium.Math.toRadians(10));
      viewer.camera.lookLeft(Cesium.Math.toRadians(0.1));
    } else if (e.key == "e") {
      // 相机绕地球旋转
      viewer.camera.lookRight(Cesium.Math.toRadians(0.1));
    } else if (e.key == "r") {
      // r键向上旋转相机
      viewer.camera.lookUp(Cesium.Math.toRadians(0.1));
    } else if (e.key == "f") {
      // f键向下旋转相机
      viewer.camera.lookDown(Cesium.Math.toRadians(0.1));
    } else if (e.key == "z") {
      // z键向上移动相机
      viewer.camera.moveUp(moveRate);
    } else if (e.key == "x") {
      // x键向下移动相机
      viewer.camera.moveDown(moveRate);
    } else if (e.key == "g") {
      viewer.camera.twistLeft(Cesium.Math.toRadians(0.1));
    } else if (e.key == "h") {
      viewer.camera.twistRight(Cesium.Math.toRadians(0.1));
    }
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
