

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
    // gl_FragColor = vec4(textureColor.rgb,textureColor.r) ;
    vec4 textureColor;
    if(vImgIndex==0.0){
       textureColor = texture2D(uTexture,gl_PointCoord);
    }else if(vImgIndex==1.0){
       textureColor = texture2D(uTexture1,gl_PointCoord);
    }else{
       textureColor = texture2D(uTexture2,gl_PointCoord);
    }
    

    gl_FragColor = vec4(vColor,textureColor.r) ;
    

}