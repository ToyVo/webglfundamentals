import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import fragment from './Shaders/fragment.glsl';
import vertex from './Shaders/vertex.glsl';
import Matrix from './Matrix';
import TrianglesGeometry from './Geometry/TrianglesGeometry';
import createProgram, {degreesToRadians} from './Utility';
import Vector from './Vector';

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
	private translation: {x: number, y: number, z: number} = {x: -150, y: 0, z: -360};
	private rotation: {x: number, y: number, z: number} = {x: 190, y: 40, z: 320};
	private scale: {x: number, y: number, z: number} = {x: 1, y: 1, z: 1};
	private fieldOfView: number = 60;
	private cameraAngle: number = 0;

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
		this.geometry = TrianglesGeometry.ThreeDF(this.gl);

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
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Turn on culling
		this.gl.enable(this.gl.CULL_FACE);
		this.gl.enable(this.gl.DEPTH_TEST);

		// Tell it to use our program (pair of shaders)
		this.gl.useProgram(this.program);

		// Turn on the attribute, Bind the position buffer, Tell the attribute how to get data out of positionBuffer
		// (ARRAY_BUFFER)
		this.gl.enableVertexAttribArray(this.positionLocation);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
		this.gl.vertexAttribPointer(this.positionLocation, 3, this.gl.FLOAT, false, 0, 0);

		this.gl.enableVertexAttribArray(this.colorLocation);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.vertexAttribPointer(this.colorLocation, 4, this.gl.UNSIGNED_BYTE, true, 0, 0);

		// Compute the matrix
		const radius = 200;
		// Compute the projection matrix
		const projectionMatrix = Matrix.perspectiveMatrix(degreesToRadians(this.fieldOfView), this.canvas.clientWidth / this.canvas.clientHeight, 1, 2000);

		// Compute the position of the first F
		const fPosition = new Vector([radius, 0, 0]);
		// Use matrix math to compute a position on a circle where the camera is
		const cameraMatrix = Matrix.yRotationMatrix(degreesToRadians(this.cameraAngle)).translate(0, 0, radius * 1.5);

		// Get the camera's position from the matrix we computed
		const cameraPosition = new Vector([
			cameraMatrix.getValue(3, 0),
			cameraMatrix.getValue(3, 1),
			cameraMatrix.getValue(3, 2)
		]);

		const upDirection = new Vector([0, 1, 0]);

		// Compute the camera's matrix using look at.
		const lookAtMatrix = Matrix.lookAtMatrix(cameraPosition, fPosition, upDirection);

		// Make a view matrix from the camera matrix.
		const viewMatrix = lookAtMatrix.inverse();

		// View Projection
		const viewProjectionMatrix = projectionMatrix.multiply(viewMatrix);

		for(let i = 0; i < 5; i++) {
			const angle = i * Math.PI * 2 / 5; // 5 is the number of f's we are drawing
			const x = Math.cos(angle) * radius;
			const y = Math.sin(angle) * radius;

			// starting with the view projection matrix
			// compute a matrix for the F
			const matrix = viewProjectionMatrix.translate(x, 0, y);

			// Set the Matrix
			this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix.data);

			this.geometry.draw(this.gl);
		}
	}

	setupInput() {
		this.createSlider('cameraAngle', -360, 360, 1, this.cameraAngle, (sliderValue => this.cameraAngle = sliderValue));
		this.createSlider('fov', 1, 170, 1, this.fieldOfView, (sliderValue => {
			this.fieldOfView = sliderValue;
		}));
		this.createSlider('x', 0, this.canvas.clientWidth, 1, this.translation.x, (sliderValue => {
			this.translation.x = sliderValue;
		}));
		this.createSlider('y', 0, this.canvas.clientHeight, 1, this.translation.y, (sliderValue => {
			this.translation.y = sliderValue;
		}));
		this.createSlider('z', -400, 400, 1, this.translation.z, (sliderValue => {
			this.translation.z = sliderValue;
		}));
		this.createSlider('angleX', 0, 360, 1, this.rotation.x, (sliderValue => {
			this.rotation.x = sliderValue;
		}));
		this.createSlider('angleY', 0, 360, 1, this.rotation.y, (sliderValue => {
			this.rotation.y = sliderValue;
		}));
		this.createSlider('angleZ', 0, 360, 1, this.rotation.z, (sliderValue => {
			this.rotation.z = sliderValue;
		}));
		this.createSlider('scaleX', -5, 5, 0.01, this.scale.x, (sliderValue => {
			this.scale.x = sliderValue;
		}));
		this.createSlider('scaleY', -5, 5, 0.01, this.scale.y, (sliderValue => {
			this.scale.y = sliderValue;
		}));
		this.createSlider('scaleZ', -5, 5, 0.01, this.scale.z, (sliderValue => {
			this.scale.z = sliderValue;
		}));
	}

	createSlider(elementID: string, min: number, max: number, step: number, watchValue: number, onInput: (sliderValue: number) => void) {
		const div = document.getElementById(elementID);
		if(!div) throw new Error(`cannot find element ${elementID}`);
		const container = document.createElement('div');
		container.className = 'sliderContainer';
		const label = document.createElement('div');
		label.className = 'sliderLabel';
		const slider = document.createElement('input');
		slider.className = 'slider';
		const value = document.createElement('div');
		value.className = 'sliderValue';
		label.innerText = elementID;
		value.innerText = watchValue.toString();
		slider.type = 'range';
		slider.min = min.toString();
		slider.max = max.toString();
		slider.step = step.toString();
		slider.value = watchValue.toString();
		slider.oninput = () => {
			value.innerText = slider.value;
			onInput(Number.parseFloat(slider.value));
			this.drawScene();
		};
		div.appendChild(container);
		container.appendChild(label);
		container.appendChild(slider);
		container.appendChild(value);
	}
}

new Drawing();
