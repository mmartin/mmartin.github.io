precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_mouse_trail;
uniform float u_time;

float count = 69.0;

vec2 downscaled_center;
vec2 downscaled_mouse;

vec2 downscale(in vec2 pos) {
    if (u_resolution.x > u_resolution.y) {
        pos.x /= 1. + mod(u_resolution.x, u_resolution.y / count) / u_resolution.x * 1.1;
        pos.x *= u_resolution.x / u_resolution.y;
    } else {
        pos.y /= 1. + mod(u_resolution.y, u_resolution.x / count) / u_resolution.y * 1.1;
        pos.y *= u_resolution.y / u_resolution.x;
    }
    return floor(pos / u_resolution * count);
}

float random(in vec2 pos) {
    if (downscaled_mouse == pos) {
        return 0.;
    } else if (downscaled_center == pos) {
        return 1.;
    } else {
        return fract(
            sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453123
                + fract(-u_time * (distance(downscaled_center, pos)) / count * 3.)
        );
    }
}

void main() {
    downscaled_center = downscale(u_resolution / 2.);
    downscaled_mouse = downscale(u_mouse);
    vec2 mouse_distance_from_center = u_resolution / count * vec2(u_mouse_trail / u_resolution - 0.5);
    vec2 pos = gl_FragCoord.xy;
    vec3 color = vec3(
            random(downscale(pos - floor(6. * mouse_distance_from_center))),
            random(downscale(pos - floor(3. * mouse_distance_from_center))),
            random(downscale(pos))
        );
    gl_FragColor = vec4(color, 1.);
}
