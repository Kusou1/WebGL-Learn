void main(){
    // <投影矩阵> * <视图矩阵> * <模型矩阵> * <顶点坐标>
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ) ;
}