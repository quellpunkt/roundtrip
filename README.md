# roundtrip
This project was created for my bachelor thesis. It implements heuristics to solve the Traveling Salesman Problem (TSP). The TSP is the problem of finding the shortest route from a starting point to different locations and back to the starting point. Heuristics do not necessarily provide the ideal solution - they are used to get good solutions in a short time.

You can see a live demo here: www.roundtrip.at

## Which algorithms are implemented?

An initial solution is found with the Nearest Neighbor algorithm. In each step one looks for the nearest stop (that is not considered yet) and adds it to the route. This creates the initial tour which is used for the 2-opt algorithm (a tour improvement algorithm). This algorithm needs an initial solution and inverses the order between two stops in each step. If an improvement is found, this new route is used and the inversion starts again. This happens until no improvement can be found.

## Usage

### roundtrip.nearestNeighbor(dMatrix)

* _parameter dMatrix_
distance/duration/cost matrix
2 dimensional array: [row][column], "undef" if row=column
[0][0] starting point

* _returns_
decision matrix
 2 dimensional array: [row][column], 1 if you are going from location represented by row to location represented by column, otherwise 0.


### roundtrip.twoOpt(decisionMatrix, dMatrix)

* _parameter decisionMatrix_
decision matrix (e.g. from nearestNeighbor)

* _parameter dMatrix_
distance/duration/cost matrix

* _returns_
decision matrix

### example
 _dMatrix_
 
 ```
 [
    ["undef", 1000, 2000, 3000],
    [1000, "undef", 1000, 2000],
    [2000, 1000, "undef", 1000],
    [3000, 2000, 1000, "undef"]
]
```

e.g. first row means: city 1 -> city 2: 1000km, city 1 -> city 3: 2000km, city 1 -> city 4: 3000km

_decision matrix_ from nearest neighbor

```
[
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0]
]
```
this means you go from city 1 -> city 2 -> city 3 -> city 4 -> city 1
