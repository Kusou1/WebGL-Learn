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

import vertexShader from "../shader/vertexShader.glsl";
import fragmentShader from "../shader/fragmentShader.glsl";
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
const texture = textureLoader.load("./textures/cloth_pos.png");
const normalMap = textureLoader.load("./textures/cloth_norm.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(0.2, 0.2);
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
normalMap.repeat.set(0.2, 0.2);
texture.offset.set(0, 0);

gsap.to(texture.offset, {
  x: 1,
  y: 1,
  duration: 1,
  repeat: -1,
  onUpdate: function () {
    // console.log(texture.offset);
    texture.needsUpdate = true;
  },
});
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
  console.log(gltf);
  scene.add(gltf.scene);
  gltf.scene.traverse(function (child) {
    // if (child.name == "Body") {
    //   console.log(child);
    // }
    // if (child.name == "Floor") {
    //   child.material = new THREE.MeshStandardMaterial({
    //     color: 0xffffff,
    //   });
    //   console.log(child);
    // }
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        map: texture,
        emissiveMap: texture,
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        normalMap: normalMap,
      });
    }
  });
  // 设置动画
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[0]);

  action.play();
  action.timeScale = 4;

  // 添加平行光;
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 100, -100);
  scene.add(light);
  // 添加点光源
  // const pointLight = new THREE.PointLight(0xffffff, 10);
  // pointLight.position.set(0, 100, 100);
});

// 创建一个金属球添加到场景中
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material1 = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,
});
const sphere = new THREE.Mesh(geometry, material1);
sphere.position.set(-2, 0, 0);
scene.add(sphere);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
renderer.setClearColor(0xcccccc, 1);

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
  let time = clock.getDelta();
  if (mixer) {
    // console.log(mixer);
    mixer.update(time);
  }
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
