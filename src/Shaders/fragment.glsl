#version 100
precision lowp float;
varying vec4 v_color;
void main() {
    gl_FragColor = v_color;
}
