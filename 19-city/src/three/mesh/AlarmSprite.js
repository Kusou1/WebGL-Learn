import * as THREE from "three";
import camera from "../camera";

export default class AlarmSprite {
  constructor(type = "火警", position = { x: -1.8, z: 3 }, color = 0xffffff) {
    const textureLoader = new THREE.TextureLoader();
    const typeObj = {
      火警: "./textures/tag/fire.png",
      治安: "./textures/tag/jingcha.png",
      电力: "./textures/tag/e.png",
    };

    const map = textureLoader.load(typeObj[type]);
    this.material = new THREE.SpriteMaterial({
      map: map,
      color: color,
      // blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
    });

    this.mesh = new THREE.Sprite(this.material);

    // 设置位置
    this.mesh.position.set(position.x, 3.5, position.z);

    // 封装点击事件
    this.fns = [];

    // 创建射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 事件的监听
    window.addEventListener("click", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

      this.raycaster.setFromCamera(this.mouse, camera);

      event.mesh = this.mesh;
      event.alarm = this;

      const intersects = this.raycaster.intersectObject(this.mesh);
      if (intersects.length > 0) {
        this.fns.forEach((fn) => {
          fn(event);
        });
      }
    });
  }
  onClick(fn) {
    this.fns.push(fn);
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
