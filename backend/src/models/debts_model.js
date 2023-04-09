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

// A function to build levelGraph
function buildLevelGraph(residualGraph, start, end) {
    const N = residualGraph.length;
    const levelGraph = new Array(N).fill(-1);
    const queue = [];
    queue.push(start);
    levelGraph[start] = 0;

    while (queue.length > 0) {
        const u = queue.shift();
        for (let v = 0; v < N; v++) {
            if (residualGraph[u][v] > 0 && levelGraph[v] === -1) {
                levelGraph[v] = levelGraph[u] + 1;
                queue.push(v);
            }
        }
    }

    if (levelGraph[end] === -1) {
        return null;
    } else {
        return levelGraph;
    }
}

export { buildResidualGraph, buildLevelGraph };
