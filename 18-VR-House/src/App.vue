<template>
  <div class="container" ref="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { ref, onMounted } from "vue";
import gsap from "gsap";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.z = 0.1;
// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

const container = ref(null);

// 创建辅助坐标轴
// const axes = new THREE.AxesHelper(5);
// scene.add(axes);

function makeCube(position, arrImg, imgPath, name) {
  // 添加立方体
  const geometry = new THREE.BoxGeometry(500, 500, 500);
  geometry.scale(1, 1, -1);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // 4_b,

  var arr = arrImg;
  var boxMaterials = [];

  arr.forEach((item) => {
    // 纹理加载
    let texture = new THREE.TextureLoader().load(`${imgPath}/${item}.jpg`);
    // 创建材质
    if (item === arrImg[2] || item === arrImg[3]) {
      texture.rotation = Math.PI;
      texture.center = new THREE.Vector2(0.5, 0.5);
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
    } else {
      boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
    }
  });
  const cube = new THREE.Mesh(geometry, boxMaterials);
  cube.position.set(position.x, position.y, position.z);
  // cube.geometry.scale(1, 1, -1);
  scene.add(cube);
  cube.name = name;
  return cube;
}

let cube = makeCube(
  new THREE.Vector3(0, 0, 0),
  ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"],
  "./imgs/living",
  "livingRoom"
);
let kitchen = makeCube(
  new THREE.Vector3(500, 0, -360),
  ["0_l", "0_r", "0_u", "0_d", "0_b", "0_f"],
  "./imgs/kitchen",
  "kitchen"
);

let home = {
  livingRoom: cube,
  kitchen: kitchen,
};

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  render();

  // 射线获取鼠标点击的位置
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const mouseDown = (e) => {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      console.log(intersects);
      if (
        intersects[0].object &&
        typeof intersects[0].object.name === "string" &&
        intersects[0].object.name.includes("sprite")
      ) {
        let name = intersects[0].object.name;
        let key = name.split("_")[0];
        if (home[key]) {
          gsap.to(controls.target, {
            duration: 0.5,
            x: home[key].position.x,
            y: home[key].position.y,
            z: home[key].position.z,
            onComplete: () => {
              console.log("完成");
              gsap.to(camera.position, {
                duration: 0.5,
                x: home[key].position.x - 1,
                y: home[key].position.y,
                z: home[key].position.z + 1,
              });
            },
          });
        }
      }
    }
  };
  container.value.addEventListener("mousedown", mouseDown);

  // 创建精灵图
  const spriteMap = new THREE.TextureLoader().load("./imgs/go.png");
  const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(245, -12, -181);
  sprite.scale.set(25, 25, 25);
  sprite.name = "kitchen_sprite";
  scene.add(sprite);

  // 精灵图添加一个文字标签
  const kitchenDiv = document.createElement("div");
  kitchenDiv.className = "label";
  kitchenDiv.textContent = "厨房";
  const kitchenLabel = new CSS2DObject(kitchenDiv);
  kitchenLabel.position.set(0, 1, 0);
  sprite.add(kitchenLabel);

  gsap.to(sprite.position, {
    duration: 2,
    y: 3,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
  });
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
.label {
  color: #fff;
  text-shadow: 0 0 10px #000;
  font-size: 16px;
}
</style>
