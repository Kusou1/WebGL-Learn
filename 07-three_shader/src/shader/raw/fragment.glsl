precision lowp float;
// 接收顶点着色器传过来的参数
varying vec2 vUv; 
varying float vElevation;

// sampler2D采样
uniform sampler2D uTexture; 


void main(){
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // float height = vElevation + 0.05 * 10.0;
    // gl_FragColor = vec4(1.0*height,0.0, 0.0, 1.0);

    // 根据UV,取出对应的颜色
    float height = vElevation + 0.05 * 20.0;
    // 根据vUv进行采样
    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb*=height;
    gl_FragColor = textureColor;
}