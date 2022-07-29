uniform sampler2D uTexture;
uniform vec3 uColor;
void main(){
    vec4 uTextureColor = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = vec4(uColor, uTextureColor.x);
}