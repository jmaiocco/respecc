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
  NullLiteral,
  IdExp
} = require("../../ast");

const fixture = {
  helloRude: [
    String.raw`print("Hello, world\n")`,
    new Program(
      false,
      [
        new FunctionCall(
          new IdExp("print"),
          [new StringLiteral("Hello, world\\n")],
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
          new IdExp("print"),
          [new StringLiteral("Hello, world\\n")],
          true
        )
      ],
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
          false,
          null
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
          true,
          null
        )
      ],
      false
    )
  ],
  breakRude: [String.raw`break`, new Program(false, [new Break(false)], false)],
  breakPolite: [
    String.raw`You deserve a break!`,
    new Program(false, [new Break(true)], false)
  ],
  conditionalRude: [
    String.raw`if(x is less than 3) {return 1}
    else if(x >= 3) {return 2}
    else {return 3}`,
    new Program(
      false,
      [
        new Conditional(
          new BinaryExp(new IdExp("x"), "is less than", new NumberLiteral(3)),
          new Block([new Return(new NumberLiteral(1), false)], false),
          [new BinaryExp(new IdExp("x"), ">=", new NumberLiteral(3))],
          [new Block([new Return(new NumberLiteral(2), false)], false)],
          new Block([new Return(new NumberLiteral(3), false)], false),
          false
        )
      ],
      false
    )
  ],

  conditionalPolite: [
    String.raw`Excuse me, if x is less than 3, could you...
      return 1
    Thank You.
    Otherwise, if x >= 3, could you...
      return 2
    Thank You.
    Otherwise, could you...
      return 3
    Thank You.
    `,
    new Program(
      false,
      [
        new Conditional(
          new BinaryExp(new IdExp("x"), "is less than", new NumberLiteral(3)),
          new Block([new Return(new NumberLiteral(1), false)], true),
          [new BinaryExp(new IdExp("x"), ">=", new NumberLiteral(3))],
          [new Block([new Return(new NumberLiteral(2), false)], true)],
          new Block([new Return(new NumberLiteral(3), false)], true),
          true
        )
      ],
      false
    )
  ],
  //*/
  WhileLoopRude: [
    String.raw`while(x[1] < 3){break}`,
    new Program(
      false,
      [
        new WhileLoop(
          new BinaryExp(
            new SubscriptExp(new IdExp("x"), new NumberLiteral(1)),
            "<",
            new NumberLiteral(3)
          ),
          new Block([new Break(false)], false),
          false
        )
      ],
      false
    )
  ],
  WhileLoopPolite: [
    String.raw`Excuse me, while i is less than n, could you...
    return 1
  Thank You.`,
    new Program(
      false,
      [
        new WhileLoop(
          new BinaryExp(new IdExp("i"), "is less than", new IdExp("n")),
          new Block([new Return(new NumberLiteral(1), false)], true),
          true
        )
      ],
      false
    )
  ],
  ForLoopRude: [
    String.raw`for(gimme i = 0; i < n; i++) {
      break
    }`,
    new Program(
      false,
      [
        new ForLoop(
          new VariableDeclaration("i", null, new NumberLiteral(0), false, null),
          new BinaryExp(new IdExp("i"), "<", new IdExp("n")),
          new UnaryPostfix(new IdExp("i"), "++"),
          new Block([new Break(false)], false)
        )
      ],
      false
    )
  ],
  FunctionCallStmtRude: [
    String.raw`init(x,y)`,
    new Program(
      false,
      [
        new FunctionCall(
          new IdExp(`init`),
          [new IdExp("x"), new IdExp("y")],
          false
        )
      ],
      false
    )
  ],
  FunctionCallStmtPolite: [
    String.raw`Do me a favor and run init with (x,Yes).`,
    new Program(
      false,
      [
        new FunctionCall(
          new IdExp("init"),
          [new IdExp("x"), new BooleanLiteral(true)],
          true
        )
      ],
      false
    )
  ],

  FunctionCallExpRude: [
    String.raw`x= plusOne(x)`,
    new Program(
      false,
      [
        new Assignment(
          new IdExp("x"),
          new FunctionCall(new IdExp("plusOne"), [new IdExp("x")], false),
          false
        )
      ],
      false
    )
  ],
  FunctionCallExpPolite: [
    String.raw`Please populate x with the result of running plusOne with (x).`,
    new Program(
      false,
      [
        new Assignment(
          new IdExp("x"),
          new FunctionCall(new IdExp("plusOne"), [new IdExp("x")], true),
          true
        )
      ],
      false
    )
  ],

  AssignmentRude: [
    String.raw`gimmeFive = ()->{return 5}`,
    new Program(
      false,
      [
        new Assignment(
          new IdExp("gimmeFive"),
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
          new IdExp("gimmeFive"),
          new LambdaExp([], new NumberLiteral(5)),
          true
        )
      ],
      false
    )
  ],
  DictionaryType: [
    String.raw`Please declare x as a Dict<String, Number>`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "x",
          new DictionaryType("String", "Number"),
          null,
          true,
          true
        )
      ],
      false
    )
  ],
  ArrayType: [
    String.raw`Please declare x as a Array<Number> as [0, 1].`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "x",
          new ArrayType("Number"),
          new ArrayLiteral([new NumberLiteral(0), new NumberLiteral(1)]),
          true,
          true
        )
      ],
      false
    )
  ],
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
            new Parameter("x", "Number", true, true),
            new Parameter("y", "Number", true, true)
          ],
          "Number",
          new Block(
            [
              new Return(
                new BinaryExp(new IdExp("x"), "plus", new IdExp("y")),
                true
              )
            ],
            true
          ),
          true,
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
          [
            new Parameter("x", null, true, null),
            new Parameter("y", null, true, null)
          ],
          null,
          new Block(
            [
              new Return(
                new BinaryExp(new IdExp("x"), "+", new IdExp("y")),
                false
              )
            ],
            false
          ),
          false,
          null
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
          false,
          null
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
          true,
          null
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
          [
            new Parameter("x", null, true, null),
            new Parameter("y", null, true, null)
          ],
          null,
          new Block(
            [
              new Return(
                new BinaryExp(new IdExp("x"), "+", new IdExp("y")),
                false
              )
            ],
            false
          ),
          false,
          null
        )
      ],
      false
    )
  ], // same as function Declaration

  ParameterRude: [
    String.raw`function sum(x:Number, y:Number) {return x * y}`,
    new Program(
      false,
      [
        new FunctionDeclaration(
          "sum",
          [
            new Parameter("x", "Number", true, false),
            new Parameter("y", "Number", true, false)
          ],
          null,
          new Block(
            [
              new Return(
                new BinaryExp(new IdExp("x"), "*", new IdExp("y")),
                false
              )
            ],
            false
          ),
          false,
          null
        )
      ],
      false
    )
  ],

  ParameterPolite: [
    String.raw`function sum(x as a Number, y as a Number) {return x ** y}`,
    new Program(
      false,
      [
        new FunctionDeclaration(
          "sum",
          [
            new Parameter("x", "Number", true, true),
            new Parameter("y", "Number", true, true)
          ],
          null,
          new Block(
            [
              new Return(
                new BinaryExp(new IdExp("x"), "**", new IdExp("y")),
                false
              )
            ],
            false
          ),
          false,
          null
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
          false,
          null
        )
      ],
      false
    )
  ],
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
          false,
          null
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
          false,
          null
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
          false,
          null
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
          false,
          null
        )
      ],
      false
    )
  ],
  UnaryPrefix: [
    String.raw`y = !x`,
    new Program(
      false,
      [
        new Assignment(
          new IdExp("y"),
          new UnaryPrefix("!", new IdExp("x")),
          false
        )
      ],
      false
    )
  ],

  SubscriptExp: [
    String.raw`gimme item = arr[0]`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "item",
          null,
          new SubscriptExp(new IdExp("arr"), new NumberLiteral(0)),
          false,
          null
        )
      ],
      false
    )
  ],

  ArrayLiteral: [
    String.raw`x = [1,2]`,
    new Program(
      false,
      [
        new Assignment(
          new IdExp("x"),
          new ArrayLiteral([new NumberLiteral(1), new NumberLiteral(2)]),
          false
        )
      ],
      false
    )
  ],
  DictionaryLiteral: [
    String.raw`x = {a:6, b:7}`,
    new Program(
      false,
      [
        new Assignment(
          new IdExp("x"),
          new DictionaryLiteral([
            new DictEntry(new IdExp("a"), new NumberLiteral(6)),
            new DictEntry(new IdExp("b"), new NumberLiteral(7))
          ]),
          false
        )
      ],
      false
    )
  ],

  NegativeExponent: [
    String.raw`gimme x = 3**-2`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "x",
          null,
          new BinaryExp(
            new NumberLiteral(3),
            "**",
            new UnaryPrefix("-", new NumberLiteral(2))
          ),
          false,
          null
        )
      ],
      false
    )
  ],

  OrOperator: [
    String.raw`gimme boolExp = No or Yes`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "boolExp",
          null,
          new BinaryExp(
            new BooleanLiteral(false),
            "or",
            new BooleanLiteral(true)
          ),
          false,
          null
        )
      ],
      false
    )
  ],

  AndOperator: [
    String.raw`gimme boolExp = (No and Yes)`,
    new Program(
      false,
      [
        new VariableDeclaration(
          "boolExp",
          null,
          new BinaryExp(
            new BooleanLiteral(false),
            "and",
            new BooleanLiteral(true)
          ),
          false,
          null
        )
      ],
      false
    )
  ],

  PoliteClass: [
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
    Bye Bye!`,
    new Program(
      true,
      [
        new ClassDeclaration(
          "Dog",
          new ClassBlock(
            [
              new VariableDeclaration("name", "String", null, true, true),
              new Constructor(
                "Dog",
                [new Parameter("name", "String", true, true)],
                new Block(
                  [
                    new Assignment(
                      new MemberExp(new IdExp("this"), "name"),
                      new IdExp("name"),
                      true
                    )
                  ],
                  true
                ),
                true
              ),
              new FunctionDeclaration(
                "getName",
                [],
                "String",
                new Block(
                  [new Return(new MemberExp(new IdExp("this"), "name"), true)],
                  true
                ),
                true,
                true
              )
            ],
            true
          ),
          true
        )
      ],
      true
    )
  ],

  RudeClass: [
    String.raw`class Dog {
      gimme name : String
      Dog(name) { this.name = name }
      function getName() { return this.name }
    }
    `,
    new Program(
      false,
      [
        new ClassDeclaration(
          "Dog",
          new ClassBlock(
            [
              new VariableDeclaration("name", "String", null, false, false),
              new Constructor(
                "Dog",
                [new Parameter("name", null, true, null)],
                new Block(
                  [
                    new Assignment(
                      new MemberExp(new IdExp("this"), "name"),
                      new IdExp("name"),
                      false
                    )
                  ],
                  false
                ),
                false
              ),
              new FunctionDeclaration(
                "getName",
                [],
                null,
                new Block(
                  [new Return(new MemberExp(new IdExp("this"), "name"), false)],
                  false
                ),
                false,
                null
              )
            ],
            false
          ),
          false
        )
      ],
      false
    )
  ],
  UnaryPostfix: [
    String.raw`x--`,
    new Program(false, [new UnaryPostfix(new IdExp("x"), "--")], false)
  ],

  UnaryIncrement: [
    String.raw`++x`,
    new Program(false, [new UnaryPrefix("++", new IdExp("x"))], false)
  ],
  NullLiteral: [
    String.raw`x= Null`,
    new Program(
      false,
      [new Assignment(new IdExp("x"), new NullLiteral(), false)],
      false
    )
  ]
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
