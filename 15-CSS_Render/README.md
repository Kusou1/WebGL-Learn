## HTML混合3D渲染

[三维向量（Vector3）](https://threejs.org/docs/index.html?q=vect#api/zh/math/Vector3)

.project ( camera : Camera ) : this
camera — 在投影中使用的摄像机。

将此向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。

[光线投射Raycaster](https://threejs.org/docs/index.html?q=ray#api/zh/core/Raycaster)
.setFromCamera ( coords : Vector2, camera : Camera ) : undefined
coords —— 在标准化设备坐标中鼠标的二维坐标 —— X分量与Y分量应当在-1到1之间。
camera —— 射线所来源的摄像机。

使用一个新的原点和方向来更新射线。

