// Interfaces used throughout Perfily

interface sharedPerfProperties extends Object {
    // Pre-Run Properties
    AutoclearExpecting : boolean; // AutoclearExpecting is a boolean to determine whether we should remove Expecting after each Run()
    Autorun : boolean; // // Autorun is a boolean to determine whether we should automatically run the test after setting the function
    Iterations : boolean; // Number of Times to run Function
    Output : boolean; // Output the result of the Test
	OutputIntoDocument : boolean; // Define outputIntoDocument as a boolean, defaulting to false
}

interface suiteProperties extends sharedPerfProperties {
    // Post-Run Properties
    LongestTestLength : number; // Define LongestTestLength as the length of the longest test in the Suite
    LongestTestObject : testProperties; // Define LongestTestObject as the testProperties Object of the longest test
    ShortestTestLength : number; // Define ShortestTestLength as the length of the shortest test in the Suite
    ShortestTestObject : testProperties; // Define ShortestTestObject as the testProperties Object of the shortest test
    Tests : Array<string>; // Tests is an array of string, where string is the Id of the test
    TotalDurationOfTests : number; // Set TotalDurationOfTests as a number, the total milliseconds of all the tests in the suite
}

interface testProperties extends sharedPerfProperties {
    // Pre-Run Properties
	Expecting : any; // Set expecting to any
    Suite : string; // Id of the Suite (if any) to associate test with
	TestFunction : Function; // Set the function of this Perfily Test

    // Post-Run Properties
    Description : string; // Set the description of this Perfily Test
	Duration : number; // Duration the Benchmark took
	Passed : boolean; // Define passed as a boolean, defaulting to true
}