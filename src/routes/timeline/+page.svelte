<script lang="ts">
	import type { VertexMeta, EdgeMeta } from '$lib/types';
	import { Node, Svelvet, Minimap, Controls, Edge, Anchor } from 'svelvet';
	import verticesSrc from '$lib/nasuverse/timeline/vertices.json';
	import edgesSrc from '$lib/nasuverse/timeline/edges.json';
	import DiGraph from '$lib/Graph';
	import CustomEdge from '$lib/components/CustomEdge.svelte';

	const vertexSize = { width: 200, height: 100 };

	const vertices = verticesSrc as VertexMeta[];
	const edges = edgesSrc as EdgeMeta[];

	const graph = new DiGraph(vertices, {
		vertexSize,
		gap: 50
	});

	for (const edge of edges) {
		graph.addEdge(edge.from, edge.to);
	}

	const vertexMap = graph.Vertices;
</script>

<Svelvet minimap>
	{#each [...vertexMap.values()] as vertex}
		<Node
			id={vertex.id}
			position={{ x: vertex.position.x, y: vertex.position.y }}
			dimensions={vertexSize}
			label={vertex.metadata.name}
			connections={graph.adjacent(vertex.id)}
			edge={CustomEdge}
		/>
	{/each}
</Svelvet>
