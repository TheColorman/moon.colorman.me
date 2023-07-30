import type { VertexMeta } from './types';

type Vertex = {
	id: number;
	metadata: VertexMeta;
	size: { width: number; height: number };
	position: { x: number; y: number };
};

type Point = {
	x: number;
	y: number;
};
/**
 *  Credit to https://www.geeksforgeeks.org/find-two-rectangles-overlap/
 */
function doOverlap(l1: Point, r1: Point, l2: Point, r2: Point) {
	// if rectangle has area 0, no overlap
	if (l1.x == r1.x || l1.y == r1.y || r2.x == l2.x || l2.y == r2.y) return false;

	// If one rectangle is on left side of other
	if (l1.x > r2.x || l2.x > r1.x) return false;

	// If one rectangle is above other
	if (r1.y < l2.y || r2.y < l1.y) return false;

	return true;
}
export default class DiGraph {
	_V: number; // number of vertices
	_E: number; // number of edges
	_adj: Map<number, Set<number>>; // adjacency list
	_vertices: Map<number, Vertex>;
	_options: { vertexSize: { width: number; height: number }; gap: number };

	constructor(
		Vertices: VertexMeta[],
		{ vertexSize, gap }: { vertexSize: { width: number; height: number }; gap: number }
	) {
		this._V = Vertices.length;
		this._E = 0;
		this._adj = new Map();
		this._vertices = new Map();
		this._options = { vertexSize, gap };

		for (const v of Vertices) {
			this._adj.set(v.id, new Set());
			this._vertices.set(v.id, {
				id: v.id,
				metadata: v,
				size: vertexSize,
				position: { x: 0, y: 0 }
			});
		}
	}

	get V() {
		return this._V;
	}
	get E() {
		return this._E;
	}
	get Vertices() {
		return this._vertices;
	}

	_validateVertex(v: number) {
		if (!this._adj.has(v)) throw new Error(`Vertex ${v} does not exist in graph`);
	}

	addEdge(v: number, w: number) {
		this._validateVertex(v);

		this._adj.get(v)?.add(w);
		this._E++;

		// Set position of w to be right of v
		const vPos = this._vertices.get(v)?.position;
		const wPos = vPos
			? { x: vPos.x + this._options.vertexSize.width + this._options.gap, y: vPos.y }
			: { x: 0, y: 0 };
		// Check if wPos is inside the subtree rooted at v
		// If it is, we want to move the subtree to make room.
		const subtreeDims = this.subtreeDimensions(v);
		if (
			doOverlap(
				{ x: wPos.x, y: wPos.y },
				{ x: wPos.x + this._options.vertexSize.width, y: wPos.y + this._options.vertexSize.height },
				{ x: subtreeDims.left, y: subtreeDims.top },
				{ x: subtreeDims.right, y: subtreeDims.bottom }
			)
		) {
			this.shiftSubtreeVertical(v);
		}

		this._vertices.set(w, {
			id: w,
			metadata: this._vertices.get(w)?.metadata || { id: w, name: '', year: 0 },
			size: this._options.vertexSize,
			position: wPos
		});
	}

	subtree(v: number) {
		this._validateVertex(v);

		const subtree = new Set<number>();
		const dfs = (v: number) => {
			subtree.add(v);
			for (const w of this._adj.get(v) || []) {
				if (!subtree.has(w)) dfs(w);
			}
		};
		dfs(v);

		return subtree;
	}
	subtreeDimensions(v: number) {
		const subtree = this.subtree(v);

		const bounds = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0
		};

		const gap = this._options.gap;
		for (const w of subtree) {
			const pos = this._vertices.get(w)?.position;
			const size = this._vertices.get(w)?.size;
			if (pos && size) {
				// Calculate bounds of vertex
				const top = pos.y;
				const bottom = pos.y + size.height;
				const left = pos.x;
				const right = pos.x + size.width;
				// Update bounds
				bounds.top = Math.min(bounds.top, top);
				bounds.bottom = Math.max(bounds.bottom, bottom + gap);
				bounds.left = Math.min(bounds.left, left);
				bounds.right = Math.max(bounds.right, right + gap);
			}
		}

		return bounds;
	}
	shiftSubtreeVertical(v: number) {
		const subtree = this.subtree(v);
		// Shift every node in the subtree up by one node and a gap
		const gap = this._options.gap;
		for (const w of subtree) {
			if (v == w) continue;
			const pos = this._vertices.get(w)?.position;
			if (pos) {
				pos.y += gap + this._options.vertexSize.height;
			}
		}
	}
	adjacent(v: number) {
		this._validateVertex(v);

		const a = [...(this._adj.get(v) || [])];
		return a;
	}
}
