import { Entity } from "../live/entity";

export class HashGrid {
	public grid: Map<number, Entity[]> = new Map<number, Entity[]>();
	public shift: number;
	constructor(shift: number) {
		this.shift = shift;
	}

	public clear(): void {
		this.grid.clear();
	}

	public insert(entity: Entity): void {
		const startX: number = entity.x1 >> this.shift;
		const startY: number = entity.y1 >> this.shift;
		const endX: number = entity.x2 >> this.shift;
		const endY: number = entity.y2 >> this.shift;
		if (startX === endX) {
			if (startY === endY) {
				this._processInsert(entity, startX, startY);
			} else {
				for (let i: number = startY; i <= endY; i++) {
					this._processInsert(entity, startX, i);
				}
			}
		} else if (startY === endY) {
			for (let i: number = startX; i <= endX; i++) {
				this._processInsert(entity, i, startY);
			}
		} else {
			for (let i: number = startY; i <= endY; i++) {
				for (let j: number = startX; j <= endX; j++) {
					this._processInsert(entity, j, i);
				}
			}
		}
	}

	public query(minX: number, minY: number, maxX: number, maxY: number, callback: (entity: Entity) => void): void {
		const startX: number = minX >> this.shift;
		const startY: number = minY >> this.shift;
		const endX: number = maxX >> this.shift;
		const endY: number = maxY >> this.shift;
		if (startX === endX) {
			if (startY === endY) {
				this._processQuery(startX, startY, minX, minY, maxX, maxY, callback);
			} else {
				for (let i: number = startY; i <= endY; i++) {
					this._processQuery(startX, i, minX, minY, maxX, maxY, callback);
				}
			}
		} else if (startY === endY) {
			for (let i: number = startX; i <= endX; i++) {
				this._processQuery(i, startY, minX, minY, maxX, maxY, callback);
			}
		} else {
			for (let i: number = startY; i <= endY; i++) {
				for (let j: number = startX; j <= endX; j++) {
					this._processQuery(j, i, minX, minY, maxX, maxY, callback);
				}
			}
		}
	}

	public collisions(callback: (instance: Entity, other: Entity) => void): void {
		const processed: Set<number> = new Set();
		for (const cell of this.grid.values()) {
			const cellLength: number = cell.length;
			if (cellLength < 2) {
				continue;
			}
			for (let i: number = 0; i < cellLength; i++) {
				const instance: Entity = cell[i];
				const instanceIndex: number = instance.index;
				for (let j: number = i + 1; j < cellLength; j++) {
					const other = cell[j];
					const otherIndex: number = other.index;
					const key: number = instanceIndex < otherIndex ? (otherIndex << 16) | instanceIndex : (instanceIndex << 16) | otherIndex;
					if (processed.has(key)) {
						continue;
					}
					processed.add(key);
					if (!(instance.x2 < other.x1 || instance.x1 > other.x2 || instance.y2 < other.y1 || instance.y1 > other.y2)) {
						callback(instance, other);
					}
				}
			}
		}
	}

	private _processInsert(entity: Entity, gridX: number, gridY: number): void {
		const key: number = (gridY << 16) | gridX;
		const cell: Entity[] | undefined = this.grid.get(key);
		if (cell === undefined) {
			this.grid.set(key, [entity]);
		} else {
			cell.push(entity);
		}
	}

	private _processQuery(gridX: number, gridY: number, minX: number, minY: number, maxX: number, maxY: number, callback: (entity: Entity) => void): void {
		const key: number = (gridY << 16) | gridX;
		const cell: Entity[] | undefined = this.grid.get(key);
		if (cell !== undefined) {
			const cellLength: number = cell.length;
			for (let i = 0; i < cellLength; i++) {
				const entity: Entity = cell[i];
				if (entity.x1 < maxX && entity.x2 > minX && entity.y1 < maxY && entity.y2 > minY) {
					callback(entity);
				}
			}
		}
	}
}