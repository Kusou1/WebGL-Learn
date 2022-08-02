import * as Cesium from "cesium";
import * as turf from "@turf/turf"; // 生成地理信息数据
import gsap from "gsap";
import { PolylineTrailMaterialProperty } from "./material/PolylineTrailMaterialProperty";
import { SpriteLineMaterialProperty } from "./material/SpriteLineMaterialProperty";

export function setBackground(viewer, color) {
  // 设置背景颜色
  // 取消天空盒
  viewer.scene.skyBox.show = false;
  // 设置背景颜色
  viewer.scene.backgroundColor = color;
}

export function setSingleImage(viewer, imgUrl) {
  // 设置单张顶级图像
  const image = new Cesium.SingleTileImageryProvider({
    url: imgUrl,
    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
  });
  let laryer = viewer.imageryLayers.addImageryProvider(image);
  // 设置图层透明度
  laryer.alpha = 0.5;
}

export function goFlyDestination(viewer) {
  // 位置
  let position = Cesium.Cartesian3.fromDegrees(113.94, 22.5, 2000);

  // 设置前往的位置
  viewer.camera.flyTo({
    destination: position,
    // 视角

    duration: 2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-30),
      roll: 0.0,
    },
    complete: function () {
      // 在相机移动完成后执行
      console.log("已抵达深圳南山");
    },
  });
}

// 添加光锥
export function addConeModel(viewer, modelUrl) {
  let params = {
    height: 400,
    degress: 0,
  };
  // 设置模型的位置矩阵
  let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
    // 设置模型的位置
    Cesium.Cartesian3.fromDegrees(113.93, 22.53, params.height),
    // 设置模型的旋转情况
    new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(params.degress),
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0)
    )
  );
  console.log(modelMatrix);
  // 添加光锥模型
  let model = viewer.scene.primitives.add(
    Cesium.Model.fromGltf({
      url: "./assets/model/pyramid.glb",
      show: true, // default
      modelMatrix: modelMatrix, 
      scale: 200.0, // double size设置模型缩放比例
      minimumPixelSize: 12, // never smaller than 128 pixels最小的比例
      maximumScale: 20000, // never larger than 20000 * model size (overrides minimumPixelSize)
      allowPicking: false, // not pickable
      debugShowBoundingVolume: false, // default
      debugWireframe: false,
      color: Cesium.Color.YELLOW,
      colorBlendMode: Cesium.ColorBlendMode.MIX,
    })
  );
  // 光锥运动
  gsap.to(params, {
    height: 600,
    degress: 180,
    yoyo: true,
    repeat: -0.7,
    duration: 1,
    ease: "power2.inOut",
    onUpdate: () => {
      model.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        Cesium.Cartesian3.fromDegrees(113.93, 22.53, params.height),
        new Cesium.HeadingPitchRoll(
          Cesium.Math.toRadians(params.degress),
          Cesium.Math.toRadians(0),
          Cesium.Math.toRadians(0)
        )
      );
    },
  });
  console.log(model);
}

// 上升飞线效果
export function addFlightLine(viewer, data) {
  // 线特效的参数获取
  let setupParams = JSON.parse(data.setup_param);
  // 获取区域的经纬度
  let bbox = [
    setupParams.startPoint_lng,
    setupParams.startPoint_lat,
    setupParams.endPoint_ing,
    setupParams.endPoint_lat,
  ];
  let color = setupParams.color;
  let width = data.width;
  let height = setupParams.height;
  let speed = setupParams.speed;
  let percent = setupParams.percent;
  let gradient = setupParams.gradient;
  let random = setupParams.random;

  // turf生成随机点
  let points = turf.randomPoint(random, {
    bbox: bbox,
  });
  // console.log(points);
  // 通过生成的随机点生成线特效
  let features = points.features;
  features.forEach((item) => {
    // 获取点的经纬度
    let point = item.geometry.coordinates;
    // 根据点设置起始位置
    let startPosition = Cesium.Cartesian3.fromDegrees(point[0], point[1], 0);
    // 根据点设置结束位置
    let endPosition = Cesium.Cartesian3.fromDegrees(
      point[0],
      point[1],
      height * 2 * Math.random()
    );

    // 创建线
    let flyLine = viewer.entities.add({
      polyline: {
        positions: [startPosition, endPosition],
        width: width,
        // material: Cesium.Color.fromCssColorString(color),
        material: new PolylineTrailMaterialProperty(),
      },
    });
  });
}

// 道路汽车行驶轨迹线效果
export function addRoadLine(viewer, data) {
  // 线特效的参数获取
  let setupParams = JSON.parse(data.setup_param);
  let url = data.geojsonfile;
  // 加载geojson文件
  let promise = Cesium.GeoJsonDataSource.load(url);
  promise.then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    console.log(dataSource);
    let entities = dataSource.entities.values;
    console.log(entities);
    // 行驶轨迹线shader
    let material = new SpriteLineMaterialProperty();
    console.log(material);
    entities.forEach((item) => {
      item.polyline.width = data.width;
      item.polyline.material = material;
    });
  });
}