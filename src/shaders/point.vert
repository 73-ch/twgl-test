attribute float index;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float pointScale;
varying vec2 vpos;
void main(){
    vec2 p = vec2(mod(index, resolution.x) / resolution.x, floor(index / resolution.x) / resolution.y);
    vec4 t = texture2D(texture, p);
    gl_Position  = vec4(t.xy*2.-1., 0.0, 1.0);
    gl_PointSize = 0.2 + pointScale;
    vpos = p;
}