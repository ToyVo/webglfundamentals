export default class F {
	public color: Float32List = new Float32Array([0, 0, 0, 1]);

	constructor(gl: WebGLRenderingContext, color?: Float32List) {
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
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
			]),
			gl.STATIC_DRAW);

		if(color && color.length == 4) this.color = color;
	}

	public draw(gl: WebGLRenderingContext): void {
		gl.drawArrays(gl.TRIANGLES, 0, 18);
	}

}
