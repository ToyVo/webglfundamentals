import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import fragment from './Shaders/fragment.glsl';
import vertex from './Shaders/vertex.glsl';
import createProgram from './program';
import F from './Geometry/F';
import Matrix3 from './Matrix3';

class Drawing {
	private readonly gl: WebGLRenderingContext;
	private readonly canvas: HTMLCanvasElement;
	private readonly program: WebGLProgram;

	//program locations
	private readonly positionLocation: GLint;
	private readonly colorLocation: WebGLUniformLocation;
	private readonly matrixLocation: WebGLUniformLocation;
	private readonly positionBuffer: WebGLBuffer;

	private geometry: F;
	private translation: {x: number, y: number} = {x: 0, y: 0};
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
		this.colorLocation = this.gl.getUniformLocation(this.program, 'u_color');
		this.matrixLocation = this.gl.getUniformLocation(this.program, 'u_matrix');

		// Create a buffer and bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		this.positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

		// setup geometries
		this.geometry = new F(this.gl, [Math.random(), Math.random(), Math.random(), 1]);

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

		// Compute the matrix
		const matrix = Matrix3.projectionMatrix(this.canvas.clientWidth, this.canvas.clientHeight)
			.translate(this.translation.x, this.translation.y)
			.rotate(this.rotation)
			.scale(this.scale.x, this.scale.y)
			// change origin to center of object
			.translate(-50, -75);

		// Set the Matrix
		this.gl.uniformMatrix3fv(this.matrixLocation, false, matrix.getData());

		this.gl.uniform4fv(this.colorLocation, this.geometry.color);
		this.geometry.draw(this.gl);

	}

	setupInput() {
		const div = document.createElement('div');
		div.id = 'inputContainer';
		const xDiv = document.createElement('div');
		xDiv.className = 'sliderContainer';
		const yDiv = document.createElement('div');
		yDiv.className = 'sliderContainer';
		const rotationDiv = document.createElement('div');
		rotationDiv.className = 'sliderContainer';
		const xScaleDiv = document.createElement('div');
		xScaleDiv.className = 'sliderContainer';
		const yScaleDiv = document.createElement('div');
		yScaleDiv.className = 'sliderContainer';

		const xLabel = document.createElement('div');
		xLabel.innerText = 'x';
		xLabel.className = 'sliderLabel';
		const xValue = document.createElement('div');
		xValue.innerText = String(this.translation.x);
		xValue.className = 'sliderValue';

		const xSlider = document.createElement('input');
		xSlider.min = '0';
		xSlider.max = this.canvas.clientWidth.toString();
		xSlider.value = String(this.translation.x);
		xSlider.oninput = () => {
			this.translation.x = Number.parseFloat(xSlider.value);
			this.drawScene();
			xValue.innerText = String(this.translation.x);
		};

		const yLabel = document.createElement('div');
		yLabel.innerText = 'y';
		yLabel.className = 'sliderLabel';
		const yValue = document.createElement('div');
		yValue.innerText = String(this.translation.y);
		yValue.className = 'sliderValue';

		const ySlider = document.createElement('input');
		ySlider.min = '0';
		ySlider.max = this.canvas.clientHeight.toString();
		ySlider.value = String(this.translation.y);
		ySlider.oninput = () => {
			this.translation.y = Number.parseFloat(ySlider.value);
			this.drawScene();
			yValue.innerText = String(this.translation.y);
		};

		const rotationLabel = document.createElement('div');
		rotationLabel.innerText = 'rotation';
		rotationLabel.className = 'sliderLabel';
		const rotationValue = document.createElement('div');
		rotationValue.innerText = '0';
		rotationValue.className = 'sliderValue';

		const rotationSlider = document.createElement('input');
		rotationSlider.min = '0';
		rotationSlider.max = String(Math.PI * 2);
		rotationSlider.value = '0';
		rotationSlider.step = String(Math.PI / 360);
		rotationSlider.oninput = () => {
			this.rotation = Number.parseFloat(rotationSlider.value);
			this.drawScene();
			rotationValue.innerText = String(Math.floor(this.rotation * 180 / Math.PI));
		};

		const xScaleLabel = document.createElement('div');
		xScaleLabel.innerText = 'x scale';
		xScaleLabel.className = 'sliderLabel';
		const xScaleValue = document.createElement('div');
		xScaleValue.innerText = String(this.scale.x);
		xScaleValue.className = 'sliderValue';

		const xScaleSlider = document.createElement('input');
		xScaleSlider.min = '-5';
		xScaleSlider.max = '5';
		xScaleSlider.step = '0.05';
		xScaleSlider.value = String(this.scale.x);
		xScaleSlider.oninput = () => {
			this.scale.x = Number.parseFloat(xScaleSlider.value);
			this.drawScene();
			xScaleValue.innerText = String(this.scale.x);
		};

		const yScaleLabel = document.createElement('div');
		yScaleLabel.innerText = 'y scale';
		yScaleLabel.className = 'sliderLabel';
		const yScaleValue = document.createElement('div');
		yScaleValue.innerText = String(this.scale.y);
		yScaleValue.className = 'sliderValue';

		const yScaleSlider = document.createElement('input');
		yScaleSlider.min = '-5';
		yScaleSlider.max = '5';
		yScaleSlider.step = '0.05';
		yScaleSlider.value = String(this.scale.y);
		yScaleSlider.oninput = () => {
			this.scale.y = Number.parseFloat(yScaleSlider.value);
			this.drawScene();
			yScaleValue.innerText = String(this.scale.y);
		};

		for(const slider of [xSlider, ySlider, rotationSlider, xScaleSlider, yScaleSlider]) {
			slider.type = 'range';
			slider.className = 'slider';
		}

		document.body.appendChild(div);
		div.appendChild(xDiv);
		div.appendChild(yDiv);
		div.appendChild(rotationDiv);
		div.appendChild(xScaleDiv);
		div.appendChild(yScaleDiv);
		xDiv.appendChild(xLabel);
		xDiv.appendChild(xSlider);
		xDiv.appendChild(xValue);
		yDiv.appendChild(yLabel);
		yDiv.appendChild(ySlider);
		yDiv.appendChild(yValue);
		rotationDiv.appendChild(rotationLabel);
		rotationDiv.appendChild(rotationSlider);
		rotationDiv.appendChild(rotationValue);
		xScaleDiv.appendChild(xScaleLabel);
		xScaleDiv.appendChild(xScaleSlider);
		xScaleDiv.appendChild(xScaleValue);
		yScaleDiv.appendChild(yScaleLabel);
		yScaleDiv.appendChild(yScaleSlider);
		yScaleDiv.appendChild(yScaleValue);
	}
}

new Drawing();
