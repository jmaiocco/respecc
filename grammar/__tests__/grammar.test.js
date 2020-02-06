/*
 * Grammar Success Test
 *
 * These tests check that our grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require("../syntax-checker");
/*
const program1 = String.raw`
let
  type Circle = {
    x: int,
    y: int,
    color: string
  }
  function fib(n: int): int =
    let
      var a: int := 0
      var b: int := 1
      var t := 0
    in
      while n > 0 do
        (t := a; a := b; b := t + b; n := n - 1);
      "abc$%π\n\\\u{41}";
      a := if 1 then b := 1;
      b := if 0 then 2 else let var x := 1 in x end;
      b
    end
  var c: Circle := Circle {y = 2, x = 5<3&2<>1, color = "blue"}
  type list = array of string
  var dogs: list := list [3] of "woof"
in
  dogs[1] := "Sparky";
  for i := 1 to 10 do
    print(fib(i) & 0 | 1 + 0 * 1 - 0 / 1)
end
`;
*/

const program1 = String.raw`
Salutations!
for( gimme i : Number = 0; i < 10; i++) could you...
  print(i)
Thank You.
Farewell!
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program1)).toBe(true);
    done();
  });
});
const program2 = String.raw`
Excuse me, if x is less than 3, could you...
	x = 3;
  Please declare x as 3.
  Please declare x as x < 4.
Thank You.
Otherwise, if x is equal to 6, could you...
Thank You.
Otherwise, could you...
Thank You.
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program2)).toBe(true);
    done();
  });
});

const program3 = String.raw`
Hello!
if(x raised to the power of 3 is less than 6) {
	x = 3;
}

Farewell!
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program3)).toBe(true);
    done();
  });
});

const program4 = String.raw`
y = func(x,y,z) or func();
Please populate y with the result of running sum with (a,b).

x =  the result of running sum with (a,b)

You deserve a break!
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program4)).toBe(true);
    done();
  });
});

const program5 = String.raw`
gimme id : Number = 6
Please declare id as a Number as 6.
id = 7;
Please populate id with 7.

`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program5)).toBe(true);
    done();
  });
});
const program6 = String.raw`
Excuse me, while x is less than y, could you...
	 x++

Thank You.

for(gimme i =  x; x < 6; x++) {
}

if(  x  < y   ) {
}

x = the result of running o
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program6)).toBe(true);
    done();
  });
});

const program7 = String.raw`
Favor o():Number {
}
print(333333)
Do me a favor and run o.
`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program7)).toBe(true);
    done();
  });
});

const program8 = String.raw`
/* Impolite Function Declartion */

function sum(a,b) {
	return a + b
}


/* Polite Function Declartion */
Favor sum( a , b ) could you...
	return a plus b
Thank You.

/* Impolite Loop  */
for(gimme i = 0; i < n; i++) {
	if(i == 3) { break; }
 }

/* Polite Loop */
Please declare i as 0.
Excuse me, while i is less than n, could you...
	Excuse me, if i is equal to 3, could you...
    	break
    Thank You.
    Please populate i with i plus 1.
Thank You.

`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program8)).toBe(true);
    done();
  });
});

const program9 = String.raw`
x = x ? x : x
x = (x,x) -> could you...
x = x + x
Thank You.

`;

describe("The syntax checker", () => {
  test("accepts the mega program with all syntactic forms", done => {
    expect(syntaxCheck(program9)).toBe(true);
    done();
  });
});
