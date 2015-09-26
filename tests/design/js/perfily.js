// This is the Perfily class
var Perfily = (function () {
    function Perfily(benchmarkProperties) {
        if (typeof benchmarkProperties == "object") {
            if (typeof benchmarkProperties["name"] == "string") {
                this.name = benchmarkProperties["name"];
            }
            if (typeof benchmarkProperties["function"] == "function") {
                this.testFunction = benchmarkProperties["function"];
            }
            if (typeof benchmarkProperties["expecting"] !== "undefined") {
                this.expecting = benchmarkProperties["expecting"];
            }
            if (typeof benchmarkProperties["outputIntoDocument"] == "boolean") {
                this.outputIntoDocument = benchmarkProperties["outputIntoDocument"];
            }
            else {
                this.outputIntoDocument = false;
            }
        }
    }
    Perfily.prototype.SetExpecting = function (benchmarkExpectedResult) {
        this.expecting = benchmarkExpectedResult;
    };
    Perfily.prototype.SetFunction = function (benchmarkFunction) {
        this.testFunction = benchmarkFunction;
    };
    Perfily.prototype.SetName = function (benchmarkName) {
        this.name = benchmarkName;
    };
    Perfily.prototype.Run = function () {
        var testStartTime = performance.now();
        var potentialBenchmarkResult = this.testFunction();
        var testEndTime = performance.now();
        var testPassed = "passed";
        if (typeof this.expecting !== "undefined") {
            if (this.expecting !== potentialBenchmarkResult) {
                testPassed = "failed";
            }
        }
        this.duration = (testEndTime - testStartTime);
        var testResultMessage = this.name + " " + testPassed + " and took " + Number(this.duration.toFixed(2)) + "ms";
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
