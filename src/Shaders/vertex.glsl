#version 100
attribute vec4 a_position;
attribute vec4 a_color;
uniform mat4 u_matrix;
varying vec4 v_color;
void main() {
    // Multiply the position by the matrix.
    gl_Position = a_position * u_matrix;
    v_color = a_color;
}
