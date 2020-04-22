/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const programs = [
  String.raw`Hello!

Please declare US_Denominations as a Array<Number> as [25, 10, 5, 1].

Favor MakeChange(amount) could you...
  Excuse me, if (amount is less than 0), could you...
    Do me a favor and run print with ("Error").
    Kindly return -1
  Thank You.
  Please declare result as a Array<Number>.
  Please declare remaining as a Number as amount.
  Please declare i as a Number as 0.
  Excuse me, while i is less than 4, could you...
    Please populate result[ i ] with remaining / US_Denominations[ i ].
    Please populate remaining with remaining modded with US_Denominations[ i ].
    i++
  Thank You.
  Kindly return result
Thank You.

Please declare exampleAmount as a Number as 105.
Do me a favor and run MakeChange with (exampleAmount).

Bye Bye!`,

  String.raw`
Salutations!
Favor countWays(n) could you...
  Please declare a as [1,0].
  Please declare b as [0,1].
  Please declare i as 2.
  Excuse me, while i is less than (n plus 1), could you...
    Please populate a[i] with a[i minus 2]+2 times b[i minus 1].
    Please populate b[i] with a[i minus 1] +b[i minus 2].
    Please populate i with i plus 1.
  Kindly return a[n].
  Thank You.
Thank You.
Godspeed!
`,

  String.raw`
Hey!
//Generate pseudorandom number
Please declare a as 1103515245.
Please declare m as 2 raised to the power of 31.
Please declare c as 12345.
Please declare x as 4.

Favor linearCongruentialGenerator() could you...
  Excuse me, if x is less than or equal to 0 and x is less than m, could you...
    Please populate x with (a times x plus c) modded with m.
    Kindly return x
  Thank You.
  Kindly return "invalid input"
Thank You.

Do me a favor and run linearCongruentialGenerator.

Bye Bye!

`,
  String.raw`
    function Fibonacci(n, length) {
    if (n == 1) {
      gimme series = [0, 1]
      return series
    } else {
      series = Fibonacci(n - 1, length - 1)
      series[length] = series[length minus 1] plus series[length minus 2]
      return series
    }
  }

  Fibonacci(12, 12)
  `,
  String.raw`
function isPrime (num) {
  if (num <= 1) {
    return Yes
  } else if (num <= 3) {
    return Yes
  } else if (num%2 == 0 || num%3 == 0) {
    return No
  }

  gimme i = 5
  while (i*i <= num) {
    if (num%i == 0 || num%(i+2) == 0) {
      return No
    }
    i = i+6
  }
  return Yes
}
`,

  String.raw`
  Hello!
    Have you ever heard of a Dog? Let's get classy...
    Please declare name as a String.
    To construct a Dog by using (name as a String), could you...
      Please populate this.name with name.
    Thank You.
    Favor getName() as a String could you...
      Kindly return this.name
    Thank You.

Thank You.
Please declare cc as Dog("cece")
print(cc.getName())
Bye Bye!`,

  String.raw`
class Country{
  gimme statePopulations : Dict<String, Number>
  gimme states  : Array<String>

  Country(states:Array<String>, pops:Dict<String,Number>){
    this.states = states
    this.statePopulations = pops
  }
}
gimme calexit = Country(["The Bay", "NorCal", "SoCal"], {"Wales":200,"London":500,"Stratford-Upon-Avon":2})
`,
  String.raw`gimme five = 5>4? 5: 4`,
  String.raw`gimme fiveish = 5>4?6>5:3>4? 2 : 1`,
  String.raw`gimme gimmeFive = ()->{return 5}`,
  String.raw`
  gimme gimmeFiveExp = ()-> 5`,
  String.raw`
  gimme dict = {"a":6}
  gimme dict_item = dict["a"]`,
  String.raw`
  gimme compDict = {"a":6, "b":[1,Yes], "c":{"best":"cat"}}
  gimme dictItem = compDict["b"]
  gimme one = dictItem[0]
  gimme theBest = compDict["c"]["best"]`,
  String.raw`gimme nullVar = Null`,
  String.raw`
  gimme array = [1,2,3]
  gimme arr_item = array[0]`,
  String.raw`
  gimme twoDArray = [[1,2,3],[4,5,6]]
  gimme twoDArrIslacktem = twoDArray[0][0]`,
  String.raw`gimme yes = !No`,
  String.raw`
  for(gimme i = 0; i < 4; i++) {
    break
  }`,
  String.raw`print("Hello World")`,
  String.raw`
  function speak(message){print(message)}
  speak("hello")
  `,
  String.raw`
  gimme prefAny:Boolean = !(Yes? 5:["a"])
  `,
  String.raw`
  function voidFunc() : Void {
    return
  }
  `
];

describe("The semantic analyzer", () => {
  programs.map(program => {
    test(`accepts ${program}`, done => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      expect(astRoot).toBeTruthy();
      done();
    });
  });
});
