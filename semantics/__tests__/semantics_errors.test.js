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
  [
    "undeclared beacuse in other scope ",
    String.raw`
  function scopeError(){
    gimme scopeVar = 1
  }
  gimme outOfScope = scopeVar`
  ],
  ["redeclaration of variable", "gimme x:Number = 1\n gimme x:Number = 2"],
  ["type mismatch in assignment rude", 'gimme x:Number = "hello"'],
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
  ["redeclared field", "gimme dict = {a:1, a:Yes}"],
  ["no such field", "gimme dict1 = {a:1} \n gimme notField = dict1.b"],
  ["member of nonrecord", "gimme nonRecord = 1 \n gimme item = nonRecord.z"],
  ["subscript of nonarray", "gimme nonArr = 1 \n gimme item1 = nonArr[0]"],
  ["call of nonfunction", "gimme nonFunct= 1 \n nonFunct()"],
  [
    "non integer subscript",
    "gimme arr = [1,2,3] \n gimme nonSubcript = arr[True]"
  ],
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
    "constructor name not equal to class name",
    String.raw`
    class Dog {
      gimme name : String
      gimme age : Number
      Dog(name) { this.name = name }
      Dog(name) {
        this.name = name
        this.age = 5
      }
    }
    gimme pup = Pup("cat")
  `
  ],
  [
    "constructor has non-null return",
    String.raw`class Doggo {
      Doggo() { return 2 }
  }`
  ],
  [
    "constructors have ambiguous arg types",
    String.raw`class Doggy {
      gimme name : String
      gimme breed : String
      gimme age : Number
      Doggy(name) { this.name = name }
      Doggy(breed) {
        this.breed = breed
      }
  }`
  ],
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
  ],
  [
    "class function called outside of scope",
    String.raw`
      class Dog {
        gimme name : String
        gimme age : Number
        Dog(name) { this.name = name }
        function getName(){ return this.name}
      }
      gimme cc = Dog(10)
      print(getName())
  `
  ]
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
