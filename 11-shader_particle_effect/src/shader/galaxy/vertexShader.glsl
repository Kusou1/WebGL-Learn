attribute float aScale;
varying vec2 vUv;
uniform float uTime;
// 获取顶点颜色传递给片元着色器
varying vec3 vColor;

void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    // 设置顶点旋转
    // 获取顶点的角度
    float angle = atan(modelPosition.x,modelPosition.z);
    // 获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    // 设置根据顶点到中心的距离，设置不同的旋转度数
    float angleOffset = 1.0/distanceToCenter*uTime;

    // 根据旋转的偏移值，旋转当前的点
    angle+=angleOffset;
    modelPosition.x = cos(angle)*distanceToCenter;
    modelPosition.z = sin(angle)*distanceToCenter;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position =  projectionMatrix * viewPosition;

    // 设置顶点大小
    gl_PointSize = 80.0*aScale/ -viewPosition.z;
    vUv=uv;
    vColor = color;
}