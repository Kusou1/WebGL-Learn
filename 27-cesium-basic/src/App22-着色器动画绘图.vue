<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import * as dat from "dat.gui";
import gsap from "gsap";

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
// 实现圆的扩散
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
    // extrudedHeight: 30000,
  });

  const instance = new Cesium.GeometryInstance({
    geometry: extrudePolygon,
    id: "挤出四边形",
  });

  const material = new Cesium.Material({
    fabric: {
      // type: "Color",
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
        uTime: 0,
      },
      source: `
      czm_material czm_getMaterial(czm_materialInput materialInput)
      {
          czm_material material = czm_getDefaultMaterial(materialInput);
          material.diffuse = vec3(uTime,uTime,0.81);

          return material;
      }
      `,
    },
  });
  console.log(material);
  console.log(material.shaderSource);

  gsap.to(material.uniforms, {
    uTime: 1,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "linear",
    onUpdate: () => {
      console.log("值发生了修改");
      // viewer.scene.primitives.add(
      //   new Cesium.Primitive({
      //     geometryInstances: instance,
      //     appearance: new Cesium.MaterialAppearance({
      //       material: material,
      //       translucent: true,
      //       closed: true,
      //     }),
      //   })
      // );
    },
  });

  const appearance = new Cesium.MaterialAppearance({
    material: material,
    // translucent: true,
    // closed: true,
  });

  //   const appearance = new Cesium.MaterialAppearance({
  //     fragmentShaderSource: `
  //     varying vec3 v_positionEC;
  // varying vec3 v_normalEC;
  // varying vec2 v_st;

  // void main()
  // {
  //     vec3 positionToEyeEC = -v_positionEC;

  //     vec3 normalEC = normalize(v_normalEC);
  // #ifdef FACE_FORWARD
  //     normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
  // #endif

  //     czm_materialInput materialInput;
  //     materialInput.normalEC = normalEC;
  //     materialInput.positionToEyeEC = positionToEyeEC;
  //     materialInput.st = v_st;
  //     czm_material material = czm_getMaterial(materialInput);
  //   //  实现圆
  //   // float strength = 1.0 - distance(v_st,vec2(0.5,0.5))*2.0;
  //   // material.diffuse = vec3(strength);
  //   // material.alpha = step(0.0,strength);

  //   // 渐变环
  //   float strength =  1.0-(abs(distance(v_st,vec2(0.5,0.5))-0.25)*4.0);
  //   material.diffuse = vec3(strength);
  //   material.alpha = step(0.0,strength);

  // #ifdef FLAT
  //     gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
  // #else
  //     gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
  // #endif
  // }
  //     `,
  //   });

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
