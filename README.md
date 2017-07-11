# roundtrip
This project was created for my bachelor thesis. It implements heuristics to solve the Traveling Salesman Problem (TSP). The TSP is the problem of finding the shortest route from a starting point to different locations and back to the starting point. Heuristics do not necessarily provide the ideal solution - they are used to get good solutions in a short time.

You can see a live demo here: www.roundtrip.at

# Which algorithms are implemented?

An initial solution is found with the Nearest Neighbor algorithm. In each step one looks for the nearest stop (that is not considered yet) and adds it to the route. This creates the initial tour which is used for the 2-opt algorithm (a tour improvement algorithm). This algorithm needs an initial solution and inverses the order between two stops in each step. If an improvement is found, this new route is used and the inversion starts again. This happens until no improvement can be found.

# Usage

roundtrip.nearestNeighbor(distanceMatrix);
parameter: distanceMatrix distance/duration/cost matrix, 2 dimensional array, first index: rows, second index: columns. if row index === column index value must be 'undef'; [0][0] is the starting point
returns decision matrix: 2 dimensional binary array. decision[0][1] = 1 means that you are going from stop 0 to stop 1; only one row has a column with 1 in it, otherwise it is 0

roundtrip.twoOpt(decisionMatrix, distanceMatrix);
parameter decisionMatrx (e.g. from nearestNeighbor) and distanceMatrix like for nearestNeighbor
returns a decision matrix
