import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 顶点着色器
import basicVertexShader from "../shader/basic/vertex.glsl";
// 片元着色器
import basicFragmentShader from "../shader/basic/fragment.glsl";

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
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 加载纹理

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./texture/da.jpeg");
const params = {
  uFrequency: 10,
  uScale: 0.1,
};

// const material = new THREE.MeshBasicMaterial({ color: "#00ff00" });
// 创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  // 顶点着色器  描述点的位置 4个纬度
  // projectionMatrix * viewMatrix * modelMatrix 顶点变换
  // <投影矩阵> * <视图矩阵> * <模型矩阵> * <顶点坐标>
  vertexShader: `
        void main(){
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ) ;
        }
    `,
  // 片元着色器  应该怎么去显示,对每一个需要渲染的像素运行fragment shader
  fragmentShader: `
        void main(){
            gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
        }
  `,
});

// 创建平面
// width — 平面沿着X轴的宽度。默认值是1。
// height — 平面沿着Y轴的高度。默认值是1。
// widthSegments — （可选）平面的宽度分段数，默认值是1。
// heightSegments — （可选）平面的高度分段数，默认值是1。
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 64, 64),
  shaderMaterial
);

console.log(floor);
scene.add(floor);

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

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  const elapsedTime = clock.getElapsedTime();
  //   console.log(elapsedTime);
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
