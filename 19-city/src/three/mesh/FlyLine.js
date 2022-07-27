import * as THREE from "three";
import gsap from "gsap";

export default class FlyLine {
  constructor() {
    // 通过点数组生成飞线
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 4, 0),
      new THREE.Vector3(10, 0, 10),
    ];
    // 1/创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    // 2/根据曲线生成管道几何体
    this.geometry = new THREE.TubeBufferGeometry(
      this.lineCurve,
      100, // 曲率
      0.4, // 管道宽度
      2, // 横截面
      false //闭不闭合
    );
    // 3/设置飞线材质
    // 创建纹理
    const textloader = new THREE.TextureLoader();
    this.texture = textloader.load("./textures/z_11.png");
    // 重复的设置 水平重复两次
    this.texture.repeat.set(1, 2);
    // 水平重复
    this.texture.wrapS = THREE.RepeatWrapping;
    // 镜像重复
    this.texture.wrapT = THREE.MirroredRepeatWrapping;

    this.material = new THREE.MeshBasicMaterial({
      // color: 0xfff000,
      map: this.texture,
      transparent: true,
    });

    // 4/创建飞线物体
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // 5/创建飞线的动画   纹理不断的去运动
    gsap.to(this.texture.offset, {
      x: -1,
      duration: 1,
      repeat: -1,
      ease: "none",
    });
  }
}
