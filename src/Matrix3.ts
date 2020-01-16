export default class Matrix3 {
	public data: Array<number> = [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	];

	constructor(data?: Array<number>) {
		if(data) {
			if(data.length != 9) {
				throw new Error('Matrix3 needs exactly 9 items');
			}
			this.data = data;
		}
	}

	getData(): Float32List {
		return new Float32Array(this.data);
	}

	translate(tx: number, ty: number): Matrix3 {
		return Matrix3.multiply(this, Matrix3.translationMatrix(tx, ty));
	}

	rotate(radians: number): Matrix3 {
		return Matrix3.multiply(this, Matrix3.rotationMatrix(radians));
	}

	scale(sx: number, sy: number): Matrix3 {
		return Matrix3.multiply(this, Matrix3.scaleMatrix(sx, sy));
	}

	static translationMatrix(tx: number, ty: number): Matrix3 {
		return new Matrix3([
			1, 0, 0,
			0, 1, 0,
			tx, ty, 1
		]);
	}

	static rotationMatrix(radians: number): Matrix3 {
		const c = Math.cos(radians);
		const s = Math.sin(radians);
		return new Matrix3([
			c, -s, 0,
			s, c, 0,
			0, 0, 1
		]);
	}

	static scaleMatrix(sx: number, sy: number): Matrix3 {
		return new Matrix3([
			sx, 0, 0,
			0, sy, 0,
			0, 0, 1
		]);
	}

	static projectionMatrix(width: number, height: number): Matrix3 {
		// Note: This matrix flips the Y axis so that 0 is at the top.
		return new Matrix3([
			2 / width, 0, 0,
			0, -2 / height, 0,
			-1, 1, 1
		]);
	}

	static multiply(a: Matrix3, b: Matrix3): Matrix3 {
		return new Matrix3([
			b.data[0] * a.data[0] + b.data[1] * a.data[3] + b.data[2] * a.data[6],
			b.data[0] * a.data[1] + b.data[1] * a.data[4] + b.data[2] * a.data[7],
			b.data[0] * a.data[2] + b.data[1] * a.data[5] + b.data[2] * a.data[8],
			b.data[3] * a.data[0] + b.data[4] * a.data[3] + b.data[5] * a.data[6],
			b.data[3] * a.data[1] + b.data[4] * a.data[4] + b.data[5] * a.data[7],
			b.data[3] * a.data[2] + b.data[4] * a.data[5] + b.data[5] * a.data[8],
			b.data[6] * a.data[0] + b.data[7] * a.data[3] + b.data[8] * a.data[6],
			b.data[6] * a.data[1] + b.data[7] * a.data[4] + b.data[8] * a.data[7],
			b.data[6] * a.data[2] + b.data[7] * a.data[5] + b.data[8] * a.data[8]
		]);
	}
}
