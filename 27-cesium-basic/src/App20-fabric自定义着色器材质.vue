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

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(112.417, 23.29, 100000),
  });

  const extrudePolygon = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        112.417, 23.29, 113.67, 23.56, 114.093, 22.59, 112.838, 22.285,
      ])
    ),
    extrudedHeight: 30000,
  });

  const instance = new Cesium.GeometryInstance({
    geometry: extrudePolygon,
    id: "挤出四边形",
  });

  // 编写着色器修改材质
  const material = new Cesium.Material({
    // fabric自定义着色器材质
    fabric: {
      // type: "Color",
      // uniforms: {
      //   color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
      // },
      // source函数，返回着色器代码，决定最终显示什么内容
      source: `
      czm_material czm_getMaterial(czm_materialInput materialInput)
      {
          czm_material material = czm_getDefaultMaterial(materialInput);
          material.diffuse = vec3(0.84,0.66,0.81);
          
          return material;
      }
      `,
    },
  });

  console.log(material.shaderSource);

  // const appearance = new Cesium.MaterialAppearance({
  //   material: material,
  //   // translucent: true,
  //   // closed: true,
  // });

  // st就是uv的坐标
  const appearance = new Cesium.MaterialAppearance({
    fragmentShaderSource: `
    varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;

void main()
{
    vec3 positionToEyeEC = -v_positionEC;

    vec3 normalEC = normalize(v_normalEC);
#ifdef FACE_FORWARD
    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
#endif

    czm_materialInput materialInput;
    materialInput.normalEC = normalEC;
    materialInput.positionToEyeEC = positionToEyeEC;
    materialInput.st = v_st;
    czm_material material = czm_getMaterial(materialInput);
    material.diffuse = vec3(v_st,0.81);
    // material.emission = vec3(0.5,0.5,0.5);
    // material.specular = 1.0;
    material.specular = 1.0;
    material.alpha = 1.0;

#ifdef FLAT
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
#else
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
#endif
}
    `,
  });

  // 创建图元添加
  var primitive = viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: [instance],
      appearance: appearance,
    })
  );

  console.log(appearance.vertexShaderSource);
  console.log(appearance.fragmentShaderSource);

  // let fs = appearance.getFragmentShaderSource();
  // console.log(fs);
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
