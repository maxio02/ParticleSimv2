precision mediump float;

uniform vec2 u_resolution;

uniform vec3 u_color;
uniform float u_radius;
uniform vec2 u_translation;
uniform float u_outline_black;
float mask(in vec2 _st, in float _radius){
    vec2 dist = _st;
    return 1.-smoothstep(_radius-(_radius*0.15),
                         _radius+(_radius*0.15),
                         dot(dist,dist)*3.9);
}


vec3 circle(in vec2 _st, in float radius, in vec3 color) {
	vec2 dist = _st;
	return smoothstep(
		radius + (radius * 0.15),
		radius -(radius * 0.15),
		dot(dist, dist) * 3.9) * color + u_outline_black * (smoothstep(
		radius - (radius * 0.15),
		radius +(radius * 0.15),
		dot(dist, dist) * 6.));
}
void main(){
 	vec2 st = (gl_FragCoord.xy - u_translation) / u_radius;

	vec3 color = circle(st,4.0, u_color);

	gl_FragColor = vec4(color, mask(st, 4.0));
}



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