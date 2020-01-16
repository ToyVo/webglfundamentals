import Geometry from './Geometry';

export default class Rectangle extends Geometry {
	constructor(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number, color?: Float32List) {
		super(gl, color);
		const x1 = x + width;
		const y1 = y + height;
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			x, y,
			x1, y,
			x, y1,
			x, y1,
			x1, y,
			x1, y1
		]), gl.STATIC_DRAW);
	}

	draw(gl: WebGLRenderingContext) {
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
}
