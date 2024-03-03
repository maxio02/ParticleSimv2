precision mediump float;

attribute vec2 a_position;

// attribute vec3 color;
// varying vec3 v_color;
uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
    //move the position of the shader
    vec2 position = a_position + u_translation;

    // convert the position from pixels to 0.0 to 1.0
    vec2 zeroToOne = position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);

    // // Pass the vertex color to the fragment shader.
    // v_position = a_position;
}