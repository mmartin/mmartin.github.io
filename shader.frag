precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float scale = 33.0;
float size = 420.0;
vec2 center_crap;

vec2 downscale(in vec2 pos) {
    return floor(pos/size * scale) / scale;
}

float random(in vec2 pos) {
    return fract(
        sin(dot(pos, vec2(12.9898,78.233))) * 43758.5453123
        + fract(u_time * (1.0 - pow(length(center_crap - pos), 1.13)))
    );
}

void main() {
    center_crap = downscale(u_resolution/2.);
    vec2 pos = gl_FragCoord.xy - mod(u_resolution,  size) / 2.;
    vec2 mouse_delta = u_mouse == vec2(0.) ? vec2(0.) : 10.*size/scale*vec2(u_mouse/u_resolution-0.5);
    vec3 color = vec3(
        random(downscale(pos - 1.0*mouse_delta)),
        random(downscale(pos - 0.6*mouse_delta)),
        random(downscale(pos - 0.3*mouse_delta))
    );

    gl_FragColor = vec4(color, 1.);
}
