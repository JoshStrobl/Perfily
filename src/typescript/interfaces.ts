// Interfaces used throughout Perfily

interface sharedPerfProperties extends Object{
    Output : boolean; // Output the result of the Test
	OutputIntoDocument : boolean; // Define outputIntoDocument as a boolean, defaulting to false
}

interface suiteProperties extends sharedPerfProperties {
    LongestTestLength : number; // Define LongestTestLength as the length of the longest test in the Suite
    LongestTestObject : testProperties; // Define LongestTestObject as the testProperties Object of the longest test
    ShortestTestLength : number; // Define ShortestTestLength as the length of the shortest test in the Suite
    ShortestTestObject : testProperties; // Define ShortestTestObject as the testProperties Object of the shortest test
    Tests : Array<string>; // Tests is an array of string, where string is the Id of the test
    TotalDurationOfTests : number; // Set TotalDurationOfTests as a number, the total milliseconds of all the tests in the suite
}

interface testProperties extends sharedPerfProperties {
    AutoclearExpecting : boolean; // autoclearExpecting is a boolean to determine whether we should remove Expecting after each Run() (helps when reusing a Perfily instance)
	Autorun : boolean; // autorun is a boolean to determine whether we should automatically run the test after setting the function
    Description : string; // Set the description of this Perfily Test
	Duration : number; // Duration the Benchmark took
	Expecting : any; // Set expecting to any
	Iterations : number; // Set iterations to number
	Passed : boolean; // Define passed as a boolean, defaulting to true
    Suite : string; // Id of the Suite (if any) to associate test with
	TestFunction : Function; // Set the function of this Perfily Test
}