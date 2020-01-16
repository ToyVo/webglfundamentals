export default class Rectangle {
	public color: Float32List = new Float32Array([0, 0, 0, 1]);

	constructor(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number, color?: Float32List) {
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
		if(color && color.length == 4) this.color = color;
	}

	draw(gl: WebGLRenderingContext) {
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
}
