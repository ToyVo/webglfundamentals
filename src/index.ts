import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import fragment from './Shaders/fragment.glsl';
import vertex from './Shaders/vertex.glsl';
import createProgram from './program';
import Matrix3 from './Matrix3';
import TrianglesGeometry from './Geometry/TrianglesGeometry';

class Drawing {
	private readonly gl: WebGLRenderingContext;
	private readonly canvas: HTMLCanvasElement;
	private readonly program: WebGLProgram;
	private readonly positionLocation: GLint;
	private readonly colorLocation: GLint;
	private readonly matrixLocation: WebGLUniformLocation;
	private readonly positionBuffer: WebGLBuffer;
	private readonly colorBuffer: WebGLBuffer;

	private geometry: TrianglesGeometry;
	private translation: {x: number, y: number} = {x: 500, y: 500};
	private rotation: number = 0;
	private scale: {x: number, y: number} = {x: 1, y: 1};

	constructor() {
		// Get A WebGL context
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.gl = this.canvas.getContext('webgl');

		// get the program passing in the source for vertex and fragment shaders
		this.program = createProgram(this.gl, vertex, fragment);

		// look up where the data needs to go.
		this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
		this.colorLocation = this.gl.getAttribLocation(this.program, 'a_color');
		this.matrixLocation = this.gl.getUniformLocation(this.program, 'u_matrix');

		// setup geometries
		this.geometry = TrianglesGeometry.F(this.gl);

		// Create a buffer and bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		this.positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
		this.geometry.bufferPoints(this.gl);

		// setup colors
		this.colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.geometry.bufferColors(this.gl);

		// Setup UI
		this.setupInput();

		this.drawScene();
	}

	drawScene() {
		// Resize the canvas
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;

		// Tell WebGL how to convert from clip space to pixels
		this.gl.viewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

		// Clear the canvas
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// Tell it to use our program (pair of shaders)
		this.gl.useProgram(this.program);

		// Turn on the attribute
		this.gl.enableVertexAttribArray(this.positionLocation);

		// Bind the position buffer.
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		const size = 2;                // 2 components per iteration
		const type = this.gl.FLOAT;    // the data is 32bit floats
		const normalize = false;       // don't normalize the data
		const stride = 0;              // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0;              // start at the beginning of the buffer
		this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);

		this.gl.enableVertexAttribArray(this.colorLocation);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.vertexAttribPointer(this.colorLocation, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);

		// Compute the matrix
		const matrix = Matrix3.projectionMatrix(this.canvas.clientWidth, this.canvas.clientHeight)
			.translate(this.translation.x, this.translation.y)
			.rotate(this.rotation)
			.scale(this.scale.x, this.scale.y);
		// change origin to center of object
		//.translate(-50, -75);

		// Set the Matrix
		this.gl.uniformMatrix3fv(this.matrixLocation, false, matrix.data);

		this.geometry.draw(this.gl);

	}

	setupInput() {
		const xValue = document.getElementById('xValue');
		xValue.innerText = String(this.translation.x);
		const yValue = document.getElementById('yValue');
		yValue.innerText = String(this.translation.y);
		const rotationValue = document.getElementById('rotationValue');
		rotationValue.innerText = String(0);
		const xScaleValue = document.getElementById('xScaleValue');
		xScaleValue.innerText = String(this.scale.x);
		const yScaleValue = document.getElementById('yScaleValue');
		yScaleValue.innerText = String(this.scale.y);

		const xSlider = document.getElementById('xSlider') as HTMLInputElement;
		xSlider.max = this.canvas.clientWidth.toString();
		xSlider.value = String(this.translation.x);
		xSlider.oninput = () => {
			this.translation.x = Number.parseFloat(xSlider.value);
			this.drawScene();
			xValue.innerText = String(this.translation.x);
		};

		const ySlider = document.getElementById('ySlider') as HTMLInputElement;
		ySlider.max = this.canvas.clientHeight.toString();
		ySlider.value = String(this.translation.y);
		ySlider.oninput = () => {
			this.translation.y = Number.parseFloat(ySlider.value);
			this.drawScene();
			yValue.innerText = String(this.translation.y);
		};

		const rotationSlider = document.getElementById('rotationSlider') as HTMLInputElement;
		rotationSlider.max = String(Math.PI * 2);
		rotationSlider.value = String(this.rotation);
		rotationSlider.step = String(Math.PI / 360);
		rotationSlider.oninput = () => {
			this.rotation = Number.parseFloat(rotationSlider.value);
			this.drawScene();
			rotationValue.innerText = String(Math.floor(this.rotation * 180 / Math.PI));
		};

		const xScaleSlider = document.getElementById('xScaleSlider') as HTMLInputElement;
		xScaleSlider.value = String(this.scale.x);
		xScaleSlider.oninput = () => {
			this.scale.x = Number.parseFloat(xScaleSlider.value);
			this.drawScene();
			xScaleValue.innerText = String(this.scale.x);
		};

		const yScaleSlider = document.getElementById('yScaleSlider') as HTMLInputElement;
		yScaleSlider.value = String(this.scale.y);
		yScaleSlider.oninput = () => {
			this.scale.y = Number.parseFloat(yScaleSlider.value);
			this.drawScene();
			yScaleValue.innerText = String(this.scale.y);
		};
	}
}

new Drawing();
