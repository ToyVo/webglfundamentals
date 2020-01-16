export default class TrianglesGeometry {
	public points: Float32List;
	public colors: Uint8Array;

	constructor(gl: WebGLRenderingContext, points: Float32List, colors?: Uint8Array) {
		this.points = points;
		if(colors) this.colors = colors;
		else this.colors = this.setRandomColors();
	}

	bufferPoints(gl: WebGLRenderingContext) {
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);
	}

	bufferColors(gl: WebGLRenderingContext) {
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(this.colors), gl.STATIC_DRAW);
	}

	draw(gl: WebGLRenderingContext) {
		const count = Math.floor(this.points.length / 2);
		gl.drawArrays(gl.TRIANGLES, 0, count);
	}

	static F(gl: WebGLRenderingContext): TrianglesGeometry {
		return new TrianglesGeometry(gl, [
			// left column
			0, 0,
			30, 0,
			0, 150,
			0, 150,
			30, 0,
			30, 150,

			// top rung
			30, 0,
			100, 0,
			30, 30,
			30, 30,
			100, 0,
			100, 30,

			// middle rung
			30, 60,
			67, 60,
			30, 90,
			30, 90,
			67, 60,
			67, 90
		]);
	}

	static Triangle(gl: WebGLRenderingContext): TrianglesGeometry {
		return new TrianglesGeometry(gl, [
			0, -100,
			150, 125,
			-175, 100
		]);
	}

	static Rectangle(gl: WebGLRenderingContext, width: number = 50, height: number = 50): TrianglesGeometry {
		return new TrianglesGeometry(gl, [
			0, 0,
			width, 0,
			0, height,
			0, height,
			width, 0,
			width, height
		]);
	}

	setRandomInterpolatedColors(): Uint8Array {
		const numberOfPoints = Math.floor(this.points.length / 2);
		const colors = new Array<number>();
		for(let i = 0; i < numberOfPoints; i++) {
			colors.push(Math.random() * 256, Math.random() * 256, Math.random() * 256, 255);
		}
		return new Uint8Array(colors);
	}

	setRandomColors(): Uint8Array {
		const numberOfTriangles = Math.floor(this.points.length / 6);
		const colors = new Array<number>();
		for(let i = 0; i < numberOfTriangles; i++) {
			const red = Math.random() * 256;
			const green = Math.random() * 256;
			const blue = Math.random() * 256;
			const alpha = 255;
			colors.push(red, green, blue, alpha, red, green, blue, alpha, red, green, blue, alpha);
		}
		return new Uint8Array(colors);
	}
}