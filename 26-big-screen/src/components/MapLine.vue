<template>
  <div class="mapLine" ref="mapDom" :style="styleObj"></div>
</template>

<script setup>
import { appendToMemberExpression } from "@babel/types";
import { ref, onMounted, reactive } from "vue";
let styleObj = reactive({
  width: "600px",
  height: "400px",
});
let mapDom = ref(null);

onMounted(() => {
  console.log(mapDom);
  fetch("./assets/mapstyle/custom_map_config.json")
    .then((res) => res.json())
    .then((res) => {
      // console.log(res)
      map.setMapStyleV2({ styleJson: res });
    });
  var map = new BMapGL.Map(mapDom.value);
  var point = new BMapGL.Point(116.404, 39.915);
  map.centerAndZoom(point, 11);

  map.enableScrollWheelZoom(true);
});
</script>
