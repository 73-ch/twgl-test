precision mediump float;

uniform vec2 resolution;
uniform float time;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    float color = 0.0;
    gl_FragColor = vec4(0.3, 0.8, 1.0,1.0);
}