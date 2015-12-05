declare module perfily.data {
    var store: Object;
    function GetProperty(id: string, property: string): any;
    function IsObject(key: string): boolean;
    function OutputResult(id: string): void;
    function SetProperty(id: string, property: string, value: any): boolean;
}
interface sharedPerfProperties extends Object {
    AutoclearExpecting: boolean;
    Autorun: boolean;
    Iterations: boolean;
    Output: boolean;
    OutputIntoDocument: boolean;
}
interface suiteProperties extends sharedPerfProperties {
    LongestTestLength: number;
    LongestTestObject: testProperties;
    ShortestTestLength: number;
    ShortestTestObject: testProperties;
    Tests: Array<string>;
    TotalDurationOfTests: number;
}
interface testProperties extends sharedPerfProperties {
    Expecting: any;
    Suite: string;
    TestFunction: Function;
    Description: string;
    Duration: number;
    Passed: boolean;
}
declare module perfily.test {
    function NewId(suiteName: string): string;
    function New(testProperties: any): string;
    var OutputResult: Function;
    function Export(id: string, options: Array<string>): Object;
    function Run(id: string): void;
    function SetDescription(id: string, testName: string): boolean;
    function SetExpecting(id: string, benchmarkExpectedResult: any): boolean;
    function SetIterations(id: string, iterations: number): boolean;
    function SetFunction(id: string, benchmarkFunction: Function): void;
}
declare module perfily.suite {
    function New(suiteName: string, suiteProperties: any): void;
    var OutputResult: Function;
    function Export(suiteName: string, options: Array<string>): Array<Object>;
    function Run(suiteName: string): void;
    function UpdateTotalDuration(suiteName: string, latestTestDuration: number): boolean;
}
declare module perfily {
    var NewSuite: Function;
    var NewTest: Function;
    var ExportSuite: Function;
    var ExportTest: Function;
    var RunSuite: Function;
    var RunTest: Function;
    var GetProperty: Function;
    var OutputResult: Function;
    var SetProperty: Function;
}
