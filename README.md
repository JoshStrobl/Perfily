# Perfily #

Perfily is a simple (*no really, like super simple*) JavaScript benchmark and test utility, written in Typescript, that leverages `performance.now()`. It is intentionally minimalistic, with merely doing benchmark and function v.s. expected result comparison.

## Do I always have to create a new instance? ##

Nope. You can use the helper functions to do re-setting of the benchmark's values

## Developing Perfily ##

To develop Perfily, you need the `compiler` tool from [StroblIndustries/CodeUtils](https://github.com/StroblIndustries/CodeUtils) and have it set in your local `build` dir within Perfily's repo.

You'll also need to run the `bootstrap` tool from CodeUtils as well to get the necessary packages.

## Using Perfily ##

### Creating a Perfily Benchmark ###

You can create an instance of Perfily by doing:

``` javascript
var benchmark = new Perfily();
```

Perfily accepts multiple variables on constructions:

Key | Type
---- | -----
autoclearExpecting | boolean
expecting | any
function | Function
iterations | number
name | string
outputIntoDocument | boolean

Example:

``` javascript
var benchmark = new Perfily({
	"autoclearExpecting" : true,
	"name" : "Test",
	"expecting" : "bacon",
    "iterations" : 100,
	"function" : function(){return "bacon";}
});
```

### Set / Helper Functions ###

Several functions are offered for setting the properties shown in the "Creating a Perfily Benchmark" section, in the event you don't set them during construction.

**SetName()** Usage:

``` javascript
benchmark.SetName("Test Benchmark");
```

**SetExpecting()** Usage:

``` javascript
benchmark.SetExpecting(value);
```

**Note:** If you set value to `""` (an empty string), it will remove the `expecting` variable from that particular Perfily instance.

**SetFunction()** Usage:

``` javascript
benchmark.SetFunction(function);
```

**SetIterations()** Usage:

``` javascript
benchmark.SetIterations(num);
```

### Run ###

Use the `Run` function to run the benchmark / test.

``` javascript
benchmark.Run();
```

It will log to console (or if you set `outputToDocument` to `true` during Perfily instance construction, document), something like:

```
Test Benchmark passed, running over 100 iterations, and took 12.2ms
```

It will also set the Benchmark's `duration` to the time it took to run the test. So you can use something like `benchmark.duration` and get the entire, non-fixed, duration of the test.

It will run over `x` amount of iterations, where `x` is the amount of iterations defined for this Perfily benchmark, defaulting to 1. The duration will be the average of the individual iteration times.

If `autoclearExpecting` is set to `true` (default: `false`), it will remove the `expecting` variable from that particular Perfily instance.  This is handy if you are using a single Perfily instance for multiple tests,
and don't want the residual "expecting" variable.