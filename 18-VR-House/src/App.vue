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
// 初始化相机 透视相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
// 设置相机位置 尽量靠近中心的位置
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

// 创建精灵图
const spriteMap = new THREE.TextureLoader().load("./imgs/go.png");
const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap,
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
});

let inCreamTicket = [];

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

function createBtn(position, name, label) {
    // 设置精灵图位置
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(position.x, position.y, position.z);
    // sprite.position.set(245, -12, -181);
    sprite.scale.set(25, 25, 25);
    sprite.name = `${name}_sprite`;
    scene.add(sprite);

    // 精灵图添加一个文字标签
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "label";
    ticketDiv.textContent = label;
    const ticketLabel = new CSS2DObject(ticketDiv);
    ticketLabel.position.set(0, 1, 0);
    sprite.add(ticketLabel);

    gsap.to(sprite.position, {
        duration: 2,
        y: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
    });
    inCreamTicket.push({ label: ticketLabel, sprite: sprite });
}

function rebuildTicket(key) {
    cleanTicket();
    ticketsArr[key].forEach((param) => {
        createBtn(...param);
    });
}

function cleanTicket() {
    inCreamTicket.forEach((ticket) => {
        ticket.sprite.remove(ticket.label);
        scene.remove(ticket.sprite);
    });
}

// 客厅
let livingRoom = makeCube(
    new THREE.Vector3(0, 0, 0),
    ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"],
    "./imgs/living",
    "livingRoom"
);

let bedRoom = makeCube(
    new THREE.Vector3(-500, 0, -360),
    ["20_l", "20_r", "20_u", "20_d", "20_b", "20_f"],
    "./imgs/bedRoom",
    "bedRoom"
);

// 厨房
let kitchen = makeCube(
    new THREE.Vector3(500, 0, -360),
    ["0_l", "0_r", "0_u", "0_d", "0_b", "0_f"],
    "./imgs/kitchen",
    "kitchen"
);

let home = {
    livingRoom: livingRoom,
    kitchen: kitchen,
    bedRoom: bedRoom,
};

let ticketsArr = {
    livingRoom: [
        [new THREE.Vector3(245, -12, -181), "kitchen", "厨房"],
        [new THREE.Vector3(-120, 20, -50), "bedRoom", "卧室"],
    ],
    kitchen: [[new THREE.Vector3(480, -82, -181), "livingRoom", "客厅"]],
    bedRoom: [[new THREE.Vector3(-540, 0, -460), "livingRoom", "客厅"]],
};
// 挂载完毕之后获取dom
onMounted(() => {
    // 添加控制器
    const controls = new OrbitControls(camera, container.value);
    controls.enableDamping = true;
    // 将渲染器的内容加到container中
    container.value.appendChild(renderer.domElement);
    ticketsArr.livingRoom.forEach((param) => {
        createBtn(...param);
    });
    const render = () => {
        controls.update();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        // 每一帧都进行调用
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
        // 通过射线进行碰撞
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
                console.log(key);
                if (home[key]) {
                    rebuildTicket(key);
                    gsap.to(controls.target, {
                        duration: 0.5,
                        x: home[key].position.x,
                        y: home[key].position.y,
                        z: home[key].position.z,
                        onComplete: () => {
                            console.log("完成");
                            gsap.to(camera.position, {
                                duration: 0.5,
                                x: home[key].position.x + 1,
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
