/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../javascript-generator");

function stripped(s) {
  return s.replace(/\s+/g, "").replace(/_\d+/g, "");
}

const fixture = {
  hello: [String.raw`print("Hello")`, 'console.log   ("Hello")'],
  oneVar: [String.raw`gimme x = 1`, 'let x_1 = 1'],
  forLoopWithBreak: [
    String.raw`for (gimme i = 0; i < 10; i++) { break }`,
    String.raw`for (let i = 0; (i < 10); i++) { break }`
  ],
  ternaryExp: [
    String.raw`gimme trn = Yes ? 1 : 2`, 
    String.raw`let trn = (true ? 1 : 2)`
  ],
  null: [
    String.raw`gimme nl = Null`,
    String.raw`let nl = null`
  ],
  /*basicConditionalRude: [
    String.raw`
      gimme z:Number = 3
      if(z == 0) {
        z = z + 1
      } else if(z == 1) {
        z = z + 2
      } else if(z == 2) {
        z = z + 3
      } else {
        z = z * z
      }
    `,
    String.raw`
      let z = 3;
      if((z === 0)) {
        z = (z + 1);
      } else if((z === 1)) {
        z = (z + 2)
      } else if((z === 2)) {
        z = (z + 3)
      } else {
        z = (z * z)
      }
    `
  ],
  basicConditionalPolite: [
    String.raw``,
    String.raw`
      Please declare x as a Number as 3.
      if() {

      } else if () {

      } else {
        
      }
    `
  ],
  basicForLoop: [

  ],
  */
  changeMaker: [
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
          Please populate result[ i ] with roundDown(remaining / US_Denominations[ i ]).
          Please populate remaining with roundDown(remaining modded with US_Denominations[ i ]).
          i++
        Thank You.
        Kindly return result
      Thank You.
      Please declare exampleAmount as a Number as 105.
      Do me a favor and run MakeChange with (exampleAmount).
      Bye Bye!`,
    String.raw`let US_Denominations_1 = [25, 10, 5, 1];
        function MakeChange_2(amount_3) {
          if ((amount_3 < 0)) {
            console.log("Error");
            return -1
          };
          let result_4 = [];
          let remaining_5 = amount_3;
          let i_6 = 0;
          while ((i_6 < 4)) {
            result_4[i_6] = Math.floor((remaining_5 / US_Denominations_1[i_6]));
            remaining_5 = Math.floor((remaining_5 % US_Denominations_1[i_6]));
            i_6++
          };
          return result_4
        };
        let exampleAmount_7 = 105;
        MakeChange_2(exampleAmount_7)`
  ],

  dogClass: [
    String.raw`Hello!
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
    String.raw`class Dog_1 {
    name_2;
    getName_3() {
      return this.name_2
    }
    constructor(..._) {
      if (_.length === 1) {
        let name_4 = _[0];
        this.name_2 = name_4
      }
    }
  };
  let cc_5 = new Dog_1("cece");
  console.log(cc_5.getName_3())`
  ],

  countryClass: [
    String.raw`class Country{
      gimme statePopulations : Dict<String, Number>
      gimme states  : Array<String>

      Country(states:Array<String>, pops:Dict<String,Number>){
        this.states = states
        this.statePopulations = pops
      }
    }
    gimme calexit = Country(["The Bay", "NorCal", "SoCal"], {"Wales":200,"London":500,"Stratford-Upon-Avon":2})
  `,
    String.raw`class Country_13 {
        statePopulations_14 = {};
        states_15 = []
        constructor(..._) {
          if (_.length === 2) {
            let states_16 = _[0];
            let pops_17 = _[1];
            this.states_15 = states_16;
            this.statePopulations_14 = pops_17
          }
        }
      };
      let calexit_18 = new Country_13(["The Bay", "NorCal", "SoCal"], {
        "Wales": 200,
        "London": 500,
        "Stratford-Upon-Avon": 2
      })`,
  ],
  builtins: [
    String.raw`
      Hello!

      Please declare word as a String as "lengthtest".
      print(word.length())
      Please declare rdup as a Number as 22.55.
      Please declare rddn as a Number as 22.55. 
      rdup = roundUp(rdup)
      rddn = roundDown(rddn)
      Please declare abs as a Number as -999.
      abs = absoluteVal(abs)
      Please declare dog as a String as "dog".
      Please declare house as a String as "house".
      Please declare doghouse as a String as concatenate(dog, house).

      Bye Bye!
    `,
    String.raw`
      let word = "lengthtest";
      console.log(word.length);
      let rdup = 22.55;
      let rddn = 22.55;
      rdup = Math.ceil(rdup);
      rddn = Math.floor(rddn);
      let abs = -999;
      abs = Math.abs(abs);
      let dog = "dog";
      let house = "house";
      let doghouse = dog.concat(house)
    `
  ]
  /*
  hello: [
    String.raw`print("Hello, world\n")`,
    String.raw`console.log("Hello, world\n")`
  ],

  arithmetic: [String.raw`5 * -2 + 8`, String.raw`((5 * (-(2))) + 8)`],

  letAndAssign: [
    String.raw`let var x := 3 in x := 2 end`,
    /let x_(\d+) = 3;\s+x_\1 = 2/
  ],

  call: [
    String.raw`let function f(x: int, y: string) = () in f(1, "") end`,
    /function f_(\d+)\(x_\d+, y_\d+\) \{\s*};\s*f_\1\(1, ""\)/
  ],

  whileLoop: [String.raw`while 7 do break`, /while \(7\) \{\s*break\s*\}/],

  forLoop: [
    String.raw`for i := 0 to 10 do ()`,
    /let hi_(\d+) = 10;\s*for \(let i_(\d+) = 0; i_\2 <= hi_\1; i_\2\+\+\) \{\s*\}/
  ],

  ifThen: [String.raw`if 3 then 5`, "((3) ? (5) : (null))"],

  ifThenElse: [String.raw`if 3 then 5 else 8`, "((3) ? (5) : (8))"],

  member: [
    String.raw`let type r = {x:string} var p := r{x="@"} in print(p.x) end`,
    /let p_(\d+) = \{\s*x: "@"\s*\};\s*console.log\(p_\1\.x\)/
  ],

  subscript: [
    String.raw`let type r = array of string var a := r[3] of "" in print(a[0]) end`,
    /let a_(\d+) = Array\(3\).fill\(""\);\s*console.log\(a_\1\[0\]\)/
  ],

  letInFunction: [
    String.raw`let function f():int = let var x:= 1 in x end in () end`,
    /function f_(\d+)\(\) \{\s*let x_(\d+) = 1;\s*return x_\2\s*\};/
  ],

  letAsValue: [
    String.raw`print(let var x := "dog" in concat(x, "s") end)`,
    /console.log\(\(\(\) => \{\s*let x_(\d+) = "dog";\s*return x_\1.concat\("s"\);\s*\}\)\(\)\)/
  ],

  returnExpressionSequence: [
    String.raw`let function f():int = let var x:= 1 in (1;nil;3) end in () end`,
    /function f_(\d+)\(\) {\s*let x_(\d+) = 1;\s*1;\s*null;\s*return 3\s*\};/
  ],

  moreBuiltIns: [
    String.raw`(ord("x"); chr(30); substring("abc", 0, 1))`,
    /\("x"\).charCodeAt\(0\);\s*String.fromCharCode\(30\);\s*"abc".substr\(0, 1\)/
  ],

  evenMoreBuiltIns: [
    String.raw`(not(1) ; size(""); exit(3))`,
    /\(!\(1\)\);\s*"".length;\s*process\.exit\(3\)/
  ]
*/
};
describe("The JavaScript generator", () => {
  console.log(generate);
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, done => {
      const ast = parse(source);
      analyze(ast);
      const actual = generate(ast, false);
      expect(stripped(actual)).toEqual(stripped(expected));
      done();
    });
  });
});
