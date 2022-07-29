<template>
    <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";

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
    20.4,
    // 东边经度
    110.4,
    // 北边维度
    61.2
);

onMounted(() => {
    // 自定义地图与地图叠加
    var viewer = new Cesium.Viewer("cesiumContainer", {
        // 天地图矢量地图
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
        //   layer: "tdtBasicLayer",
        //   style: "default",
        //   format: "image/jpeg",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        // }),

        // 高德矢量地图
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //     url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        //     layer: "tdtVecBasicLayer",
        //     style: "default",
        //     format: "image/png",
        //     tileMatrixSetID: "GoogleMapsCompatible",
        // }),

        // 天地图影像服务
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
          layer: "tdtBasicLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
        }),

        // OSM地图
        // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
        //   url: "https://a.tile.openstreetmap.org/",
        // }),
        // 将基础图层选择器设置为false
        baseLayerPicker: false,
    });

    // 地图叠加
    console.log(viewer.imageryLayers);
    var layer = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            layer: "tdtVecBasicLayer",
            style: "default",
            format: "image/png",
            tileMatrixSetID: "GoogleMapsCompatible",
        })
    );

    // 设置图层的透明度
    layer.alpha = 0.5;

    console.log(layer);

    // 设置沙箱允许使用JS
    var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
    iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-popups allow-forms"
    );
    iframe.setAttribute("src", "");

    // // 隐藏cesiumLogo
    viewer.cesiumWidget.creditContainer.style.display = "none";
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
