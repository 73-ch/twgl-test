precision mediump float;
uniform vec2 resolution;
void main(){
    vec2 p = gl_FragCoord.xy / resolution;
    gl_FragColor = vec4(p, 0.0, 0.0);
}