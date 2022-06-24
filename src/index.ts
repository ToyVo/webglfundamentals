import './index.css';

import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import createProgram from './program';
import Rectangle from './Rectangle';
import Geometry from './Geometry';
import F from './F';

class Drawing {
	private gl: WebGLRenderingContext;
	private canvas: HTMLCanvasElement;
	private program: WebGLProgram;
	private positionAttributeLocation: GLint;
	private resolutionUniformLocation: WebGLUniformLocation;
	private colorUniformLocation: WebGLUniformLocation;
	private translationUniformLocation: WebGLUniformLocation;
	private positionBuffer: WebGLBuffer;
	private objects = new Array<Geometry>();

	public translation = [0, 0];

	constructor() {
		// Get A WebGL context
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.gl = this.canvas.getContext('webgl');

		// get the program passing in the source for vertex and fragment shaders
		this.program = createProgram(this.gl, vertex, fragment);

		// look up where the vertex data needs to go.
		this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
		this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
		this.colorUniformLocation = this.gl.getUniformLocation(this.program, 'u_color');
		this.translationUniformLocation = this.gl.getUniformLocation(this.program, 'u_translation');

		// Create a buffer and put three 2d clip space points in it
		this.positionBuffer = this.gl.createBuffer();

		// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

		// setup geometries
		this.objects.push(new F(this.gl, [Math.random(), Math.random(), Math.random(), 1]));
		this.objects.push(new Rectangle(this.gl, 200, 200, 30, 30, [Math.random(), Math.random(), Math.random(), 1]));
	}

	drawScene() {
		// Resize the canvas
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;

		// Tell WebGL how to convert from clip space to pixels
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		// Clear the canvas
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// Tell it to use our program (pair of shaders)
		this.gl.useProgram(this.program);

		// Turn on the attribute
		this.gl.enableVertexAttribArray(this.positionAttributeLocation);

		// Bind the position buffer.
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		const size = 2;          // 2 components per iteration
		const type = this.gl.FLOAT;   // the data is 32bit floats
		const normalize = false; // don't normalize the data
		const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0;        // start at the beginning of the buffer
		this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

		// Set the resolution
		this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

		// set the translation
		this.gl.uniform2fv(this.translationUniformLocation, this.translation);

		for(const obj of this.objects) {
			this.gl.uniform4fv(this.colorUniformLocation, obj.color);
			obj.draw(this.gl);
		}
	}
}

const drawing = new Drawing();
drawing.drawScene();
setInterval(() => {
	drawing.translation[0] += 1;
	drawing.drawScene();
}, 1);
