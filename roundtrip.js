/*
Copyright 2017 Simon Doppler

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var roundtrip = function() {
    // parameter: decision matrix
    // returns an array with the stops in it
    // example: route: 0 - 5 - 3 - 4 - 1 - 2 - 0
    // [5, 3, 4, 1, 2, 0]
    function createStopArray(decisionMatrix) {
        var stopArray = [];
        var i;
        // inserting first stop manually
        if (decisionMatrix.length >= 1) {
            stopArray[0] = decisionMatrix[0].indexOf(1);
        }
        for (i = 1; i < decisionMatrix.length; i++) {
            stopArray[i] = decisionMatrix[stopArray[i-1]].indexOf(1);
        }
        return stopArray;
    }
    
    // parameter: stop array in form like createStopArray creates
    // returns a decision matrix
    function createDecisionMatrix(stopArray) {
        var decisionMatrix = [];
        var i, j;
        // first row manually
        if (stopArray.length >= 1) {
            decisionMatrix[0] = [];
            for (i = 0; i < stopArray.length; i++) {
                if (i === stopArray[0]) {
                    decisionMatrix[0][i] = 1;
                } else {
                    decisionMatrix[0][i] = 0;
                }
            }
        }
        for (i = 1; i < stopArray.length; i++) {
            decisionMatrix[stopArray[i-1]] = [];
            for (j = 0; j < stopArray.length; j++) {
                if (j === stopArray[i]) {
                    decisionMatrix[stopArray[i-1]][j] = 1;
                } else {
                    decisionMatrix[stopArray[i-1]][j] = 0;
                }
            }
        }
        return decisionMatrix;
    }
    
    // parameter stopArray: stopArray that should get inversed
    // param i: lower index
    // param j: higher index
    // inverse the Array between (including) indizes i and j
    function inverseStops(stopArray, i, j) {
        var newArray = [];
        var k;
        var inverseIndex = i;
        // stops before index i are the same
        for (k = 0; k < i; k++) {
            newArray[k] = stopArray[k];
        }
        for (k = j; k >= i; k--) {
            newArray[inverseIndex] = stopArray[k];
            inverseIndex++;
        }
        for (k = j+1; k < stopArray.length; k++) {
            newArray[k] = stopArray[k];
        }
        if (newArray[newArray.length-1] !== 0) {
            // rearrange array so last stop is start
            newArray = rearrangeArray(newArray);
        }
        
        return newArray;
    }
    
    // parameter stopArray: stopArray that should get rearranged
    // if stop 0 is not in the last position (0 is the start and also the endpoint) the array will get rearranged so the tour will be the same but with 0 as end stop
    function rearrangeArray(stopArray) {
        var rearranged = [];
        var i;
        var currentIndex = stopArray.indexOf(0)+1;
        if (currentIndex < stopArray.length) {
            // only rearrange if last stop (0) is not at last position
            for (i = 0; i < stopArray.length; i++) {
                rearranged[i] = stopArray[currentIndex];
                if (currentIndex < stopArray.length-1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
            }
        }
        return rearranged;
    }
    
    // parameter decisionMatrix: decision matrix created from a tour construction algorithm
    // costMatrix: distance or duration matrix
    // algorithm croes: a method for solving the traveling salesman problem
    // select two stops and inverse the order of the cities (and the cities between)
    // if an improvement was found start with the (best) improvement - if not: stop
    // see nearestNeighbor for information on decision and cost matrix
    function twoOpt(decisionMatrix, costMatrix) {
        //var newMatrix;// = decisionMatrix;
        var improved = true;
        var distance = calculateD(decisionMatrix, costMatrix);
        var stopArray = createStopArray(decisionMatrix);
        var i, j;
        var improvedArray, newStopArray, newMatrix, newDistance;
        while (improved){
            improved = false;
            improvedArray = [];
            for (i = 0; i < stopArray.length-1; i++) {
                for (j = i+1; j < stopArray.length; j++) {
                    // inverse stops and calculate new distance
                    newStopArray = inverseStops(stopArray, i, j);
                    //console.log('new stop array: ' + newStopArray);
                    newMatrix = createDecisionMatrix(newStopArray);
                    newDistance = calculateD(newMatrix, costMatrix);
                    if (newDistance < distance) {
                        // if new distance is shorter 
                        improved = true;
                        distance = newDistance;
                        improvedArray = newStopArray;
                    }
                }
            }
            if (improved) {
                stopArray = improvedArray;
            }
        }
        return createDecisionMatrix(stopArray);
    }
    
    // parameter dMatrix: distance or duration matrix (or cost matrix, whatever...) (2 dimensional array: dMatrix[0][1] = distance/cost/duration; first index: rows, second index: columns; if row index === column index: value must be 'undef')
    // returns decision matrix (2 dimensional array: decision[0][1] = 1 means that you are going from stop 0 to stop 1; first index: rows, second index: columns; only one row has a column = 1)
    function nearestNeighbor(dMatrix) {
        // start s
        // go from s to k with shortest distance
        // go from k to not yet selected city
        // go to 3 or back to start if there are no cities left

        // calculate nearest neighbor
        var rows = []; // position in rows where distance is nearest
        var i, j;
        var current = 0; // start position - basis
        var visited = [current]; // visited cities - basis
        var distance, index;
        var column;
        var decision = []; // return decision matrix

        // set rows to -1
        for (i = 0; i < dMatrix.length; i++) {
            rows.push(-1);
        }

        while (rows.indexOf(-1) !== -1) {
            // are all cities visited go back to start
            if (visited.length === rows.length) {
                current = rows.indexOf(-1);
                rows[current] = 0;
            } else {
                // not all cities were visited
                distance = 0;
                index = 0;
                for (i = 0; i < dMatrix[current].length; i++) {
                    if (dMatrix[current][i] !== 'undef' && visited.indexOf(i) === -1) {
                        // there is a distance available and the city was not visited yet
                        if ((index === 0 && distance === 0) || dMatrix[current][i] < distance) {
                            // nothing set yet, set current index
                            index = i;
                            distance = dMatrix[current][i];
                        }
                    }
                }
                // set next city
                rows[current] = index;
                current = index;
            }
            visited.push(current);
        }
        // fill decision matrix
        for (i = 0; i < dMatrix.length; i++) {
            column = [];
            for (j = 0; j < dMatrix[i].length; j++) {
                if (rows[i] === j) {
                    column.push(1); // 1 from row to column
                } else {
                    column.push(0); // 0 if not
                }
            }
            decision.push(column);
        }
        
        return decision;
    }
    
    // decisionMatrix: binary matrix of decision based on algorithm
    // dMatrix: distance or duration matrix / cost matrix
    function calculateD(decisionMatrix, dMatrix) {
        //var distanceString = '';
        // easy check
        var i;
        var calculate = 0;
        if (decisionMatrix.length === dMatrix.length) {
            for (i = 0; i < decisionMatrix.length; i++) {
                calculate += dMatrix[i][decisionMatrix[i].indexOf(1)];
            }
        }
        return calculate;
    }
    
    return {
        nearestNeighbor: nearestNeighbor,
        twoOpt: twoOpt
    }
}();