export default abstract class Geometry {
	public color: Float32List = new Float32Array([0, 0, 0, 1]);

	protected constructor(gl: WebGLRenderingContext, color?: Float32List) {
		if(color) this.color = color;
	}

	abstract draw(gl: WebGLRenderingContext): void;
}
