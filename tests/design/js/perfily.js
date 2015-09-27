// This is the Perfily class
var Perfily = (function () {
    function Perfily(benchmarkProperties) {
        this.iterations = 1;
        this.passed = true;
        this.outputIntoDocument = false;
        if (typeof benchmarkProperties == "object") {
            if (typeof benchmarkProperties["name"] == "string") {
                this.name = benchmarkProperties["name"];
            }
            if (typeof benchmarkProperties["expecting"] !== "undefined") {
                this.expecting = benchmarkProperties["expecting"];
            }
            if (typeof benchmarkProperties["iterations"] == "number") {
                this.iterations = benchmarkProperties["iterations"];
            }
            if (typeof benchmarkProperties["function"] == "function") {
                this.testFunction = benchmarkProperties["function"];
            }
            if (typeof benchmarkProperties["outputIntoDocument"] == "boolean") {
                this.outputIntoDocument = benchmarkProperties["outputIntoDocument"];
            }
        }
    }
    Perfily.prototype.SetExpecting = function (benchmarkExpectedResult) {
        this.expecting = benchmarkExpectedResult;
    };
    Perfily.prototype.SetIterations = function (iterations) {
        this.iterations = iterations;
    };
    Perfily.prototype.SetFunction = function (benchmarkFunction) {
        this.testFunction = benchmarkFunction;
    };
    Perfily.prototype.SetName = function (benchmarkName) {
        this.name = benchmarkName;
    };
    Perfily.prototype.Run = function () {
        var times = [];
        var iteration = 0;
        var iterationString = "iteration";
        while (iteration < this.iterations) {
            var testStartTime = performance.now();
            var potentialBenchmarkResult = this.testFunction();
            var testEndTime = performance.now();
            var testPassed = "passed";
            if (typeof this.expecting !== "undefined") {
                this.passed = (this.expecting == potentialBenchmarkResult);
            }
            times.push((testEndTime - testStartTime));
            iteration++;
        }
        if (this.iterations > 1) {
            var average = 0;
            iterationString += "s";
            var timesAverageToRemove = 0;
            for (var timeIndex = 0; timeIndex < times.length; timeIndex++) {
                if (times[timeIndex] !== 0) {
                    average += times[timeIndex];
                }
                else {
                    timesAverageToRemove++;
                }
            }
            this.duration = (average / (times.length - timesAverageToRemove));
        }
        else {
            this.duration = times[0];
        }
        var testResultMessage = this.name + " " + testPassed + ", running " + this.iterations.toString() + " " + iterationString + ", and took an average of " + this.duration.toFixed(4) + "ms";
        if (this.outputIntoDocument == false) {
            console.log(testResultMessage);
        }
        else {
            var testResultParagraph = document.createElement("p");
            testResultParagraph.textContent = testResultMessage;
            document.body.appendChild(testResultParagraph);
        }
    };
    return Perfily;
})();
