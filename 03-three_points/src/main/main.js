import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：运用数学知识设计特定形状的星系

const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  30
);

const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("./textures/particles/1.png");
// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

const params = {
  count: 10000,
  size: 0.1,
  radius: 5,
  branch: 3,
  color: "#ff6030",
  rotateScale: 0.3,
  endColor: "#1b3984",
};

let geometry = null;
let material = null;
let points = null;
const centerColor = new THREE.Color(params.color);
const endColor = new THREE.Color(params.endColor);
const generateGalaxy = () => {
  // 生成顶点
  geometry = new THREE.BufferGeometry();
  //   随机生成位置和
  const positions = new Float32Array(params.count * 3);
  // 设置顶点颜色
  const colors = new Float32Array(params.count * 3);

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    //   当前的点应该在哪一条分支的角度上
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);

    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
    const current = i * 3;

    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

    // const randomX = (Math.pow(Math.random() * 2 - 1, 3) * distance) / 5;
    // const randomY = (Math.pow(Math.random() * 2 - 1, 3) * distance) / 5;
    // const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * distance) / 5;

    positions[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    positions[current + 1] = 0 + randomY;
    positions[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;

    // 混合颜色，形成渐变色
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius);

    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  //   设置点材质
  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.color),
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
};
generateGalaxy();

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  let time = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");

  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
