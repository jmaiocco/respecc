/*
 * Semantic Error Tests
 *
 * These tests check that the analyzer will reject programs with various
 * static semantic errors.
 */

const parse = require("../../ast/parser");
const Context = require("../context");

const errors = [
  ["use of undeclared variable rude", "x = 1"],

  /*//BINARY EXPRESSION TYPING WILL THROW AT RUNTIME
  ["non Number,  add rude", "gimme x= 1 + No"], //DOES NOT PASS

  ["non Number, subtract rude", "gimme x = 1 - Yes"],

  ["types don't match in equality test", "gimme x = 1 is equal to Yes"],
  ["types don't match in inequality test", "gimme x= 1 is not equal to Yes"],
  ["types do not match in declaration rude", 'gimme x:Number = "hello"'],
/**/

  // ["undeclared beacuse in other scope rude", "x= 0"], IDK HOW TO

  ["redeclaration of variable", "gimme x:Number = 1\n gimme x:Number = 2"],
  ["type mismatch in assignment rude", 'gimme x:Number = "hello"'],

  // ["writing to (readonly) for loop index"],does not apply to respec++
  [
    "too many function arguments rude",
    "function plusOne(x:Number){return  x+1}\n plusOne(3,1)"
  ],

  [
    "too few function arguments",
    "function plusOne(x:Number){return  x+1}\n plusOne()"
  ],
  [
    "wrong type of function argument",
    'function plusOne(x:Number){return  x+1}\n plusOne("hi")'
  ],
  ["redeclared field", "gimme x = {a:1, a:Yes}"], //does not apply to respec++ probably
  ["no such field", "gimme x = {a:1} \n gimme y = x.b"],
  ["member of nonrecord", "gimme x = 1 \n gimme y = x.z"],
  ["subscript of nonarray", "gimme x = 1 \n gimme y = x[0]"],
  ["call of nonfunction", "gimme x= 1 \n x()"],
  ["non integer subscript", "gimme x = [1,2,3] \n gimme y = x[True]"],
  [
    "constructors have the same args",
    String.raw`class Dog {
      gimme name : String
      gimme age : Number
      Dog(name) { this.name = name }
      Dog(name) {
        this.name = name
        this.age = 5
      }
  }`
  ],
  [
    "constructors have ambiguous arg types",
    String.raw`class Dog {
      gimme name : String
      gimme breed : String
      gimme age : Number
      Dog(name) { this.name = name }
      Dog(breed) {
        this.breed = breed
      }
  }`,
    [
      "Instantiate class with undefined constructor",
      String.raw`
      class Dog {
        gimme name : String
        gimme age : Number
        Dog(name) { this.name = name }
      }
      gimme cc = Dog(10)
  `
    ]
  ]

  /* **************Toal Examples***************************
  ['use of undeclared variable', 'x := 1'],
  ['non integer while condition', 'while "hello" do nil'],
  ['non integer if condition', 'if "hello" then nil'],
  ['non integer in add', '3 + "dog"'],
  ['non integer in subtract', '"dog" - 5'],
  ['types do not match in equality test', '2 = "dog"'],
  ['types do not match in inequality test', '2 <> "dog"'],
  ['types do not match in declaration', 'let var x: int := "3" in x end'],
  ['undeclared because in other scope', 'let var x := 1 in let var y := 2 in 1 end; y end'],
  ['redeclaration of variable', 'let var x := 1 var x := 2 in nil end'],
  ['type mismatch in assignment', 'let var x := 1 var y := "abc" in x := y end'],
  ['writing to (readonly) for loop index', 'for i := 0 to 10 do i := 3'],
  ['too many function arguments', 'chr(1, 2, 3)'],
  ['too few function arguments', 'concat("x")'],
  ['wrong type of function argument', 'ord(8)'],
  ['redeclared field', 'let type p = {r: int, r: int} in 0 end'],
  ['no such field', 'let type p = {r: int} var s: p := nil in s.zzz end'],
  ['member of nonrecord', 'let var x := 3 in x.y end'],
  ['subscript of nonarray', 'let var x := 3 in x[0] end'],
  ['call of nonfunction', 'let var x := 1 in x(5) end'],
  ['non integer subscript', 'let type list = array of int var a := list [1] of 0 in a["x"] end'],
  // Might need more here, depending on your test coverage report
  */
];

describe("The semantic analyzer", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, done => {
      const astRoot = parse(program);
      expect(astRoot).toBeTruthy();
      expect(() => astRoot.analyze(Context.INITIAL)).toThrow();
      done();
    });
  });
});
