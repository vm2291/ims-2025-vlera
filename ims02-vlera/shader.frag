#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
float PI = 3.142;

float smoothMod(float x, float y, float e){
    float top = cos(PI * (x/y)) * sin(PI * (x/y));
    float bot = pow(sin(PI * (x/y)),2.);
    float at = atan(top/bot);
    return y * (1./2.) - (1./PI) * at ;
}

vec2 modPolar(vec2 p, float repetitions) {
    float angle = 2.*3.14/repetitions;
    float a = atan(p.y, p.x) + angle/2.;
    float r = length(p);
    a = smoothMod(a,angle,033323231231561.9) - angle/2.;
    vec2 p2 = vec2(cos(a), sin(a))*r;
    return p2;
}

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle), sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 rotateTilePattern(vec2 _st){
    _st *= 2.0;
    float index = 0.0;
    index += step(1., mod(_st.x,2.0));
    index += step(1., mod(_st.y,2.0))*2.0;
    _st = fract(_st);
    if(index == 1.0){
        _st = rotate2D(_st,PI*0.5);
    } else if(index == 2.0){
        _st = rotate2D(_st,PI*-0.5);
    } else if(index == 3.0){
        _st = rotate2D(_st,PI);
    }
    return _st;
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv2 = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.);

    float t = (u_time * .125) + uv.x;
    float t2 = (u_time * .125) + uv.y;
    float t3 = (u_time * .25) + length(uv-.3);

    uv = mix(modPolar(uv-.5, 30.* cos(t3)), modPolar(uv-.5, 4.* cos(t2)), sin(t3*.3));
    uv = mix(uv, uv2, sin(t2*.3));
    uv = rotateTilePattern(uv);

    color = mix(color, 1.-color, step(sin(t), .5));
    color = mix(color, 1.-color, step(sin(t), .4));

    uv2 = fract(uv * 2.);
    t = (u_time * .125) + uv2.x;
    color = mix(color, 1.-color, step(sin(t), .5));
    color = mix(color, 1.-color, step(sin(t), .4));
    color = mix(color, 1.-color, step(sin(t2), .5));
    color = mix(color, 1.-color, step(sin(t2), .4));

    vec2 uv3 = fract(uv * 4.);
    t = (u_time * .125) + uv3.x;
    t2 = (u_time * .125) + uv3.y;
    color = mix(color, 1.-color, step((cos(t) +1.)*.5, .5));
    color = mix(color, 1.-color, step((cos(t) +1.)*.5, .4));
    color = mix(color, 1.-color, step(cos(t2), .5));
    color = mix(color, 1.-color, step(cos(t2), .4));

    vec2 uv4 = fract(uv * 16.);
    t = (u_time * .105) + uv4.x;
    t2 = (u_time * .105) + uv4.y;

    if(color == vec3(0.)){
        color = mix(color, 1.-color, step(sin(t), .5));
        color = mix(color, 1.-color, step(sin(t), .4));
        color = mix(color, 1.-color, step(sin(t2), .5));
        color = mix(color, 1.-color, step(sin(t2), .4));
    }

    vec2 uv5 = fract(uv * 20.);
    t = (u_time * .0805) + uv5.x;
    t2 = (u_time * .0805) + uv5.y;

    if(color == vec3(1.)){
        color = mix(color, 1.-color, step((cos(t) +1.)*.5, .5));
        color = mix(color, 1.-color, step((cos(t*.8) +1.)*.5, .4));
        color = mix(color, 1.-color, step(cos(t2*.7), .5));
        color = mix(color, 1.-color, step(cos(t2*.6), .4));
    }

    color = mix(color, 1.-color, step(uv.x, uv.y));
    gl_FragColor = vec4(color,1.0); 
}
