<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
// yarn add cesium
// 将cesium目录下的Build/Cesium4个目录拷贝到public，然后将widgets目录拷贝一份到src下
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";
import gsap from "gsap";

// 设置cesium token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";

// 设置cesium静态资源路径
window.CESIUM_BASE_URL = "/";

// 设置cesium默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西边的经度
  89.5,
  // 南边维度
  20.4,
  // 东边经度
  110.4,
  // 北边维度
  61.2
);

onMounted(() => {
  var viewer = new Cesium.Viewer("cesiumContainer", {
    // 是否显示信息窗口
    infoBox: false,
    // terrainProvider: Cesium.createWorldTerrain(),
  });

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 添加3D建筑
  // const osmBuildings = viewer.scene.primitives.add(
  //   new Cesium.createOsmBuildings()
  // );

  // let material = new Cesium.GridMaterialProperty({
  //   color: Cesium.Color.YELLOW,
  //   cellAlpha: 0.2,
  //   lineCount: new Cesium.Cartesian2(4, 4),
  //   lineThickness: new Cesium.Cartesian2(4.0, 4.0),
  // });

  class CustcomMaterialProperty {
    constructor(options) {
      this.init(options);
      this.definitionChanged = new Cesium.Event();
    }

    getType() {
      // 返回类型
      return "CustcomMaterial";
    }
    getValue(time, result) {
      // console.log(time, result);
      // 用来设置和处理uniform变量
      return result;
    }

    init() {
      Cesium.Material._materialCache.addMaterial("CustcomMaterial", {
        fabric: {
          type: "CustcomMaterial",
          uniforms: {},
          source: `
          czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          // 生成默认的基础材质
          czm_material material = czm_getDefaultMaterial(materialInput);
          
          material.diffuse = vec3(materialInput.st,  0.0);
          return material;
        }
          `,
        },
      });
    }
  }

  let material = new CustcomMaterialProperty();

  console.log(material);

  var rectangle = viewer.entities.add({
    id: "entityRect",
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西边的经度
        90,
        // 南边维度
        20,
        // 东边经度
        110,
        // 北边维度
        30
      ),
      // 设置entity材质，MaterialProperty
      // material: Cesium.Color.RED.withAlpha(0.5),
      material: material,
    },
  });
  console.log(rectangle);

  // primivite创建矩形
  // 01-创建几何体
  let rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      115,
      // 南边维度
      20,
      // 东边经度
      135,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 02-创建几何体实例
  let instance = new Cesium.GeometryInstance({
    id: "redRect",
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.RED.withAlpha(0.5)
      ),
    },
  });

  let rectGeometry1 = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      // 西边的经度
      140,
      // 南边维度
      20,
      // 东边经度
      160,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 1000,
  });

  let instance2 = new Cesium.GeometryInstance({
    id: "blueRect",
    geometry: rectGeometry1,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BLUE.withAlpha(0.5)
      ),
    },
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 编写着色器修改材质
  // https://cesium.com/downloads/cesiumjs/releases/b28/Documentation/
  let material1 = new Cesium.Material({
    fabric: {
      uniforms: {
        uTime: 0,
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          // 生成默认的基础材质
          czm_material material = czm_getDefaultMaterial(materialInput);
          // material.diffuse = vec3(materialInput.st+uTime, 0.0);
          float strength = mod((materialInput.st.x-uTime) * 10.0, 1.0);
          material.diffuse = vec3(strength, 0.0, 0.0);
          return material;
        }
      `,
    },
  });

  // gsap.to(material1.uniforms, {
  //   uTime: 1,
  //   duration: 2,
  //   repeat: -1,
  //   ease: "linear",
  // });

  console.log(material1);
  console.log(material1.shaderSource);

  // 设定几何体都是与地球的椭球体平行
  //假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存

  let appearance = new Cesium.EllipsoidSurfaceAppearance({
    // material: material1,
    // aboveGround: false,
    // translucent: true,
    // uniform不在这里传值
    // uniforms: {
    //   uTime: 0,
    // },
    fragmentShaderSource: `
    varying vec3 v_positionMC;
    varying vec3 v_positionEC;
    varying vec2 v_st;
    uniform float uTime;

    void main()
    {
        czm_materialInput materialInput;

        gl_FragColor = vec4(v_st,uTime, 1.0);
    }
    `,
  });
  appearance.uniforms = {
    uTime: 0,
  };

  gsap.to(appearance.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });

  // console.log(appearance);
  // console.log(appearance.vertexShaderSource);
  // console.log(appearance.fragmentShaderSource);

  // let appearance = new Cesium.MaterialAppearance({
  //   material: material1,
  // });
  // 04-图元
  let primitive = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    appearance: appearance,
    show: true,
  });

  console.log(primitive);
  // 05-添加到viewer
  viewer.scene.primitives.add(primitive);

  viewer.camera.setView(viewer.entities);
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
