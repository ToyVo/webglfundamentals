import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import fragment from './Shaders/fragment.glsl';
import vertex from './Shaders/vertex.glsl';
import createProgram from './program';
// eslint-disable-next-line no-unused-vars
import Geometry from './Geometry/Geometry';
import F from './Geometry/F';

class Drawing {
	private gl: WebGLRenderingContext;
	private canvas: HTMLCanvasElement;
	private program: WebGLProgram;

	//program locations
	private positionAttributeLocation: GLint;
	private resolutionUniformLocation: WebGLUniformLocation;
	private colorUniformLocation: WebGLUniformLocation;
	private translationUniformLocation: WebGLUniformLocation;
	private rotationUniformLocation: WebGLUniformLocation;
	private scaleUniformLocation: WebGLUniformLocation;

	private positionBuffer: WebGLBuffer;
	private objects = new Array<Geometry>();

	public translation = [0, 0];
	public rotation = [0, 1];
	public scale = [1, 1];

	constructor() {
		// Get A WebGL context
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.gl = this.canvas.getContext('webgl');

		this.setupInput();

		// get the program passing in the source for vertex and fragment shaders
		this.program = createProgram(this.gl, vertex, fragment);

		// look up where the vertex data needs to go.
		this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
		this.resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
		this.colorUniformLocation = this.gl.getUniformLocation(this.program, 'u_color');
		this.translationUniformLocation = this.gl.getUniformLocation(this.program, 'u_translation');
		this.rotationUniformLocation = this.gl.getUniformLocation(this.program, 'u_rotation');
		this.scaleUniformLocation = this.gl.getUniformLocation(this.program, 'u_scale');

		// Create a buffer and put three 2d clip space points in it
		this.positionBuffer = this.gl.createBuffer();

		// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

		// setup geometries
		this.objects.push(new F(this.gl, [Math.random(), Math.random(), Math.random(), 1]));
		//this.objects.push(new Rectangle(this.gl, 200, 200, 30, 30, [Math.random(), Math.random(), Math.random(), 1]));

		this.drawScene();
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

		// set the rotation
		this.gl.uniform2fv(this.rotationUniformLocation, this.rotation);

		// set the scale
		this.gl.uniform2fv(this.scaleUniformLocation, this.scale);

		for(const obj of this.objects) {
			this.gl.uniform4fv(this.colorUniformLocation, obj.color);
			obj.draw(this.gl);
		}
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
		xValue.innerText = String(this.translation[0]);
		xValue.className = 'sliderValue';

		const xSlider = document.createElement('input');
		xSlider.min = '0';
		xSlider.max = this.canvas.clientWidth.toString();
		xSlider.value = String(this.translation[0]);
		xSlider.oninput = () => {
			this.translation[0] = Number.parseFloat(xSlider.value);
			this.drawScene();
			xValue.innerText = xSlider.value;
		};

		const yLabel = document.createElement('div');
		yLabel.innerText = 'y';
		yLabel.className = 'sliderLabel';
		const yValue = document.createElement('div');
		yValue.innerText = String(this.translation[1]);
		yValue.className = 'sliderValue';

		const ySlider = document.createElement('input');
		ySlider.min = '0';
		ySlider.max = this.canvas.clientHeight.toString();
		ySlider.value = String(this.translation[1]);
		ySlider.oninput = () => {
			this.translation[1] = Number.parseFloat(ySlider.value);
			this.drawScene();
			yValue.innerText = ySlider.value;
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
			const radians = Number.parseFloat(rotationSlider.value);
			this.rotation[0] = Math.sin(radians);
			this.rotation[1] = Math.cos(radians);
			this.drawScene();
			rotationValue.innerText = String(Math.floor(radians * 180 / Math.PI));
		};

		const xScaleLabel = document.createElement('div');
		xScaleLabel.innerText = 'x scale';
		xScaleLabel.className = 'sliderLabel';
		const xScaleValue = document.createElement('div');
		xScaleValue.innerText = String(this.scale[0]);
		xScaleValue.className = 'sliderValue';

		const xScaleSlider = document.createElement('input');
		xScaleSlider.min = '-5';
		xScaleSlider.max = '5';
		xScaleSlider.step = '0.1';
		xScaleSlider.value = String(this.scale[0]);
		xScaleSlider.oninput = () => {
			this.scale[0] = Number.parseFloat(xScaleSlider.value);
			this.drawScene();
			xScaleValue.innerText = xScaleSlider.value;
		};

		const yScaleLabel = document.createElement('div');
		yScaleLabel.innerText = 'y scale';
		yScaleLabel.className = 'sliderLabel';
		const yScaleValue = document.createElement('div');
		yScaleValue.innerText = String(this.scale[1]);
		yScaleValue.className = 'sliderValue';

		const yScaleSlider = document.createElement('input');
		yScaleSlider.min = '-5';
		yScaleSlider.max = '5';
		yScaleSlider.step = '0.1';
		yScaleSlider.value = String(this.scale[1]);
		yScaleSlider.oninput = () => {
			this.scale[1] = Number.parseFloat(yScaleSlider.value);
			this.drawScene();
			yScaleValue.innerText = yScaleSlider.value;
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
