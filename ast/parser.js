const fs = require("fs");
const ohm = require("ohm-js");
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
  IdExp,
  addAllScoreProps
} = require("../ast");

const grammar = ohm.grammar(fs.readFileSync("grammar/respecc.ohm"));

// Ohm turns `x?` into either [x] or [], which we should clean up for our AST.
function arrayToNullable(a) {
  return a.length === 0 ? null : a[0];
}

/* eslint-disable no-unused-vars */

const astGenerator = grammar.createSemantics().addOperation("ast", {
  Program(_1, greet, _2, sfirst, _3, ss, _4, farewell, _5) {
    addAllScoreProps();
    return new Program(
      greet.ast().length !== 0,
      [sfirst.ast(), ...ss.ast()],
      farewell.ast().length !== 0
    );
  },
  SimpleStmt_return_impolite(_return, exp, _p) {
    return new Return(arrayToNullable(exp.ast()), false);
  },
  SimpleStmt_return_polite(_kreturn, exp, _p) {
    return new Return(arrayToNullable(exp.ast()), true);
  },
  SimpleStmt_break_impolite(_break) {
    return new Break(false);
  },
  SimpleStmt_break_polite(_break) {
    return new Break(true);
  },
  Conditional_if_impolite(
    _if,
    _po1,
    exp,
    _pc1,
    ifblk,
    _1,
    _elseif,
    _po2,
    exps,
    pc2,
    blks,
    _2,
    _else,
    elseblk
  ) {
    return new Conditional(
      exp.ast(),
      ifblk.ast(),
      exps.ast(),
      blks.ast(),
      arrayToNullable(elseblk.ast()),
      false
    );
  },
  Conditional_if_polite(
    _if,
    exp,
    _c1,
    ifblk,
    _1,
    _otherwiseif,
    exps,
    _c2,
    blks,
    _2,
    _otherwise,
    oblk
  ) {
    return new Conditional(
      exp.ast(),
      ifblk.ast(),
      exps.ast(),
      blks.ast(),
      arrayToNullable(oblk.ast()),
      true
    );
  },
  Loop_while_impolite(_while, _po, exp, _pc, blk) {
    return new WhileLoop(exp.ast(), blk.ast(), false);
  },
  Loop_while_polite(_while, exp, _c, blk) {
    return new WhileLoop(exp.ast(), blk.ast(), true);
  },
  Loop_for_impolite(_for, _po, dec, _semi1, exp, _semi2, assign, _pc, blk) {
    return new ForLoop(
      arrayToNullable(dec.ast()),
      arrayToNullable(exp.ast()),
      arrayToNullable(assign.ast()),
      blk.ast()
    );
  },
  Assignment_impolite(v, _eq, exp) {
    return new Assignment(v.ast(), exp.ast(), false);
  },
  Assignment_polite(_1, v, _2, exp, _3) {
    return new Assignment(v.ast(), exp.ast(), true);
  },
  Type_array(_arr, _open, type, _close) {
    return new ArrayType(type.ast());
  },
  Type_dict(_dict, _open, type1, _comma, type2, _close) {
    return new DictionaryType(type1.ast(), type2.ast());
  },

  ClassDec_impolite(_1, id, blk) {
    return new ClassDeclaration(id.ast(), blk.ast(), false);
  },
  ClassDec_polite(_1, id, _2, blk) {
    return new ClassDeclaration(id.ast(), blk.ast(), true);
  },
  ClassBlock_impolite(_1, _open, _2, fmember, _3, members, _4, _close) {
    return new ClassBlock([...fmember.ast(), ...members.ast()], false);
  },
  ClassBlock_polite(_1, _open, _2, fmember, _3, members, _4, _close) {
    return new ClassBlock([...fmember.ast(), ...members.ast()], true);
  },
  Constructor_impolite(id, params, blk) {
    return new Constructor(id.ast(), params.ast(), blk.ast(), false);
  },
  Constructor_polite(_1, id, _2, params, _3, blk) {
    return new Constructor(id.ast(), params.ast(), blk.ast(), true);
  },

  FuncDec_polite(_favor, id, params, _colon, type, block) {
    return new FunctionDeclaration(
      id.ast(),
      params.ast(),
      arrayToNullable(type.ast()),
      block.ast(),
      true
    );
  },
  FuncDec_impolite(_function, id, params, _colon, type, block) {
    return new FunctionDeclaration(
      id.ast(),
      params.ast(),
      arrayToNullable(type.ast()),
      block.ast(),
      false
    );
  },
  VarDec_polite(_1, id, _2, type, _3, exp, _4) {
    return new VariableDeclaration(
      id.ast(),
      arrayToNullable(type.ast()),
      arrayToNullable(exp.ast()),
      true
    );
  },
  VarDec_impolite(_1, id, _2, type, _3, exp) {
    return new VariableDeclaration(
      id.ast(),
      arrayToNullable(type.ast()),
      arrayToNullable(exp.ast()),
      false
    );
  },
  Params(_open, params, _close) {
    return params.ast();
  },
  Param(id, sep, type) {
    return new Parameter(
      id.ast(),
      arrayToNullable(type.ast()),
      arrayToNullable(sep.ast()) === null
        ? null
        : arrayToNullable(sep.ast()) !== ":"
    );
  },
  Args(_open, exps, _close) {
    return exps.ast();
  },
  Block_polite(_open, _1, sfirst, _2, ss, _3, _close) {
    return new Block([...sfirst.ast(), ...ss.ast()], true);
  },
  Block_impolite(_open, _1, sfirst, _2, ss, _3, _close) {
    return new Block([...sfirst.ast(), ...ss.ast()], false);
  },
  Exp_ternary(exp1, _1, exp2, _2, exp3) {
    return new TernaryExp(exp1.ast(), exp2.ast(), exp3.ast());
  },
  Exp1_lambda_blk(params, _, blk) {
    return new LambdaBlock(params.ast(), blk.ast());
  },
  Exp1_lambda_exp(params, _, exp) {
    return new LambdaExp(params.ast(), exp.ast());
  },
  Exp2_binary(exp1, op, exp2) {
    return new BinaryExp(exp1.ast(), op.sourceString, exp2.ast());
  },
  Exp3_binary(exp1, op, exp2) {
    return new BinaryExp(exp1.ast(), op.sourceString, exp2.ast());
  },
  Exp4_binary(exp1, op, exp2) {
    return new BinaryExp(exp1.ast(), op.sourceString, exp2.ast());
  },
  Exp5_binary(exp1, op, exp2) {
    return new BinaryExp(exp1.ast(), op.sourceString, exp2.ast());
  },
  Exp6_binary(exp1, op, exp2) {
    return new BinaryExp(exp1.ast(), op.sourceString, exp2.ast());
  },
  Exp7_prefix(op, exp) {
    return new UnaryPrefix(op.sourceString, exp.ast());
  },
  Exp8_binary(exp1, op, exp2) {
    return new BinaryExp(exp1.ast(), op.sourceString, exp2.ast());
  },
  Exp8_negate(minus, exp) {
    return new UnaryPrefix(minus.sourceString, exp.ast());
  },
  Exp9_parens(_open, exp, _close) {
    return exp.ast();
  },
  Increment_prefix(op, v) {
    return new UnaryPrefix(op.sourceString, v.ast());
  },
  Increment_postfix(v, op) {
    return new UnaryPostfix(v.ast(), op.sourceString);
  },
  Var_subscript(v, _open, subscript, _close) {
    return new SubscriptExp(v.ast(), subscript.ast());
  },
  Var_select(v, _dot, field) {
    return new MemberExp(v.ast(), field.ast());
  },
  Var_id(id) {
    return new IdExp(id.ast());
  },
  FuncCallStmt_call_impolite(id, args) {
    return new FunctionCall(id.ast(), args.ast(), false);
  },
  FuncCallStmt_call_polite(_1, id, _2, args, _3) {
    return new FunctionCall(id.ast(), arrayToNullable(args.ast()), true);
  },
  FuncCallExp_call_impolite(id, args) {
    return new FunctionCall(id.ast(), args.ast(), false);
  },
  FuncCallExp_call_polite(_1, id, _2, args) {
    return new FunctionCall(id.ast(), arrayToNullable(args.ast()), true);
  },

  ArrayLit(_open, exps, _close) {
    return new ArrayLiteral([...exps.ast()]);
  },
  DictLit(_open, dictentries, _close) {
    return new DictionaryLiteral(dictentries.ast());
  },
  DictEntry(exp1, _colon, exp2) {
    return new DictEntry(exp1.ast(), exp2.ast());
  },
  id(_firstChar, _restChars) {
    return this.sourceString;
  },
  numlit(digits, _radix, decimals) {
    return new NumberLiteral(+this.sourceString);
  },
  stringlit(_openQuote, chars, _closeQuote) {
    return new StringLiteral(this.sourceString.slice(1, -1));
  },
  boollit(bool) {
    return new BooleanLiteral(bool.ast() === "Yes");
  },
  nulllit(_null) {
    return new NullLiteral();
  },
  NonemptyListOf(first, _separator, rest) {
    return [first.ast(), ...rest.ast()];
  },
  EmptyListOf() {
    return [];
  },
  _terminal() {
    return this.sourceString;
  }
});
/* eslint-enable no-unused-vars */

module.exports = text => {
  const match = grammar.match(text);
  if (!match.succeeded()) {
    throw new Error(`Syntax Error: ${match.message}`);
  }
  return astGenerator(match).ast();
};
