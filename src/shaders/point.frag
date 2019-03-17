precision mediump float;
varying vec2 vpos;
uniform vec4 ambient;
void main(){
    gl_FragColor = vec4(vpos, 0., 1.0);
//    gl_FragColor = ambient;
}