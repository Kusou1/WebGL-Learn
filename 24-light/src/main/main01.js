import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

// 目标：点光源

const gui = new dat.GUI();
// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

// 设置相机位置
camera.position.set(0, 0, 20);
scene.add(camera);

// 灯光
// 环境光
// const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
// scene.add(light);

// 添加hdr环境纹理
const loader = new RGBELoader();
loader.load("./textures/Dosch-Space_0026_4k.hdr", function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 加载纹理
const textureLoader = new THREE.TextureLoader();

// 加载压缩的glb模型
let material = null;
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/gltf/");
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.preload();
gltfLoader.setDRACOLoader(dracoLoader);
let mixer;
gltfLoader.load("./model/jianshen-min.glb", function (gltf) {
  // console.log(gltf);
});

// 创建一个金属球添加到场景中
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material1 = new THREE.MeshBasicMaterial({
  color: "#ffaa33",
});
const sphere = new THREE.Mesh(geometry, material1);
sphere.position.set(-5, 0, 0);
sphere.layers.set(1);
scene.add(sphere);

// 创建一个正方体
const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshStandardMaterial({
  emissive: 0x33ff33,
});
const cube = new THREE.Mesh(geometry2, material2);
cube.position.set(5, 0, 0);
scene.add(cube);

// 创建一个纽结体
const geometry3 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material3 = new THREE.MeshStandardMaterial({
  emissive: 0x33ff33,
});
const torusKnot = new THREE.Mesh(geometry3, material3);
torusKnot.position.set(0, 0, 0);
scene.add(torusKnot);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0xcccccc, 1);
// 关闭每次渲染自动清除
renderer.autoClear = false;

// 添加效果合成
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const effect = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0,
  10,
  1
);
effect.threshold = 0;
effect.strength = 3;
effect.radius = 0.5;
composer.addPass(effect);
// composer.renderToScreen = false;

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
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const bloomLayer = new THREE.Layers();
bloomLayer.set(0);
const materials = {};
function render() {
  let time = clock.getDelta();
  if (mixer) {
    // console.log(mixer);
    mixer.update(time);
  }
  controls.update();
  // 手动清除
  renderer.clear();
  camera.layers.set(0);
  composer.render();
  // scene.traverse(restoreMaterial);
  // 清除深度缓冲区片元深度数据
  renderer.clearDepth();
  camera.layers.set(1);
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

window.addEventListener("click", () => {
  cube.layers.set(1);
});
