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
  //Classes added as of 02/23/2020
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
    String.raw`gimme gimmeFive = ()->{return 5;}`,
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
    String.raw`Please declare gimmeFive as ()-> could you... Kindly return 5.
    Thank You..`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), true)], true)
          ),
          true
        )
      ],
      false
    )
  ],

  /* UNIMPLEMENTED TESTS
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
  //*/

  AssignmentRude: [
    String.raw`gimmeFive = ()->{return 5;}`,
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
  ], //DOES NOT PASS AS OF 02/23/2020, here "gimme" is considered a keyword despite being connected to "Five"

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
  // DeclarationRude:[String.raw``],
  // DeclarationPolite:[String.raw``],

  /*UNIMPLEMENTED TESTS
  ArrayType: [String.raw``],

  DictionaryType: [String.raw``],
  //*/

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
  ], // same as function Declaration

  ParameterRude: [
    String.raw`function sum(x:Number, y:Number) {return x + y;}`,
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
    String.raw`function sum(x as a Number, y as a Number) {return x + y;}`,
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
    String.raw`gimme gimmeFive = ()->{return 5;}`,
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
    String.raw`gimme gimmeFive = ()-> could you... return 5; Thank You.`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "gimmeFive",
          null,
          new LambdaBlock(
            [],
            new Block([new Return(new NumberLiteral(5), false)], true)
          ),
          false
        )
      ],
      false
    )
  ],

  TernaryExp: [
    String.raw`gimme five = 5>4? 5: 4;`,
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
    String.raw`gimme gimmeFive = ()->{return 5;}`,
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

  /* UNIMPLEMENTED TESTS
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
  //Test necessary as of 02/23/2020
  //*/
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
