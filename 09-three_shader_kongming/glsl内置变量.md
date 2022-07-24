## 着色器材质内置变量

1. gl_PointSize：在点渲染模式中，控制方形点区域渲染像素大小（注意这里是像素大小，而不是three.js单位，因此在移动相机是，所看到该点在屏幕中的大小不变）
2. gl_Position：控制顶点选完的位置
3. gl_FragColor：片元的RGB颜色值
4. gl_FragCoord：片元的坐标，同样是以像素为单位
5. gl_PointCoord：在点渲染模式中，对应方形像素坐标

他们或者单个出现在着色器中，或者组团出现在着色器中，是着色器的灵魂。下面来分别说一说他们的意义和用法。

## 1. gl_PointSize

gl_PointSize内置变量是一个float类型，在点渲染模式中，顶点由于是一个点，理论上我们并无法看到，所以他是以一个正对着相机的正方形面表现的。使用内置变量gl_PointSize主要是用来设置顶点渲染出来的正方形面的相素大小（默认值是0）。

```javascript
void main() {
  gl_PointSize = 10.0；
}
```



## 2. gl_Position

gl_Position内置变量是一个vec4类型，它表示最终传入片元着色器片元化要使用的顶点位置坐标。vec4(x,y,z,1.0),前三个参数表示顶点的xyz坐标值，第四个参数是浮点数1.0。

```javascript
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
```



## 3. gl_FragColor

gl_FragColor内置变量是vec4类型，主要用来设置片元像素的颜色，它的前三个参数表示片元像素颜色值RGB，第四个参数是片元像素透明度A，1.0表示不透明,0.0表示完全透明。

```javascript
void main() {
	gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
```



## 4. gl_FragCoord

gl_FragCoord内置变量是vec2类型，它表示WebGL在canvas画布上渲染的所有片元或者说像素的坐标，坐标原点是canvas画布的左上角，x轴水平向右，y竖直向下，gl_FragCoord坐标的单位是像素，gl_FragCoord的值是vec2(x,y),通过gl_FragCoord.x、gl_FragCoord.y方式可以分别访问片元坐标的纵横坐标。



![img](https://ask.qcloudimg.com/raw/yehe-fbd3d4418/1c7yur1uvo.png?imageView2/2/w/1620)

下面我们举个例子

```javascript
fragmentShader: `
    void main() {
        if(gl_FragCoord.x < 600.0) {
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        } else {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        }
    }
`
```





![img](https://ask.qcloudimg.com/raw/yehe-fbd3d4418/27j8klsuig.png?imageView2/2/w/1620)

这里以600像素为分界，x值小于600像素的部分，材质被渲染成红色，大于的部分为黄色。

## 5. gl_PointCoord

gl_PointCoord内置变量也是vec2类型，同样表示像素的坐标，但是与gl_FragCoord不同的是，gl_FragCoord是按照整个canvas算的x值从0,宽度，y值是从0,高度。而gl_PointCoord是在点渲染模式中生效的，而它的范围是对应小正方形面，同样是左上角0,0到右下角1,1。

## 6. 内置变量练习

五个内置变量我们都大致的说了一遍，下面用一个小案例来试用一下除了gl_FragCoord的其他四个。先上图，在线案例请点击[着色器内置变量](http://three.mrguo.link/glsl6)。



![img](https://ask.qcloudimg.com/raw/yehe-fbd3d4418/oyq0b7a1mn.png?imageView2/2/w/1620)



```javascript
var planeGeom = new THREE.PlaneGeometry(1000, 1000, 100, 100);
uniforms = {
    time: {
        value: 0
    }
}
var planeMate = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader: `
				uniform float time;
        void main() {
            float y = sin(position.x / 50.0 + time) * 10.0 + sin(position.y / 50.0 + time) * 10.0;
            vec3 newPosition = vec3(position.x, position.y, y * 2.0 );
            gl_PointSize = (y + 20.0) / 4.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
    `,
    fragmentShader: `
        void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if(r < 0.5) {
                gl_FragColor = vec4(0.0,1.0,1.0,1.0);
            }
        }
    `
})
var planeMesh = new THREE.Points(planeGeom, planeMate);
planeMesh.rotation.x = - Math.PI / 2;
scene.add(planeMesh);
```



好了这篇就说到这了，再见。