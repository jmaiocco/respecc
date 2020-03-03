/*
 * Semantics Success Test
 *
 * These tests check that the semantic analyzer correctly accepts a program that passes
 * all of semantic constraints specified by the language.
 */

const parse = require("../../ast/parser");
const analyze = require("../analyzer");

const program = String.raw`Hello!

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

Bye Bye!`;

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

describe("The semantic analyzer", () => {
  test("accepts the mega program with all syntactic forms", done => {
    const astRoot = parse(program);
    expect(astRoot).toBeTruthy();
    analyze(astRoot);
    expect(astRoot).toBeTruthy();
    done();
  });
});
