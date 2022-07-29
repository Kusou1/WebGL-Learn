<template>
  <div id="bigScreen">
    <div class="header">城市</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent" @click="showWall">
          <GdpGrow></GdpGrow>

          <div class="footerBorder"></div>
        </div>
        <div class="cityEvent" @click="showAll">
          <PieChart></PieChart>

          <div class="footerBorder"></div>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent" @click="flatFighter">
          <ScatterChart></ScatterChart>

          <div class="footerBorder"></div>
        </div>

        <div class="cityEvent" @click="recoverFighter">
          <AqiChart></AqiChart>
          <div class="footerBorder"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import eventHub from "@/utils/eventHub";
import GdpGrow from "./GdpGrow.vue";
import PieChart from "./PieChart.vue";
import ScatterChart from "./ScatterChart.vue";
import AqiChart from "./AqiChart.vue";

const showWall = () => {
  eventHub.emit("showWall");
};

const showFloor1 = () => {
  eventHub.emit("showFloor1");
};

const showFloor2 = () => {
  eventHub.emit("showFloor2");
};
let open = false;
const showAll = () => {
  if (open) {
    eventHub.emit("hideAll");
    open = false;
  } else {
    eventHub.emit("showAll");
    open = true;
  }
};

const flatFighter = () => {
  eventHub.emit("flatFighter");
};

const recoverFighter = () => {
  eventHub.emit("recoverFighter");
};

const pointsFighter = () => {
  eventHub.emit("pointsFighter");
};

const pointsBlast = () => {
  eventHub.emit("pointsBlast");
};

const pointsBack = () => {
  eventHub.emit("pointsBack");
};
</script>

<style>
#bigScreen {
  width: 1920px;
  height: 1080px;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  width: 1920px;
  height: 100px;

  background-image: url(@/assets/bg/title.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(34, 133, 247);
  font-size: 40px;
  font-weight: bold;
  line-height: 100px;
  text-shadow: 0 0 10px #fff;
}

.main {
  flex: 1;
  width: 1920px;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 400px;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png),
    linear-gradient(to right, rgb(10, 42, 84), transparent);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.right {
  width: 400px;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png),
    linear-gradient(to left, rgb(10, 42, 84), transparent);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.cityEvent {
  position: relative;
  width: 350px;
  /* height: 3rem; */
  margin-bottom: 50px;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
  pointer-events: auto;
}

.cityEvent::before {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.cityEvent::after {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}
.footerBorder {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 350px;
  height: 40px;
}
.footerBorder::before {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footerBorder::after {
  width: 40px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 0.3rem;
}
h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
  text-shadow: 0 0 5px #000;
}

h1 > div {
  display: flex;
  align-items: center;
}
h1 span.time {
  font-size: 0.2rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}
.list h1 {
  padding: 0.1rem 0.3rem;
}
.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}
.cityEvent li.active p {
  color: red;
}
</style>
