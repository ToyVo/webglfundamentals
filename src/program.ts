export function createShader(gl: WebGLRenderingContext, source: string, type: GLenum): WebGLShader {
	const shader = gl.createShader(type);
	if(!shader) {
		throw new Error(`failed to create shader of type ${type}`);
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader;
	} else {
		console.error(`${gl.getShaderInfoLog(shader)}`);
		gl.deleteShader(shader);
		throw new Error('Failed to compile shader');
	}
}

export default function createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram {
	// create shaders
	const vertex = createShader(gl, vertexSrc, gl.VERTEX_SHADER);
	const fragment = createShader(gl, fragmentSrc, gl.FRAGMENT_SHADER);

	// create program
	const program = gl.createProgram();
	if(!program) {
		throw new Error('failed to create program');
	}

	// attach shaders
	gl.attachShader(program, vertex);
	gl.attachShader(program, fragment);

	// link the program
	gl.linkProgram(program);

	// check the results
	if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return program;
	} else {
		gl.deleteProgram(program);
		throw new Error('Program did not link');
	}
}
