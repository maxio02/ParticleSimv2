precision mediump float;

uniform vec2 u_resolution;
// // Passed in from the vertex shader.
// varying vec3 v_color;
uniform vec3 u_color;
uniform float u_radius;
uniform vec2 u_center;
// float mask(in vec2 _st, in float _radius){
//     vec2 dist = _st-u_center;
//     return 1.-smoothstep(_radius-(_radius*0.01),
//                          _radius+(_radius*0.01),
//                          dot(dist,dist)*4.024);
// }

// vec3 circle(in vec2 _st, in float _radius, in vec3 color){
//     vec2 dist = _st-u_center;
// 	return 
//     (smoothstep(_radius-(_radius*0.01), _radius +(_radius*0.01),dot(dist, dist)*(4.))) + color * (smoothstep(_radius + (_radius*0.01), _radius -(_radius*0.01),dot(dist, dist)*(4.8)));
// }
// void main(){
// 	vec2 st = gl_FragCoord.xy/u_resolution.xy;

// 	st.x = mix(0.5, st.x, )

// 	vec3 shaded = circle(st,u_radius, u_color);

// 	gl_FragColor = vec4( shaded, mask(st, u_radius));
	
// }

void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(u_color, 1.);
  }