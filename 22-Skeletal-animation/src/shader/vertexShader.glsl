varying vec2 vUv;
void main(){
    gl_Position=  projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
    vUv = uv;
}