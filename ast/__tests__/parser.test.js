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
  ClassDeclaration,
  ClassBlock,
  Constructor,
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
  BooleanLiteral,
  NullLiteral
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
  returnRude: [
    String.raw`gimme gimmeFive = ()->{return 5}`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), false)], false)
          ),
          false
        )
      ],
      false
    )
  ],
  returnPolite: [
    String.raw`Please declare gimmeFive as ()-> { Kindly return 5. }.`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), true)], false)
          ),
          true
        )
      ],
      false
    )
  ],
  /*
  breakRude: [
    String.raw``,
    new Program(

    )
  ],
  breakPolite: [
    String.raw``,
    new Program(

    )
  ],
  conditionalRude: [
    String.raw``,
    new Program(

    )
  ],
  conditionalPolite: [
    String.raw``,
    new Program(

    )
  ],
  WhileLoopRude: [
    String.raw``,
    new Program(

    )
  ],
  WhileLoopPolite: [
    String.raw``,
    new Program(

    )
  ],
  ForLoopRude: [
    String.raw``,
    new Program(

    )
  ],
  ForLoopPolite: [
    String.raw``,
    new Program(

    )
  ],
  FunctionCallRude: [
    String.raw``,
    new Program(

    )
  ],
  FunctionCallPolite: [
    String.raw``,
    new Program(

    )
  ],
  FunctionCallStmtRude: [
    String.raw``,
    new Program(

    )
  ],
  FunctionCallStmtPolite: [
    String.raw``,
    new Program(

    )
  ],
  FunctionCallExpRude: [
    String.raw``,
    new Program(

    )
  ],
  FunctionCallExpPolite: [
    String.raw``,
    new Program(

    )
  ],
  */
  AssignmentRude: [
    String.raw`gimmeFive = ()->{return 5}`,
    new Program(
      false,
      [
        new Assignment(
          "gimmeFive",
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), false)], false)
          ),
          false
        )
      ],
      false
    )
  ],
  AssignmentPolite: [
    String.raw`Please populate gimmeFive with () -> 5.`,
    new Program(
      false,
      [
        new Assignment(
          "gimmeFive",
          new LambdaExp([], new NumberLiteral(5)),
          true
        )
      ],
      false
    )
  ],
  /*
  DeclerationRude: [
    String.raw``,
    new Program(

    )
  ],
  DeclerationPolite: [
    String.raw``,
    new Program(

    )
  ],
  DictionaryType: [
    String.raw``,
    new Program(

    )
  ],
  ArrayType: [
    String.raw``,
    new Program(

    )
  ],
  */
  functionDeclarationPolite: [
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

  functionDeclarationRude: [
    String.raw`function sum(x, y) {return x + y}`,
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

  VariableDeclarationRude: [
    String.raw`gimme gimmeFive = () -> 5`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaExp([], new NumberLiteral(5)),
          false
        )
      ],
      false
    )
  ], // same as returnRude ast
  VariableDeclarationPolite: [
    String.raw`Please declare gimmeFive as () -> 5.`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaExp([], new NumberLiteral(5)),
          true
        )
      ],
      false
    )
  ], // may need review for polite punctuation

  ParameterNull: [
    String.raw`function sum(x, y) {return x + y}`,
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
  ], // same as function Declaration

  ParameterRude: [
    String.raw`function sum(x:Number, y:Number) {return x + y}`,
    new Program(
      false,
      [
        new FunctionDeclaration(
          "sum",
          [
            new Parameter("x", "Number", false),
            new Parameter("y", "Number", false)
          ],
          null,
          new Block([new Return(new BinaryExp("x", "+", "y"), false)], false),
          false
        )
      ],
      false
    )
  ],

  ParameterPolite: [
    String.raw`function sum(x as a Number, y as a Number) {return x + y}`,
    new Program(
      false,
      [
        new FunctionDeclaration(
          "sum",
          [
            new Parameter("x", "Number", true),
            new Parameter("y", "Number", true)
          ],
          null,
          new Block([new Return(new BinaryExp("x", "+", "y"), false)], false),
          false
        )
      ],
      false
    )
  ],

  BlockRude: [
    String.raw`gimme gimmeFive = ()->{return 5}`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), false)], false)
          ),
          false
        )
      ],
      false
    )
  ], //same as returnRude ast
  BlockPolite: [
    String.raw`gimme gimmeFive = ()-> { return 5 }`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), false)], false)
          ),
          false
        )
      ],
      false
    )
  ],

  TernaryExp: [
    String.raw`gimme five = 5>4? 5: 4`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "five",
          null,
          new TernaryExp(
            new BinaryExp(new NumberLiteral(5), ">", new NumberLiteral(4)),
            new NumberLiteral(5),
            new NumberLiteral(4)
          ),
          false
        )
      ],
      false
    )
  ],

  LambdaBlock: [
    String.raw`gimme gimmeFive = ()->{return 5}`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), false)], false)
          ),
          false
        )
      ],
      false
    )
  ],

  LambdaExp: [
    String.raw`gimme gimmeFive = ()-> 5`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaExp([], new NumberLiteral(5)),
          false
        )
      ],
      false
    )
  ]
  /*
  BinaryExp: [
    String.raw``,
    new Program(

    )
  ],
  UnaryPrefix: [
    String.raw``,
    new Program(

    )
  ],
  UnaryPostfix: [
    String.raw``,
    new Program(

    )
  ],
  SubscriptExp: [
    String.raw``,
    new Program(

    )
  ],
  MemberExp: [
    String.raw``,
    new Program(

    )
  ],
  ArrayLiteral: [
    String.raw``,
    new Program(

    )
  ],
  DictionaryLiteral: [
    String.raw``,
    new Program(

    )
  ],
  DictEntry: [
    String.raw``,
    new Program(

    )
  ],
  NumberLiteral: [
    String.raw``,
    new Program(

    )
  ],
  StringLiteral: [
    String.raw``,
    new Program(

    )
  ],
  BooleanLiteral: [
    String.raw``,
    new Program(

    )
  ],
  ClassDecleration: [
    String.raw``,
    new Program(

    )
  ],
  Constructor: [
    String.raw``,
    new Program(

    )
  ],
  ClassMember: [
    String.raw``,
    new Program(

    )
  ],
*/
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
