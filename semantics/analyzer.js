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
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType
} = require("./builtins");
const check = require("./check");
const Context = require("./context");

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
  //So classes and functions seen everywhere within their block()?)
  this.statements
    .filter(d => d.constructor === ClassDeclaration)
    .forEach(d => {
      context.add(d);
      d.analyzeNames(context);
    });
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => d.analyzeSignature(context));
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => context.add(d));
  this.statements.forEach(d => d.analyze(context));
  //check.noRecursiveTypeCyclesWithoutRecordTypes(this.decs);
};

VariableDeclaration.prototype.analyze = function(context) {
  this.type = context.lookup(this.type);
  if (this.expression) {
    this.expression.analyze(context);
    if (this.type) {
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
  //check.isNotReadOnly(this.variable);
};

Conditional.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.bodyContext = context.createChildContextForBlock();
  this.ifBlock.analyze(this.bodyContext);
  if (this.exps && this.blocks) {
    this.exps.forEach(e => this.e.analyze(context));
    this.blocks.forEach(b => this.b.analyze(this.bodyContext));
  }
  if (this.elseBlock) {
    this.elseBlock.analyze(this.bodyContext);
  }
};

WhileLoop.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.bodyContext = context.createChildContextForLoop();
  this.block.analyze(this.bodyContext);
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
    this.exp.analyze(this.bodyContext);
  }
  this.block.analyze(this.bodyContext);
};

FunctionCall.prototype.analyze = function(context) {
  /*Should callee be a member of function call (for decorated tree)?*/
  this.callee = context.lookup(this.id);
  check.isFunction(this.callee, "Attempt to call a non-function");
  this.args.forEach(arg => arg.analyze(context));
  check.legalArguments(this.args, this.callee.params);
  this.type = this.callee.type;
};

Parameter.prototype.analyze = function(context) {
  this.type = context.lookup(this.type);
  context.add(this);
};

TernaryExp.prototype.analyze = function(context) {
  this.type = BooleanType;
  [this.exp1, this.exp2, this.exp3].forEach(e => {
    e.analyze(context);
  });
  if (this.exp2.type === this.exp1.type) {
    this.type = this.exp1.type;
  } else {
    this.type = AnyType;
  }
};

LambdaBlock.prototype.analyze = function(context) {
  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.analyze(this.bodyContext);
  this.block.analyze(this.bodyContext);
  this.type = AnyType;
};

LambdaExp.prototype.analyze = function(context) {
  this.params.analyze(this.context);
  this.exp.analyze(this.context);
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
    //Should this guarentee that the return type is the type of the first operand?
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
  //Only Allows Integer Incrementation
  this.left.analyze(context);
  check.isNumber(this.left);
  this.type = this.left.type;
};

Break.prototype.analyze = function(context) {
  check.inLoop(context, "break");
};

Return.prototype.analyze = function(context) {
  //
  //Assign this AST a type? (Connection with function node(?))
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
      //Must do control flow analysis to ensure this return occurs
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
  this.type = context.lookup(this.type);
  //Control Flow Analysis
  this.typeResolved = this.type === AnyType ? true : false;
};
FunctionDeclaration.prototype.analyze = function() {
  this.block.analyze(this.bodyContext);
  //Control Flow Analysis
  check.functiontypeResolved(this);
  //If signature typed, make sure there is a return?
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
};

Block.prototype.analyze = function(context) {
  //Disallow Class Declarations and Function Declartions in BLocks
  this.statements.forEach(d => {
    check.isNotClassDeclaration(d);
    check.isNotFunctionDeclaration(d); //Do we want function declaration in functions?
    d.analyze(context);
  });
};

ClassDeclaration.prototype.analyzeNames = function(context) {
  this.bodyContext = context.createChildContextForClassBody(this);
  this.block.analyzeNames(this.bodyContext);
  this.type = this;
};

ClassDeclaration.prototype.analyze = function(context) {
  this.block.analyze(this.bodyContext);
};

ClassBlock.prototype.analyzeNames = function(context) {
  this.members
    .filter(d => d.constructor === ClassDeclaration)
    .forEach(d => {
      context.add(d);
      d.analyzeNames(context);
    });
  this.statements
    .filter(d => d.constructor === FunctionDeclaration || Constructor)
    .forEach(d => d.analyzeSignature(context));
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => context.add(d));
  this.members.forEach(d => d.analyze(context));
};

ClassBlock.prototype.analyze = function(context) {
  this.members.forEach(d => d.analyze(context));
};

Constructor.prototype.analyzeSignature = function(context) {
  check.inClass(context, this.id);
  check.constructorMatchesClass(this, context.currentClass);
  this.bodyContext = context.createChildContextForFunctionBody(this);
  this.params.forEach(p => p.analyze(this.bodyContext));
  this.context.currentClass.params = this.params;
};

Constructor.prototype.analyze = function(context) {
  this.block.analyze(this.bodyContext);
};

MemberExp.prototype.analyze = function(context) {
  this.v.analyze(context);
  check.isClass(this.v.type);
  //Should Member be included here as a property?
  this.member = this.v.type.bodyContext.lookup(this.id);
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
    this.type = this.composite.type.type1;
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

///* Types only need to be same is static typing demands in (isAssignable)
ArrayLiteral.prototype.analyze = function(context) {
  this.exps.map(e => e.analyze(context));
  this.type = new ArrayType(check.propertyOfAll(this.exps, "type"));
};

DictionaryLiteral.prototype.analyze = function(context) {
  this.keyValuePairs.forEach(e => e.analyze(context));
  let [keyType, valueType] = [
    check.propertyOfAll(this.keyValuePairs, "keyType"),
    check.propertyOfAll(this.keyValuePairs, "valueType")
  ];
  this.type = new DictionaryType(keyType, valueType);
};
//*/

DictEntry.prototype.analyze = function(context) {
  this.key.analyze(context);
  this.value.analyze(context);
  this.keyType = this.key.type;
  this.valueType = this.value.type;
};

IdExp.prototype.analyze = function(context) {
  this.ref = context.lookup(this.ref);
  this.type = this.ref.type;
};

/*
ArrayExp.prototype.analyze = function (context) {
  this.type = context.lookup(this.type);
  check.isArrayType(this.type);
  this.size.analyze(context);
  check.isInteger(this.size);
  this.fill.analyze(context);
  check.isAssignableTo(this.fill, this.type.memberType);
};

ArrayType.prototype.analyze = function (context) {
  this.memberType = context.lookup(this.memberType);
};

Assignment.prototype.analyze = function (context) {
  this.source.analyze(context);
  this.target.analyze(context);
  check.isAssignableTo(this.source, this.target.type);
  check.isNotReadOnly(this.target);
};

Break.prototype.analyze = function (context) {
  check.inLoop(context, 'break');
};

BinaryExp.prototype.analyze = function (context) {
  this.left.analyze(context);
  this.right.analyze(context);
  if (/[-+&|]/.test(this.op)) {
    check.isInteger(this.left);
    check.isInteger(this.right);
  } else if (/<=?|>=?/.test(this.op)) {
    check.expressionsHaveTheSameType(this.left, this.right);
    check.isIntegerOrString(this.left);
    check.isIntegerOrString(this.right);
  } else {
    check.expressionsHaveTheSameType(this.left, this.right);
  }
  this.type = IntType;
};
/*
Binding.prototype.analyze = function (context) {
  this.value.analyze(context);
};

Call.prototype.analyze = function (context) {
  this.callee = context.lookup(this.callee);
  check.isFunction(this.callee, 'Attempt to call a non-function');
  this.args.forEach(arg => arg.analyze(context));
  check.legalArguments(this.args, this.callee.params);
  this.type = this.callee.returnType;
};

ExpSeq.prototype.analyze = function (context) {
  this.exps.forEach(e => e.analyze(context));
  if (this.exps.length > 0) {
    this.type = this.exps[this.exps.length - 1].type;
  }
};

Field.prototype.analyze = function (context) {
  this.type = context.lookup(this.type);
};

ForExp.prototype.analyze = function (context) {
  this.low.analyze(context);
  check.isInteger(this.low, 'Low bound in for');
  this.high.analyze(context);
  check.isInteger(this.high, 'High bound in for');
  const bodyContext = context.createChildContextForLoop();
  this.index = new Variable(this.index, this.low.type);
  this.index.readOnly = true;
  bodyContext.add(this.index);
  this.body.analyze(bodyContext);
};


IfExp.prototype.analyze = function (context) {
  this.test.analyze(context);
  check.isInteger(this.test, 'Test in if');
  this.consequent.analyze(context);
  if (this.alternate) {
    this.alternate.analyze(context);
    if (this.consequent.type) {
      check.expressionsHaveTheSameType(this.consequent, this.alternate);
    } else {
      check.mustNotHaveAType(this.alternate);
    }
  }
  this.type = this.consequent.type;
};

LetExp.prototype.analyze = function (context) {
  const newContext = context.createChildContextForBlock();
  this.decs.filter(d => d.constructor === TypeDec).map(d => newContext.add(d));
  this.decs.filter(d => d.constructor === Func).map(d => d.analyzeSignature(newContext));
  this.decs.filter(d => d.constructor === Func).map(d => newContext.add(d));
  this.decs.map(d => d.analyze(newContext));
  check.noRecursiveTypeCyclesWithoutRecordTypes(this.decs);
  this.body.map(e => e.analyze(newContext));
  if (this.body.length > 0) {
    this.type = this.body[this.body.length - 1].type;
  }
};

MemberExp.prototype.analyze = function (context) {
  this.record.analyze(context);
  check.isRecord(this.record);
  const field = this.record.type.getFieldForId(this.id);
  this.type = field.type;
};

NegationExp.prototype.analyze = function (context) {
  this.operand.analyze(context);
  check.isInteger(this.operand, 'Operand of negation');
  this.type = IntType;
};

Param.prototype.analyze = function (context) {
  this.type = context.lookup(this.type);
  context.add(this);
};

RecordExp.prototype.analyze = function (context) {
  this.type = context.lookup(this.type);
  check.isRecordType(this.type);
  this.bindings.forEach((binding) => {
    const field = this.type.getFieldForId(binding.id);
    binding.analyze(context);
    check.isAssignableTo(binding.value, field.type);
  });
};

RecordType.prototype.analyze = function (context) {
  const usedFields = new Set();
  this.fields.forEach((field) => {
    check.fieldHasNotBeenUsed(field.id, usedFields);
    usedFields.add(field.id);
    field.analyze(context);
  });
};

RecordType.prototype.getFieldForId = function (id) {
  const field = this.fields.find(f => f.id === id);
  if (!field) {
    throw new Error('No such field');
  }
  return field;
};

SubscriptedExp.prototype.analyze = function (context) {
  this.array.analyze(context);
  check.isArray(this.array);
  this.subscript.analyze(context);
  check.isInteger(this.subscript);
  this.type = this.array.type.memberType;
};

TypeDec.prototype.analyze = function (context) {
  this.type.analyze(context);
};

Variable.prototype.analyze = function (context) {
  this.init.analyze(context);
  if (this.type) {
    this.type = context.lookup(this.type);
    check.isAssignableTo(this.init, this.type);
  } else {
    // Yay! type inference!
    this.type = this.init.type;
  }
  context.add(this);
};

WhileExp.prototype.analyze = function (context) {
  this.test.analyze(context);
  check.isInteger(this.test, 'Test in while');
  this.body.analyze(context.createChildContextForLoop());
};
*/
