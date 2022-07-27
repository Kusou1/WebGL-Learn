import * as THREE from "three";
import gsap from "gsap";
import vertex from "@/shader/lightWall/vertex.glsl";
import fragment from "@/shader/lightWall/fragment.glsl";

export default class LightWall {
  constructor(
    radius = 5,
    length = 2,
    position = { x: 0, z: 0 },
    color = 0xff0000
  ) {
    // CylinderGeometry 圆柱几何体
    this.geometry = new THREE.CylinderBufferGeometry(
      radius, //  圆柱的顶部半径
      radius, // 圆柱的底部半径
      2, // 圆柱的高度
      32, // 圆柱侧面周围的分段数
      1, // 圆柱侧面沿着其高度的分段数
      true // 该圆锥的底面是开放的还是封顶的
    );
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true, // 透明
      side: THREE.DoubleSide, // 两面都看得到
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, 1, position.z);
    this.mesh.geometry.computeBoundingBox();
    //   console.log(mesh.geometry.boundingBox);

    let { min, max } = this.mesh.geometry.boundingBox;
    //   获取物体的高度差
    let uHeight = max.y - min.y;
    this.material.uniforms.uHeight = {
      value: uHeight,
    };

    // 光墙动画
    gsap.to(this.mesh.scale, {
      x: length,
      z: length,
      duration: 1,
      repeat: -1,
      yoyo: true,
    });
  }

  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
