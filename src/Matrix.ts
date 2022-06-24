export default class Matrix {
	public readonly data: Float32List = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	constructor(data?: Float32List) {
		if(data) {
			if(data.length != 16) {
				throw new Error('Matrix needs exactly 16 items');
			}
			this.data = data;
		}
	}

	translate(tx: number, ty: number, tz: number): Matrix {
		return Matrix.multiply(this, Matrix.translationMatrix(tx, ty, tz));
	}

	rotate(rx: number, ry: number, rz: number): Matrix {
		let rotate = new Matrix();
		rotate = Matrix.multiply(rotate, Matrix.xRotationMatrix(rx));
		rotate = Matrix.multiply(rotate, Matrix.yRotationMatrix(ry));
		rotate = Matrix.multiply(rotate, Matrix.zRotationMatrix(rz));
		return rotate;
	}

	scale(sx: number, sy: number, sz: number): Matrix {
		return Matrix.multiply(this, Matrix.scaleMatrix(sx, sy, sz));
	}

	static translationMatrix(tx: number, ty: number, tz: number): Matrix {
		return new Matrix([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			tx, ty, tz, 1
		]);
	}

	static xRotationMatrix(radians: number): Matrix {
		const c = Math.cos(radians);
		const s = Math.sin(radians);
		return new Matrix([
			1, 0, 0, 0,
			0, c, s, 0,
			0, -s, c, 0,
			0, 0, 0, 1
		]);
	}

	static yRotationMatrix(radians: number): Matrix {
		const c = Math.cos(radians);
		const s = Math.sin(radians);
		return new Matrix([
			c, 0, -s, 0,
			0, 1, 0, 0,
			s, 0, c, 0,
			0, 0, 0, 1
		]);
	}

	static zRotationMatrix(radians: number): Matrix {
		const c = Math.cos(radians);
		const s = Math.sin(radians);
		return new Matrix([
			c, s, 0, 0,
			-s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	}

	static scaleMatrix(sx: number, sy: number, sz: number): Matrix {
		return new Matrix([
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, sz, 0,
			0, 0, 0, 1
		]);
	}

	static projectionMatrix(width: number, height: number, depth): Matrix {
		// Note: This matrix flips the Y axis so that 0 is at the top.
		return new Matrix([
			2 / width, 0, 0, 0,
			0, -2 / height, 0, 0,
			0, 0, 2 / depth, 0,
			-1, 1, 0, 1
		]);
	}

	static multiply(a: Matrix, b: Matrix): Matrix {
		return new Matrix([
			b.data[0] * a.data[0] + b.data[1] * a.data[4] + b.data[2] * a.data[8] + b.data[3] * a.data[12],
			b.data[0] * a.data[1] + b.data[1] * a.data[5] + b.data[2] * a.data[9] + b.data[3] * a.data[13],
			b.data[0] * a.data[2] + b.data[1] * a.data[6] + b.data[2] * a.data[10] + b.data[3] * a.data[14],
			b.data[0] * a.data[3] + b.data[1] * a.data[7] + b.data[2] * a.data[11] + b.data[3] * a.data[15],
			b.data[4] * a.data[0] + b.data[5] * a.data[4] + b.data[6] * a.data[8] + b.data[7] * a.data[12],
			b.data[4] * a.data[1] + b.data[5] * a.data[5] + b.data[6] * a.data[9] + b.data[7] * a.data[13],
			b.data[4] * a.data[2] + b.data[5] * a.data[6] + b.data[6] * a.data[10] + b.data[7] * a.data[14],
			b.data[4] * a.data[3] + b.data[5] * a.data[7] + b.data[6] * a.data[11] + b.data[7] * a.data[15],
			b.data[8] * a.data[0] + b.data[9] * a.data[4] + b.data[10] * a.data[8] + b.data[11] * a.data[12],
			b.data[8] * a.data[1] + b.data[9] * a.data[5] + b.data[10] * a.data[9] + b.data[11] * a.data[13],
			b.data[8] * a.data[2] + b.data[9] * a.data[6] + b.data[10] * a.data[10] + b.data[11] * a.data[14],
			b.data[8] * a.data[3] + b.data[9] * a.data[7] + b.data[10] * a.data[11] + b.data[11] * a.data[15],
			b.data[12] * a.data[0] + b.data[13] * a.data[4] + b.data[14] * a.data[8] + b.data[15] * a.data[12],
			b.data[12] * a.data[1] + b.data[13] * a.data[5] + b.data[14] * a.data[9] + b.data[15] * a.data[13],
			b.data[12] * a.data[2] + b.data[13] * a.data[6] + b.data[14] * a.data[10] + b.data[15] * a.data[14],
			b.data[12] * a.data[3] + b.data[13] * a.data[7] + b.data[14] * a.data[11] + b.data[15] * a.data[15]
		]);
	}
}
