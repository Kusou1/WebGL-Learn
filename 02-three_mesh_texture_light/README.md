mesh 全面认识three.js几何体与材质

几何体
[立方缓冲几何体（BoxGeometry）](https://threejs.org/docs/#api/zh/geometries/BoxGeometry)
[圆形缓冲几何体（CircleGeometry）](https://threejs.org/docs/?q=geometry#api/zh/geometries/CircleGeometry)
其他几何体详见doc

材质
[基础网格材质(MeshBasicMaterial)](https://threejs.org/docs/#api/zh/materials/MeshBasicMaterial)

[纹理(Texture)](https://threejs.org/docs/?q=Text#api/zh/textures/Texture)
[纹理加载器(TextureLoader)](https://threejs.org/docs/?q=TextureLoader#api/zh/loaders/TextureLoader)



[什么是PBR](https://zhuanlan.zhihu.com/p/342484575)

[什么是HDR](https://www.zhihu.com/question/19774840)
[纹理常量（Texture Constants）](https://threejs.org/docs/?q=texture#api/zh/constants/Textures)


[平行光（DirectionalLight）](https://threejs.org/docs/?q=Dire#api/zh/lights/DirectionalLight)
[聚光灯（SpotLight）](https://threejs.org/docs/?q=spot#api/zh/lights/SpotLight)
[点光源（PointLight）](https://threejs.org/docs/#api/zh/lights/PointLight)
[平行光阴影 (DirectionalLightShadow)](https://threejs.org/docs/#api/zh/lights/shadows/DirectionalLightShadow)


获取纹理材质
- https://www.poliigon.com/textures
- arroway-textures.ch
- https://quixel.com/bridge

.displacementMap : Texture
位移贴图会影响网格顶点的位置，与仅影响材质的光照和阴影的其他贴图不同，
移位的顶点可以投射阴影，阻挡其他对象， 以及充当真实的几何体。
位移纹理是指：网格的所有顶点被映射为图像中每个像素的值（白色是最高的），并且被重定位。
.roughness : Float
材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。

.roughnessMap : Texture
该纹理的绿色通道用于改变材质的粗糙度。

.metalness : Float
材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘。

.metalnessMap : Texture
该纹理的蓝色通道用于改变材质的金属度。

.normalMap : Texture
用于创建法线贴图的纹理。RGB值会影响每个像素片段的曲面法线，并更改颜色照亮的方式。法线贴图不会改变曲面的实际形状，只会改变光照。 In case the material has a normal map authored using the left handed convention, the y component of normalScale should be negated to compensate for the different handedness.

.normalMapType : Integer
法线贴图的类型。

选项为THREE.TangentSpaceNormalMap（默认）和THREE.ObjectSpaceNormalMap。

.normalScale : Vector2
法线贴图对材质的影响程度。典型范围是0-1。默认值是Vector2设置为（1,1）。

| File   | Target                                      |
| ------ | ------------------------------------------- |
| main01 | (BufferGeometry)[https://threejs.org/docs/?q=BufferGeometry#api/zh/core/BufferGeometry]                 |
| main02 | 打造酷炫的三角形                        |
| main03 | [基础材质与纹理](https://threejs.org/docs/#api/zh/materials/MeshBasicMaterial)                           |
| main04 | 纹理常用属性                              |
| main05 | 纹理显示的算法与mipmap |
| main06 | 纹理显示的算法与mipmap                    |
| main07 | 透明纹理 alphaMap                    |
| main08 | AO环境遮挡贴图              |
| main09 | [标准网格材质(MeshStandardMaterial) ](https://threejs.org/docs/?q=MeshStandardMaterial#api/zh/materials/MeshStandardMaterial) （基于PBR）                          |
| main10   | 粗糙度与粗糙度贴图/金属贴图、法线贴图               |
| main11   | 纹理加载的进度              |
| main12   | 设置环境纹理 [CubeTextureLoader](https://threejs.org/docs/?q=CubeTextureLoader#api/zh/loaders/CubeTextureLoader)   |
| main13   | 加载hdr环境图 [RGBELoader](https://threejs.org/docs/?q=DataTexture#api/zh/loaders/DataTextureLoader)|
| main14   | 灯光与阴影的关系与设置  |
| main15   | [阴影的属性与投影相机原理](https://threejs.org/docs/#api/zh/lights/shadows/DirectionalLightShadow)  |
| main16   | [聚光灯（SpotLight）](https://threejs.org/docs/?q=spot#api/zh/lights/SpotLight)  |
| main16   | [点光源（PointLight）](https://threejs.org/docs/#api/zh/lights/PointLight)  |










