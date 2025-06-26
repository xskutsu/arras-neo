import fs from "fs";
import path from "path";

export enum GStat {
	Reload,
	Recoil,
	Shudder,
	Size,
	Health,
	Damage,
	Pen,
	Speed,
	MaxSpeed,
	Range,
	Density,
	Spray,
	Resistance
}

export const GStatMap: Map<string, Float16Array> = new Map<string, Float16Array>();

const filePath: string = path.resolve("source/server/definitions/gstats.csv");
if (!fs.existsSync(filePath)) {
	throw new Error(`Failed to find gstats.csv at "${filePath}".`);
}

for (let line of fs.readFileSync(filePath, "utf-8").trim().split(/\r?\n/)) {
	const content: string[] = line.split(",");
	const gstat: Float16Array = new Float16Array(13);
	for (let i: number = 1; i < content.length; i++) {
		gstat[i - 1] = parseFloat(content[i].trim());
	}
	GStatMap.set(content[0], gstat);
}

console.log(`${GStatMap.size} gun stats loaded.`);

export function GStatMatrix(gstats: (Float16Array | [GStat, number])[]): Float16Array {
	const gstat: Float16Array = new Float16Array(13).fill(1);
	for (let i: number = 0; i < gstats.length; i++) {
		if (gstats[i].length === 2) {
			gstat[gstats[i][0]] *= gstats[i][1];
		} else {
			for (let j = 0; j < 13; j++) {
				gstat[j] *= gstats[i][j];
			}
		}
	}
	return gstat;
}