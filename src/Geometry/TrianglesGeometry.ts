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
			0, 0, 0,
			30, 0, 0,
			0, 150, 0,
			0, 150, 0,
			30, 0, 0,
			30, 150, 0,

			// top rung
			30, 0, 0,
			100, 0, 0,
			30, 30, 0,
			30, 30, 0,
			100, 0, 0,
			100, 30, 0,

			// middle rung
			30, 60, 0,
			67, 60, 0,
			30, 90, 0,
			30, 90, 0,
			67, 60, 0,
			67, 90, 0
		]);
	}

	static ThreeDF(gl: WebGLRenderingContext): TrianglesGeometry {
		const points = new Float32Array([
			-50, 75, 15,
			-50, -75, 15,
			-20, 75, 15,
			-50, -75, 15,
			-20, -75, 15,
			-20, 75, 15,
			-20, 75, 15,
			-20, 45, 15,
			50, 75, 15,
			-20, 45, 15,
			50, 45, 15,
			50, 75, 15,
			-20, 15, 15,
			-20, -15, 15,
			17, 15, 15,
			-20, -15, 15,
			17, -15, 15,
			17, 15, 15,
			-50, 75, -15,
			-20, 75, -15,
			-50, -75, -15,
			-50, -75, -15,
			-20, 75, -15,
			-20, -75, -15,
			-20, 75, -15,
			50, 75, -15,
			-20, 45, -15,
			-20, 45, -15,
			50, 75, -15,
			50, 45, -15,
			-20, 15, -15,
			17, 15, -15,
			-20, -15, -15,
			-20, -15, -15,
			17, 15, -15,
			17, -15, -15,
			-50, 75, 15,
			50, 75, 15,
			50, 75, -15,
			-50, 75, 15,
			50, 75, -15,
			-50, 75, -15,
			50, 75, 15,
			50, 45, 15,
			50, 45, -15,
			50, 75, 15,
			50, 45, -15,
			50, 75, -15,
			-20, 45, 15,
			-20, 45, -15,
			50, 45, -15,
			-20, 45, 15,
			50, 45, -15,
			50, 45, 15,
			-20, 45, 15,
			-20, 15, -15,
			-20, 45, -15,
			-20, 45, 15,
			-20, 15, 15,
			-20, 15, -15,
			-20, 15, 15,
			17, 15, -15,
			-20, 15, -15,
			-20, 15, 15,
			17, 15, 15,
			17, 15, -15,
			17, 15, 15,
			17, -15, -15,
			17, 15, -15,
			17, 15, 15,
			17, -15, 15,
			17, -15, -15,
			-20, -15, 15,
			-20, -15, -15,
			17, -15, -15,
			-20, -15, 15,
			17, -15, -15,
			17, -15, 15,
			-20, -15, 15,
			-20, -75, -15,
			-20, -15, -15,
			-20, -15, 15,
			-20, -75, 15,
			-20, -75, -15,
			-50, -75, 15,
			-50, -75, -15,
			-20, -75, -15,
			-50, -75, 15,
			-20, -75, -15,
			-20, -75, 15,
			-50, 75, 15,
			-50, 75, -15,
			-50, -75, -15,
			-50, 75, 15,
			-50, -75, -15,
			-50, -75, 15
		]);
		const colors = new Uint8Array([
			// left column front
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,

			// top rung front
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,

			// middle rung front
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,
			200, 70, 120, 255,

			// left column back
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,

			// top rung back
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,

			// middle rung back
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,
			80, 70, 200, 255,

			// top
			70, 200, 210, 255,
			70, 200, 210, 255,
			70, 200, 210, 255,
			70, 200, 210, 255,
			70, 200, 210, 255,
			70, 200, 210, 255,

			// top rung right
			200, 200, 70, 255,
			200, 200, 70, 255,
			200, 200, 70, 255,
			200, 200, 70, 255,
			200, 200, 70, 255,
			200, 200, 70, 255,

			// under top rung
			210, 100, 70, 255,
			210, 100, 70, 255,
			210, 100, 70, 255,
			210, 100, 70, 255,
			210, 100, 70, 255,
			210, 100, 70, 255,

			// between top rung and middle
			210, 160, 70, 255,
			210, 160, 70, 255,
			210, 160, 70, 255,
			210, 160, 70, 255,
			210, 160, 70, 255,
			210, 160, 70, 255,

			// top of middle rung
			70, 180, 210, 255,
			70, 180, 210, 255,
			70, 180, 210, 255,
			70, 180, 210, 255,
			70, 180, 210, 255,
			70, 180, 210, 255,

			// right of middle rung
			100, 70, 210, 255,
			100, 70, 210, 255,
			100, 70, 210, 255,
			100, 70, 210, 255,
			100, 70, 210, 255,
			100, 70, 210, 255,

			// bottom of middle rung.
			76, 210, 100, 255,
			76, 210, 100, 255,
			76, 210, 100, 255,
			76, 210, 100, 255,
			76, 210, 100, 255,
			76, 210, 100, 255,

			// right of bottom
			140, 210, 80, 255,
			140, 210, 80, 255,
			140, 210, 80, 255,
			140, 210, 80, 255,
			140, 210, 80, 255,
			140, 210, 80, 255,

			// bottom
			90, 130, 110, 255,
			90, 130, 110, 255,
			90, 130, 110, 255,
			90, 130, 110, 255,
			90, 130, 110, 255,
			90, 130, 110, 255,

			// left side
			160, 160, 220, 255,
			160, 160, 220, 255,
			160, 160, 220, 255,
			160, 160, 220, 255,
			160, 160, 220, 255,
			160, 160, 220, 255
		]);
		return new TrianglesGeometry(gl, points, colors);
	}

	static Triangle(gl: WebGLRenderingContext): TrianglesGeometry {
		return new TrianglesGeometry(gl, [
			0, -100, 0,
			150, 125, 0,
			-175, 100, 0
		]);
	}

	static Rectangle(gl: WebGLRenderingContext, width: number = 50, height: number = 50): TrianglesGeometry {
		return new TrianglesGeometry(gl, [
			0, 0, 0,
			width, 0, 0,
			0, height, 0,
			0, height, 0,
			width, 0, 0,
			width, height, 0
		]);
	}

	setRandomInterpolatedColors(): Uint8Array {
		const numberOfPoints = Math.floor(this.points.length / 3);
		const colors = new Array<number>();
		for(let i = 0; i < numberOfPoints; i++) {
			colors.push(Math.random() * 256, Math.random() * 256, Math.random() * 256, 255);
		}
		return new Uint8Array(colors);
	}

	setRandomColors(vertices: number = 3): Uint8Array {
		const numberOfTriangles = Math.floor(this.points.length / 3 * vertices);
		const colors = new Array<number>();
		for(let i = 0; i < numberOfTriangles; i++) {
			const red = Math.random() * 256;
			const green = Math.random() * 256;
			const blue = Math.random() * 256;
			const alpha = 255;
			for(let j = 0; j < vertices; j++) {
				colors.push(red, green, blue, alpha);
			}
		}
		return new Uint8Array(colors);
	}
}
