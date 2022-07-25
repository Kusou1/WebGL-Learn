

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
varying float vImgIndex;
varying vec3 vColor;
void main(){
    
    // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);

    // 设置渐变圆
    // float strength = distance(gl_PointCoord,vec2(0.5));
    // strength*=2.0;
    // strength = 1.0-strength;
    // gl_FragColor = vec4(strength);

    // 圆形点
    // float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
    // strength = step(0.5,strength);
    // gl_FragColor = vec4(strength);

    // 根据纹理设置图案
    // vec4 textureColor = texture2D(uTexture,gl_PointCoord);
    // 采样rgb三种颜色
    // gl_FragColor = vec4(textureColor.rgb,textureColor.r) ;
   
    vec4 textureColor;
    if(vImgIndex==0.0){
       textureColor = texture2D(uTexture,gl_PointCoord);
    }else if(vImgIndex==1.0){
       textureColor = texture2D(uTexture1,gl_PointCoord);
    }else{
       textureColor = texture2D(uTexture2,gl_PointCoord);
    }
    
    // gl_PointCoord内置变量也是vec2类型，同样表示像素的坐标，
    // 但是与gl_FragCoord不同的是，gl_FragCoord是按照整个canvas算的x值从0,宽度，y值是从0,高度。
    // 而gl_PointCoord是在点渲染模式中生效的，而它的范围是对应小正方形面，同样是左上角0,0到右下角1,1。

    gl_FragColor = vec4(vColor,textureColor.r) ;
    

}