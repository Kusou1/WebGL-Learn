varying vec2 vUv;


// highp -2^16-2^16
// mediump = -2^10-2^10
// lowp -2^8-2^8
precision lowp float;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    vUv=uv;
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    

}

