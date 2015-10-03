// This is the Perfily class

class Perfily {
	autoclearExpecting : boolean; // autoclearExpecting is a boolean to determine whether we should remove Expecting after each Run() (helps when reusing a Perfily instance)
	duration : number; // Duration the Benchmark took
	expecting : any; // Set expecting to any
	iterations : number; // Set iterations to number
	name : string; // Set the name of this Perfily Benchmark
	outputIntoDocument : boolean; // Define outputIntoDocument as a boolean, defaulting to false
	passed : boolean; // Define passed as a boolean, defaulting to true
	testFunction : Function; // Set the function of this Perfily Benchmark


	constructor(benchmarkProperties ?: Object){
		this.iterations = 1; // Set default iterations to 1
		this.autoclearExpecting = false; // Default autoclearExpecting to false
		this.passed = true; // Default passed to true
		this.outputIntoDocument = false; // Log to console and not document

		if (typeof benchmarkProperties == "object"){

			if (typeof benchmarkProperties["autoclearExpecting"] == "boolean"){ // If autoclearExpecting is provided as a boolean
				this.autoclearExpecting = benchmarkProperties["autoclearExpecting"]; // Set autoclearExpecting of this Perfily benchmark
			}

			if (typeof benchmarkProperties["expecting"] !== "undefined"){ // If an expected result is provided
				this.expecting = benchmarkProperties["expecting"]; // Set expecting of this Perfily benchmark to the benchmarkExpecting
			}

			if (typeof benchmarkProperties["iterations"] == "number"){ // If iterations is a number
				this.iterations = benchmarkProperties["iterations"]; // Set expecting of this Perfily benchmark to the benchmarkExpecting
			}

			if (typeof benchmarkProperties["function"] == "function"){ // If a Benchmark Function is a function
				this.testFunction = benchmarkProperties["function"]; // Set the testFunction of this Perfily benchmark to benchmarkFunction
			}

			if (typeof benchmarkProperties["name"] == "string"){ // If a Benchmark Name is defined
				this.name = benchmarkProperties["name"]; // Set the name of this Perfily benchmark to benchmarkName
			}

			if (typeof benchmarkProperties["outputIntoDocument"] == "boolean"){ // If outputIntoDocument is provided as a boolean
				this.outputIntoDocument = benchmarkProperties["outputIntoDocument"]; // Set outputIntoDocument of this Perfily benchmark
			}
		}
	}

	// #region Separate Set functions

	SetExpecting(benchmarkExpectedResult : any){ // Set Expecting of this Perfily benchmark
		if (benchmarkExpectedResult !== ""){ // If we aren't using "" to clear out expecting
			this.expecting = benchmarkExpectedResult;
		} else{ // If we are clearing out expecting
			this.expecting = undefined; // Set expecting as undefined
		}
	}

	SetIterations(iterations : number){ // Set Iterations of this Perfily benchmark
		this.iterations = iterations;
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
		var times : Array<number> = []; // Define times as an Array of numbers
		var iteration = 0;
		var iterationString = "iteration";

		while (iteration < this.iterations){
			var testStartTime : number = performance.now(); // Get the current microsecond-precise "time" of when the test started
			var potentialBenchmarkResult : any = this.testFunction(); // Run the testFunction, assigning any value to potentialBenchmarkResult
			var testEndTime : number = performance.now(); // Get the current microsecond-precise "time" of when the test ended

			var testPassed : string = "passed"; // Define testPassed as defaulting to "passed"

			if (typeof this.expecting !== "undefined"){ // If there is an expected result of this function
				this.passed = (this.expecting == potentialBenchmarkResult) // Set this.passed to the boolean value of comparing this.expecting with the result
			}

			times.push((testEndTime - testStartTime)); // Push to times a new number that is this specific iteration's amount
			iteration++;
		}

		// #region Autoclear Expecting Check

		if (this.autoclearExpecting){ // If we are supposed to autoclear expecting var
			this.SetExpecting(""); // Clear
		}
		
		// #endregion

		// #region Average Iteration Times

		if (this.iterations > 1){ // If there was multiple iterations
			var average = 0;
			iterationString += "s"; // Add s to the end of the iterationString to indicate multiple iterations
			var timesAverageToRemove = 0; // Define timesAverageToRemove as 0

			for (var timeIndex = 0; timeIndex < times.length; timeIndex++){
					if (times[timeIndex] !== 0){ // If this is not an absolute zero
						average += times[timeIndex]; // Add time to average
					}
					else{ // If this is an absolute zero, don't add to average (that'll skew the averaging)
						timesAverageToRemove++; // Add 1 to the timesAverageToRemove
					}
			}

			this.duration = (average / (times.length - timesAverageToRemove)); // Set duration to the average / times.length
		}
		else{ // If there was only one iteration
			this.duration = times[0];
		}

		// #endregion

		var testResultMessage : string= this.name + " " + testPassed + ", running " + this.iterations.toString() + " " + iterationString + ", and took an average of " +  this.duration.toFixed(4) + "ms" // Set as  the name, pass/fail status, and duration

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