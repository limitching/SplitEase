// Creates a deep copy of the input graph, returning a new 2D array with the same elements
function buildResidualGraph(graph) {
  const nodeCount = graph.length;
  const residualGraph = new Array(nodeCount);

  // Create new array and copy elements
  for (let i = 0; i < nodeCount; i++) {
    residualGraph[i] = new Array(nodeCount).fill(0); // Create new row in residual graph
    for (let j = 0; j < nodeCount; j++) {
      residualGraph[i][j] = graph[i][j]; // Copy element from input graph to residual graph
    }
  }

  return residualGraph;
}

// Build level graph using BFS traversal on residual graph
function buildLevelGraph(residualGraph, start, end) {
  const nodeCount = residualGraph.length;
  const levelGraph = new Array(nodeCount).fill(-1);

  // Set starting node's level to 0 and add to queue
  levelGraph[start] = 0;
  const queue = [start];

  // BFS traversal on residual graph
  while (queue.length) {
    const current = queue.shift();
    const neighbors = residualGraph[current];
    for (let neighbor = 0; neighbor < nodeCount; neighbor++) {
      const isPathExist = neighbors[neighbor] > 0;
      const isNeighborNotVisited = levelGraph[neighbor] === -1;
      if (isPathExist && isNeighborNotVisited) {
        levelGraph[neighbor] = levelGraph[current] + 1;
        queue.push(neighbor);
        if (neighbor === end) return levelGraph; // Early return if end node is reached
      }
    }
  }

  return null; // No path from start to end
}

// A function to find the blocking flow in a graph given the level graph and residual graph
function findBlockingFlow(
  levelGraph,
  residualGraph,
  startUser,
  targetUser,
  flow
) {
  // If the current user is the target user, the flow has reached the target and can be returned
  if (startUser === targetUser) {
    return flow;
  }

  // Get the number of users in the graph
  const numUsers = residualGraph.length;
  let currentFlow = 0;

  for (let neighborUser = 0; neighborUser < numUsers; neighborUser++) {
    // If there is residual capacity between the start user and the neighbor user
    // and the neighbor user has not been visited before
    if (
      residualGraph[startUser][neighborUser] > 0 &&
      levelGraph[neighborUser] === levelGraph[startUser] + 1
    ) {
      // Calculate the maximum flow that can be sent from start user to neighbor user
      const maxFlow = Math.min(
        flow - currentFlow,
        residualGraph[startUser][neighborUser]
      );
      // Recursively find the blocking flow from the neighbor user to the target user
      const delta = findBlockingFlow(
        levelGraph,
        residualGraph,
        neighborUser,
        targetUser,
        maxFlow
      );

      // If there is a blocking flow, update the residual graph and the flow
      if (delta > 0) {
        currentFlow += delta;
        residualGraph[startUser][neighborUser] -= delta;
      }
    }
  }

  return currentFlow;
}

// A function to update the graph
function updateGraph(graph, residualGraph, source, sink, maxFlow) {
  const N = graph.length;

  // Update residual graph with maximum flow from source to sink
  residualGraph[source][sink] = maxFlow;

  // Update flow graph with blocking flow
  // i = source, j = sink
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      // If there is flow in the residual graph, update the flow graph
      if (residualGraph[i][j] > 0) {
        graph[i][j] -= maxFlow; // Decrease flow on original edge
        graph[j][i] += maxFlow; // Increase flow on reverse edge
      }
    }
  }
}

// Find the maximum flow within a specific source and sink using Dinic's Maxflow algorithm
function dinicMaxFlow(graph, source, sink) {
  let maxFlow = 0;

  // Check if there's any edge between source and sink
  if (graph[source][sink] === 0) {
    // console.debug(
    //   `There's no path between source = ${source} and sink = ${sink}!`
    // );
    return { maxFlow, residualGraph: graph };
  }

  // Build the residual graph
  const residualGraph = buildResidualGraph(graph);

  // Loop until there are no more blocking flows in residual graph
  while (true) {
    const levelGraph = buildLevelGraph(residualGraph, source, sink);
    if (levelGraph === null) break;

    let blockingFlow = Infinity;
    while (blockingFlow > 0) {
      blockingFlow = findBlockingFlow(
        levelGraph,
        residualGraph,
        source,
        sink,
        Infinity
      );
      maxFlow += blockingFlow;
    }
  }

  // Update the original graph with the residual graph and max flow
  updateGraph(graph, residualGraph, source, sink, maxFlow);

  // Return the max flow and residual graph
  return { maxFlow, residualGraph };
}

function minimizeDebts(graph) {
  const N = graph.length;
  //   let residualGraph = buildResidualGraph(graph);
  let residualGraph = graph;

  for (let source = 0; source < N; source++) {
    for (let sink = 0; sink < N; sink++) {
      const dinicResult = dinicMaxFlow(residualGraph, source, sink);
      residualGraph = dinicResult.residualGraph;
    }
  }

  // Minimize debts from residual graph
  const transactions = getSuggestedTransaction(residualGraph);
  return transactions;
}

// A function to calculate Net for each people, positive means credit, negative mean debit
function calculateNets(graph) {
  const N = graph[0].length;
  const Nets = new Array(N).fill(0);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      Nets[j] += graph[i][j] - graph[j][i];
    }
  }
  return Nets;
}

// A function to calculate the suggestion of transaction for each subGroup to settle up
function getSuggestedTransaction(graph) {
  // Calculate total balance for each person
  const Nets = calculateNets(graph);
  // Find all non-divisible subgroups
  const subGroups = getNetZeroSubGroup(Nets);
  const nonDivisibleSubGroups = findNonDivisibleSubGroups(subGroups);
  // Calculate the net for each subGroup
  const subNets = getSubGroupsNets(nonDivisibleSubGroups, Nets);
  // Calculate the suggestion of transaction for each subGroup to settle up
  const transactions = getSettleUpTransactions(subNets);
  return transactions;
}

// A function to calculate the minimum number of transactions required to settle all debts
function getNetZeroSubGroup(nets) {
  const N = nets.length;
  // dp[currentState] = the minimum number of transactions required to settle all debts in the current state
  const dp = new Array(1 << N).fill(0);
  const sumValue = new Array(1 << N).fill(0);
  const subGroups = [];
  // Iterate through all possible states
  for (let currentState = 1; currentState < 1 << N; currentState++) {
    let bit = 1;
    let maxGroupCount = 0;
    for (let i = 0; i < N; i++) {
      if (currentState & bit) {
        sumValue[currentState] += nets[i];
        const lastState = currentState ^ bit;
        maxGroupCount = Math.max(maxGroupCount, dp[lastState]);
      }
      bit <<= 1;
    }
    // If the current state is a net zero state, update the dp array and add the current state to the subGroups array
    if (sumValue[currentState] === 0) {
      dp[currentState] = maxGroupCount + 1;

      if (currentState !== (1 << N) - 1) {
        const binaryStr = currentState.toString(2).padStart(N, 0);
        const subGroupMembers = [];
        const subNets = new Array(N).fill(0);
        for (let i = binaryStr.length; i >= 0; i--) {
          if (binaryStr[i] === "1") {
            if (nets[binaryStr.length - 1 - i] !== 0) {
              subGroupMembers.push(binaryStr.length - 1 - i);
            }
            subNets[binaryStr.length - 1 - i] = nets[binaryStr.length - 1 - i];
          }
        }
        // If the current state is not a subset of any other state, add it to the subGroups array
        if (subGroupMembers.length > 1) {
          const hasSameElements = subGroups.some((group) => {
            if (group.length !== subGroupMembers.length) return false;
            const sortedGroup = group.slice().sort();
            const sortedSubGroupMembers = subGroupMembers.slice().sort();
            return sortedGroup.every(
              (val, index) => val === sortedSubGroupMembers[index]
            );
          });

          if (!hasSameElements) {
            subGroups.push(subGroupMembers);
          }
        }
      }
    } else {
      dp[currentState] = maxGroupCount;
    }
  }
  // If there is no net zero state, add all people to the subGroups array
  if (subGroups.length === 0) {
    subGroups.push(Array.from(Array(N).keys()));
  }
  //minTransferStep = N - dp[(1 << N) - 1]
  return subGroups;
}

// A function to find all non-divisible subgroups
function findNonDivisibleSubGroups(allSubGroups) {
  // Sort allSubGroups by length
  allSubGroups.sort((a, b) => {
    return a.length - b.length;
  });

  const uniqueSet = new Set(allSubGroups.map(JSON.stringify));
  const uniqueSubGroups = Array.from(uniqueSet).map(JSON.parse);
  const filteredSubGroups = uniqueSubGroups.filter((subGroup) => {
    // Determine whether there are other subsets that completely contain the current subset
    const isSubset = uniqueSubGroups.some((otherSubGroup) => {
      if (otherSubGroup === subGroup) {
        return false;
      }
      return subGroup.every((element) => otherSubGroup.includes(element));
    });
    // If there is no other subset that completely contains the current subset, keep the current subset
    return isSubset;
  });
  return uniqueSubGroups.length === 1 ? uniqueSubGroups : filteredSubGroups;
}

// A function to calculate the net for each subGroup
function getSubGroupsNets(subGroups, nets) {
  const subNets = [];
  for (let subGroup of subGroups) {
    const subNet = new Array(nets.length).fill(0);

    for (let i = 0; i < subGroup.length; i++) {
      subNet[subGroup[i]] = nets[subGroup[i]];
    }
    subNets.push(subNet);
  }
  return subNets;
}

// Calculate the suggestion of transaction for each subGroup to settle up
function getSettleUpTransactions(subGroupsNets) {
  const settleUpSuggestion = [];

  subGroupsNets.forEach((subNet) => {
    for (let i = 0; i < subNet.length; i++) {
      if (subNet[i] === 0) {
        continue;
      }
      for (let j = i + 1; j < subNet.length; j++) {
        if (subNet[i] * subNet[j] >= 0) {
          continue;
        }

        // Determine Cash flow direction
        if (subNet[i] > 0) {
          if (Math.abs(subNet[i]) - Math.abs(subNet[j]) > 0) {
            settleUpSuggestion.push([i, j, -subNet[j]]);
            subNet[i] += subNet[j];
            subNet[j] -= subNet[j];
          } else {
            settleUpSuggestion.push([i, j, subNet[i]]);
            subNet[j] += subNet[i];
            subNet[i] -= subNet[i];
          }
        } else {
          if (Math.abs(subNet[i]) - Math.abs(subNet[j]) > 0) {
            settleUpSuggestion.push([j, i, subNet[j]]);
            subNet[i] += subNet[j];
            subNet[j] -= subNet[j];
          } else {
            settleUpSuggestion.push([j, i, -subNet[i]]);
            subNet[j] += subNet[i];
            subNet[i] -= subNet[i];
          }
        }
      }
    }
  });
  return settleUpSuggestion;
}

// calculate the minimum number of transactions required to settle all debts
function minimizeTransaction(graph) {
  const N = graph.length;

  // Calculate total debts and credits for each person
  // If user i and user j owe each other money, offset part of the debt
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

export { minimizeDebts, minimizeTransaction };
