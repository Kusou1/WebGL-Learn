import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import gsap from "gsap";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import cameraModule from "../camera";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import eventHub from "@/utils/eventHub";
import { ShaderMaterial } from "three";
import fragmentShader from "@/shader/fighter/fragmentShader.glsl";
import vertexShader from "@/shader/fighter/vertexShader.glsl";

export default class City {
  constructor(scene) {
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    dracoLoader.setDecoderConfig({ type: "js" });
    dracoLoader.preload();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.scene = scene;
    this.floor1Group;
    this.floor2Group;
    this.wallGroup;
    this.floor2Tags = [];
    gltfLoader.load("./model/floor2.glb", (gltf) => {
      console.log(gltf);
      this.floor2Group = gltf.scene;

      let array = ["小型会议室", "核心科技室", "科技展台", "设计总监办公室"];
      // 判断子元素是否是物体
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 15;
          // child.receiveShadow = true;
          // child.castShadow = true;
        }
        if (array.indexOf(child.name) != -1) {
          // console.log("小型会议室", child);
          const css3dObject = this.createTag(child);
          css3dObject.visible = false;
          this.floor2Tags.push(css3dObject);
          this.floor2Group.add(css3dObject);
        }
      });
      this.floor2Group.visible = false;

      scene.add(this.floor2Group);
    });

    gltfLoader.load("./model/floor1.glb", (gltf) => {
      console.log(gltf);
      this.floor1Group = gltf.scene;

      // 判断子元素是否是物体
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 5;
          // child.receiveShadow = true;
          // child.castShadow = true;
        }
      });
      this.floor1Group.visible = false;
      scene.add(gltf.scene);
    });

    gltfLoader.load("./model/wall.glb", (gltf) => {
      console.log(gltf);
      scene.add(gltf.scene);
      this.wallGroup = gltf.scene;
    });

    gltfLoader.load("./model/Fighter1.glb", (gltf) => {
      console.log(gltf);

      this.fighterGroup = gltf.scene;

      this.fighterGroup.visible = false;
      scene.add(this.fighterGroup);
      this.fighterGroup.position.set(3, 42, 68);
      this.fighterGroup.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          child.material.emissiveIntensity = 15;
          child.position2 = child.position.clone();
        }
      });
      this.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();
      // 事件监听
      window.addEventListener("click", (event) => {
        //   console.log(event);
        //   对时间对象进行加工
        event.mesh = this;
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

        //通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera(this.mouse, cameraModule.activeCamera);

        //进行检测
        const intersects = this.raycaster.intersectObject(this.fighterGroup);
        //   console.log(intersects);
        if (intersects.length > 0) {
          //   真正触发精灵的点击事件
          console.log("点击了战斗机");
          if (this.floor2Group.visible) {
            this.floor2Group.visible = false;
            this.floor2Tags.forEach((tag) => {
              tag.visible = false;
            });
          } else {
            this.floor2Group.visible = true;
            this.floor2Tags.forEach((tag) => {
              tag.visible = true;
            });
          }
        }
      });

      this.showFighter();
    });

    this.initEvent();
  }

  update(time) {
    if (this.mixer) {
      // console.log(time);
      this.mixer.update(time);
    }
  }

  createTag(object3d) {
    // 创建各个区域的元素
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
      <div class="elementContent">
        <h3>${object3d.name}</h3>
        <p>温度：26℃</p>
        <p>湿度：50%</p>
      </div>
    `;

    const objectCSS3D = new CSS3DObject(element);
    objectCSS3D.position.copy(object3d.position);
    objectCSS3D.scale.set(0.2, 0.2, 0.2);
    return objectCSS3D;
    // scene.add(objectCSS3D);
  }

  showFloor1() {
    this.floor1Group.visible = true;
  }
  showFloor2() {
    this.floor2Group.visible = true;
    this.fighterGroup.visible = true;
    this.floor2Tags.forEach((tag) => {
      tag.visible = true;
    });
  }

  hideFloor1() {
    this.floor1Group.visible = false;
  }
  hideFloor2() {
    this.floor2Group.visible = false;
    this.fighterGroup.visible = false;
    this.floor2Tags.forEach((tag) => {
      tag.visible = false;
    });
  }

  hideWall() {
    this.wallGroup.visible = false;
  }
  showWall() {
    this.wallGroup.visible = true;
  }
  initEvent() {
    eventHub.on("showFloor1", () => {
      this.showFloor1();
      this.hideWall();
      this.hideFloor2();
    });
    eventHub.on("showFloor2", () => {
      this.showFloor2();
      this.hideWall();
      this.hideFloor1();
    });
    eventHub.on("showWall", () => {
      this.showWall();
      this.hideFloor1();
      this.hideFloor2();
    });
    eventHub.on("showAll", () => {
      this.showFloor1();
      this.showFloor2();
      this.showWall();
      gsap.to(this.wallGroup.position, {
        y: 200,
        duration: 1,
      });
      gsap.to(this.floor2Group.position, {
        y: 50,
        duration: 1,
        delay: 1,
      });
    });

    eventHub.on("hideAll", () => {
      console.log("hideall");
      // this.hideWall();
      gsap.to(this.wallGroup.position, {
        y: 0,
        duration: 1,
        delay: 1,
        onComplete: () => {
          this.hideFloor1();
          this.hideFloor2();
        },
      });
      gsap.to(this.floor2Group.position, {
        y: 0,
        duration: 1,
      });
    });

    eventHub.on("flatFighter", () => {
      // console.log(this.fighterGroup);
      // 将飞机展成立方体
      // 获取立方体点的位置
      const positions = [];
      for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
          positions.push(new THREE.Vector3(i * 2 - 2, j * 2 - 2, 0));
        }
      }

      let n = 0;
      this.fighterGroup.traverse((child) => {
        if (child.isMesh) {
          // console.log(child);
          // child.position.copy(positions[n].multiplyScalar(20));
          positions[n].multiplyScalar(10);

          gsap.to(child.position, {
            x: "+=" + positions[n].x,
            y: "+=" + positions[n].y,
            z: "+=" + positions[n].z,
            duration: 1,
          });
          n++;
        }
      });

      console.log(positions);
    });

    eventHub.on("recoverFighter", () => {
      this.fighterGroup.traverse((child) => {
        if (child.isMesh) {
          gsap.to(child.position, {
            x: child.position2.x,
            y: child.position2.y,
            z: child.position2.z,
            duration: 1,
          });
        }
      });
    });

    eventHub.on("pointsFighter", () => {
      this.createPoints(this.fighterGroup);
    });

    eventHub.on("pointsBlast", () => {
      this.pointsBlast();
    });

    eventHub.on("pointsBack", () => {
      this.pointsBack();
    });
  }
  showFighter() {
    this.floor1Group && (this.floor1Group.visible = false);
    this.floor2Group && (this.floor2Group.visible = false);
    this.wallGroup && (this.wallGroup.visible = false);
    this.fighterGroup.visible = true;
  }
  createPoints(object3d) {
    if (!this.fighterPointsGroup) {
      this.fighterPointsGroup = this.transformPoints(object3d);
      this.scene.add(this.fighterPointsGroup);
    }
  }

  transformPoints(object3d) {
    // 创建纹理图像
    const texture = new THREE.TextureLoader().load("./assets/particles/1.png");
    const group = new THREE.Group();

    function createPoints(object3d, newObject3d) {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child) => {
          if (child.isMesh) {
            // 随机生成颜色
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random()
            );
            // const material = new THREE.PointsMaterial({
            //   size: 0.1,
            //   color: color,
            //   map: texture,
            //   blending: THREE.AdditiveBlending,
            //   transparent: true,
            //   depthTest: false,
            // });

            const material = new THREE.ShaderMaterial({
              uniforms: {
                uColor: { value: color },
                uTexture: { value: texture },
                uTime: {
                  value: 0,
                },
              },
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthTest: false,
            });
            const points = new THREE.Points(child.geometry, material);
            points.position.copy(child.position);
            points.rotation.copy(child.rotation);
            points.scale.copy(child.scale);
            newObject3d.add(points);
            createPoints(child, points);
          }
        });
      }
    }

    createPoints(object3d, group);
    // object3d.traverse((child) => {
    //   if (child.isMesh) {
    //     const points = child.geometry.attributes.position.array;
    //     const geometry = new THREE.BufferGeometry();
    //     geometry.setAttribute(
    //       "position",
    //       new THREE.Float32BufferAttribute(points, 3)
    //     );

    //     // 随机生成颜色
    //     const color = new THREE.Color(
    //       Math.random(),
    //       Math.random(),
    //       Math.random()
    //     );
    //     const material = new THREE.PointsMaterial({
    //       size: 0.1,
    //       color: color,
    //     });
    //     const pointsMesh = new THREE.Points(geometry, material);
    //     pointsMesh.position.copy(child.position);
    //     pointsMesh.rotation.copy(child.rotation);
    //     pointsMesh.scale.copy(child.scale);
    //     group.add(pointsMesh);
    //   }
    // });
    return group;
  }

  pointsBlast() {
    this.fighterPointsGroup.traverse((child) => {
      if (child.isPoints) {
        let randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3
        );
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
        }

        child.geometry.setAttribute(
          "aPosition",
          new THREE.BufferAttribute(randomPositionArray, 3)
        );

        gsap.to(child.material.uniforms.uTime, {
          value: 10,
          duration: 10,
        });
      }
    });
  }

  pointsBack() {
    this.fighterPointsGroup.traverse((child) => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime, {
          value: 0,
          duration: 10,
        });
      }
    });
  }
}
