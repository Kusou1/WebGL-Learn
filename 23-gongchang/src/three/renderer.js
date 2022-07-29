import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // 设置物理灯光模拟效果
  physicallyCorrectLights: true,
  // 设置对数深度缓冲区
  logarithmicDepthBuffer: true,
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// 调节色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 调节曝光
renderer.toneMappingExposure = 0.8;

// 创建css3drender
const css3drender = new CSS3DRenderer();
css3drender.setSize(window.innerWidth, window.innerHeight);
document.querySelector(".cssrender").appendChild(css3drender.domElement);

export default { renderer, css3drender };
