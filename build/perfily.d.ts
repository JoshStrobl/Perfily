declare class Perfily {
    duration: number;
    expecting: any;
    iterations: number;
    name: string;
    outputIntoDocument: boolean;
    passed: boolean;
    testFunction: Function;
    constructor(benchmarkProperties?: Object);
    SetExpecting(benchmarkExpectedResult: Function): void;
    SetIterations(iterations: number): void;
    SetFunction(benchmarkFunction: Function): void;
    SetName(benchmarkName: string): void;
    Run(): void;
}
