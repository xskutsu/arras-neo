import { Vector } from "../core/vector";

export enum Cell {
	Normal,
	Nest,
	Rock
}

export class Room {
	public static instances: Map<number, Room> = new Map<number, Room>();
	public static index: number = 1;

	public index: number = Room.index++;
	public width: number;
	public height: number;
	public layout: Cell[][];
	public columns: number;
	public rows: number;
	private _cellMap: Map<Cell, number[]> = new Map<Cell, number[]>();
	private _lastTickTime: number = performance.now();
	private _cellWidth: number;
	private _cellHeight: number;
	constructor(width: number, height: number, layout: Cell[][]) {
		this.width = width;
		this.height = height;
		this.layout = layout;
		this.columns = layout[0].length;
		this.rows = layout.length;
		this._cellWidth = this.width / this.columns;
		this._cellHeight = this.height / this.rows;
		this._makeCellMap();
		Room.instances.set(this.index, this);
	}

	public getRandom(): Vector {
		return {
			x: this.width * Math.random(),
			y: this.height * Math.random()
		};
	}

	public getRandomByType(cellType: Cell): Vector {
		const cells: number[] | undefined = this._cellMap.get(cellType);
		if (cells === undefined) {
			throw new Error(`Cell type "${cellType}" is not in room "${this.index}".`);
		}
		const index: number = Math.floor(Math.random() * cells.length / 2);
		return {
			x: cells[index] + this._cellWidth * Math.random(),
			y: cells[index] + this._cellHeight * Math.random()
		}
	}

	public isInBounds(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	public isInCell(x: number, y: number, cellType: Cell): boolean {
		return this.isInBounds(x, y) ? this.layout[Math.floor(y / this._cellHeight)][Math.floor(x / this._cellWidth)] === cellType : false;
	}

	public destroy() {
		Room.instances.delete(this.index);
	}

	private _makeCellMap(): void {
		this._cellMap.clear();
		for (let i: number = 0; i < this.rows; i++) {
			const row: Cell[] = this.layout[i];
			for (let j: number = 0; j < this.columns; j++) {
				const x: number = this._cellWidth * j;
				const y: number = this._cellHeight * i;
				const cell: Cell = row[j];
				const cells: number[] | undefined = this._cellMap.get(cell);
				if (cells === undefined) {
					this._cellMap.set(cell, [x, y]);
				} else {
					cells.push(x, y);
				}
			}
		}
	}
}