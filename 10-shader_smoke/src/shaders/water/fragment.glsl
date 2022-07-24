precision lowp float;

uniform vec3 uHighColor;
uniform vec3 uLowColor;
varying float vElevation;
uniform float uOpacity;

void main(){
    float a = (vElevation+1.0)/2.0;
    vec3 color = mix(uLowColor,uHighColor,a);
    gl_FragColor = vec4(color,uOpacity);
}