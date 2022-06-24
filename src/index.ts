import './index.css';

import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import Rectangle from './Rectangle';
import createProgram from './program';

function main() {
	// Get A WebGL context
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	const gl = canvas.getContext('webgl');

	// get the program passing in the source for vertex and fragment shaders
	const program = createProgram(gl, vertex, fragment);

	// look up where the vertex data needs to go.
	const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
	const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
	const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

	// Create a buffer and put three 2d clip space points in it
	const positionBuffer = gl.createBuffer();

	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// code above this line is initialization code.
	// code below this line is rendering code.

	// Resize the canvas
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Clear the canvas
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Turn on the attribute
	gl.enableVertexAttribArray(positionAttributeLocation);

	// Bind the position buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	const size = 2;          // 2 components per iteration
	const type = gl.FLOAT;   // the data is 32bit floats
	const normalize = false; // don't normalize the data
	const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	let offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	// Set the resolution
	gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

	// Draw 50 random rectangles
	for(let i = 0; i < 50; i++) {
		const rect = new Rectangle(gl, Math.floor(Math.random() * 300), Math.floor(Math.random() * 300), Math.floor(Math.random() * 300),
			Math.floor(Math.random() * 300), new Float32Array([Math.random(), Math.random(), Math.random(), 1]));
		gl.uniform4fv(colorUniformLocation, rect.color);
		rect.draw(gl);
	}
}

main();
