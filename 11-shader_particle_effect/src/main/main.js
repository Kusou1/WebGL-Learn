import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Color } from "three";
import fragmentShader from "../shader/basic/fragmentShader.glsl";
import vertexShader from "../shader/basic/vertexShader.glsl";
// 目标：打造一个旋转的银河系

//创建gui对象
const gui = new dat.GUI();

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
camera.position.set(0, 0, 5);
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// const geometry = new THREE.BufferGeometry();
// const positions = new Float32Array([0,0,0]);
// geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));

// 点材质
// const material = new THREE.PointsMaterial({
//   color:0xff0000,
//   size:10,
//   sizeAttenuation:true
// })


// 导入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/particles/10.png');
const texture1 = textureLoader.load('textures/particles/9.png');
const texture2 = textureLoader.load('textures/particles/11.png');

// 点着色器材质
// const material = new THREE.ShaderMaterial({
//   uniforms:{
//     uTexture:{
//       value:texture
//     }
//   },
//   vertexShader:vertexShader,
//   fragmentShader:fragmentShader,
//   transparent:true
// })

// // 生成点
// const points = new THREE.Points(geometry,material)
// scene.add(points)
let geometry=null;
let  points=null;

// 设置星系的参数
const params = {
  count: 1000,
  size: 0.1,
  radius: 5,
  branches: 4,
  spin: 0.5,
  color: "#ff6030",
  outColor: "#1b3984",
};

// GalaxyColor
let galaxyColor = new THREE.Color(params.color);
let outGalaxyColor = new THREE.Color(params.outColor);
let material;
const generateGalaxy = () => {
  // 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // 生成顶点几何
  geometry = new THREE.BufferGeometry();
  //   随机生成位置
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);

  const scales = new Float32Array(params.count);

  //图案属性
  const imgIndex = new Float32Array(params.count)

  //   循环生成点
  for (let i = 0; i < params.count; i++) {
    const current = i * 3;

    // 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
    const branchAngel =
      (i % params.branches) * ((2 * Math.PI) / params.branches);

    const radius = Math.random() * params.radius;
    // 距离圆心越远，旋转的度数就越大
    // const spinAngle = radius * params.spin;

    // 随机设置x/y/z偏移值
    const randomX =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomY =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;
    const randomZ =
      Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3;

    // 设置当前点x值坐标
    positions[current] = Math.cos(branchAngel) * radius + randomX;
    // 设置当前点y值坐标
    positions[current + 1] = randomY;
    // 设置当前点z值坐标
    positions[current + 2] = Math.sin(branchAngel) * radius + randomZ;

    const mixColor = galaxyColor.clone();
    mixColor.lerp(outGalaxyColor, radius / params.radius);

    //   设置颜色
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;



    // 顶点的大小
    scales[current] = Math.random();

    // 根据索引值设置不同的图案；
    imgIndex[current] = i%3 ;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("imgIndex", new THREE.BufferAttribute(imgIndex, 1));

  //   设置点材质
  //   material = new THREE.PointsMaterial({
  //     color: new THREE.Color(0xffffff),
  //     size: params.size,
  //     sizeAttenuation: true,
  //     depthWrite: false,
  //     blending: THREE.AdditiveBlending,
  //     map: particlesTexture,
  //     alphaMap: particlesTexture,
  //     transparent: true,
  //     vertexColors: true,
  //   });

  //   设置点的着色器材质
  material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0,
      },
      uTexture:{
        value:texture
      },
      uTexture1:{
        value:texture1
      },
      uTexture2:{
        value:texture2
      },
      uTime:{
        value:0
      },
      uColor:{
        value:galaxyColor
      }

    },
  });

  //   生成点
  points = new THREE.Points(geometry, material);
  scene.add(points);
  console.log(points);
  //   console.log(123);
};

generateGalaxy()



// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
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
// // 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();

function animate(t) {
  //   controls.update();
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();
