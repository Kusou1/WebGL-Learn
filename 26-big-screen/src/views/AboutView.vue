<template>
  <div class="screenBig">
    <div class="about" ref="screenDom">
      <Map3d></Map3d>
      <BigScreen></BigScreen>
      <!-- <GdpGrow></GdpGrow> -->
    </div>
  </div>
</template>

<script setup>
import Map3d from "../components/Map3d.vue";
import { ref, onMounted, reactive } from "vue";
import GdpGrow from "@/components/GdpGrow.vue";
import BigScreen from "../components/BigScreen.vue";
let screenDom = ref(null);
const resizeFn = () => {
  console.log(screenDom);
  let scale = window.innerWidth / 1920;
  screenDom.value.style.transform = `scale(${scale})`;
};
onMounted(() => {
  resizeFn();
  window.addEventListener("resize", resizeFn);
});
</script>

<style>
.screenBig {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.about {
  width: 1920px;
  height: 1080px;
  transform-origin: 0 0;
}
</style>
