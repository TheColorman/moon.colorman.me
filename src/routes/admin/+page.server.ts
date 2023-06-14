import fs from 'fs/promises';
import path from 'path';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    addVertex: async ({ request }) => {
        const data = await request.formData();
        
        // Load json file
        const jsonPath = path.join(process.cwd(), 'src', 'lib', 'nasuverse', 'vertices.json');
        const json = await fs.readFile(jsonPath, 'utf-8');
        const vertices = JSON.parse(json);

        // Add new vertex
        const vertex = {
            id: vertices.length,
            title: data.get('title'),
            released: data.get('released'),
            ended: data.get('ended'),
            medium: data.get('medium'),
        }
        vertices.push(vertex);

        // Save json file
        await fs.writeFile(jsonPath, JSON.stringify(vertices, null, 4));
    },
    
    addEdge: async ({ request }) => {
        const data = await request.formData();

        // Load json file
        const jsonPath = path.join(process.cwd(), 'src', 'lib', 'nasuverse', 'edges.json');
        const json = await fs.readFile(jsonPath, 'utf-8');
        const edges = JSON.parse(json);

        // Add new edge
        const edge = {
            id: edges.length,
            source: data.get('source'),
            target: data.get('target'),
            type: data.get('type'),
        }
        edges.push(edge);

        // Save json file
        await fs.writeFile(jsonPath, JSON.stringify(edges, null, 4));
    }
}