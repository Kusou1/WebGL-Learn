import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 初始化场景
const scene = new THREE.Scene();

// 添加雾霾
// const fog = new THREE.Fog(0x000000, 0, 10);
// scene.fog = fog;

// const cubeTextureLoader = new THREE.CubeTextureLoader().setPath("./textures/");
// const texture = cubeTextureLoader.load([
//   "1.jpg",
//   "2.jpg",
//   "3.jpg",
//   "4.jpg",
//   "5.jpg",
//   "6.jpg",
// ]);

// 添加圆柱形天空
const rgbeloader = new RGBELoader();

rgbeloader.loadAsync("./textures/2k.hdr").then((texture) => {
  // 设置纹理为圆柱形纹理
  texture.mapping = THREE.EquirectangularReflectionMapping;
  // 添加天空环境
  scene.background = texture;
  scene.environment = texture;
});

// 场景亮度物理灯光效果
// 1设置色调映射
// 2设置曝光
// 3设置场景灯光

// 给场景添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 100, 10);
scene.add(light);

export default scene;
