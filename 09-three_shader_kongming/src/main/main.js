import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import vertexShader from "../shaders/flylight/vertex.glsl";
import fragmentShader from "../shaders/flylight/fragment.glsl";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 目标：认识shader

//创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 2);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

// 加载纹理

// 创建纹理加载器对象
const rgbeLoader = new RGBELoader();
// 加载背景
rgbeLoader.loadAsync("./assets/2k.hdr").then((texture) => {
  // 环境的映射
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture; // 将环境设置成这张图片
  scene.environment = texture;
});

// 创建着色器材质;
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {},
  side: THREE.DoubleSide,
  //   transparent: true,
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;

// 定义渲染器的输出编码。默认为THREE.LinearEncoding
// 如果渲染目标已经使用 .setRenderTarget、之后将直接使用renderTarget.texture.encoding
// 详见色彩空间.md
renderer.outputEncoding = THREE.sRGBEncoding; // 设置成RGB编码
// 色调映射
// ACESFilmicToneMapping最常用的，保留更多的细节，电影级别
// 这些常量定义了WebGLRenderer中toneMapping的属性。 
// 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。
// 对性能影响不大
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.CineonToneMapping;
// 设置曝光程度
renderer.toneMappingExposure = 0.2;

// 加载GLTF
const gltfLoader = new GLTFLoader();
let LightBox = null;
gltfLoader.load("./assets/model/flyLight.glb", (gltf) => {
  console.log(gltf);

  LightBox = gltf.scene.children[1];
  LightBox.material = shaderMaterial;

  for (let i = 0; i < 150; i++) {
    let flyLight = gltf.scene.clone(true);
    // 获取随机的坐标
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 25;
    flyLight.position.set(x, y, z);
    // 旋转
    gsap.to(flyLight.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    });
    // 上下漂浮
    gsap.to(flyLight.position, {
      x: "+=" + Math.random() * 5,
      y: "+=" + Math.random() * 20,
      yoyo: true,
      duration: 5 + Math.random() * 10,
      repeat: -1,
    });
    scene.add(flyLight);
  }
});

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

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置控制器自动旋转
controls.autoRotate = true;
// 旋转速度
controls.autoRotateSpeed = 0.5;
// 设置最大及最小旋转角度
// 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。
controls.maxPolarAngle = (Math.PI / 3) * 2;
controls.minPolarAngle = (Math.PI / 3) * 2;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  const elapsedTime = clock.getElapsedTime();

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
