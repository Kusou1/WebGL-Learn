import * as Cesium from "cesium";
import gsap from "gsap";


// 添加雷达效果
export function addRadarEffect(viewer) {
  const extrudePolygon = new Cesium.PolygonGeometry({
    polygonHierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        113.93, 22.53, 113.915, 22.53, 113.915, 22.54, 113.93, 22.54,
      ])
    ),
    extrudedHeight: 10,
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
              // 生成默认的基础材质
              czm_material material = czm_getDefaultMaterial(materialInput);
              
              // 获取uv,绕圆心旋转uv
              vec2 newSt = mat2(
                cos(uTime), -sin(uTime),
                sin(uTime), cos(uTime)
              )*(materialInput.st-0.5);
              // 恢复回圆心
              newSt += 0.5;
                
              // 设置圆，外部透明，内部不透明
              float alpha = 1.0 - step(0.3,distance(newSt, vec2(0.5)));
              // angle是从-pi到pi的，所以如果要设置从0-1的转变，需要加上pi
              float angle = atan(newSt.x - 0.5, newSt.y - 0.5);
              // 按照角度设置强弱程度
              float strength = (angle+3.14)/6.28;
              // 将强弱与透明度结合
              material.alpha = alpha*strength;
              material.diffuse = mix(vec3(0.0, 0.0, 0.0), vec3(1.0,0.0,0.0), strength);
              
              return material;
          }
          `,
    },
  });

  gsap.to(material.uniforms, {
    uTime: -6.28,
    duration: 1,
    repeat: -1,
    ease: "linear",
    // yoyo: true,
  });
  const appearance = new Cesium.MaterialAppearance({
    material: material,
    // translucent: true,
    // closed: true,
  });
  appearance.material.uniforms.uTime = 0.0;
  // 创建图元添加
  var primitive = viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: [instance],
      appearance: appearance,
    })
  );
}
