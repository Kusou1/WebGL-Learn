import * as Cesium from "cesium";
// 着色器实现建筑物渐变特效
export function setBuilding(viewer) {
  let tiles3d = new Cesium.Cesium3DTileset({
    url: "https://mapv-data.oss-cn-hangzhou.aliyuncs.com/titleset/sz_ns2/tileset.json",
    shadows: Cesium.ShadowMode.ENABLED,
    maximumScreenSpaceError: 1,
    maximumNumberOfLoadedTiles: 1000,
  });

  const cityTiles = viewer.scene.primitives.add(tiles3d);

  //   监听当瓦片加载时候的事件
  tiles3d.tileVisible.addEventListener((tile) => {
    // console.log(tile);
    // console.log(tile.content);
    // 获取3d瓦片
    const cesium3DTileCon = tile.content;
    const featuresLength = cesium3DTileCon.featuresLength;
    for (let i = 0; i < featuresLength; i++) {
      // 获取模型
      const model = cesium3DTileCon.getFeature(i).content._model;
      //   console.log(model);
      //   console.log(model._sourcePrograms);
      // console.log(model._rendererResources.sourceShaders[1]);
      model._rendererResources.sourceShaders[1] = `
        varying vec3 v_positionEC;
        void main(){
            vec4 position = czm_inverseModelView * vec4(v_positionEC, 1.0);
            float strength = position.z/100.0;
            gl_FragColor = vec4(1.0*strength, 0.1*strength, 1.0*strength, 1.0);
        
        // 动态光环
        // czm_frameNumber cesium提供的帧数，可以用来做动画
        // fract(x),返回x的小数部分
        float time =  fract(czm_frameNumber/360.0);
        // 实现往返的效果
        time  = abs(time-0.5)*2.0;
        // clamp(x,min,max),返回x在min和max之间的最小值
        float diff = step(0.01,abs(clamp(position.z/100.0, 0.0, 1.0)-time));
        gl_FragColor.rgb += gl_FragColor.rgb*(1.0-diff);
    }
      
      `;
      // 片元着色器已经修改，需要更新
      model._shouldRegenerateShaders = true;
    }
  });
}
