// The semantic analyzer
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
} = require("../ast");
const {
  ObjectType,
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType,
  lengthFunction
} = require("./builtins");
const check = require("./check");
const Context = require("./context");
let calledFunctions = new Set();

let orOperators = new Set(["||", "or"]);
let andOperators = new Set(["&&", "and"]);
let relOperators = new Set([
  "<=",
  "<",
  ">=",
  ">",
  "==",
  "!=",
  "is less than or equal to",
  "is greater than or equal to",
  "is less than",
  "is greater than",
  "is equal to",
  "is not equal to"
]);
let addOperators = new Set(["+", "-", "plus", "minus"]);
let multOperators = new Set([
  "*",
  "/",
  "%",
  "times",
  "divided by",
  "modded with"
]);
let expoOperators = new Set(["**", "raised to the power of"]);

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

Program.prototype.analyze = function(context) {
  this.statements
    .filter(d => d.constructor === ClassDeclaration)
    .forEach(d => context.add(new ObjectType(d.id)));
  this.statements
    .filter(d => d.constructor === ClassDeclaration)
    .forEach(d => d.analyzeNames(context));
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => d.analyzeSignature(context));
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => context.add(d));
  this.statements.forEach(d => d.analyze(context));
  this.calledFunctions = calledFunctions;
};

VariableDeclaration.prototype.analyze = function(context) {
  this.type = context.lookup(this.type);
  if (this.expression) {
    this.expression.analyze(context);
    if (this.type && this.type !== AnyType) {
      check.isAssignableTo(this.expression, this.type);
    } else {
      this.type = this.expression.type;
    }
  }

  context.add(this);
};

Assignment.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.variable.analyze(context);
  check.isAssignableTo(this.exp, this.variable.type);
};

Conditional.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.ifBlock.analyze(context.createChildContextForBlock());
  this.exps.forEach(e => e.analyze(context));
  this.blocks.forEach(b => b.analyze(context.createChildContextForBlock()));
  if (this.elseBlock) {
    this.elseBlock.analyze(context.createChildContextForBlock());
  }
};

WhileLoop.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.bodyContext = context.createChildContextForLoop();
  this.block.analyze(this.bodyContext);
  delete this.bodyContext;
};

ForLoop.prototype.analyze = function(context) {
  this.bodyContext = context.createChildContextForLoop();
  if (this.dec) {
    this.dec.analyze(this.bodyContext);
  }
  if (this.exp) {
    this.exp.analyze(this.bodyContext);
    check.isBoolean(this.exp);
  }
  if (this.assignment) {
    this.assignment.analyze(this.bodyContext);
  }
  this.block.analyze(this.bodyContext);
  delete this.bodyContext;
};

FunctionCall.prototype.analyze = function(context) {
  calledFunctions.add(this.id.ref);
  if (this.id.constructor === MemberExp) {
    this.id.analyze(context);
    let objectType = this.id.v.type;
    this.callee = objectType.locals.get(this.id.field);
  } else {
    //IdExp
    this.id.analyze(context);
    this.callee = this.id.ref;
  }
  check.isCallable(this.callee, "Attempt to call a non-function");

  if (this.args) {
    this.args.forEach(arg => arg.analyze(context));
    if (this.callee.constructor === ObjectType) {
      check.anyLegalArguments(this.args, this.callee.callingParams);
      this.type = this.callee;
      return;
    } else {
      check.legalArguments(this.args, this.callee.params);
    }
  }
  this.type = this.callee.type;
};

Parameter.prototype.analyze = function(context) {
  this.type = context.lookup(this.type);
  context.add(this);
};

TernaryExp.prototype.analyze = function(context) {
  [this.exp1, this.exp2, this.exp3].forEach(e => {
    e.analyze(context);
  });
  if (this.exp2.type === this.exp3.type) {
    this.type = this.exp2.type;
  } else {
    this.type = AnyType;
  }
};

LambdaBlock.prototype.analyze = function(context) {
  this.type = AnyType;
  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach(param => param.analyze(this.bodyContext));
  this.block.analyze(this.bodyContext);
  delete this.bodyContext;
};

LambdaExp.prototype.analyze = function(context) {
  this.params.forEach(param => param.analyze(context));
  this.exp.analyze(context);
  this.type = this.exp.type;
};

BinaryExp.prototype.analyze = function(context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (
    addOperators.has(this.operator) ||
    multOperators.has(this.operator) ||
    expoOperators.has(this.operator)
  ) {
    this.type = this.left.type;
  } else {
    this.type = BooleanType;
  }
};

UnaryPrefix.prototype.analyze = function(context) {
  this.right.analyze(context);
  if (this.operator === "--" || this.operator === "-") {
    check.isNumber(this.right);
  } else {
    check.isBoolean(this.right);
  }
  this.type = this.right.type;
};

UnaryPostfix.prototype.analyze = function(context) {
  this.left.analyze(context);
  check.isNumber(this.left);
  this.type = this.left.type;
};

Break.prototype.analyze = function(context) {
  check.inLoop(context, "break");
};

Return.prototype.analyze = function(context) {
  check.inFunction(context, "return");
  check.functionConstructorHasNoReturnValue(
    context.currentFunction,
    this.returnValue
  );

  if (this.returnValue) {
    this.returnValue.analyze(context);
    if (context.currentFunction.type !== AnyType) {
      check.isAssignableTo(
        this.returnValue,
        context.currentFunction.type,
        "Type mismatch in function return"
      );
      context.currentFunction.typeResolved = true;
    }
  }
};

// Function analysis is broken up into two parts in order to support (nutual)
// recursion. First we have to do semantic analysis just on the signature
// (including the return type). This is so other functions that may be declared
// before this one have calls to this one checked.
FunctionDeclaration.prototype.analyzeSignature = function(context) {
  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach(p => p.analyze(this.bodyContext));
  if (this.type === "Void") {
    this.type = AnyType;
  } else {
    this.type = context.lookup(this.type);
  }
  this.typeResolved = this.type === AnyType ? true : false;
};
FunctionDeclaration.prototype.analyze = function() {
  this.block.analyze(this.bodyContext);
  check.functiontypeResolved(this);
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
};

Block.prototype.analyze = function(context) {
  this.statements.forEach(d => {
    check.isNotClassDeclaration(d);
    check.isNotFunctionDeclaration(d);
    d.analyze(context);
  });
};

ClassDeclaration.prototype.analyzeNames = function(context) {
  this.bodyContext = context.createChildContextForClassBody(this);
  this.block.analyzeNames(this.bodyContext);
  let objectType = context.lookup(this.id);
  check.objectNoMatchingConstructors(objectType);
};

ClassDeclaration.prototype.analyze = function() {
  let objType = this.bodyContext.lookup(this.id);
  objType.locals = this.bodyContext.locals;

  let typeClone = new ObjectType("this");
  typeClone.locals = this.bodyContext.locals;
  this.bodyContext.add(typeClone);
  this.block.analyze(this.bodyContext);
  this.bodyContext.locals.delete("this");
  this.type = objType;
  delete this.bodyContext;
};

ClassBlock.prototype.analyzeNames = function(context) {
  this.members
    .filter(d => d.constructor === Constructor)
    .forEach(d => d.analyzeSignature(context));
  this.members
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => d.analyzeSignature(context));
  this.members
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => context.add(d));
};

ClassBlock.prototype.analyze = function(context) {
  this.members.forEach(d => d.analyze(context));
};

Constructor.prototype.analyzeSignature = function(context) {
  check.inClass(context, this.id);
  check.constructorMatchesClass(this, context.currentClass);

  let objectType = context.lookup(this.id);

  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach(p => p.analyze(this.bodyContext));

  objectType.callingParams = [...objectType.callingParams, this.params];
};

Constructor.prototype.analyze = function(context) {
  this.block.analyze(this.bodyContext);
  delete this.bodyContext;
};

MemberExp.prototype.analyze = function(context) {
  this.v.analyze(context);
  check.memberExists(this.v, this.field);
  this.member = this.v.type.locals.get(this.field);
  this.type = this.member.type;
};

SubscriptExp.prototype.analyze = function(context) {
  this.composite.analyze(context);
  check.isArrayOrDictionary(this.composite);
  this.subscript.analyze(context);
  if (this.composite.type.constructor === ArrayType) {
    check.isNumber(this.subscript, `Array Subscript must be of type Number`);
    this.type = this.composite.type.type;
  } else if (this.composite.type.constructor === DictionaryType) {
    check.isAssignableTo(
      this.subscript,
      this.composite.type.type1,
      `Dict subscript must match key type`
    );
    this.type = this.composite.type.type2;
  } else {
    this.type = AnyType;
  }
};

NumberLiteral.prototype.analyze = function(context) {
  this.type = NumberType;
};

StringLiteral.prototype.analyze = function(context) {
  this.type = StringType;
};

NullLiteral.prototype.analyze = function(context) {
  this.type = NullType;
};

BooleanLiteral.prototype.analyze = function(context) {
  this.type = BooleanType;
};

ArrayLiteral.prototype.analyze = function(context) {
  this.exps.map(e => e.analyze(context));
  this.type = new ArrayType(check.propertyOfAll(this.exps, "type"));
  this.type.locals.set("length", lengthFunction);
};

DictionaryLiteral.prototype.analyze = function(context) {
  this.keyValuePairs.forEach(e => e.analyze(context));
  let [keyType, valueType] = [
    check.propertyOfAll(this.keyValuePairs, "keyType"),
    check.propertyOfAll(this.keyValuePairs, "valueType")
  ];
  this.type = new DictionaryType(keyType, valueType);
  this.type.locals.set("length", lengthFunction);
};

DictEntry.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
  this.keyType = this.key.type;
  this.valueType = this.value.type;
};

IdExp.prototype.analyze = function(context) {
  this.ref = context.lookup(this.ref);
  this.type = this.ref.type;
  if (this.ref.constructor === ObjectType) {
    this.type = this.ref;
  }
};
