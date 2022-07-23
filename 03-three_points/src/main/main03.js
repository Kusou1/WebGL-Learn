import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：设置漫天的雪花

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

// 设置相机位置
camera.position.set(0, 0, 40);
scene.add(camera);

function createPoints(url, size = 0.5) {
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 10000;

  // 设置缓冲区数组
  const positions = new Float32Array(count * 3);
  // 设置粒子顶点颜色
  const colors = new Float32Array(count * 3);
  // 设置顶点
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100;
    colors[i] = Math.random();
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 设置点材质
  const pointsMaterial = new THREE.PointsMaterial();
  pointsMaterial.size = 0.5;
  pointsMaterial.color.set(0xfff000);
  // 相机深度而衰减
  pointsMaterial.sizeAttenuation = true;

  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(`./textures/particles/${url}.png`);
  // 设置点材质纹理
  pointsMaterial.map = texture;
  pointsMaterial.alphaMap = texture;
  pointsMaterial.transparent = true;
  pointsMaterial.depthWrite = false;
  pointsMaterial.blending = THREE.AdditiveBlending;
  // 设置启动顶点颜色
  pointsMaterial.vertexColors = true;

  const points = new THREE.Points(particlesGeometry, pointsMaterial);

  scene.add(points);
  return points;
}

const points = createPoints("1", 1.5);
const points2 = createPoints("xh", 1);
const points3 = createPoints("xh", 2);

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
  points.rotation.x = time * 0.3;
  points2.rotation.x = time * 0.5;
  points2.rotation.y = time * 0.4;
  points3.rotation.x = time * 0.2;
  points3.rotation.y = time * 0.2;
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
