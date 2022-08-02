import * as Cesium from "cesium";
function PolylineTrailMaterialProperty() {
  this._definitionChanged = new Cesium.Event();
  // console.log("PolylineTrailMaterialProperty");
}
Object.defineProperties(PolylineTrailMaterialProperty.prototype, {
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
});
PolylineTrailMaterialProperty.prototype.getType = function (time) {
  return "PolylineTrail";
};
PolylineTrailMaterialProperty.prototype.getValue = function (time, result) {
  return {};
};
PolylineTrailMaterialProperty.prototype.equals = function (t) {
  return (
    this === t ||
    (t instanceof PolylineTrailMaterialProperty &&
      this.speed === t.speed &&
      Cesium.Property.equals(this.color, t.color))
  );
};
// Object.defineProperties(Cesium, {
//   PolylineTrailMaterialProperty: {
//     get: function () {
//       return PolylineTrailMaterialProperty;
//     },
//   },
// });
// Cesium.PolylineTrailMaterialProperty = PolylineTrailMaterialProperty;
Cesium.Material.PolylineTrailMaterialType = "PolylineTrail";
Cesium.Material._materialCache.addMaterial("PolylineTrail", {
  fabric: {
    type: "PolylineTrail",
    uniforms: {
      color: new Cesium.Color(0.7, 0.7, 1.0, 1.0),
      transparent: true,
      speed: 6 * Math.random(),
      gradient: 0.01,
      percent: 0.1,
    },
    source: `
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st = materialInput.st; //st.x: 0~1, st.y: 0~1
          // fract(1.3) == 0.3,fract是保留小数点后面的数字
          // czm_frameNumber 是当前帧数的索引号
          float t = fract(czm_frameNumber * speed / 1000.0);
          t *= (1.0 + percent);
          // smoothstep(edge0, edge1, value)
          // 假设edge0=0.0, edge1=1.0, value=0.5
          // 当value<edge0时，返回0.0
          // 当value>edge1时，返回1.0
          // 当edge0<=value<=edge1时，返回(value-edge0)/(edge1-edge0)
          // edge0 = 6, edge1 = 10, value = 8; = 0.5

          float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
          alpha += 0.1;
          material.diffuse = color.rgb;
          material.alpha = alpha;


          
          return material;
        }

    `,
  },
  translucent: true,
});

export { PolylineTrailMaterialProperty };
