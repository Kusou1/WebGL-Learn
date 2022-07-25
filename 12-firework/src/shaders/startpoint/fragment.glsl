
uniform vec3 uColor;
void main(){
    float distanceToCenter = distance(gl_PointCoord,vec2(0.5));
    float strength = distanceToCenter*2.0;
    strength = 1.0-strength;
    strength = pow(strength,1.5);
    // 将传进来的颜色给到着色器
    gl_FragColor = vec4(uColor,strength);
}