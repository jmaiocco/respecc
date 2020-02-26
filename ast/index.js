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
  constructor(id, exp, politeFlag) {
    Object.assign(this, { id, exp, politeFlag });
  }
}

class ArrayType {
  constructor(type) {
    Object.assign(this, { type });
  }
}

class DictionaryType {
  constructor(type1, type2) {
    Object.assign(this, { type1, type2 });
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
  constructor(id, params, blk, politeFlag) {
    Object.assign(this, { id, params, blk, politeFlag });
  }
}

class FunctionDeclaration {
  constructor(id, params, type, block, politeFlag) {
    Object.assign(this, { id, params, type, block, politeFlag });
  }
}

class VariableDeclaration {
  constructor(id, type, expression, politeFlag) {
    Object.assign(this, { id, type, expression, politeFlag });
  }
}

/*The parameter politeness is based on whether or not the the parameter
 is statically typed. If it isnt, that flag is null.
  If its ":", flag is flase.
  If it's "as a", flag is true.
 */
class Parameter {
  constructor(id, type, politeFlag) {
    Object.assign(this, { id, type, politeFlag });
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
  constructor(v, subscript) {
    Object.assign(this, { v, subscript });
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
  BooleanLiteral
};
