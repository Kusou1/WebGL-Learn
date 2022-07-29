import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import gsap from "gsap";
import * as dat from "dat.gui";
import * as d3 from "d3";
import Stats from "three/examples/jsm/libs/stats.module.js";

//创建gui对象
const gui = new dat.GUI();

const stats = new Stats();
document.body.appendChild(stats.dom);
// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// console.log(d3);
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  100000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 100);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 加载纹理
const map = new THREE.Object3D();

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);
const canvas = renderer.domElement;

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  stats.update();
  const deltaTime = clock.getDelta();

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();

// 以经纬度116，39为中心，进行投影的函数转换函数,并移动到坐标轴中心
const projection1 = d3.geoMercator().center([116, 39]).translate([0, 0, 0]);
const loader = new THREE.FileLoader();
loader.load("./assets/100000_full.json", (data) => {
  console.log(data);
  const jsonData = JSON.parse(data);
  operationData(jsonData);
  console.log(jsonData);
});

function operationData(jsondata) {
  // 全国信息
  const features = jsondata.features;

  features.forEach((feature) => {
    // 单个省份 对象
    const province = new THREE.Object3D();
    // 地址
    province.properties = feature.properties.name;
    const coordinates = feature.geometry.coordinates;
    const color = "#99ff99";

    if (feature.geometry.type === "MultiPolygon") {
      // 多个，多边形
      coordinates.forEach((coordinate) => {
        // console.log(coordinate);
        // coordinate 多边形数据
        coordinate.forEach((rows) => {
          const mesh = drawExtrudeMesh(rows, color, projection1);
          const line = lineDraw(rows, color, projection1);
          // 唯一标识
          mesh.properties = feature.properties.name;

          province.add(line);
          province.add(mesh);
        });
      });
    }

    if (feature.geometry.type === "Polygon") {
      // 多边形
      coordinates.forEach((coordinate) => {
        const mesh = drawExtrudeMesh(coordinate, color, projection1);
        const line = lineDraw(coordinate, color, projection1);
        // 唯一标识
        mesh.properties = feature.properties.name;

        province.add(line);
        province.add(mesh);
      });
    }
    map.add(province);
  });
  scene.add(map);
}

function lineDraw(polygon, color, projection) {
  const lineGeometry = new THREE.BufferGeometry();
  const pointsArray = new Array();
  polygon.forEach((row) => {
    const [x, y] = projection(row);
    // 创建三维点
    pointsArray.push(new THREE.Vector3(x, -y, 9));
  });
  // 放入多个点
  lineGeometry.setFromPoints(pointsArray);
  // 生成随机颜色
  const lineColor = new THREE.Color(
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5,
    Math.random() * 0.5 + 0.5
  );

  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
  });
  return new THREE.Line(lineGeometry, lineMaterial);
}

// 根据经纬度坐标生成物体
function drawExtrudeMesh(polygon, color, projection) {
  const shape = new THREE.Shape();
  // console.log(polygon, projection);
  polygon.forEach((row, i) => {
    const [x, y] = projection(row);
    // console.log(row, [x, y]);
    if (i === 0) {
      // 创建起点,使用moveTo方法
      // 因为计算出来的y是反过来，所以要进行颠倒
      shape.moveTo(x, -y);
    }
    shape.lineTo(x, -y);
  });

  // 拉伸  根据形状挤出物体
  const geometry = new THREE.ExtrudeGeometry(shape, {
    // 高度
    depth: 5,
    bevelEnabled: true,
  });

  // 随机颜色
  const randomColor = (0.5 + Math.random() * 0.5) * 0xffffff;
  // 材质
  const material = new THREE.MeshBasicMaterial({
    color: randomColor,
    transparent: true,
    opacity: 0.5,
  });
  return new THREE.Mesh(geometry, material);
}

// 监听鼠标
window.addEventListener("click", onRay);
// 全局对象
let lastPick = null;
function onRay(event) {
  let pickPosition = setPickPosition(event);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pickPosition, camera);
  // 计算物体和射线的交点
  const intersects = raycaster.intersectObjects([map], true);
  // 数组大于0 表示有相交对象
  if (intersects.length > 0) {
    if (lastPick) {
      if (lastPick.object.properties !== intersects[0].object.properties) {
        lastPick.object.material.color.set("#99ff99");
        lastPick = null;
      }
    }
    if (intersects[0].object.properties) {
      intersects[0].object.material.color.set("red");
    }
    lastPick = intersects[0];
  } else {
    if (lastPick) {
      // 复原
      if (lastPick.object.properties) {
        lastPick.object.material.color.set("yellow");
        lastPick = null;
      }
    }
  }
}

/**
 * 获取鼠标在three.js 中归一化坐标
 * */
function setPickPosition(event) {
  let pickPosition = { x: 0, y: 0 };
  // 计算后 以画布 开始为 （0，0）点
  const pos = getCanvasRelativePosition(event);
  // 数据归一化
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;
  return pickPosition;
}

// 计算 以画布 开始为（0，0）点 的鼠标坐标
function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}
