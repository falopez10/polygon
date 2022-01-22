import React, { FC, useRef, useState } from 'react';
const polygonNames = require("../data/polygonNames.json");

interface Vertex {
    id: number;
    x: number;
    y: number;
}

interface Edge {
    id: number;
    from: Vertex;
    to: Vertex;
}

export const Canvas: FC = () => {
    const rectEl: any = useRef();
    const idCount = useRef(0);
    const [vertices, setVertices] = useState<Vertex[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [completed, setCompleted] = useState<boolean>(false);

    function addEdge(from: Vertex, to: Vertex) {
        const newEdge: Edge = { from, to, id: to.id };
        setEdges(prevEdges => [...prevEdges, newEdge]);
    }
    function addVertex(event: React.MouseEvent<SVGRectElement>) {
        if (completed) return;
        event.preventDefault();
        const { clientX, clientY } = event;

        const { x, y } = rectEl.current.getBoundingClientRect();

        const id = idCount.current++;
        const newVertex: Vertex = { id, x: clientX - x, y: clientY - y };
        //add Vertex
        setVertices(prevVertices => {
            return [...prevVertices, newVertex];
        });
        // add edge when there's 2 or more vertices
        if (vertices.length > 0) {
            addEdge(vertices[vertices.length - 1], newVertex);
        }
    }
    function complete() {
        addEdge(vertices[vertices.length - 1], vertices[0]);
        setCompleted(true);
    }
    function reset() {
        setCompleted(false);
        setVertices([]);
        setEdges([]);
    }

    return <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
        <svg style={{ margin: 16, width: "80%", height: "400" }}>
            <rect ref={rectEl} width="100%" height="100%" style={{
                fill: "#DDDDDD",
                strokeWidth: 5,
                stroke: "black",
                cursor: completed ? "auto" : "pointer"
            }}
                onClick={addVertex}
            >
            </rect>
            {
                edges.map(({ id, from, to }) => <path
                    key={id}
                    className="draw"
                    d={` M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                    fill="blue"
                    stroke="blue"
                    strokeWidth={3}
                />)
            }
            {
                vertices.map(({ id, x, y }, index) =>
                    <circle className="draw" key={id} cx={x} cy={y} r={7} fill="black"
                        style={{ cursor: vertices.length > 2 && index === 0 ? "pointer" : "auto" }}
                        onClick={vertices.length > 2 && index === 0 ? complete : undefined}
                    />
                )
            }
        </svg>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={complete} disabled={completed || vertices.length < 3}>Complete</button>
            <button onClick={reset}>Reset</button>
        </div>
        {completed && <div>
            <h3> 🎉 Congratulations! You have created a {polygonNames[edges.length].commonName ?? polygonNames[edges.length].name} 🎉</h3>
            <h5>(<i>that just means you made a {edges.length} sided polygon</i> 😃)</h5>
        </div>}
    </div>;
};
