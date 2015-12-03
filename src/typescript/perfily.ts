// This is the Perfily module

/// <reference path="data.ts" />
/// <reference path="interfaces.ts" />
/// <reference path="suite.ts" />
/// <reference path="test.ts" />

module perfily {
	export var NewSuite : Function = perfily.suite.New;
	export var NewTest : Function = perfily.test.New;
}