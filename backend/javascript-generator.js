/*
 * Translation to JavaScript
 *
 * Requiring this module adds a gen() method to each of the AST classes, except
 * for types, and fields, which don’t figure into code generation. It exports a
 * function that generates a complete, pretty-printed JavaScript program for a
 * Tiger expression, bundling the translation of the Tiger standard library with
 * the expression's translation.
 *
 * Each gen() method returns a fragment of JavaScript.
 *
 *   const generate = require('./backend/javascript-generator');
 *   generate(tigerExpression);
 */

const beautify = require("js-beautify");
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
  AnyType,
  ObjectType,
  standardFunctions
} = require("../semantics/builtins");

let respecc_score = 50;
let respecc_modes = ["RudeAF", "Rude", "Impolite", "Polite", "Angelic"];
let respecc_level = 4;

let politeOps = {
  or: "||",
  and: "&&",
  "is less than or equal to": "<=",
  "is greater than or equal to": ">=",
  "is less than": "<",
  "is greater than": ">",
  "is equal to": "===",
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

function setScore(object) {
  if (object.constructor === Program) {
    respecc_score += object.isGreeting
      ? object.constructor.politeFactor[0]
      : object.constructor.rudeFactor[0];
    respecc_score += object.isFarewell
      ? object.constructor.politeFactor[1]
      : object.constructor.rudeFactor[1];
  } else if (object.constructor === BinaryExp) {
    respecc_score += politeOps[object.operator]
      ? object.constructor.politeFactor
      : object.constructor.rudeFactor;
  } else if (
    object.constructor === VariableDeclaration ||
    object.constructor === FunctionDeclaration ||
    object.constructor === Parameter
  ) {
    respecc_score +=
      object.politeFlag === true
        ? object.constructor.politeFactor
        : object.constructor.rudeFactor;
    respecc_score +=
      object.typePoliteness === true
        ? object.constructor.typeFactor[0]
        : object.typePoliteness === false
        ? object.constructor.typeFactor[1]
        : object.constructor.typeFactor[2];
  } else if (
    object.constructor === TernaryExp ||
    object.constructor === LambdaBlock ||
    object.constructor === LambdaExp
  ) {
    respecc_score += object.constructor.rudeFactor;
  } else if (object.constructor.politeFactor && object.constructor.rudeFactor) {
    respecc_score +=
      object.politeFlag === true
        ? object.constructor.politeFactor
        : object.constructor.rudeFactor;
  }
  respecc_score = Math.max(0, Math.min(respecc_score, 100));
  respecc_level = Math.min(Math.floor(respecc_score / 20), 4);
  console.log(
    `${object.constructor.name}: ${respecc_score} is ${respecc_modes[respecc_level]}`
  );
}

// javaScriptId(e) takes any Tiger object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
const javaScriptId = (() => {
  let lastId = 0;
  const map = new Map();
  return v => {
    if (!map.has(v)) {
      map.set(v, ++lastId); // eslint-disable-line no-plusplus
    }
    return `${v.id}_${map.get(v)}`;
  };
})();

// Let's inline the built-in functions, because we can!

const builtin = {
  respecc() {
    return `${respecc_score}`;
  },
  print([s]) {
    return `console.log(${s})`;
  }
  /*
  ord([s]) {
    return `(${s}).charCodeAt(0)`;
  },
  chr([i]) {
    return `String.fromCharCode(${i})`;
  },
  size([s]) {
    return `${s}.length`;
  },
  substring([s, i, n]) {
    return `${s}.substr(${i}, ${n})`;
  },
  concat([s, t]) {
    return `${s}.concat(${t})`;
  },
  not(i) {
    return `(!(${i}))`;
  },
  exit(code) {
    return `process.exit(${code})`;
  }
  */
};

module.exports = function(exp) {
  return beautify(exp.gen(), { indent_size: 2 });
};

Program.prototype.gen = function() {
  setScore(this);
  return this.statements.map(e => e.gen()).join(";");
};

VariableDeclaration.prototype.gen = function() {
  setScore(this);
  return `let ${javaScriptId(this)} = ${this.expression.gen()}`;
};

Return.prototype.gen = function() {
  setScore(this);
  return;
};
Break.prototype.gen = function() {
  setScore(this);
  return;
};
Conditional.prototype.gen = function() {
  setScore(this);
  return;
};
WhileLoop.prototype.gen = function() {
  setScore(this);
  return;
};
ForLoop.prototype.gen = function() {
  setScore(this);
  return;
};
FunctionCall.prototype.gen = function() {
  setScore(this);
  return;
};
Assignment.prototype.gen = function() {
  setScore(this);
  return;
};
ArrayType.prototype.gen = function() {
  return;
};
DictionaryType.prototype.gen = function() {
  return;
};
ClassDeclaration.prototype.gen = function() {
  setScore(this);
  return;
};
ClassBlock.prototype.gen = function() {
  setScore(this);
  return;
};
Constructor.prototype.gen = function() {
  setScore(this);
  return;
};
FunctionDeclaration.prototype.gen = function() {
  setScore(this);
  return;
};
Parameter.prototype.gen = function() {
  setScore(this);
  return;
};
Block.prototype.gen = function() {
  setScore(this);
  return;
};
TernaryExp.prototype.gen = function() {
  setScore(this);
  return;
};
LambdaBlock.prototype.gen = function() {
  setScore(this);
  return;
};
LambdaExp.prototype.gen = function() {
  setScore(this);
  return;
};
BinaryExp.prototype.gen = function() {
  setScore(this);
  return `(${this.left.gen()} ${makeOp(this.operator)} ${this.right.gen()})`;
};
UnaryPrefix.prototype.gen = function() {
  return;
};
UnaryPostfix.prototype.gen = function() {
  return;
};
SubscriptExp.prototype.gen = function() {
  return;
};
MemberExp.prototype.gen = function() {
  return;
};
ArrayLiteral.prototype.gen = function() {
  return;
};
DictionaryLiteral.prototype.gen = function() {
  return;
};
DictEntry.prototype.gen = function() {
  return;
};
NumberLiteral.prototype.gen = function() {
  return this.value;
};

StringLiteral.prototype.gen = function() {
  return;
};
BooleanLiteral.prototype.gen = function() {
  return;
};
NullLiteral.prototype.gen = function() {
  return;
};
IdExp.prototype.gen = function() {
  return;
};

/*
ArrayExp.prototype.gen = function () {
  return `Array(${this.size.gen()}).fill(${this.fill.gen()})`;
};

Assignment.prototype.gen = function () {
  return `${this.target.gen()} = ${this.source.gen()}`;
};

BinaryExp.prototype.gen = function () {
  return `(${this.left.gen()} ${makeOp(this.op)} ${this.right.gen()})`;
};

Binding.prototype.gen = function () {
  return `${this.id} : ${this.value.gen()}`;
};

Break.prototype.gen = function () {
  return 'break';
};

Call.prototype.gen = function () {
  const args = this.args.map(a => a.gen());
  if (this.callee.builtin) {
    return builtin[this.callee.id](args);
  }
  return `${javaScriptId(this.callee)}(${args.join(',')})`;
};

ExpSeq.prototype.gen = function () {
  return this.exps.map(e => e.gen()).join(';');
};

ForExp.prototype.gen = function () {
  const i = javaScriptId(this.index);
  const low = this.low.gen();
  const hi = javaScriptId(new Variable('hi'));
  const preAssign = `let ${hi} = ${this.high.gen()};`;
  const loopControl = `for (let ${i} = ${low}; ${i} <= ${hi}; ${i}++)`;
  const body = this.body.gen();
  return `${preAssign} ${loopControl} {${body}}`;
};

Func.prototype.gen = function () {
  const name = javaScriptId(this);
  const params = this.params.map(javaScriptId);
  // "Void" functions do not have a JS return, others do
  const body = this.body.type ? makeReturn(this.body) : this.body.gen();
  return `function ${name} (${params.join(',')}) {${body}}`;
};

IdExp.prototype.gen = function () {
  return javaScriptId(this.ref);
};

IfExp.prototype.gen = function () {
  const thenPart = this.consequent.gen();
  const elsePart = this.alternate ? this.alternate.gen() : 'null';
  return `((${this.test.gen()}) ? (${thenPart}) : (${elsePart}))`;
};

LetExp.prototype.gen = function () {
  if (this.type) {
    // This looks insane, but let-expressions really are closures!
    return `(() => {${makeReturn(this)} ; })()`;
  }
  const filteredDecs = this.decs.filter(d => d.constructor !== TypeDec);
  return [...filteredDecs, ...this.body].map(e => e.gen()).join(';');
};
*/
/*
MemberExp.prototype.gen = function () {
  return `${this.record.gen()}.${this.id}`;
};

SubscriptedExp.prototype.gen = function () {
  return `${this.array.gen()}[${this.subscript.gen()}]`;
};

NegationExp.prototype.gen = function () {
  return `(- (${this.operand.gen()}))`;
};

Nil.prototype.gen = function () {
  return 'null';
};

RecordExp.prototype.gen = function () {
  return `{${this.bindings.map(b => b.gen()).join(',')}}`;
};
*/
/*
WhileExp.prototype.gen = function () {
  return `while (${this.test.gen()}) { ${this.body.gen()} }`;
};

*/
