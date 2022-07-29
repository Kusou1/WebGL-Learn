import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import cameraModule from "./camera";
import rendererModule from "./renderer";
import eventHub from "@/utils/eventHub";

// 初始化控制器;
const controls = new OrbitControls(
  // 设置启用相机模块里的活动相机
  cameraModule.activeCamera,
  rendererModule.renderer.domElement
);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转;
// controls.autoRotate = true;

class ControlModule {
  constructor() {
    this.controls = controls;
    eventHub.on("toggleControls", (controlsName) => {
      this.setControls(controlsName);
    });
  }
  setControls(controlsName) {
    this[`set${controlsName}Controls`]();
  }
  setOrbitControls() {
    this.controls.dispose();
    this.controls = new OrbitControls(
      // 设置启用相机模块里的活动相机
      cameraModule.activeCamera,
      renderer.domElement
    );
  }
  setFlyControls() {
    this.controls = new FlyControls(
      // 设置启用相机模块里的活动相机
      cameraModule.activeCamera,
      renderer.domElement
    );
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
  }
  setFirstPersonControls() {
    this.controls = new FirstPersonControls(
      // 设置启用相机模块里的活动相机
      cameraModule.activeCamera,
      renderer.domElement
    );
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
  }
}

export default new ControlModule();
