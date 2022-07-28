import * as THREE from "three";
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // depthbuffer 对深度buffer进行检测
  logarithmicDepthBuffer: true,
  // 物理正确光照
  physicallyCorrectLights: true,
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// 电影的渲染方式
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 曝光程度
renderer.toneMappingExposure = 1.5;

export default renderer;
