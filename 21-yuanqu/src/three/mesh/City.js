import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import eventHub from "@/utils/eventHub";
import cameraModule from "../camera";

export default class City {
  constructor(scene) {
    // 载入模型
    this.scene = scene;
    this.loader = new GLTFLoader();
    // 解压缩模型
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(dracoLoader);
    this.loader.load("./model/city4.glb", (gltf) => {
      console.log(gltf);
      scene.add(gltf.scene);

      // 场景子元素遍历
      this.gltf = gltf;
      gltf.scene.traverse((child) => {
        if (child.name === "热气球") {
          // console.log(child);
          // 传入混合器播放的动画所属的对象
          this.mixer = new THREE.AnimationMixer(child);
          // 把动作的片段拿出来
          this.clip = gltf.animations[1];
          this.action = this.mixer.clipAction(this.clip);
          this.action.play();
        }

        if (child.name === "汽车园区轨迹") {
          // console.log(child);
          const line = child;
          line.visible = false;
          // 根据点创建曲线
          const points = [];
          for (
            let i = line.geometry.attributes.position.count - 1;
            i >= 0;
            i--
          ) {
            // 获取三个点的坐标
            points.push(
              new THREE.Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i)
              )
            );
          }

          // 创建曲线
          this.curve = new THREE.CatmullRomCurve3(points);
          this.curveProgress = 0;
          // 汽车跟着曲线做运动
          this.carAnimation();
        }

        if (child.name === "redcar") {
          console.log(child);
          this.redcar = child;
        }
      });

      gltf.cameras.forEach((camera) => {
        // scene.add(camera);
        cameraModule.add(camera.name, camera);
      });
    });

    // 切换热气球动画
    eventHub.on("actionClick", (i) => {
      console.log(i);
      this.action.reset();
      this.clip = this.gltf.animations[i];
      this.action = this.mixer.clipAction(this.clip);
      this.action.play();
    });
  }

  update(time) {
    // 如果这个有值，则更新动画
    if (this.mixer) {
      this.mixer.update(time);
    }
  }

  carAnimation() {
    gsap.to(this, {
      curveProgress: 0.999,
      duration: 20,
      repeat: -1,
      onUpdate: () => {
        // getPoint接收参数必须在[0,1]范围内，返回曲线上给的位置的点
        const point = this.curve.getPoint(this.curveProgress);
        this.redcar.position.set(point.x, point.y, point.z);
        if (this.curveProgress + 0.001 < 1) {
          const point = this.curve.getPoint(this.curveProgress + 0.001);
          // 车头朝向下一个点的方向
          this.redcar.lookAt(point);
        }
      },
    });
  }
}
