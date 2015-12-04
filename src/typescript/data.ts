// This is the Perfily Data module

module perfily.data {
    export var store : Object = {};

    // GetProperty
    // This function will get the property of the Suite or Test
    export function GetProperty(id : string, property : string) : any {
        let value : any = false; // Set value as default to false

        if (perfily.data.IsObject(id)){ // If the Id passed is a valid Suite or Test Object
            let propertyValue = perfily.data.store[id][property]; // Get the propertyValue if it exists

            if (typeof propertyValue !== "undefined"){ // If the value exists
                value = propertyValue; // Change value to propertyValue
            }
        }

        return value;
    }

    // IsObject
    // This function will check if the key provided is a valid Object in perfily.data.store
    export function IsObject(key : string) : boolean {
        if ((typeof perfily.data.store[key] == "object") && (!Array.isArray(perfily.data.store[key]))){ // If the key exists as an Object
            return true;
        } else { // If the test does not exist
            return false;
        }
    }

    // OutputResult
	// This function will output the result
	export function OutputResult(id : string){
		let resultMessage : string = id; // Initially set resultMessage to id

		if (perfily.data.IsObject(id)){ // If this is a Suite or Test
            if (typeof perfily.data.store[id]["TotalDurationOfTests"] == "number"){ // If the TotalDurationOfTests exists, meaning this id is a Suite id
                let currentTestDuration : number = perfily.data.GetProperty(id, "TotalDurationOfTests") // Get the current TotalDurationOfTests
                resultMessage = id + " Suite has a total duration of its tests take: " + currentTestDuration.toFixed(4) + "ms.";
            } else { // If this is a Test
    			let testDescription : string = perfily.data.GetProperty(id, "Description"); // Get the Description of the Test if it exists
    			let testIterations : number = perfily.data.GetProperty(id, "Iterations"); // Get the number of Iterations of the Test
    			let testPassedString : string = "failed"; // Define testPassedString as "failed"

    			if (testDescription !== ""){ // If the Description exists
    				resultMessage += " (" + testDescription + ")"; // Append the testDescription
    			}

    			if (perfily.data.GetProperty(id, "Passed")){ // If the Test Passed
    				testPassedString = "passed"; // Change testPassedString to "passed"
    			}

    			resultMessage += " " + testPassedString; // Append testPassedString

    			if (testIterations > 1){ // If the testIterations is greater than one
    				resultMessage += ", running " + testIterations.toString() + " iterations,"; // Append iterations string to resultMessage
    			}

    			resultMessage += " and took an average of " + perfily.data.GetProperty(id, "Duration").toFixed(4) + "ms to complete.";
    		}
        } else { // If this is not a Suite or Test
            resultMessage += " is not a Suite or Test."
        }

		if (perfily.data.GetProperty(id, "OutputIntoDocument") == false){ // If we are logging to console (default action)
			console.log(resultMessage);
		} else{ // If we are outputting to document instance
			let paragraph = document.createElement("p"); // Create a new paragraph tag
			paragraph.textContent = resultMessage; // Set the textContent of the paragraph to resultMessage
			document.body.appendChild(paragraph); // Append the testParagraph
		}
	}

    // SetProperty
    // This function will set a property of the Suite or Test
    export function SetProperty(id : string, property : string, value : any) : boolean {
        if (perfily.data.IsObject(id)){ // If this is a Suite or Test
            perfily.data.store[id][property] = value; // Set property to value
            return true; // Return success
        } else { // If the test does not exist
            return false;
        }
    }

    // #endregion

}