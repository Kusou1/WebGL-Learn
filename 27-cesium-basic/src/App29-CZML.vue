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
        // infoBox: false,
        shouldAnimate: true,
    });

    // // 隐藏cesiumLogo
    viewer.cesiumWidget.creditContainer.style.display = "none";

    //   let czml = [
    //     {
    //         id: "document",
    //         name: "box",
    //         version: "1.0",
    //     },
    //     {
    //         id:"shape",
    //         name: "Blue box",
    //         position: {
    //             cartographicDegrees: [-144.0, 40.0, 30000.0]
    //         },
    //         box: {
    //             dimensions: {
    //                 cartesian: [400000.0, 300000.0, 500000.0]
    //             },
    //             material: {
    //                 solidColor: {
    //                     color: {
    //                         rgba: [0, 0, 255, 255]
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //   ]
    const czml = [
        {
            id: "document",
            name: "CZML Point - Time Dynamic",
            version: "1.0",
        },
        {
            id: "point",
            // 物体在什么时间范围可用
            availability: "2022-08-01T15:00:00Z/2022-08-01T23:00:00Z",
            position: {
                // 设置物体的起始时间
                epoch: "2022-08-01T15:00:00Z",
                // 设置了四个维度，1维是时间，2维是经度，3维是纬度，4维是高度
                cartographicDegrees: [
                    0, -70, 20, 150000, 100, -80, 44, 150000.2, -90, 18, 150000,
                    300, -98, 52, 150000,
                ],
            },
            point: {
                color: {
                    rgba:[255,255,255,128]
                },
                outlineColor: {
                    rgba: [255,0,0,128]
                },
                outlineWidth: 3,
                pixelSize: 15,
            }
        },
    ];

    let promiseData = Cesium.CzmlDataSource.load(czml);
    promiseData.then((dataSource) => {
        viewer.dataSources.add(dataSource);
        viewer.flyTo(dataSource);
    });
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
