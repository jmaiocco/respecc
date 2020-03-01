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
const { NumberType, StringType, NullType, BooleanType } = require("./builtins");
const check = require("./check");
const Context = require("./context");

module.exports = function(exp) {
  exp.analyze(Context.INITIAL);
};

Program.prototype.analyze = function(context) {
  //So classes and functions seen everywhere within their block()?)
  this.statements
    .filter(d => d.constructor === ClassDeclaration)
    .forEach(d => context.add(d));
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => d.analyzeSignature(context));
  this.statements
    .filter(d => d.constructor === FunctionDeclaration)
    .forEach(d => context.add(d));
  this.statements.forEach(d => d.analyze(context));
  //check.noRecursiveTypeCyclesWithoutRecordTypes(this.decs);
};

Assignment.prototype.analyze = function(context) {
  this.exp.analyze(context);
  this.variable.analyze(context);
  if (this.variable.type !== null) {
    check.isAssignableTo(this.exp, this.variable.type);
  }
  //check.isNotReadOnly(this.variable);
};

Conditional.prototype.analyze = function(context) {};

WhileLoop.prototype.analyze = function(context) {};

ForLoop.prototype.analyze = function(context) {};

FunctionCall.prototype.analyze = function(context) {};

Break.prototype.analyze = function(context) {
  check.inLoop(context, "break");
};

Return.prototype.analyze = function(context) {
  //this.returnValue.analyze(context);
  //
  //Assign this AST a type?
  //check.inLoop(context, "return");
};

VariableDeclaration.prototype.analyze = function(context) {
  this.expression.analyze(context);
  if (this.type) {
    this.type = context.lookup(this.type);
    check.isAssignableTo(this.expression, this.type);
  } else {
    //type inference way: this.type = this.expression.type;
    //type ignore
    this.type = null;
  }
  context.add(this);
};

// Function analysis is broken up into two parts in order to support (nutual)
// recursion. First we have to do semantic analysis just on the signature
// (including the return type). This is so other functions that may be declared
// before this one have calls to this one checked.
FunctionDeclaration.prototype.analyzeSignature = function(context) {
  //this.bodyContext = context.createChildContextForFunctionBody();
  //this.params.forEach(p => p.analyze(this.bodyContext));
  //this.returnType = !this.returnType ? undefined : context.lookup(this.returnType);
};
FunctionDeclaration.prototype.analyze = function() {};

ClassDeclaration.prototype.analyze = function(context) {};

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
    check.propertyOfAll(this.keyValuePairs, "type1"),
    check.propertyOfAll(this.keyValuePairs, "type2")
  ];
  this.type = new DictionaryType(keyType, valueType);
};
//*/

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

// Function analysis is broken up into two parts in order to support (nutual)
// recursion. First we have to do semantic analysis just on the signature
// (including the return type). This is so other functions that may be declared
// before this one have calls to this one checked.
Func.prototype.analyzeSignature = function (context) {
  this.bodyContext = context.createChildContextForFunctionBody();
  this.params.forEach(p => p.analyze(this.bodyContext));
  this.returnType = !this.returnType ? undefined : context.lookup(this.returnType);
};

Func.prototype.analyze = function () {
  this.body.analyze(this.bodyContext);
  check.isAssignableTo(this.body, this.returnType, 'Type mismatch in function return');
  delete this.bodyContext; // This was only temporary, delete to keep output clean.
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

Literal.prototype.analyze = function () {
  if (typeof this.value === 'number') {
    this.type = IntType;
  } else {
    this.type = StringType;
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
