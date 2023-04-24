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

// A function to find BlockingFlow
function findBlockingFlow(levelGraph, residualGraph, u, t, flow) {
    // u = current user , t = target user
    // when meet target user, return flow
    if (u === t) {
        return flow;
    }

    // N = number of users
    const N = residualGraph.length;
    let currentFlow = 0;

    for (let i = 0; i < N; i++) {
        // If user[u] has debt with user[i] , and user[i] is user[u]'s neighborhood,
        // try finding BlockingFlow between them.
        if (residualGraph[u][i] > 0 && levelGraph[i] === levelGraph[u] + 1) {
            const minFlow = Math.min(flow - currentFlow, residualGraph[u][i]);
            const delta = findBlockingFlow(
                levelGraph,
                residualGraph,
                i,
                t,
                minFlow
            );

            if (delta > 0) {
                currentFlow += delta;
                // console.log(currentFlow);
                // console.log("origin", residualGraph);
                residualGraph[u][i] -= delta;
                // residualGraph[i][u] += delta;
                // console.log("updated", residualGraph);
            }
        }
    }

    return currentFlow;
}

function updateGraph(graph, residualGraph, source, sink, maxFlow) {
    const n = graph.length;
    // console.log(maxFlow);
    // console.log("//////");
    // console.log("inside update function residual", residualGraph);
    residualGraph[source][sink] = maxFlow;
    // console.log("inside update function residual", residualGraph);
    // console.log("//////");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (residualGraph[i][j] > 0) {
                // 將原本的邊減去 blocking flow
                graph[i][j] -= maxFlow;
                // 將反向邊加上 blocking flow
                graph[j][i] += maxFlow;
            }
        }
    }
    // console.log(graph);
}

// A function to figure out maxFlow within specific source and sink
function dinicMaxFlow(graph, source, sink) {
    let maxFlow = 0;
    let levelGraph;
    let blockingFlow = 0;

    // Check if there's any edge between source and sink
    if (graph[source][sink] === 0) {
        // TODO:
        // console.log(
        //     `There's no path between source = ${source} and sink = ${sink}!`
        // );
        return { maxFlow, residualGraph: graph };
    }

    // build residual graph
    const residualGraph = buildResidualGraph(graph);

    // loop until there's no blocking flow in the residual graph
    while (levelGraph !== null) {
        levelGraph = buildLevelGraph(residualGraph, source, sink);
        if (levelGraph === null) {
            break;
        }

        blockingFlow = Infinity;
        while (
            (blockingFlow = findBlockingFlow(
                levelGraph,
                residualGraph,
                source,
                sink,
                Infinity
            )) > 0
        ) {
            // // update residual graph
            // updateResidualGraph(
            //     residualGraph,
            //     levelGraph,
            //     blockingFlow,
            //     source,
            //     sink
            // );
            // update max flow
            maxFlow += blockingFlow;
            // console.log(blockingFlow);
        }
    }

    // console.log("before update", graph);
    // update original graph
    updateGraph(graph, residualGraph, source, sink, maxFlow);
    // console.log("after update", graph);
    // TODO:
    // console.log(`[source = ${source} and sink = ${sink}] maxFlow = ${maxFlow}`);
    // console.log("residual", residualGraph);
    return { maxFlow, residualGraph, levelGraph };
}

function minimizeDebts(graph) {
    const N = graph.length;
    let residualGraph = buildResidualGraph(graph);
    for (let source = 0; source < N; source++) {
        for (let sink = 0; sink < N; sink++) {
            const dinicResult = dinicMaxFlow(residualGraph, source, sink);
            residualGraph = dinicResult.residualGraph;
            // console.log(residualGraph);
        }
    }

    const cutEdges = new Set();
    const levelGraph = buildLevelGraph(residualGraph, 0, graph.length - 1);
    // const levelGraph = buildLevelGraph(graph, source, sink);

    // console.log(levelGraph);

    // Find all edges crossing the cut
    for (let i = 0; i < N; i++) {
        if (levelGraph !== null && levelGraph[i] !== -1) {
            for (let j = 0; j < N; j++) {
                // if (levelGraph[j] === -1 && graph[i][j] !== 0) {
                if (levelGraph[j] === -1 && residualGraph[i][j] !== 0) {
                    cutEdges.add(`${i}-${j}`);
                }
            }
        }
    }

    // Simplify the graph by removing all edges that cross the cut
    const simplifiedGraph = new Array(N)
        .fill(null)
        .map(() => new Array(N).fill(0));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            // if (!cutEdges.has(`${i}-${j}`) && graph[i][j] !== 0) {
            if (!cutEdges.has(`${i}-${j}`) && residualGraph[i][j] !== 0) {
                // simplifiedGraph[i][j] = graph[i][j];
                simplifiedGraph[i][j] = residualGraph[i][j];
            }
        }
    }
    // TODO:
    // console.log("Simplify the graph", simplifiedGraph);

    // // Determine who owes how much money to whom
    // const transactions = calculateTransaction(simplifiedGraph);
    const transactions = minimizeTransaction(simplifiedGraph);
    return transactions;
}

function minimizeTransaction(graph) {
    const N = graph.length;

    // Calculate total debts and credits for each person
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            if (i === j) {
                continue;
            }
            if (graph[i][j] !== 0 && graph[j][i] !== 0) {
                if (graph[i][j] >= graph[j][i]) {
                    graph[i][j] = graph[i][j] - graph[j][i];
                    graph[j][i] = 0;
                } else {
                    graph[j][i] = graph[j][i] - graph[i][j];
                    graph[i][j] = 0;
                }
            }
        }
    }

    // Determine who owes how much money to whom
    let transactions = [];
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph.length; j++) {
            if (graph[i][j] !== 0) {
                transactions.push([j, i, graph[i][j]]);
            }
        }
    }
    return transactions;
}

const calculateTransaction = (graph) => {
    const transactions = [];
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph.length; j++) {
            if (graph[i][j] !== 0) {
                transactions.push([j, i, graph[i][j]]);
            }
        }
    }
    // TODO:
    // console.log(transactions);
    return transactions;
};

export { minimizeDebts };