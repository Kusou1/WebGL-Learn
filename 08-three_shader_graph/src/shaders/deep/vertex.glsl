varying vec2 vUv;


// highp -2^16-2^16
// mediump = -2^10-2^10
// lowp -2^8-2^8
precision lowp float;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    // uv自动是会获取到的，相当于属性，position也是会自己获取到
    // 表示当前自己的二维向量，传给片元着色器来决定这个点要显示什么东西
    vUv=uv;
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    

}

