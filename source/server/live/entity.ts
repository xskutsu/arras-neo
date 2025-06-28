export class Entity {
	public static instances: Map<number, Entity> = new Map<number, Entity>();
	private static _nextIndex: number = 1;

	public index: number = Entity._nextIndex++;
	public x1: number = 0;
	public y1: number = 0;
	public x2: number = 0;
	public y2: number = 0;
}