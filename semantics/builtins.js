const {
  FunctionDeclaration,
  VariableDeclaration,
  Parameter,
  ArrayType,
  DictionaryType
} = require("../ast");

class PrimitiveType {
  constructor(id) {
    Object.assign(this, { id, locals: new Map() });
  }
}

class ObjectType {
  constructor(id, callingParams = []) {
    Object.assign(this, { id, callingParams, locals: new Map() });
  }
}

const NumberType = new PrimitiveType("Number");
const StringType = new PrimitiveType("String");
StringType.locals.set(
  "length",
  new VariableDeclaration("length", NumberType, null, null)
);
const NullType = new PrimitiveType("Null");
const BooleanType = new PrimitiveType("Boolean");
const AnyType = new PrimitiveType(null);

ArrayType.locals = new Map();
ArrayType.locals.set(
  "length",
  new VariableDeclaration("length", NumberType, null, null)
);
DictionaryType.locals = new Map();
DictionaryType.locals.set(
  "length",
  new VariableDeclaration("length", NumberType, null, null)
);

const standardFunctions = [
  new FunctionDeclaration("print", [new Parameter("s", AnyType, null)])
  //new FunctionDeclaration("sacrifice", [new Parameter("s", null, null)], IntType)
];

//eslint-disable no-param-reassign
standardFunctions.forEach(f => {
  f.builtin = true;
});
//eslint-enable no-param-reassign

module.exports = {
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType,
  ObjectType,
  standardFunctions
};
