varying vec2 vUv;
uniform sampler2D uTexture;
void main(){
    vec4 color = texture2D(uTexture, vUv*0.2);
    gl_FragColor = color;
}