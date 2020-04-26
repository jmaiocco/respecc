const {
  Program, //done but needs testing
  Return, //done but needs testing
  Break, //done
  Conditional,
  WhileLoop, //done but needs testing
  ForLoop, //done but needs testing
  FunctionCall, //done but needs testings
  Assignment, //done but needs testing
  ArrayType, //done
  DictionaryType,
  ClassDeclaration,
  ClassBlock,
  Constructor,
  FunctionDeclaration, //done but needs testing
  VariableDeclaration, //done but needs testing
  Parameter, //done
  Block,
  TernaryExp,
  LambdaBlock,
  LambdaExp,
  BinaryExp, //done but needs testing
  UnaryPrefix,
  UnaryPostfix,
  SubscriptExp, //done but needs testing
  MemberExp, //done but needs testing
  ArrayLiteral, //done but not confident
  DictionaryLiteral,
  DictEntry,
  NumberLiteral, //done
  StringLiteral, //done
  BooleanLiteral, //done
  NullLiteral, //done
  IdExp //done
} = require("../ast");

module.exports = program => program.optimize();

let politeOps = {
  or: "||",
  and: "&&",
  "is less than or equal to": "<=",
  "is greater than or equal to": ">=",
  "is less than": "<",
  "is greater than": ">",
  "is equal to": "===",
  "==": "===",
  "is not equal to": "!==",
  plus: "+",
  minus: "-",
  times: "*",
  "divided by": "/",
  "modded with": "%",
  "raised to the power of": "**"
};

function makeOp(op) {
  return politeOps[op] || op;
}

function isZero(e) {
  return e instanceof NumberLiteral && e.value === 0;
}

function isOne(e) {
  return e instanceof NumberLiteral && e.value === 1;
}

function bothNumberLiterals(b) {
  return b.left instanceof NumberLiteral && b.right instanceof NumberLiteral;
}

function bothStringLiterals(b) {
  return b.left instanceof StringLiteral && b.right instanceof StringLiteral;
}

Program.prototype.optimize = function() {
  this.statements = this.statements.forEach(s => s.optimize());
};

Return.prototype.optimize = function() {
  this.returnValue = this.returnValue.optimize();
  return this;
};

Break.prototype.optimize = function() {
  return this;
};

Conditional.prototype.optimize = function() {
  return this;
};

WhileLoop.prototype.optimize = function() {
  this.exp = this.exp.optimize();
  this.block = this.block.optimize();
  return this;
};

ForLoop.prototype.optimize = function() {
  this.dec = this.dec.optimize();
  this.exp = this.exp.optimize();
  this.assignment = this.assignment.optimize();
  this.block = this.block.optimize();
  return this;
};

FunctionCall.prototype.optimize = function() {
  this.args = this.args.map(a => a.optimize());
  return this;
};

Assignment.prototype.optimize = function() {
  this.variable = this.variable.optimize();
  this.exp = this.exp.optimize();
  if (this.variable === this.exp) {
    return null;
  }
  return this;
};

ArrayType.prototype.optimize = function() {
  return this;
};


DictionaryType.prototype.optimize = function() {
  return this;
};

ClassDeclaration.prototype.optimize = function() {
  return this;
};

ClassBlock.prototype.optimize = function() {
  return this;
};

Constructor.prototype.optimize = function() {
  return this;
};

FunctionDeclaration.prototype.optimize = function() {
  if(this.block){
    this.block = this.block.optimize;
  }
  return this;
};

VariableDeclaration.prototype.optimize = function() {
  this.expression = this.expression.optimize();
  return this;
};

Parameter.prototype.optimize = function() {
  return this;
};

Block.prototype.optimize = function() {
  return this;
};

TernaryExp.prototype.optimize = function() {
  return this;
};

LambdaBlock.prototype.optimize = function() {
  return this;
};

LambdaExp.prototype.optimize = function() {
  return this;
};

BinaryExp.prototype.optimize = function() {
  this.left = this.left.optimize();
  this.right = this.right.optimize();
  if (makeOp(this.operator) === '+' && isZero(this.right)) return this.left;
  if (makeOP(this.operator) === '+' && isZero(this.left)) return this.right;
  if (makeOP(this.operator) === '*' && isZero(this.right)) return new NumberLiteral(0);
  if (makeOP(this.operator) === '*' && isZero(this.left)) return new NumberLiteral(0);
  if (makeOP(this.operator) === '*' && isOne(this.right)) return this.left;
  if (makeOP(this.operator) === '*' && isOne(this.left)) return this.right;
  if (makeOP(this.operator) === '**' && isOne(this.left)) return new NumberLiteral(1);
  if (makeOP(this.operator) === '**' && isOne(this.right)) return this.left;
  if (makeOP(this.operator) === '**' && isZero(this.right)) return new NumberLiteral(1);
  if (makeOP(this.operator) === '**' && isZero(this.left)) return new NumberLiteral(0);
  if (bothLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (makeOP(this.operator) === '+') return new NumberLiteral(x + y);
    if (makeOP(this.operator) === '*') return new NumberLiteral(x * y);
    if (makeOP(this.operator) === '/') return new NumberLiteral(x / y);
    if (makeOP(this.operator) === '**') return new NumberLiteral(x ** y);
    if (makeOP(this.operator) === '%') return new NumberLiteral(x % y);
  }
  return this;
};

UnaryPrefix.prototype.optimize = function() {
  return this;
};

UnaryPostfix.prototype.optimize = function() {
  return this;
};

SubscriptExp.prototype.optimize = function() {
  this.composite = this.composite.optimize();
  this.subscript = this.subscript.optimize();
  return this;
};

MemberExp.prototype.optimize = function() {
  this.v = this.v.optimize();
  return this;
};

ArrayLiteral.prototype.optimize = function() {
  this.exps = this.exps.forEach(s => s.optimize());
  return this;
};

DictionaryLiteral.prototype.optimize = function() {
  return this;
};

DictEntry.prototype.optimize = function() {
  return this;
};

NumberLiteral.prototype.optimize = function() {
  return this;
};

StringLiteral.prototype.optimize = function() {
  return this;
};

BooleanLiteral.prototype.optimize = function() {
  return this;
};

NullLiteral.prototype.optimize = function() {
  return this;
};

IdExp.prototype.optimize = function() {
  return this;
};


