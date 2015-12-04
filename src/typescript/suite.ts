// This is the Perfily Suite module

/// <reference path="perfily.ts" />
/// <reference path="data.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="test.ts" />

module perfily.suite {

	// New
	// This function will create a new Suite based on the suite name provided
	export function New(suiteName : string, suiteProperties : any) {
		if (!perfily.data.IsObject(suiteName)){ // If the Object does not exist
			if (typeof suiteProperties.Output !== "boolean"){ // If Output is not a boolean
				suiteProperties.Output = false; // Set to not output result automatically
			}

			if (typeof suiteProperties.OutputIntoDocument !== "boolean"){ // If OutputIntoDocument is not a boolean
				suiteProperties.OutputIntoDocument = false; // Do not output into document (if Output is set to true, will output to console if OutputIntoDocument is false)
			}

            suiteProperties.LongestTestLength = 0; // Set LongestTestLength to default 0
			suiteProperties.Tests = []; // Define Tests as an empty array
			suiteProperties.TotalDurationOfTests = 0; // Set TotalDurationOfTests to 0

			perfily.data.store[suiteName] = suiteProperties // Create a new suiteName
		}
	}

    export var OutputResult : Function = perfily.data.OutputResult; // Helper function for Suite output

	// Export
	// This function will export an Array of Objects, where each Object is an individual Test.
	export function Export(suiteName: string, options : Array<string>) : Array<Object> {
		let exportObjects : Array<Object> = []; // Create an empty array to push Objects to

		if (perfily.data.IsObject(suiteName)){ // If the Suite Exists
			for (var test of perfily.data.GetProperty(suiteName, "Tests")){ // For each Test key in the Tests array.
				let exportedTestObject : Object = perfily.test.Export(test, options); // Get the exported options of this Test
				exportObjects.push(exportedTestObject); // Push the exportedTestObject to exportObjects
			}
		}

		return exportObjects;
	}

    // Run
    // This function will run all the Tests of the Suite
    export function Run(suiteName : string){
        if (perfily.data.IsObject(suiteName)){ // If the Suite exists
            for (var test of perfily.data.GetProperty(suiteName, "Tests")){ // For test of Tests
                perfily.test.Run(test); // Run the Test
            }

            if (perfily.data.GetProperty(suiteName, "Output")){ // If we should automatically output the result
				perfily.data.OutputResult(suiteName);
			}
        }
    }

	// UpdateTotalDuration
	// This function will update the total duration of all the tests in the Suite
	export function UpdateTotalDuration(suiteName : string, latestTestDuration : number) : boolean {
		if (perfily.data.IsObject(suiteName)){ // If the Suite exists
			let currentTestDuration : number = perfily.data.GetProperty(suiteName, "TotalDurationOfTests") // Get the current TotalDurationOfTests
			perfily.data.SetProperty(suiteName, "TotalDurationOfTests", (currentTestDuration + latestTestDuration)); // Add the latestTestDuration to currentTestDuration

			return true;
		} else { // If the Suite does not exist
			return false;
		}
	}
}