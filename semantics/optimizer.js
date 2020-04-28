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

let calledFunctions = new Set();

Program.prototype.optimize = function() {
  calledFunctions = this.calledFunctions;
  let unusedFuncIndexes = [];
  this.statements.forEach((s,i) => {
      if(s.constructor === FunctionDeclaration && !this.calledFunctions.has(s.id)) {
        unusedFuncIndexes.push(i);
      }
  })
  unusedFuncIndexes.forEach(i => this.statements.splice(i, 1));
  this.statements = this.statements.map(s => s.optimize());
  return this;
};

Return.prototype.optimize = function() {
  if(this.returnValue)  this.returnValue = this.returnValue.optimize();
  return this;
};

Break.prototype.optimize = function() {
  return this;
};

Conditional.prototype.optimize = function() {
  this.exp = this.exp.optimize();
  this.ifBlock = this.ifBlock.optimize();
  this.exps = this.exps.map(s => s.optimize());
  this.blocks = this.blocks.map(s => s.optimize());
  if(this.elseBlock){
    this.elseBlock = this.elseBlock.optimize();
  }
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
  this.block = this.block.optimize();
  return this;
};

ClassBlock.prototype.optimize = function() {
  let unusedFuncIndexes = [];
  this.members.forEach((s,i) => {
      if(s.constructor === FunctionDeclaration && !this.calledFunctions.has(s.id)) {
        unusedFuncIndexes.push(i);
      }
  })
  unusedFuncIndexes.forEach(i => this.members.splice(i, 1));
  this.members = this.members.map(s => s.optimize());
  return this;
};

Constructor.prototype.optimize = function() {
  this.params = this.params.map(s => s.optimize());
  this.block = this.block.optimize();
  return this;
};

FunctionDeclaration.prototype.optimize = function() {
  if(this.block){
    this.block = this.block.optimize();
  }
  this.params = this.params.map(s => s.optimize());
  return this;
};

VariableDeclaration.prototype.optimize = function() {
  if(this.expression) {
    this.expression = this.expression.optimize();
  }
  return this;
};

Parameter.prototype.optimize = function() {
  return this;
};

Block.prototype.optimize = function() {
  let lastIndex = this.statements.length;
  for(let i = 0; i < this.statements.length; i++){
   if(this.statements[i].constructor === Break ||
    this.statements[i].constructor === Return){
     lastIndex = i;
     break;
   }
  }
  this.statements.splice(lastIndex + 1);
  this.statements = this.statements.map(s => s.optimize());
  return this;
};

TernaryExp.prototype.optimize = function() {
  this.exp1 = this.exp1.optimize();
  this.exp2 = this.exp2.optimize();
  this.exp3 = this.exp3.optimize();
  return this;
};

LambdaBlock.prototype.optimize = function() {
  this.params = this.params.map(s => s.optimize());
  this.block = this.block.optimize();
  return this;
};

LambdaExp.prototype.optimize = function() {
  this.params = this.params.map(s => s.optimize());
  this.exp = this.exp.optimize();
  return this;
};

BinaryExp.prototype.optimize = function() {
  this.left = this.left.optimize();
  this.right = this.right.optimize();
  if (makeOp(this.operator) === '+' && isZero(this.right)) return this.left;
  if (makeOp(this.operator) === '+' && isZero(this.left)) return this.right;
  if (makeOp(this.operator) === '*' && isZero(this.right)) return new NumberLiteral(0);
  if (makeOp(this.operator) === '*' && isZero(this.left)) return new NumberLiteral(0);
  if (makeOp(this.operator) === '*' && isOne(this.right)) return this.left;
  if (makeOp(this.operator) === '*' && isOne(this.left)) return this.right;
  if (makeOp(this.operator) === '**' && isOne(this.left)) return new NumberLiteral(1);
  if (makeOp(this.operator) === '**' && isOne(this.right)) return this.left;
  if (makeOp(this.operator) === '**' && isZero(this.right)) return new NumberLiteral(1);
  if (makeOp(this.operator) === '**' && isZero(this.left)) return new NumberLiteral(0);
  if (bothNumberLiterals(this)) {
    const [x, y] = [this.left.value, this.right.value];
    if (makeOp(this.operator) === '+') return new NumberLiteral(x + y);
    if (makeOp(this.operator) === '*') return new NumberLiteral(x * y);
    if (makeOp(this.operator) === '/') return new NumberLiteral(x / y);
    if (makeOp(this.operator) === '**') return new NumberLiteral(x ** y);
    if (makeOp(this.operator) === '%') return new NumberLiteral(x % y);
  }
  return this;
};

UnaryPrefix.prototype.optimize = function() {
  this.right = this.right.optimize();
  return this;
};

UnaryPostfix.prototype.optimize = function() {
  this.left = this.left.optimize();
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
  this.exps = this.exps.map(s => s.optimize());
  return this;
};

DictionaryLiteral.prototype.optimize = function() {
  this.keyValuePairs = this.keyValuePairs.map(s => s.optimize());
  return this;
};

DictEntry.prototype.optimize = function() {
  this.key = this.key.optimize();
  this.value = this.value.optimize();
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


