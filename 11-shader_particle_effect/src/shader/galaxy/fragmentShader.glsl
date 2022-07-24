varying vec2 vUv;
varying vec3 vColor;
void main(){
    // 点的像素坐标,二维，设置颜色
    // gl_FragColor = vec4(gl_PointCoord,0.0,1.0);

    // 设置圆形点
    // float strength = 1.0-distance(gl_PointCoord,vec2(0.5));
    // strength = step(0.5,strength);
    // gl_FragColor = vec4(strength,strength,strength,strength);


    // 设置渐变圆
    // float strength = distance(gl_PointCoord,vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0-strength;
    // strength = pow(strength,1.5);
    // gl_FragColor = vec4(strength,strength,strength,strength);



    // 将顶点颜色混入进来
    float strength = distance(gl_PointCoord,vec2(0.5));
    strength *= 2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);

    vec3 mixColor = mix(vec3(0.0),vColor,strength);
    gl_FragColor = vec4(mixColor,strength);
    

}