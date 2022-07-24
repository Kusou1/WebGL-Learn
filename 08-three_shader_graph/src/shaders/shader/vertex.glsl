#define GLSLIFY 1
// attribute vec3 position;
// uniform vec4 modelMatrix;
void main(){
    gl_Position =  projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}