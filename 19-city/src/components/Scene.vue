<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import gsap from "gsap";

// 导入gui对象
import gui from "@/three/gui";
// 导入场景
import scene from "@/three/scene";
// 导入相机
import camera from "@/three/camera";
// 导入控制器
import controls from "@/three/controls";
// 导入辅助坐标轴
import axesHelper from "@/three/axesHelper";
// 导入渲染器
import renderer from "@/three/renderer";
// 初始化调整屏幕
import "@/three/init";
// 导入添加物体函数
import createMesh from "@/three/createMesh";
// 导入每一帧的执行函数
import animate from "@/three/animate";
import AlarmSprite from "@/three/mesh/AlarmSprite";
import LightWall from "@/three/mesh/LightWall";
import FlyLineShader from "@/three/mesh/FlyLineShader";
import LightRadar from "@/three/mesh/LightRadar";
import eventHub from "@/utils/eventHub";

const props = defineProps(["eventList"]);
// 场景元素div
let sceneDiv = ref(null);
// 添加相机
scene.add(camera);
// 添加辅助坐标轴
scene.add(axesHelper);
// 创建物体
createMesh();

onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement);
  animate();
});
const eventListMesh = [];
let mapFn = {
  火警: (position, i) => {
    const lightWall = new LightWall(1, 2, position);
    lightWall.eventListIndex = i;
    scene.add(lightWall.mesh);
    eventListMesh.push(lightWall);
  },
  治安: (position, i) => {
    //   生成随机颜色
    const color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    ).getHex();
    // 添加着色器飞线
    const flyLineShader = new FlyLineShader(position, color);
    flyLineShader.eventListIndex = i;
    scene.add(flyLineShader.mesh);
    eventListMesh.push(flyLineShader);
  },
  电力: (position, i) => {
    // 添加雷达
    const lightRadar = new LightRadar(2, position);
    lightRadar.eventListIndex = i;
    scene.add(lightRadar.mesh);
    eventListMesh.push(lightRadar);
  },
};

eventHub.on("eventToggle", (i) => {
  eventListMesh.forEach((item) => {
    if (item.eventListIndex === i) {
      item.mesh.visible = true;
    } else {
      item.mesh.visible = false;
    }
  });
  const position = {
    x: props.eventList[i].position.x / 5 - 10,
    y: 0,
    z: props.eventList[i].position.y / 5 - 10,
  };
  //   controls.target.set(position.x, position.y, position.z);
  gsap.to(controls.target, {
    duration: 1,
    x: position.x,
    y: position.y,
    z: position.z,
  });
});

watch(
  () => props.eventList,
  (val) => {
    // console.log(val);
    eventListMesh.forEach((item) => {
      item.remove();
    });
    props.eventList.forEach((item, i) => {
      const position = {
        x: item.position.x / 5 - 10,
        z: item.position.y / 5 - 10,
      };
      const alarmSprite = new AlarmSprite(item.name, position);
      alarmSprite.onClick(() => {
        // console.log(item.name, i);
        eventHub.emit("spriteClick", { event: item, i });
      });
      alarmSprite.eventListIndex = i;
      eventListMesh.push(alarmSprite);
      scene.add(alarmSprite.mesh);
      if (mapFn[item.name]) {
        mapFn[item.name](position, i);
      }
    });
  }
);
</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
