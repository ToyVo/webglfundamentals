export default class Vector {
	public readonly data: Float32Array;

	get x() {
		return this.data[0];
	}

	get y() {
		return this.data[1];
	}

	get z() {
		return this.data[2];
	}

	/**
	 * Creates a vector. If no parameter is given, the vector is set to
	 * all 0's. If values is provided it should be an array
	 * and it will provide UP TO 3 values for the vector. If there are
	 * less than 3 values, the remaining values in the array should
	 * set to 0. If there are more than 3, the rest should be ignored.
	 */
	constructor(values?: Float32List) {
		this.data = new Float32Array([0, 0, 0, 0]);

		if(values) {
			for(let i = 0; i < values.length && i < 3; i++) {
				this.data[i] = values[i];
			}
		}
	}

	crossProduct(vector: Vector): Vector {
		return new Vector(new Float32Array([
			this.y * vector.z - this.z * vector.y,
			this.z * vector.x - this.x * vector.z,
			this.x * vector.y - this.y * vector.x
		]));
	}

	dotProduct(vector: Vector): number {
		return this.x * vector.x + this.y * vector.y + this.z * vector.z;
	}

	normalize(): Vector {
		const length = this.length();
		if(length !== 0) {
			return this.scale(1 / length);
		} else {
			return new Vector();
		}
	}

	length(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
	}

	scale(s: number): Vector {
		return new Vector([this.x * s, this.y * s, this.z * s]);
	}

	add(vector: Vector): Vector {
		return new Vector([this.x + vector.x, this.y + vector.y, this.z + vector.z]);
	}

	subtract(vector: Vector): Vector {
		return new Vector([this.x - vector.x, this.y - vector.y, this.z - vector.z]);
	}
}
