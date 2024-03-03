precision mediump float;

uniform vec2 u_resolution;

uniform vec3 u_color;
uniform float u_radius;
uniform vec2 u_translation;

float circle(in vec2 st, in float radius) {
	vec2 dist = st;
	return 1.0 - smoothstep(
		radius - (radius * 0.01),
		radius +(radius * 0.01),
		dot(dist, dist) * 4.0);
}
void main(){
 	vec2 st = (gl_FragCoord.xy - u_translation) / u_radius;

	vec3 color = vec3(u_color*circle(st,4.0));

	gl_FragColor = vec4(color, 1.0 );
}