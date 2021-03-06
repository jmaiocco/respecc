class Program {
  constructor(isGreeting, statements, isFarewell) {
    Object.assign(this, { isGreeting, statements, isFarewell });
  }
}

class Return {
  constructor(returnValue, politeFlag) {
    Object.assign(this, { returnValue, politeFlag });
  }
}

class Break {
  constructor(politeFlag) {
    Object.assign(this, { politeFlag });
  }
}

class Conditional {
  constructor(exp, ifBlock, exps, blocks, elseBlock, politeFlag) {
    Object.assign(this, { exp, ifBlock, exps, blocks, elseBlock, politeFlag });
  }
}

class WhileLoop {
  constructor(exp, block, politeFlag) {
    Object.assign(this, { exp, block, politeFlag });
  }
}

class ForLoop {
  constructor(dec, exp, assignment, block) {
    Object.assign(this, { dec, exp, assignment, block });
  }
}

class FunctionCall {
  constructor(id, args, politeFlag) {
    Object.assign(this, { id, args, politeFlag });
  }
}

class Assignment {
  constructor(variable, exp, politeFlag) {
    Object.assign(this, { variable, exp, politeFlag });
  }
}

class ArrayType {
  constructor(type, locals = new Map()) {
    Object.assign(this, { type, locals });
  }
}

class DictionaryType {
  constructor(type1, type2, locals = new Map()) {
    Object.assign(this, { type1, type2, locals });
  }
}

class ClassDeclaration {
  constructor(id, block, politeFlag) {
    Object.assign(this, { id, block, politeFlag });
  }
}

class ClassBlock {
  constructor(members, politeFlag) {
    Object.assign(this, { members, politeFlag });
  }
}

class Constructor {
  constructor(id, params, block, politeFlag) {
    Object.assign(this, { id, params, block, politeFlag });
  }
}

class FunctionDeclaration {
  constructor(id, params, type, block, politeFlag, typePoliteness) {
    Object.assign(this, {
      id,
      params,
      type,
      block,
      politeFlag,
      typePoliteness
    });
  }
}

class VariableDeclaration {
  constructor(id, type, expression, politeFlag, typePoliteness) {
    Object.assign(this, { id, type, expression, politeFlag, typePoliteness });
  }
}

class Parameter {
  constructor(id, type, politeFlag, typePoliteness) {
    Object.assign(this, { id, type, politeFlag, typePoliteness });
  }
}

class Block {
  constructor(statements, politeFlag) {
    Object.assign(this, { statements, politeFlag });
  }
}

class TernaryExp {
  constructor(exp1, exp2, exp3) {
    Object.assign(this, { exp1, exp2, exp3 });
  }
}

class LambdaBlock {
  constructor(params, block) {
    Object.assign(this, { params, block });
  }
}

class LambdaExp {
  constructor(params, exp) {
    Object.assign(this, { params, exp });
  }
}

class BinaryExp {
  constructor(left, operator, right) {
    Object.assign(this, { left, operator, right });
  }
}

class UnaryPrefix {
  constructor(operator, right) {
    Object.assign(this, { operator, right });
  }
}

class UnaryPostfix {
  constructor(left, operator) {
    Object.assign(this, { left, operator });
  }
}

class SubscriptExp {
  constructor(composite, subscript) {
    Object.assign(this, { composite, subscript });
  }
}

class MemberExp {
  constructor(v, field) {
    Object.assign(this, { v, field });
  }
}

class ArrayLiteral {
  constructor(exps) {
    Object.assign(this, { exps });
  }
}

class DictionaryLiteral {
  constructor(keyValuePairs) {
    Object.assign(this, { keyValuePairs });
  }
}

class DictEntry {
  constructor(key, value) {
    Object.assign(this, { key, value });
  }
}

class IdExp {
  constructor(ref) {
    Object.assign(this, { ref });
  }
}

class NumberLiteral {
  constructor(value) {
    Object.assign(this, { value });
  }
}

class StringLiteral {
  constructor(value) {
    Object.assign(this, { value });
  }
}

class BooleanLiteral {
  constructor(value) {
    Object.assign(this, { value });
  }
}

class NullLiteral {}

function addAllScoreProps() {
  addScoreProps(Program, [5, 5], [-8, -8]);
  addScoreProps(Return, 3, -4);
  addScoreProps(Break, 4, -7);
  addScoreProps(Conditional, 6, -6);
  addScoreProps(WhileLoop, 6, -6);
  addScoreProps(ForLoop, 6, -6);
  addScoreProps(FunctionCall, 5, -4);
  addScoreProps(Assignment, 5, -5);
  addScoreProps(ClassDeclaration, 4, -10);
  addScoreProps(ClassBlock, 3, -3);
  addScoreProps(Constructor, 4, -4);
  addScoreProps(FunctionDeclaration, 5, -8, [3, 0, -2]);
  addScoreProps(VariableDeclaration, 3, -4, [3, 0, -2]);
  addScoreProps(Block, 3, -3);
  addScoreProps(BinaryExp, 2, -3);
  //Penalty Only
  addScoreProps(TernaryExp, 0, -5);
  addScoreProps(LambdaBlock, 0, -5);
  addScoreProps(LambdaExp, 0, -5);
  //Type Scoring Only
  addScoreProps(Parameter, 0, 0, [3, 0, -2]);
}

function addScoreProps(object, politeFactor, rudeFactor, typeFactor) {
  object.politeFactor = politeFactor;
  object.rudeFactor = rudeFactor;
  if (typeFactor) {
    object.typeFactor = typeFactor;
  }
}

module.exports = {
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
  IdExp,
  addAllScoreProps
};
