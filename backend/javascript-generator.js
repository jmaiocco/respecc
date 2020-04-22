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
let toggleRandom = null;

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

// javaScriptId(e) takes any object with an id property, such as a Variable,
// Param, or Func, and produces a JavaScript name by appending a unique identifying
// suffix, such as '_1' or '_503'. It uses a cache so it can return the same exact
// string each time it is called with a particular entity.
const javaScriptId = (() => {
  let lastId = 0;
  const map = new Map();
  return v => {
    if (v.id === "this") {
      return "this";
    }
    if (!map.has(v)) {
      if (v.constructor === ClassDeclaration) {
        map.set(v.type, ++lastId);
      } else {
        map.set(v, ++lastId); // eslint-disable-line no-plusplus
      }
    }

    //console.log(map);

    return `${v.id}_${map.get(
      v.constructor === ClassDeclaration ? v.type : v
    )}`;
  };
})();

// Let's inline the built-in functions, because we can!

const builtin = {
  respecc() {
    return `${respecc_score}`;
  },
  print([s]) {
    return `console.log(${s})`;
  },
  length() {
    return `length`;
  },
  roundUp([n]) {
    return `Math.ceil(${n})`;
  },
  roundDown([n]) {
    return `Math.floor(${n})`;
  },
  concatenate([s1, s2]) {
    return `${s1}.concat(${s2})`;
  },
  absoluteVal([n]) {
    return `Math.abs(${n})`;
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

Program.prototype.gen = function(randomize = null) {
  toggleRandom = randomize;
  setScore(this);
  return this.statements.map(e => e.gen()).join(";");
};

let initializers = {
  ArrayType: "[]",
  DictionaryType: "{}",
  ObjectType: "{}",
  StringType: "",
  NumberType: "0",
  NullType: "null",
  BooleanType: "false",
  null: "null"
};

VariableDeclaration.prototype.gen = function(inClass) {
  setScore(this);
  let declarator = inClass ? "" : "let";
  let exp = "";
  if (this.expression === null) {
    exp = initializers[this.type.constructor.name];
  } else {
    exp = `${this.expression.gen()}`;
  }

  return `${declarator} ${javaScriptId(this)} ${exp ? `= ${exp}` : ""}`;
};
Return.prototype.gen = function() {
  setScore(this);
  return `return ${this.returnValue ? this.returnValue.gen() : ""}`;
};
Break.prototype.gen = function() {
  setScore(this);
  return "break";
};
Conditional.prototype.gen = function() {
  setScore(this);
  return `if(${this.exp.gen()}) ${this.ifBlock.gen()} 
    ${this.exps.map((exp, i) => {
      `else if(${exp.gen()}) ${this.blocks[i].gen()}`;
      })
    .join("")} ${this.elseBlock ? `else ${this.elseBlock.gen()}` : ""}`;
};
WhileLoop.prototype.gen = function() {
  setScore(this);
  return `while(${this.exp.gen()}) ${this.block.gen()}`;
};
ForLoop.prototype.gen = function() {
  setScore(this);
  return `for(${this.dec.gen()} ;${this.exp.gen()} ;${this.assignment.gen()}) ${this.block.gen()}`;
};
FunctionCall.prototype.gen = function() {
  setScore(this);
  let prefix = this.id.constructor === MemberExp ? `${this.id.v.gen()} .` : "";

  const args = this.args.map(a => a.gen());
  if (this.callee.builtin) {
    return `${prefix} ${builtin[this.callee.id](args)}`;
  }

  let newTag = this.callee.constructor === ObjectType ? "new" : "";

  return `${prefix} ${newTag} ${javaScriptId(this.callee)}(${this.args
    .map(a => a.gen())
    .join(",")})`;
};
Assignment.prototype.gen = function() {
  setScore(this);
  return `${this.variable.gen()} = ${this.exp.gen()}`;
};
ClassDeclaration.prototype.gen = function() {
  setScore(this);
  return `class ${javaScriptId(this)} ${this.block.gen()}`;
};
ClassBlock.prototype.gen = function() {
  setScore(this);

  let constructorsList = this.members.filter(
    e => e.constructor === Constructor
  );

  return `{${this.members
    .map(e => e.gen(true))
    .join(";")} ${generateAllConstructors(constructorsList)} }`;
};

function generateAllConstructors(constructorList) {
  return `constructor(..._) {
    ${constructorList.map(
      c => `if(_.length === ${c.params.length}) ${c.block.gen(c.params)}`
    )}
  }`;
}

Constructor.prototype.gen = function() {
  setScore(this);
};
FunctionDeclaration.prototype.gen = function(inClass) {
  let declarator = inClass ? "" : "function";
  setScore(this);
  return `${declarator} ${javaScriptId(this)}(${this.params
    .map(p => p.gen())
    .join(",")}) ${this.block.gen()}`;
};
Parameter.prototype.gen = function() {
  setScore(this);
  return javaScriptId(this);
};
Block.prototype.gen = function(params) {
  setScore(this);
  let paramsDec = "";
  if (params) {
    paramsDec = `${params
      .map((p, i) => `let ${javaScriptId(p)} = _[${i}]`)
      .join(";")} ;\n`;
  }

  return `{${paramsDec} ${this.statements.map(e => e.gen()).join(";")}}`;
};
TernaryExp.prototype.gen = function() {
  setScore(this);
  return `(${this.exp1.gen()}?${this.exp2.gen()}:${this.exp3.gen()})`;
};
LambdaBlock.prototype.gen = function() {
  setScore(this);
  return `((${this.params.map(p => p.gen()).join(",")}) => ${this.block})`;
};
LambdaExp.prototype.gen = function() {
  setScore(this);
  return `((${this.params.map(p => p.gen()).join(",")}) => ${this.exp})`;
};
BinaryExp.prototype.gen = function() {
  setScore(this);
  return `(${this.left.gen()} ${makeOp(this.operator)} ${this.right.gen()})`;
};
UnaryPrefix.prototype.gen = function() {
  return `${makeOp(this.operator)} ${this.right.gen()}`;
};
UnaryPostfix.prototype.gen = function() {
  return `${this.left.gen()} ${makeOp(this.operator)}`;
};
SubscriptExp.prototype.gen = function() {
  return `${this.composite.gen()}[${this.subscript.gen()}]`;
};
MemberExp.prototype.gen = function() {
  if (this.field.constructor === FunctionCall) {
    return `${this.v.gen()} . ${this.field.gen()}`;
  }

  return `${this.v.gen()} . ${javaScriptId(this.member)}`;
};
ArrayLiteral.prototype.gen = function() {
  return `[${[...this.exps].map(e => e.gen())}]`;
};
DictionaryLiteral.prototype.gen = function() {
  return `{${this.keyValuePairs.map(e => e.gen()).join(",")}}`; //Allows multiple of same named prop?
};
DictEntry.prototype.gen = function() {
  return `${this.key.gen()} : ${this.value.gen()}`;
};
NumberLiteral.prototype.gen = function() {
  return this.value;
};
StringLiteral.prototype.gen = function() {
  return `"${this.value}"`;
};
BooleanLiteral.prototype.gen = function() {
  return this.value;
};
NullLiteral.prototype.gen = function() {
  return "null";
};
IdExp.prototype.gen = function() {
  return javaScriptId(this.ref);
};

/*
ArrayExp.prototype.gen = function () {
  return `Array(${this.size.gen()}).fill(${this.fill.gen()})`;
};

Assignment.prototype.gen = function () {
  return `${this.target.gen()} = ${this.source.gen()}`;
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

MemberExp.prototype.gen = function () {
  return `${this.record.gen()}.${this.id}`;
};

SubscriptedExp.prototype.gen = function () {
  return `${this.array.gen()}[${this.subscript.gen()}]`;
};

NegationExp.prototype.gen = function () {
  return `(- (${this.operand.gen()}))`;
};

WhileExp.prototype.gen = function () {
  return `while (${this.test.gen()}) { ${this.body.gen()} }`;
};

*/
