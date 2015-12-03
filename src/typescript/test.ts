// This is the Perfily Test module

/// <reference path="perfily.ts" />
/// <reference path="data.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="suite.ts" />

module perfily.test {

	// NewId
	// This function will create a new Id for the Test
	export function NewId(suiteName : string) : string {
        let currentSuiteTestsArray : Array<string> = perfily.data.store[suiteName]["Tests"]; // Get the current Array<string> from Tests
		return suiteName + (currentSuiteTestsArray.length + 1).toString() // Return the suiteName with appended test num to end
	}

	// New
	// This function creates the Test based on testProperties
	export function New(testProperties : any) : string {
		if ((typeof testProperties == "object") && (!Array.isArray(testProperties))) { // If testProperties
			if (typeof testProperties.AutoclearExpecting == "undefined"){ // If AutoclearExpecting is not defined
				testProperties.AutoclearExpecting = false; // Do not autoclear expecting after a test.
			}

			if (typeof testProperties.Autorun !== "boolean"){ // If Autorun is not a boolean
				testProperties.Autorun = false; // Do not autorun test
			}

			if (typeof testProperties.AutoclearExpecting !== "boolean"){ // If AutoclearExpecting is not a boolean
				testProperties.AutoclearExpecting = false; // Do not autoclear expecting var
			}

			if (typeof testProperties.Description !== "string"){ // If Description is not a string
				testProperties.Description = ""; // Set to an empty string
			}

            if (typeof testProperties.Expecting !== "string"){ // If Expecting is not a string
				testProperties.Expecting = ""; // Set to an empty string
			}

			if ((typeof testProperties.Iterations !== "number") || (testProperties.Iterations <= 0)){ // If Iterations is not a number or is less than or equal to 0
				testProperties.Iterations = 1; // Set to a single iteration
			}

			if (typeof testProperties.Output !== "boolean"){ // If Output is not a boolean
				testProperties.Output = false; // Set to not output result automatically
			}

			if (typeof testProperties.OutputIntoDocument !== "boolean"){ // If OutputIntoDocument is not a boolean
				testProperties.OutputIntoDocument = false; // Do not output into document (if Output is set to true, will output to console if OutputIntoDocument is false)
			} else if (testProperties.OutputIntoDocument){ // If we are outputting into document
                testProperties.Output = true; // Ensure we actually output by setting Output to true
            }

			if ((typeof testProperties.Suite !== "string") || (testProperties.Suite == "")){ // If Suite is not a string
				testProperties.Suite = "generic"; // Set to generic Suite name
			}

			perfily.suite.New(testProperties.Suite, {}); // Create the Suite if necessary
			var id : string = perfily.test.NewId(testProperties.Suite); // Get a new test Id

			perfily.data.store[id] = testProperties; // Set the testProperties to the suite's test's value
            perfily.data.GetProperty(testProperties.Suite, "Tests").push(id); // Push the Test's Id to the Suite's Tests Array<string>

			if (testProperties.Autorun){ // If we should autorun the test
				perfily.test.Run(id); // Run the test
			}

			return id; // Return the id
		} else { // If testProperties is not an object
			return "Provided Properties is not an Object.";
		}
	}

    export var OutputResult : Function = perfily.data.OutputResult; // Helper function for Test output

	// Run
	// This function will run the test.
	export function Run(id : string) {
		if (perfily.data.IsObject(id)){ // If this is a Test
            let suite : string = perfily.data.GetProperty(id, "Suite"); // Get the Suite of this Test
			let times : Array<number> = []; // Define times as an Array of numbers

			let testExpecting : any = perfily.data.GetProperty(id, "Expecting"); // Get the value of whatever the result is expecting (if anything)
			let testIterationCount : number = perfily.data.GetProperty(id, "Iterations"); // Get the number of iterations to do for test
			let testPassed : boolean = true; // Default testPassed to true

			for (let iteration = 0; iteration < testIterationCount; iteration++){
				let testStartTime : number = performance.now(); // Get the current microsecond-precise "time" of when the test started
				let potentialResult : any = perfily.data.GetProperty(id, "TestFunction").call(this); // Run the TestFunction, assigning any value to potentialResult
				let testEndTime : number = performance.now(); // Get the current microsecond-precise "time" of when the test ended

				if ((typeof testExpecting !== "undefined") && (testExpecting !== "")){ // If there is an expected result of this function
					testPassed = (testExpecting == potentialResult) // Set testPassed to the boolean value of comparing testExpecting and potentialResult
				}

				times.push((testEndTime - testStartTime)); // Push to times a new number that is this specific iteration's amount
			}

            perfily.data.SetProperty(id, "Passed", testPassed); // Set the Passed property of this test to the bool

			// #region Autoclear Expecting Check

			if (perfily.data.GetProperty(id, "AutoclearExpecting")){ // If we are supposed to autoclear expecting var
				perfily.data.SetProperty(id, "Expecting", ""); // Clear out
			}

			// #endregion

			// #region Average Iteration Times

			let testDuration : number = times[0]; // Set testDuration to default to first time in times array

			if (this.iterations > 1){ // If there was multiple iterations
				let average = 0;
				let timesAverageToRemove = 0; // Define timesAverageToRemove as 0

				for (let timeIndex = 0; timeIndex < times.length; timeIndex++){
						if (times[timeIndex] !== 0){ // If this is not an absolute zero
							average += times[timeIndex]; // Add time to average
						} else { // If this is an absolute zero, don't add to average (that'll skew the averaging)
							timesAverageToRemove++; // Add 1 to the timesAverageToRemove
						}
				}

				testDuration = (average / (times.length - timesAverageToRemove)); // Set duration to the average / times.length
			}

			// #endregion

			perfily.data.SetProperty(id, "Duration", testDuration); // Set the Duration value of this test
			perfily.suite.UpdateTotalDuration(suite, testDuration); // Update the associated Suite TotalDurationOfTests with duration of this test

            // #region Shortest / Longest Test Checking

            let longestTestLength : number = perfily.data.GetProperty(suite, "LongestTestLength"); // Get the longest test length
            let shortestTestLength : number = perfily.data.GetProperty(suite, "ShortestTestLength"); // Get the shortest test length

            if ((testDuration < shortestTestLength) || (shortestTestLength == undefined)){ // If the testDuration is shorter than the shortestTestLength so far or shortestTestLength hasn't been defined yet
                perfily.data.SetProperty(suite, "ShortestTestLength", testDuration); // Update the ShortestTestLength with the length of this test
                perfily.data.SetProperty(suite, "ShortestTestObject", perfily.data.store[id]); // Set ShortestTestObject to the testProperties Object
            } else if (testDuration > longestTestLength){ // If the testDuration is shorter than the longestTestLength so far
                perfily.data.SetProperty(suite, "LongestTestLength", testDuration); // Update the LongestTestLength with the length of this test
                perfily.data.SetProperty(suite, "LongestTestObject", perfily.data.store[id]); // Set longestTestLength to the testProperties Object
            }

            // #endregion

			if (perfily.data.GetProperty(id, "Output")){ // If we should automatically output the result
				perfily.data.OutputResult(id);
			}
		}
	}

	// SetDescription
	// This is a helper function that sets the Description property of the Test.
	export function SetDescription(id : string, testName : string) : boolean{
		return perfily.data.SetProperty(id, "Description", testName); // Call SetProperty and return result
	}

	// SetExpecting
	// This is a helper function that sets the Expecting property of the Test.
	export function SetExpecting(id : string, benchmarkExpectedResult : any) : boolean {
		return perfily.data.SetProperty(id, "Expecting", benchmarkExpectedResult); // Call SetProperty and return result
	}

	// SetIterations
	// This is a helper function that sets the Iterations property of the Test.
	export function SetIterations(id : string, iterations : number) : boolean {
		return perfily.data.SetProperty(id, "Iterations", iterations); // Call SetProperty and return result
	}

	// SetFunction
	// This is a helper function that sets the Function property of the Test.
	export function SetFunction(id : string, benchmarkFunction : Function){
		var setFunctionSucceeded : boolean = perfily.data.SetProperty(id, "Function", benchmarkFunction); // Call SetProperty and set boolean result to setFunctionSucceeded

		if (perfily.data.GetProperty(id, "Autorun") == true){ // If we are supposed to autorun the Test
			perfily.test.Run(id); // Run the test
		}
	}

}