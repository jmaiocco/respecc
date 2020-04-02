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

  /* ***************Toal Examples***************************
// This is just enough to complete 100% analyzer coverage, but feels light to me.
const program = String.raw`
let
  type Circle = {
    x: int,
    y: int,
    color: string
  }
  type list = array of string
  var two := successor(1) // Test forward use, yay
  var c: Circle := Circle {y = 2, x = 5<3&2<>1, color = "blue"}
  var dogs: list := list [3] of "woof"
  function successor(x: int): int = x + 1
in
  dogs[1] := "Sparky";
  if "a" < "b" then ();
  if c = c then print("") else print("z");
  while 1 do break;
  c.x := if 1 then 2 else 3;
  for i := 1 to (9; 10) do
    print(concat(chr(-2), "xyz"));
  let var x := 1 in end
end
`;
*/

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
  `, //GENERATES ERROR...Recursive call is causing type errors, may be relegated to run-time
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
    Have you ever heard of a Ball? Let's get classy...
      Please declare color as a String.
      To construct a Ball by using (color as a String), could you...
        Please populate this.color with color.
      Thank You.
    Thank You.
    Please declare name as a String.
    Please declare ball as a Ball.
    To construct a Dog by using (name as a String), could you...
      Please populate this.name with name.
    Thank You.
    Favor getName() as a String could you...
      Kindly return this.name
    Thank You.

Thank You.
Please declare cc as Dog("cece")
Bye Bye!`,

  // String.raw`
  // gimme numbers = [1,3,4,5,28,3]

  // function bubbleSort(comparator, arr, arrlen) {
  // 	for(gimme i=0;i<arrlen-1;i++){
  //       for(gimme j=0;j<arrlen-i-1;j++){
  //         if(comparator(arr[j],arr[j+1]) > 0){
  //           gimme temp = arr[j]
  //           arr[j] = arr[j+1]
  //           arr[j+1] = temp
  //         }
  //       }
  //     }
  //   return arr
  // }

  // bubbleSort((a,b)->(a-b),numbers,6)
  // `, //GENERATE ERRORS callbacks not supported
  String.raw`gimme five = 5>4? 5: 4`,
  String.raw`gimme fiveish = 5>4?6>5:3>4? 2 : 1`,
  String.raw`gimme gimmeFive = ()->{return 5}`, //GENERATES ERRORS
  String.raw`
  gimme gimmeFiveExp = ()-> 5`,
  String.raw`
  gimme dict = {"a":6}
  gimme dict_item = dict["a"]`,
  String.raw`
  gimme compDict = {"a":6, "b":[1,Yes]}
  gimme dictItem = compDict["b"]`,
  String.raw`gimme nullVar = Null`,
  String.raw`
  gimme array = [1,2,3]
  gimme arr_item = array[0]`,
  String.raw`gimme yes = !No`,
  String.raw`
  for(gimme i = 0; i < 4; i++) {
    break
  }`,
  String.raw`print("Hello World")`,
  String.raw`Please populate gimmeFive with ()-> { Kindly return 5 }.` //Generates Errors
];

describe("The semantic analyzer", () => {
  programs.map(program => {
    test("accepts the mega program with all syntactic forms", done => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      analyze(astRoot);
      expect(astRoot).toBeTruthy();
      done();
    });
  });
});
