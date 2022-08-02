import * as Cesium from "cesium";
// 对地图颜色进行修改
export function setMapColor(viewer) {
  // 获取基础图像图层
  let baseLayer = viewer.imageryLayers.get(0);
  //   console.log(baseLayer);
  //   console.log(viewer.imageryLayers);
  //   修改底图的着色器
  const baseFragmentShader =
    viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources;

  for (let i = 0; i < baseFragmentShader.length; i++) {
    let strS = "color = czm_saturation(color, textureSaturation);";
    let strT =
      strS +
      `
        color.r = 1.0 - color.r;
        color.g = 1.0 - color.g;
        color.b = 1.0 - color.b;
      `;
    strT += `
      color.r = color.r*0.0/255.0;
        color.g = color.g*50.0/255.0;
        color.b =  color.b*100.0/255.0;
      `;
    baseFragmentShader[i] = baseFragmentShader[i].replace(strS, strT);
    console.log(baseFragmentShader[i]);
  }
}

export function changeImageryProviderColors(viewer) {
  let baseLayer = viewer.imageryLayers.get(0);
  // 设置两个变量来判断是否进行颜色的翻转和过滤
  baseLayer.invertColor = true;
  // 过滤颜色
  baseLayer.filterRGB = [0, 50, 100]; // [255, 255, 255]=>[0,127,255]
  // 更改底图的着色器 代码
  const baseFragmentShaderSource =
    viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources;
    // 循环修改着色器
  for (let i = 0; i < baseFragmentShaderSource.length; i++) {
    const oneSource = baseFragmentShaderSource[i];
    // 格式必须一致 不能多有空格 且保持版本一致性
    const strS = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    let strT = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    // 判断是否要修改
    if (baseLayer.invertColor) {
      // 反色
      strT += `
          color.r = 1.0 - color.r;
          color.g = 1.0 - color.g;
          color.b = 1.0 - color.b;
        `;
      // 过滤
      strT += `
          color.r = color.r * ${baseLayer.filterRGB[0]}.0/255.0;
          color.g = color.g * ${baseLayer.filterRGB[1]}.0/255.0;
          color.b = color.b * ${baseLayer.filterRGB[2]}.0/255.0;
          `;
    }

    if (oneSource.indexOf(strS) !== -1) {
      baseFragmentShaderSource[i] = baseFragmentShaderSource[i].replace(
        strS,
        strT
      );
    }
  }
}
