## 物体的形变

[BufferGeometry](https://threejs.org/docs/index.html?q=buffer#api/zh/core/BufferGeometry)

.morphAttributes 
存储 BufferAttribute 的 Hashmap，存储了几何体 morph targets 的细节信息。


.morphTargetsRelative 
用于控制变形目标的行为；当设置为true时，变形目标数据被视为相对偏移，而不是绝对位置/法线。默认为false


[Mesh](https://threejs.org/docs/index.html?q=mesh#api/zh/objects/Mesh)

.updateMorphTargets () : undefined
更新morphTargets，使其不对对象产生影响，重置morphTargetInfluences and morphTargetDictionary属性。

[三维物体（Object3D）](https://threejs.org/docs/index.html?q=Object#api/zh/core/Object3D)

.traverse ( callback : Function ) : undefined
callback - 以一个object3D对象作为第一个参数的函数。

在对象以及后代中执行的回调函数。

![flower](../assets/three_js/flower.png)

| File   | Target                                      |
| ------ | ------------------------------------------- |
| src/main/main | 实现花苗生长到花开效果  |
| src/main/main02 | 变形动画原理与实现  |