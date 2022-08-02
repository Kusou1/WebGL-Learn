import * as Cesium from "cesium";

export function SpriteLineMaterialProperty() {
  this._definitionChanged = new Cesium.Event();
}

Object.defineProperties(SpriteLineMaterialProperty.prototype, {
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  isConstant: {
    get: function () {
      return false;
    },
  },
});

SpriteLineMaterialProperty.prototype.getType = function (time) {
  return "SpriteLine";
};
SpriteLineMaterialProperty.prototype.getValue = function (t, result) {
  console.log(result, t);
  let time = performance.now() / 1000;
  //   console.log(time);
  result.time = time;
  return result;
};
SpriteLineMaterialProperty.prototype.equals = function (t) {
  return (
    this === t ||
    (t instanceof SpriteLineMaterialProperty &&
      this.speed === t.speed &&
      Cesium.Property.equals(this.color, t.color))
  );
};

Cesium.Material.SpriteLineMaterialType = "SpriteLine";
Cesium.Material._materialCache.addMaterial("SpriteLine", {
  fabric: {
    type: "SpriteLine",
    uniforms: {
      color: new Cesium.Color(0.7, 0.7, 1.0, 1.0),
      transparent: true,
      speed: 6 * Math.random(),
      gradient: 0.01,
      percent: 0.1,
      image: "./assets/imgs/spriteline1.png",
      time: 0.3,
    },
    source: `
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st; //st.x: 0~1, st.y: 0~1
            vec4 colorImage = texture2D(image, vec2(fract(st.s+time), st.t));
            material.alpha = colorImage.a;
            material.diffuse = colorImage.rgb * 1.5;

            return material;
          }
  
      `,
  },
  translucent: true,
});
