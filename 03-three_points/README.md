threejs Point 精通粒子特效

yarn && yarn dev


[点（Points）](https://threejs.org/docs/?q=Point#api/zh/objects/Points)
[颜色(color)](https://threejs.org/docs/?q=Color#api/zh/math/Color)
颜色收敛 .lerp ( color : Color, alpha : Float ) : this
color - 用于收敛的颜色。
alpha - 介于0到1的数字。

将该颜色的RGB值线性插值到传入参数的RGB值。alpha参数可以被认为是两种颜色之间的比例值，其中0是当前颜色和1.0是第一个参数的颜色。

[素材(https://www.kenney.nl/assets)](https://www.kenney.nl/assets)
[iconfont](https://www.iconfont.cn/)


| File   | Target                                      |
| ------ | ------------------------------------------- |
| main01 | [认识pointes](https://threejs.org/docs/?q=Point#api/zh/objects/Points)                   |
| main02 | 使用pointes设置随机顶点打造星河                      |
| main03 | 设置漫天的雪花        |
| main04 | 运用数学知识设计特定形状的星系          |