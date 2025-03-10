precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse_trail;
uniform float u_time;

float count = 6.9;

float hyp = distance(vec2(0.), u_resolution / 2.);

float func(in vec2 pos) {
    float d = distance(pos, u_resolution / 2.);
    float band = d / hyp * count;
    float n = floor(band);
    float gradient = smoothstep(0.0, 1.0, fract(band));

    if (n == 0.) {
        return pow(gradient, 5.);
    }
    return mod(n, 2.) == 0. ? gradient : 1. - gradient;
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 6

float fbm(in vec2 _st) {
    float v = 0.0;
    float a = 2.0;
    float mouse_distance = distance(gl_FragCoord.xy, u_mouse_trail);
    a += mouse_distance < 150. ? 1. - mouse_distance / 150. : 0.;

    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));

    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.;
        a *= 0.5;
    }

    return v;
}

void main() {
    vec2 pos = gl_FragCoord.xy;
    float position_distance_from_center = distance(pos, u_resolution / 2.);

    pos -= u_resolution / 2.;

    vec2 tmp_pos = pos / u_resolution * 6.9;
    tmp_pos.x *= u_resolution.x / u_resolution.y;

    pos *= fbm(tmp_pos + fbm(tmp_pos + fbm(tmp_pos) + u_time * 0.3));
    pos *= min(position_distance_from_center / u_resolution, 0.2);
    pos += u_resolution / 2.;

    vec2 color_adjustment = u_resolution * 0.005 * (1. - position_distance_from_center / hyp);

    vec3 color = vec3(
            func(pos - 6. * color_adjustment),
            func(pos - 3. * color_adjustment),
            func(pos)
        );
    gl_FragColor = vec4(color, 1.);
}
