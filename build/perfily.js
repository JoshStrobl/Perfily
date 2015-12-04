var perfily;
(function (perfily) {
    var data;
    (function (data) {
        data.store = {};
        function GetProperty(id, property) {
            if (perfily.data.IsObject(id)) {
                return perfily.data.store[id][property];
            }
            else {
                return false;
            }
        }
        data.GetProperty = GetProperty;
        function IsObject(key) {
            if ((typeof perfily.data.store[key] == "object") && (!Array.isArray(perfily.data.store[key]))) {
                return true;
            }
            else {
                return false;
            }
        }
        data.IsObject = IsObject;
        function OutputResult(id) {
            var resultMessage = id;
            if (perfily.data.IsObject(id)) {
                if (typeof perfily.data.store[id]["TotalDurationOfTests"] == "number") {
                    var currentTestDuration = perfily.data.GetProperty(id, "TotalDurationOfTests");
                    resultMessage = id + " Suite has a total duration of its tests take: " + currentTestDuration.toFixed(4) + "ms.";
                }
                else {
                    var testDescription = perfily.data.GetProperty(id, "Description");
                    var testIterations = perfily.data.GetProperty(id, "Iterations");
                    var testPassedString = "failed";
                    if (testDescription !== "") {
                        resultMessage += " (" + testDescription + ")";
                    }
                    if (perfily.data.GetProperty(id, "Passed")) {
                        testPassedString = "passed";
                    }
                    resultMessage += " " + testPassedString;
                    if (testIterations > 1) {
                        resultMessage += ", running " + testIterations.toString() + " iterations,";
                    }
                    resultMessage += " and took an average of " + perfily.data.GetProperty(id, "Duration").toFixed(4) + "ms to complete.";
                }
            }
            else {
                resultMessage += " is not a Suite or Test.";
            }
            if (perfily.data.GetProperty(id, "OutputIntoDocument") == false) {
                console.log(resultMessage);
            }
            else {
                var paragraph = document.createElement("p");
                paragraph.textContent = resultMessage;
                document.body.appendChild(paragraph);
            }
        }
        data.OutputResult = OutputResult;
        function SetProperty(id, property, value) {
            if (perfily.data.IsObject(id)) {
                perfily.data.store[id][property] = value;
                return true;
            }
            else {
                return false;
            }
        }
        data.SetProperty = SetProperty;
    })(data = perfily.data || (perfily.data = {}));
})(perfily || (perfily = {}));
var perfily;
(function (perfily) {
    var test;
    (function (test) {
        function NewId(suiteName) {
            var currentSuiteTestsArray = perfily.data.store[suiteName]["Tests"];
            return suiteName + (currentSuiteTestsArray.length + 1).toString();
        }
        test.NewId = NewId;
        function New(testProperties) {
            if ((typeof testProperties == "object") && (!Array.isArray(testProperties))) {
                if (typeof testProperties.AutoclearExpecting == "undefined") {
                    testProperties.AutoclearExpecting = false;
                }
                if (typeof testProperties.Autorun !== "boolean") {
                    testProperties.Autorun = false;
                }
                if (typeof testProperties.AutoclearExpecting !== "boolean") {
                    testProperties.AutoclearExpecting = false;
                }
                if (typeof testProperties.Description !== "string") {
                    testProperties.Description = "";
                }
                if (typeof testProperties.Expecting !== "string") {
                    testProperties.Expecting = "";
                }
                if ((typeof testProperties.Iterations !== "number") || (testProperties.Iterations <= 0)) {
                    testProperties.Iterations = 1;
                }
                if (typeof testProperties.Output !== "boolean") {
                    testProperties.Output = false;
                }
                if (typeof testProperties.OutputIntoDocument !== "boolean") {
                    testProperties.OutputIntoDocument = false;
                }
                else if (testProperties.OutputIntoDocument) {
                    testProperties.Output = true;
                }
                if ((typeof testProperties.Suite !== "string") || (testProperties.Suite == "")) {
                    testProperties.Suite = "generic";
                }
                perfily.suite.New(testProperties.Suite, {});
                var id = perfily.test.NewId(testProperties.Suite);
                perfily.data.store[id] = testProperties;
                perfily.data.GetProperty(testProperties.Suite, "Tests").push(id);
                if (testProperties.Autorun) {
                    perfily.test.Run(id);
                }
                return id;
            }
            else {
                return "Provided Properties is not an Object.";
            }
        }
        test.New = New;
        test.OutputResult = perfily.data.OutputResult;
        function Export(id, options) {
            var exportObject = {};
            if (perfily.data.IsObject(id)) {
                for (var _i = 0; _i < options.length; _i++) {
                    var option = options[_i];
                    exportObject[option] = perfily.data.GetProperty(id, option);
                }
            }
            return exportObject;
        }
        test.Export = Export;
        function Run(id) {
            if (perfily.data.IsObject(id)) {
                var suite_1 = perfily.data.GetProperty(id, "Suite");
                var times = [];
                var testExpecting = perfily.data.GetProperty(id, "Expecting");
                var testIterationCount = perfily.data.GetProperty(id, "Iterations");
                var testPassed = true;
                for (var iteration = 0; iteration < testIterationCount; iteration++) {
                    var testStartTime = performance.now();
                    var potentialResult = perfily.data.GetProperty(id, "TestFunction").call(this);
                    var testEndTime = performance.now();
                    if ((typeof testExpecting !== "undefined") && (testExpecting !== "")) {
                        testPassed = (testExpecting == potentialResult);
                    }
                    times.push((testEndTime - testStartTime));
                }
                perfily.data.SetProperty(id, "Passed", testPassed);
                if (perfily.data.GetProperty(id, "AutoclearExpecting")) {
                    perfily.data.SetProperty(id, "Expecting", "");
                }
                var testDuration = times[0];
                if (this.iterations > 1) {
                    var average = 0;
                    var timesAverageToRemove = 0;
                    for (var timeIndex = 0; timeIndex < times.length; timeIndex++) {
                        if (times[timeIndex] !== 0) {
                            average += times[timeIndex];
                        }
                        else {
                            timesAverageToRemove++;
                        }
                    }
                    testDuration = (average / (times.length - timesAverageToRemove));
                }
                perfily.data.SetProperty(id, "Duration", testDuration);
                perfily.suite.UpdateTotalDuration(suite_1, testDuration);
                var longestTestLength = perfily.data.GetProperty(suite_1, "LongestTestLength");
                var shortestTestLength = perfily.data.GetProperty(suite_1, "ShortestTestLength");
                if ((testDuration < shortestTestLength) || (shortestTestLength == undefined)) {
                    perfily.data.SetProperty(suite_1, "ShortestTestLength", testDuration);
                    perfily.data.SetProperty(suite_1, "ShortestTestObject", perfily.data.store[id]);
                }
                else if (testDuration > longestTestLength) {
                    perfily.data.SetProperty(suite_1, "LongestTestLength", testDuration);
                    perfily.data.SetProperty(suite_1, "LongestTestObject", perfily.data.store[id]);
                }
                if (perfily.data.GetProperty(id, "Output")) {
                    perfily.data.OutputResult(id);
                }
            }
        }
        test.Run = Run;
        function SetDescription(id, testName) {
            return perfily.data.SetProperty(id, "Description", testName);
        }
        test.SetDescription = SetDescription;
        function SetExpecting(id, benchmarkExpectedResult) {
            return perfily.data.SetProperty(id, "Expecting", benchmarkExpectedResult);
        }
        test.SetExpecting = SetExpecting;
        function SetIterations(id, iterations) {
            return perfily.data.SetProperty(id, "Iterations", iterations);
        }
        test.SetIterations = SetIterations;
        function SetFunction(id, benchmarkFunction) {
            var setFunctionSucceeded = perfily.data.SetProperty(id, "Function", benchmarkFunction);
            if (perfily.data.GetProperty(id, "Autorun") == true) {
                perfily.test.Run(id);
            }
        }
        test.SetFunction = SetFunction;
    })(test = perfily.test || (perfily.test = {}));
})(perfily || (perfily = {}));
var perfily;
(function (perfily) {
    var suite;
    (function (suite) {
        function New(suiteName, suiteProperties) {
            if (!perfily.data.IsObject(suiteName)) {
                if (typeof suiteProperties.Output !== "boolean") {
                    suiteProperties.Output = false;
                }
                if (typeof suiteProperties.OutputIntoDocument !== "boolean") {
                    suiteProperties.OutputIntoDocument = false;
                }
                suiteProperties.LongestTestLength = 0;
                suiteProperties.Tests = [];
                suiteProperties.TotalDurationOfTests = 0;
                perfily.data.store[suiteName] = suiteProperties;
            }
        }
        suite.New = New;
        suite.OutputResult = perfily.data.OutputResult;
        function Export(suiteName, options) {
            var exportObjects = [];
            if (perfily.data.IsObject(suiteName)) {
                for (var _i = 0, _a = perfily.data.GetProperty(suiteName, "Tests"); _i < _a.length; _i++) {
                    var test = _a[_i];
                    var exportedTestObject = perfily.test.Export(test, options);
                    exportObjects.push(exportedTestObject);
                }
            }
            return exportObjects;
        }
        suite.Export = Export;
        function Run(suiteName) {
            if (perfily.data.IsObject(suiteName)) {
                for (var _i = 0, _a = perfily.data.GetProperty(suiteName, "Tests"); _i < _a.length; _i++) {
                    var test = _a[_i];
                    perfily.test.Run(test);
                }
                if (perfily.data.GetProperty(suiteName, "Output")) {
                    perfily.data.OutputResult(suiteName);
                }
            }
        }
        suite.Run = Run;
        function UpdateTotalDuration(suiteName, latestTestDuration) {
            if (perfily.data.IsObject(suiteName)) {
                var currentTestDuration = perfily.data.GetProperty(suiteName, "TotalDurationOfTests");
                perfily.data.SetProperty(suiteName, "TotalDurationOfTests", (currentTestDuration + latestTestDuration));
                return true;
            }
            else {
                return false;
            }
        }
        suite.UpdateTotalDuration = UpdateTotalDuration;
    })(suite = perfily.suite || (perfily.suite = {}));
})(perfily || (perfily = {}));
var perfily;
(function (perfily) {
    perfily.NewSuite = perfily.suite.New;
    perfily.NewTest = perfily.test.New;
})(perfily || (perfily = {}));
