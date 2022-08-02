<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import * as THREE from "three";
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
  main();
});

// 初始化cesium渲染器
// 初始化three渲染器
// 初始化2个库的3D物体
// 循环渲染

// three全局对象
let three = {
  renderer: null,
  camera: null,
  scene: null,
};

// 设置全局cesium对象
let cesium = {
  viewer: null,
};

function main() {
  // 设置北京显示模型的渲染范围
  var minWGS84 = [115.39, 38.9];
  var maxWGS84 = [117.39, 40.9];

  // 设置cesium容器
  var cesiumContainer = document.getElementById("cesiumContainer");

  // three.js物体
  let objects3D = [];

  function Object3D(mesh, minWGS84, maxWGS84) {
    this.threeMesh = mesh;
    this.minWGS84 = minWGS84;
    this.maxWGS84 = maxWGS84;
  }

  // 初始化cesium渲染器
  function initCesium() {
    cesium.viewer = new Cesium.Viewer(cesiumContainer, {
      useDefaultRenderLoop: false,
      selectionIndicator: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      clock: false,
      geocoder: false,
      //     天地图矢量路径图
      imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
      }),
      contextOptions: {
        webgl: {
          alpha: false,
          // 抗锯齿
          antialias: true,
          depth: true,
        },
      },
    });
    // 地图叠加
    var imageryLayers = cesium.viewer.imageryLayers;
    console.log(imageryLayers);
    var layer = imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
      })
    );
    layer.alpha = 0.5;
    // 设置前往地点
    let center = Cesium.Cartesian3.fromDegrees(
      (minWGS84[0] + maxWGS84[0]) / 2,
      (minWGS84[1] + maxWGS84[1]) / 2,
      20000
    );

    // 设置相机飞往该区域
    cesium.viewer.camera.flyTo({
      destination: center,
      duration: 2,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0,
      },
    });
  }

  function initThree() {
    // 设置相机配置
    let fov = 45;
    let aspect = window.innerWidth / window.innerHeight;
    let near = 0.1;
    let far = 10 * 1000 * 1000;

    // 初始化场景
    three.scene = new THREE.Scene();
    three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    three.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    // 设置渲染器大小
    three.renderer.setSize(window.innerWidth, window.innerHeight);

    // 添加环境光
    let ambientLight = new THREE.AmbientLight(0xffffff, 1);
    three.scene.add(ambientLight);
    // 添加three.jscanvas元素到cesium容器
    cesiumContainer.appendChild(three.renderer.domElement);
  }

  // 创建three.js物体
  function createMesh() {
    let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    let mesh = new THREE.Mesh(geometry, material);

    // 放大物体
    mesh.scale.set(100, 100, 100); // 放大
    mesh.position.set(0, 0, 50); // 平移

    let meshGroup = new THREE.Group();
    meshGroup.add(mesh);
    // 添加至场景
    three.scene.add(meshGroup);
    // 创建3d物体
    let OB3d = new Object3D(
      meshGroup,
      [minWGS84[0], minWGS84[1]],
      [maxWGS84[0], maxWGS84[1]]
    );

    // 添加到3d物体数组
    objects3D.push(OB3d);
  }

  function renderThree() {
    // 设置相机跟cesium保持一致
    three.camera.fov = Cesium.Math.toDegrees(cesium.viewer.camera.frustum.fovy);
    // 声明一个将cesium框架的cartesian3转换为three.js的vector3
    let cartToVec = function (cart) {
      return new THREE.Vector3(cart.x, cart.y, cart.z);
    };
    // 将3D的物体通过经纬度转换成对应的位置
    objects3D.forEach((item, index) => {
      // 通过经纬度获取中心点的位置
      let center = Cesium.Cartesian3.fromDegrees(
        (item.minWGS84[0] + item.maxWGS84[0]) / 2,
        (item.minWGS84[1] + item.maxWGS84[1]) / 2
      );
      item.threeMesh.position.copy(cartToVec(center));

      let centerHeight = Cesium.Cartesian3.fromDegrees(
        (item.minWGS84[0] + item.maxWGS84[0]) / 2,
        (item.minWGS84[1] + item.maxWGS84[1]) / 2,
        1
      );

      let bottomLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(item.minWGS84[0], item.minWGS84[1])
      );
      let topLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(item.minWGS84[0], item.maxWGS84[1])
      );
      let latDir = new THREE.Vector3()
        .subVectors(bottomLeft, topLeft)
        .normalize();

      // console.log(item);
      item.threeMesh.lookAt(centerHeight.x, centerHeight.y, centerHeight.z);
      item.threeMesh.up.copy(latDir);
    });

    // 设置相机跟cesium保持一致
    three.camera.matrixAutoUpdate = false;
    let cvm = cesium.viewer.camera.viewMatrix;
    let civm = cesium.viewer.camera.inverseViewMatrix;

    // three相机默认朝向0,0,0
    three.camera.lookAt(0, 0, 0);

    // 设置threejs相机矩阵
    three.camera.matrixWorld.set(
      civm[0],
      civm[4],
      civm[8],
      civm[12],
      civm[1],
      civm[5],
      civm[9],
      civm[13],
      civm[2],
      civm[6],
      civm[10],
      civm[14],
      civm[3],
      civm[7],
      civm[11],
      civm[15]
    );

    three.camera.matrixWorldInverse.set(
      cvm[0],
      cvm[4],
      cvm[8],
      cvm[12],
      cvm[1],
      cvm[5],
      cvm[9],
      cvm[13],
      cvm[2],
      cvm[6],
      cvm[10],
      cvm[14],
      cvm[3],
      cvm[7],
      cvm[11],
      cvm[15]
    );

    let width = cesiumContainer.clientWidth;
    let height = cesiumContainer.clientHeight;

    three.camera.aspect = width / height;
    three.camera.updateProjectionMatrix();

    three.renderer.setSize(width, height);
    three.renderer.clear();
    three.renderer.render(three.scene, three.camera);
  }
  function renderCesium() {
    cesium.viewer.render();
  }

  function loop() {
    requestAnimationFrame(loop);
    // cesium渲染
    renderCesium();
    // three.js渲染
    renderThree();
  }
  initCesium();
  initThree();
  createMesh();
  loop();
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  position: relative;
}
#cesiumContainer > canvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
