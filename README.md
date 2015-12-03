# Perfily #

Perfily is a minimalistic JavaScript benchmark and test utility, written in Typescript, that leverages `performance.now()` for accurate benchmarking.

Perfily's minimalistic design accomplishes the following:
- Tests (benchmarking).
- Function v.s. expected result comparison.
- Organizing Tests into Suites and determining longest and shortest tests.

## Developing Perfily ##

To develop Perfily, you need the `compiler` tool from [StroblIndustries/CodeUtils](https://github.com/StroblIndustries/CodeUtils) and have it set in your local `build` dir within Perfily's repo.

You'll also need to run the `bootstrap` tool from CodeUtils as well to get the necessary packages.

## Using Perfily ##

### Creation ###

#### Shared Options ####

Both the Perfily Suite and Perfily Test creation functions accept a set of arguments in their properties Object. The options below are shared between both Suites and Tests, meaning that in both creation functions, you may add the following options:

Option | Type | Default
---- | ----- | -----
Output | boolean | false
OutputIntoDocument | boolean | false

If you set Output to `true` but did not set OutputIntoDocument, it will output to the browser's console.

If you set OutputIntoDocument to `true` but do not set Output, it will set Output to `true`.

#### Perfily Suite ####

You can create a Perfily Suite by using the `perfily.suite.New` function, or helper function `perfily.NewSuite`.

Option | Type
---- | -----
Name | string
suiteProperties | Object

The example below creates a new Suite called SuiteName, with an empty Object (defaults to not outputting results).

``` javascript
perfily.NewSuite("SuiteName", {});
```

#### Perfily Test ####

You can create a Perfily Test by using the `perfily.test.New` function, or helper function `perfily.NewTest`. This function will return a unique Id of this Test.

Option | Type | Description | Default
---- | ----- | ----- | -----
AutoclearExpecting | boolean | Remove Expecting after each Run() | `false`
Autorun | boolean | Automatically run the test after setting the function | `false`
Description | string | Description of this Perfily Test | ` `
Expecting | any | What result to expect from TestFunction | ` `
Iterations | number | Number of times to run TestFunction | `1`
Suite | string | Name of the Suite (if any) to associate test with | `generic`
TestFunction | Function | Function of this Perfily Test | ` `

Notes:

1. If no Expecting value is provided (or is an empty string), the Test will always pass.

In the example below, we:

1. Set a description
2. Expect "results" as the returned function result
3. Intend to call the function 1000 times
4. Set suite to SuiteName
5. Set TestFunction

``` javascript
var testId = perfily.NewTest({
	"Description" : "This is a Test",
	"Expecting" : "results",
	"Iterations" : 1000,
	"Suite" : "SuiteName",
	"TestFunction" : function(){ return "results"; }
})
```

### Methods ###

#### Data ####

`perfily.data.GetProperty` - This function will get the property specified from the Suite or Test specified.

Option | Type
---- | -----
Suite or Test Name | string
Property | string

**Returns**: Value of property or if Suite / Test does not exist, `false`.

**Example**:

In the example below, we get the ShortestTestLength from the Suite's Object.

``` javascript
var value = perfily.data.GetProperty("SuiteName", "ShortestTestLength");
```

`perfily.data.OutputResult` - This function will output the result of the Suite or Test, depending on what Id is provided.

`perfily.data.SetProperty` - This function will set the property specified, with the value specified, to the Suite or Test.

Option | Type
---- | -----
Suite or Test Name | string
Property | string
Value | any

**Example**:

``` javascript
perfily.data.SetProperty("generic5", "Description", "This is the description of the test generic5.");
```

#### Suite ####

`perfily.suite.OutputResult` - This function will output the results of the Suite. This is the same as calling `perfily.data.OutputResult`.

Option | Type
---- | -----
SuiteName | string

**Example**:

``` javascript
perfily.suite.OutputResult("SuiteName");
```

`perfily.suite.Run` - This function will run all the tests associated with the Suite.

Option | Type
---- | -----
SuiteName | string

**Example**:

``` javascript
perfily.suite.Run("SuiteName");
```

#### Test ####

`perfily.test.Run` - This function will run the Test and do the following (amongst other things):

1. Output if necessary.
2. If the test is shortest or longest test, set to `ShortestTestLength` or `LongestTestLength`, as well as `ShortestTestObject` or `LongestTestObject` accordingly.
3. Update the associated Suite's `TotalDurationOfTests` with the length of the Test.

Option | Type
---- | -----
Test Name | string

**Example**:

``` javascript
perfily.test.Run("generic5");
```

`perfily.test.SetDescription` - This function will set the description of the Test provided. This is the same as calling `perfily.data.SetProperty` with the id, `Description` and value.

Option | Type
---- | -----
Test Name | string
Description | string

**Example**:

``` javascript
perfily.test.SetDescription("generic5", "Description of generic5.");
```

`perfily.test.SetExpecting` - This function will set the expecting value of the Test provided. This is the same as calling `perfily.data.SetProperty` with the id, `Expecting` and value.

Option | Type
---- | -----
Test Name | string
Expecting | any

**Example**:

``` javascript
perfily.test.SetExpecting("generic5", 1337);
```

`perfily.test.SetIterations` - This function will set the iterations of the Test provided. This is the same as calling `perfily.data.SetProperty` with the id, `Iterations` and the number.

Option | Type
---- | -----
Test Name | string
Iterations | number

**Example**:

``` javascript
perfily.test.SetIterations("generic5", 1000);
```

`perfily.test.SetFunction` - This function will set the function of the Test provided. This is the same as calling `perfily.data.SetProperty` with the id, `TestFunction`, and number.

However, differing from calling `perfily.data.SetProperty`, this function will automatically run the test if `Autorun` is `true`.

Option | Type
----- | -----
Test Name | string
TestFunction | function

**Example**:

``` javascript
perfily.test.SetFunction("generic5", function(){});
```

### Getting Results ###

This section descriptions what properties are set after running a Suite or Test.

#### Suite and Test ####

Upon running a Suite or a Test associated with a Suite, it will set:

Option | Type | Description
----- | ----- | -----
ShortestTestLength | number | This is a length of time it took the shortest test.
ShortestTestObject | Object | This is the Object of the Test that took the shortest amount of the time.
LongestTestLength | number | This is a length of time it took the longest test.
LongestTestObject | Object | This is the Object of the Test that took the longest amount of the time.
TotalDurationOfTests | number | This is the combined duration of **all** the Tests in the Suite.

#### Test ####

Upon running a Test, aside from the properties set in the "Suite and Test" section, it will also set the following properties of the Test's Object:

Option | Type | Description
----- | ----- | -----
Duration | number | This is the duration the Test's TestFunction took to complete.
Passed | boolean | This is a boolean value as to whether or not the test passed.