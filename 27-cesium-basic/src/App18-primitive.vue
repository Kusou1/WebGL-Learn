<template>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import * as dat from "dat.gui";
// console.log(flightData);
const gui = new dat.GUI();

// 设置cesium的token
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";
// cesium默认资源路径
window.CESIUM_BASE_URL = "/";
// 设置默认的视角为中国
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边经度
    89.5,
    // 南边维度
    0.4,
    // 东边经度
    110.4,
    // 北边维度
    81.2
);

onMounted(() => {
    var viewer = new Cesium.Viewer("cesiumContainer", {});

    viewer.scene.globe.enableLighting = true;

    // 设置沙箱允许使用JS
    var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
    iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-popups allow-forms"
    );
    iframe.setAttribute("src", "");

    // // 隐藏cesiumLogo
    viewer.cesiumWidget.creditContainer.style.display = "none";

    // entity
    var entity = viewer.entities.add({
        id: "entity",
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(
                // 西边经度
                89.5,
                // 南边维度
                30,
                // 东边经度
                110.4,
                // 北边维度
                40
            ),
            material: Cesium.Color.BLUE.withAlpha(0.5),
        },
    });

    // primitive
    var instance = new Cesium.GeometryInstance({
        id: "blueRect",
        geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(
                // 西边经度
                89.5,
                // 南边维度
                10,
                // 东边经度
                110.4,
                // 北边维度
                20
            ),
            // 距离表面的高度
            height: 1000,
            // vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
        }),
        // attributes: {
        //   color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED),
        // },
    });

    // 几何体的实例
    const instance2 = new Cesium.GeometryInstance({
        id: "redRect",
        geometry: new Cesium.CircleGeometry({
            center: Cesium.Cartesian3.fromDegrees(110.4, 40, 0),
            radius: 1000000,
            // vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        }),
    });

    // var primitiveRect = new Cesium.Primitive({
    //   geometryInstances: instance,
    //   appearance: new Cesium.EllipsoidSurfaceAppearance({
    //     material: Cesium.Material.fromType("Color", {
    //       color: Cesium.Color.RED.withAlpha(0.5),
    //     }),
    //   }),
    // });
    // 使用实例instance的颜色去着色
    let appearance = new Cesium.PerInstanceColorAppearance({
      flat: true
    })

    // 使用Primitive，创建图元
    var primitiveRect = new Cesium.Primitive({
        // 传入几何体实例到数组，最终会作为一个几何体渲染到场景中
        geometryInstances: [instance, instance2],
        // 设置外观
        // 设定几何体都是与地球的椭球体平行
        // 假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            material: Cesium.Material.fromType("Color", {
                color: Cesium.Color.RED.withAlpha(0.5),
            }),
        }),
    });
    // 将图元添加到viewer中
    viewer.scene.primitives.add(primitiveRect);

    setInterval(() => {
        let attributes = primitiveRect.getGeometryInstanceAttributes("blueRect");
        attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
            // Cesium.Color.BLUE.withAlpha(0.5)
            Cesium.Color.fromRandom({ alpha: 0.5 })
        );
    }, 2000);

    // 点击事件，拾取
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        // movement屏幕的信息
        // 通过scene.pick，选中物体
        var pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject)) {
            console.log(pickedObject.id);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    viewer.camera.setView(viewer.entities)
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
