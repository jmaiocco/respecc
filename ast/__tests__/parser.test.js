/*
 * Parser Tests
 *
 * These tests check that the parser produces the AST that we expect.
 *
 * Note we are only checking syntactic forms here, so our test programs
 * may have semantic errors.
 */

const parse = require("../parser");

const {
  Program,
  Return,
  Break,
  Conditional,
  WhileLoop,
  ForLoop,
  FunctionCall,
  Assignment,
  ArrayType,
  DictionaryType,
  FunctionDeclaration,
  VariableDeclaration,
  Parameter,
  Block,
  TernaryExp,
  LambdaBlock,
  LambdaExp,
  BinaryExp,
  UnaryPrefix,
  UnaryPostfix,
  SubscriptExp,
  MemberExp,
  ArrayLiteral,
  DictionaryLiteral,
  DictEntry,
  NumberLiteral,
  StringLiteral,
  BooleanLiteral
} = require("../../ast");

const fixture = {
  helloRude: [
    String.raw`print("Hello, world\n")`,
    new Program(
      false,
      [
        new FunctionCall("print", [new StringLiteral("Hello, world\\n")], false)
      ],
      false
    )
  ],
  helloPolite: [
    String.raw`Hello!
    Do me a favor and run print with ("Hello, world\n").
    Bye Bye!`,
    new Program(
      true,
      [new FunctionCall("print", [new StringLiteral("Hello, world\\n")], true)],
      true
    )
  ],
  returnRude: [String.raw``],
  returnPolite: [String.raw``],
  breakRude: [String.raw``],
  breakPolite: [String.raw``],
  conditionalRude: [String.raw``],
  conditionalPolite: [String.raw``],
  WhileLoopRude: [String.raw``],
  WhileLoopPolite: [String.raw``],
  ForLooopRude: [String.raw``],
  // ForLoopPolite: [String.raw``],
  FunctionCallRude: [String.raw``],
  FunctionCallPolite: [String.raw``],
  // FunctionCallStmtRude:[String.raw``],
  // FunctionCallStmtPolite:[String.raw``],
  // FunctionCallExpRude:[String.raw``],
  // FunctionCallExpPolite:[String.raw``],
  AssignmentRude: [String.raw``],
  AssignmentPolite: [String.raw``],
  // DeclarationRude:[String.raw``],
  // DeclarationPolite:[String.raw``],
  ArrayType: [String.raw``],

  DictionaryType: [String.raw``],

  functionPolite: [
    String.raw`Hello!
    Favor sum(x as a Number, y as a Number) as a Number could you...
	   Kindly return x plus y
    Thank You.
    Farewell!`,
    new Program(
      true,
      [
        new FunctionDeclaration(
          "sum",
          [
            new Parameter("x", "Number", true),
            new Parameter("y", "Number", true)
          ],
          "Number",
          new Block([new Return(new BinaryExp("x", "plus", "y"), true)], true),
          true
        )
      ],
      true
    )
  ],

  functionRude: [
    String.raw`function sum(x, y) {return x + y;}`,
    new Program(
      false,
      [
        new FunctionDeclaration(
          "sum",
          [new Parameter("x", null, null), new Parameter("y", null, null)],
          null,
          new Block([new Return(new BinaryExp("x", "+", "y"), false)], false),
          false
        )
      ],
      false
    )
  ],
  VariableDeclarationRude: [String.raw``],
  VariableDeclarationPolite: [String.raw``],
  ParameterRude: [String.raw``],
  ParameterPolite: [String.raw``],
  BlockRude: [String.raw``],
  BlockPolite: [String.raw``],
  TernaryExp: [String.raw``],

  LambdaBlock: [String.raw``],

  LambdaExp: [String.raw``],

  BinaryExp: [String.raw``],

  UnaryPrefix: [String.raw``],

  UnaryPostfix: [String.raw``],

  SubscriptExp: [String.raw``],

  MemberExp: [String.raw``],

  ArrayLiteral: [String.raw``],

  DictionaryLiteral: [String.raw``],

  DictEntry: [String.raw``],

  NumberLiteral: [String.raw``],

  StringLiteral: [String.raw``],

  BooleanLiteral: [String.raw``]
};

describe("The parser", () => {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct AST for ${name}`, done => {
      expect(parse(source)).toEqual(expected);
      done();
    });
  });

  test("throws an exception on a syntax error", done => {
    expect(() => parse("as$df^&%*$&")).toThrow();
    done();
  });
});
