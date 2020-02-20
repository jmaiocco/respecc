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
  Parameters,
  Parameter,
  Arguments,
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
        new FunctionCall(
          "print",
          new Arguments([new StringLiteral("Hello, world\\n")]),
          false
        )
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
      [
        new FunctionCall(
          "print",
          new Arguments([new StringLiteral("Hello, world\\n")]),
          true
        )
      ],
      true
    )
  ]
  /*
  functionPolite: [
    String.raw`Hello!
    Favor sum(x as a Number, y as a Number) : Number could you...
	   Kindly return x plus y
    Thank You.
    Farewell!`,
    new Program(
      true,
      [new FunctionDeclaration(
        "sum",
        new Parameters([new Parameter(x, "Number", true),
                        new Parameter(y, "Number", true)]),
        "Number",
        new Block([
            new Return(new BinaryExp("x", "plus", "y"), true)
                ], true)
        true)],
      true
    )
  ] */
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
