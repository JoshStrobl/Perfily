// This is the Perfily class

class Perfily {
	name : string; // Set the name of this Perfily Benchmark
	duration : number; // Duration the Benchmark took
	expecting : any; // Set expecting to any
	testFunction : Function; // Set the function of this Perfily Benchmark
	outputIntoDocument : boolean; // Define outputIntoDocument as a boolean, defaulting to false

	constructor(benchmarkProperties ?: Object){
		if (typeof benchmarkProperties == "object"){
			if (typeof benchmarkProperties["name"] == "string"){ // If a Benchmark Name is defined
				this.name = benchmarkProperties["name"]; // Set the name of this Perfily benchmark to benchmarkName
			}

			if (typeof benchmarkProperties["function"] == "function"){ // If a Benchmark Function is defined
				this.testFunction = benchmarkProperties["function"]; // Set the testFunction of this Perfily benchmark to benchmarkFunction
			}

			if (typeof benchmarkProperties["expecting"] !== "undefined"){ // If an expected result is provided
				this.expecting = benchmarkProperties["expecting"]; // Set expecting of this Perfily benchmark to the benchmarkExpecting
			}

			if (typeof benchmarkProperties["outputIntoDocument"] == "boolean"){ // If outputIntoDocument is provided as a boolean
				this.outputIntoDocument = benchmarkProperties["outputIntoDocument"]; // Set outputIntoDocument of this Perfily benchmark
			}
			else{ // If it is not defined or not as a boolean
				this.outputIntoDocument = false; // Log to console and not document
			}
		}
	}

	// #region Separate Set functions

	SetExpecting(benchmarkExpectedResult : Function){ // Set Expecting of this Perfily benchmark
		this.expecting = benchmarkExpectedResult;
	}

	SetFunction(benchmarkFunction : Function){ // Set Function of this Perfily benchmark
		this.testFunction = benchmarkFunction;
	}

	SetName(benchmarkName : string){ // Set Name of this Perfily benchmark
		this.name = benchmarkName;
	}

	// #endregion

	// #region Run Perfily Benchmark

	Run(){
		var testStartTime : number = performance.now(); // Get the current microsecond-precise "time" of when the test started
		var potentialBenchmarkResult : any = this.testFunction(); // Run the testFunction, assigning any value to potentialBenchmarkResult
		var testEndTime : number = performance.now(); // Get the current microsecond-precise "time" of when the test ended

		var testPassed : string = "passed"; // Define testPassed as defaulting to "passed"

		if (typeof this.expecting !== "undefined"){ // If there is an expected result of this function
			if (this.expecting !== potentialBenchmarkResult){ // If the results are NOT the same
				testPassed = "failed"; // Change testPassed to "failed"
			}
		}

		this.duration = (testEndTime - testStartTime); // Define the Benchmark duration as the time the test took

		var testResultMessage : string= this.name + " " + testPassed + " and took " +  Number(this.duration.toFixed(2)) + "ms" // Set as  the name, pass/fail status, and duration

		if (this.outputIntoDocument == false){ // If we are logging to console (default action)
			console.log(testResultMessage);
		}
		else{ // If we are outputting to document instance
			var testResultParagraph = document.createElement("p"); // Create a new paragraph tag
			testResultParagraph.textContent = testResultMessage; // Set the textContent of the paragraph to testResultMessage
			document.body.appendChild(testResultParagraph); // Append the testParagraph
		}
	}
}