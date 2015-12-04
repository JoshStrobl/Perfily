// This is the Perfily module

/// <reference path="data.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="suite.ts" />
/// <reference path="test.ts" />

module perfily {
	// New Suite or Test helper functions
	export var NewSuite : Function = perfily.suite.New;
	export var NewTest : Function = perfily.test.New;

	// Export-related helper functions
	export var ExportSuite : Function = perfily.suite.Export;
	export var ExportTest : Function = perfily.test.Export;

	// Run-related helper functions
	export var RunSuite : Function = perfily.suite.Run;
	export var RunTest : Function = perfily.test.Run;

	// Data-related helper functions
	export var GetProperty : Function = perfily.data.GetProperty;
	export var OutputResult : Function = perfily.data.OutputResult;
	export var SetProperty : Function = perfily.data.SetProperty;
}