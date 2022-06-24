import Vector from './Vector';

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
		return this.multiply(Matrix.translationMatrix(tx, ty, tz));
	}

	rotate(radiansX: number, radiansY: number, radiansZ: number): Matrix {
		return this.rotateX(radiansX).rotateY(radiansY).rotateZ(radiansZ);
	}

	rotateX(radians): Matrix {
		return this.multiply(Matrix.xRotationMatrix(radians));
	}

	rotateY(radians): Matrix {
		return this.multiply(Matrix.yRotationMatrix(radians));
	}

	rotateZ(radians): Matrix {
		return this.multiply(Matrix.zRotationMatrix(radians));
	}

	scale(sx: number, sy: number, sz: number): Matrix {
		return this.multiply(Matrix.scaleMatrix(sx, sy, sz));
	}

	getValue(row: number, column: number): number {
		return this.data[row * 4 + column];
	}

	setValue(row: number, column: number, value: number): void {
		this.data[row * 4 + column] = value;
	}

	multiply(matB: Matrix): Matrix {
		const result = [];

		for(let row = 0; row < 4; row++) {
			for(let column = 0; column < 4; column++) {
				result.push(
					this.getValue(0, column) * matB.getValue(row, 0) +
					this.getValue(1, column) * matB.getValue(row, 1) +
					this.getValue(2, column) * matB.getValue(row, 2) +
					this.getValue(3, column) * matB.getValue(row, 3)
				);
			}
		}

		return new Matrix(result);
	}

	multiplyVector(vector: Vector): Vector {
		const dst = [];
		for(let column = 0; column < 4; ++column) {
			dst[column] = 0;
			for(let row = 0; row < 4; ++row) {
				dst[column] += vector[row] * this.getValue(row, column);
			}
		}
		return new Vector(dst);
	}

	multiplyConstant(x: number): Matrix {
		const data = [];
		this.data.forEach((entry) => {
			data.push(entry * x);
		});
		return new Matrix(data);
	}

	inverse(): Matrix {
		const m00 = this.getValue(0, 0);
		const m01 = this.getValue(0, 1);
		const m02 = this.getValue(0, 2);
		const m03 = this.getValue(0, 3);
		const m10 = this.getValue(1, 0);
		const m11 = this.getValue(1, 1);
		const m12 = this.getValue(1, 2);
		const m13 = this.getValue(1, 3);
		const m20 = this.getValue(2, 0);
		const m21 = this.getValue(2, 1);
		const m22 = this.getValue(2, 2);
		const m23 = this.getValue(2, 3);
		const m30 = this.getValue(3, 0);
		const m31 = this.getValue(3, 1);
		const m32 = this.getValue(3, 2);
		const m33 = this.getValue(3, 3);
		const tmp_0 = m22 * m33;
		const tmp_1 = m32 * m23;
		const tmp_2 = m12 * m33;
		const tmp_3 = m32 * m13;
		const tmp_4 = m12 * m23;
		const tmp_5 = m22 * m13;
		const tmp_6 = m02 * m33;
		const tmp_7 = m32 * m03;
		const tmp_8 = m02 * m23;
		const tmp_9 = m22 * m03;
		const tmp_10 = m02 * m13;
		const tmp_11 = m12 * m03;
		const tmp_12 = m20 * m31;
		const tmp_13 = m30 * m21;
		const tmp_14 = m10 * m31;
		const tmp_15 = m30 * m11;
		const tmp_16 = m10 * m21;
		const tmp_17 = m20 * m11;
		const tmp_18 = m00 * m31;
		const tmp_19 = m30 * m01;
		const tmp_20 = m00 * m21;
		const tmp_21 = m20 * m01;
		const tmp_22 = m00 * m11;
		const tmp_23 = m10 * m01;

		const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
		const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
		const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
		const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

		const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

		return new Matrix([
			d * t0,
			d * t1,
			d * t2,
			d * t3,
			d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
			d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
			d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
			d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
			d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
			d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
			d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
			d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
			d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
			d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
			d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
			d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
		]);
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

	static projectionMatrix(width: number, height: number, depth: number): Matrix {
		// Note: This matrix flips the Y axis so that 0 is at the top.
		return new Matrix([
			2 / width, 0, 0, 0,
			0, -2 / height, 0, 0,
			0, 0, 2 / depth, 0,
			-1, 1, 0, 1
		]);
	}

	static orthographicMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix {
		return new Matrix([
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, 2 / (near - far), 0,

			(left + right) / (left - right),
			(bottom + top) / (bottom - top),
			(near + far) / (near - far),
			1
		]);
	}

	static perspectiveMatrix(fieldOfViewRadians: number, aspectRatio: number, near, far): Matrix {
		const fov = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewRadians);
		const rangeInv = 1 / (near - far);

		return new Matrix([
			fov / aspectRatio, 0, 0, 0,
			0, fov, 0, 0,
			0, 0, (near + far) * rangeInv, -1,
			0, 0, near * far * rangeInv * 2, 0
		]);
	}

	static lookAtMatrix(cameraPosition: Vector, targetPosition: Vector, upDirection: Vector) {
		const zDirection = cameraPosition.subtract(targetPosition).normalize();
		const xDirection = upDirection.crossProduct(zDirection).normalize();
		const yDirection = zDirection.crossProduct(xDirection).normalize();

		return new Matrix([
			xDirection.x, xDirection.y, xDirection.z, 0,
			yDirection.x, yDirection.y, yDirection.z, 0,
			zDirection.x, zDirection.y, zDirection.z, 0,
			cameraPosition.x, cameraPosition.y, cameraPosition.z, 1
		]);
	}
}
