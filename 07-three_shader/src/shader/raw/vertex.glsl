// precision lowp float用来确定默认精度
// 在GLSL中只有三种精度限定符：

// lowp:低精度
// mediump:中精度
// highp:高精度

// 精度范围
// 对于浮点型变量的精度范围
// highp (-2的62次方, 2的62次方); 
// mediump (-2的14次方, 2的14次方);
// lowp (-2,2);
// 对于整型变量的精度范围
// highp (-2的16次方, 2的16次方);
//  mediump (-2的10次方, 2的10次方); 
// lowp (-2的8次方, 2的8次方);

precision lowp float; 
attribute vec3 position; // 接收数据
attribute vec2 uv;

// mat4四维矩阵
uniform mat4 modelMatrix; // 模型矩阵
uniform mat4 viewMatrix; // 视图矩阵
uniform mat4 projectionMatrix;

// 获取，接收时间
uniform float uTime;


// 传给片元着色器用varying定义
// vec2二维向量
varying vec2 vUv;

// highp  -2^16 - 2^16
// mediump -2^10 - 2^10
// lowp -2^8 - 2^8

varying float vElevation; 


void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    // modelPosition.x += 1.0;
    // modelPosition.z += 1.0;

    // modelPosition.z += modelPosition.x;

    // 波浪形状实现，通过时间让他动起来
    modelPosition.z = sin((modelPosition.x+uTime) * 10.0)*0.05 ;
    modelPosition.z += sin((modelPosition.y+uTime)  * 10.0)*0.05 ;
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition ;
}