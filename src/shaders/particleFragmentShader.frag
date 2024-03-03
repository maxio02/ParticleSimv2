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
		dot(dist, dist) * 5.3));
}
void main(){
 	vec2 st =  (gl_FragCoord.xy - u_translation*vec2(1., -1.) - u_resolution*vec2(0.,1.)) / u_radius; 

	vec3 color = circle(st,4.0, u_color);

	gl_FragColor = vec4(color, mask(st, 4.0));
}