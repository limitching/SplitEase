// A function to build residual graph
function buildResidualGraph(graph) {
    const N = graph.length;
    const residualGraph = new Array(N);

    // Deep copy current graph
    for (let i = 0; i < N; i++) {
        residualGraph[i] = new Array(N).fill(0);
        for (let j = 0; j < N; j++) {
            residualGraph[i][j] = graph[i][j];
        }
    }
    return residualGraph;
}

export { buildResidualGraph };
