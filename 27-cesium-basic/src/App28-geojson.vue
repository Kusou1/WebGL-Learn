<template>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
// 将cesium目录下的Build/Cesium  4个目录拷贝到public目录下
// 将cesium的widgets目录拷贝一份刀src下，将css文件引入
import * as Cesium from "cesium";
import "./Widgets/widgets.css";

// 设置cesium的token
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwN2Y0MjBjYS1kMzUzLTQ2MjAtYTFlNy1lYjg0NzFiMTllOTUiLCJpZCI6MTAzMDI2LCJpYXQiOjE2NTkxMTI1Mjh9.lhLF2WVuumLOJYjW0BHO29dGrVnO6SNveE9uqGOYugk";
// 设置cesium默认资源路径，静态资源的路径
window.CESIUM_BASE_URL = "/";
// 设置默认的视角为中国
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边经度
    89.5,
    // 南边维度
    20.4,
    // 东边经度
    110.4,
    // 北边维度
    61.2
);

onMounted(() => {
    // 要和id名相同
    var viewer = new Cesium.Viewer("cesiumContainer", {
        // 是否显示信息窗口
        infoBox: false,
    });

    //  隐藏cesiumLogo
    viewer.cesiumWidget.creditContainer.style.display = "none";
    // https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
    // 加载geojon数据
    let dataGeo = Cesium.GeoJsonDataSource.load(
        "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
        // 配置样式
        {
            stroke: Cesium.Color.WHITE,
            fill: Cesium.Color.BLUE.withAlpha(0.1),
            strokeWidth: 2,
        }
    );
    dataGeo.then((dataSources) => {
        console.log(dataSources);
        viewer.dataSources.add(dataSources);
        let entities = dataSources.entities.values;
        entities.forEach((entity, i) => {
            entity.polygon.material = new Cesium.ColorMaterialProperty(
                Cesium.Color.fromRandom({alpha: 0.4})
            );
            entity.polygon.outline = false;
            let randomNum = parseInt(Math.random() * 10);
            entity.polygon.extrudedHeight = 100000 * randomNum
        });
    
    });
    // console.log(dataGeo);
    // viewer.dataSources.add(dataGeo);
});
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
#cesiumContainer {
    width: 100vw;
    height: 100vh;
}
</style>
