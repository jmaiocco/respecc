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
const NullType = new PrimitiveType("Null");
const BooleanType = new PrimitiveType("Boolean");
const AnyType = new PrimitiveType(null);

let lengthFunction = new FunctionDeclaration(
  "length",
  [],
  NumberType,
  null,
  null
);

StringType.locals.set("length", lengthFunction);
const standardFunctions = [
  new FunctionDeclaration(
    "absoluteVal",
    [new Parameter("n", NumberType, null)],
    NumberType
  ),
  new FunctionDeclaration("printRespeccInfo", []),
  new FunctionDeclaration(
    "concatenate",
    [
      new Parameter("s1", StringType, null),
      new Parameter("s2", StringType, null)
    ],
    StringType
  ),
  new FunctionDeclaration("respecc", [], NumberType),
  //new FunctionDeclaration("maximum", [], NumberType),
  //new FunctionDeclaration("minimum", [], NumberType),
  new FunctionDeclaration("print", [new Parameter("s", AnyType, null)]),
  //new FunctionDeclaration("root", [new Parameter("")], NumberType),
  new FunctionDeclaration(
    "roundDown",
    [new Parameter("n", NumberType, null)],
    NumberType
  ),
  new FunctionDeclaration(
    "roundUp",
    [new Parameter("n", NumberType, null)],
    NumberType
  )
];

//eslint-disable no-param-reassign
standardFunctions.forEach(f => {
  f.builtin = true;
});
lengthFunction.builtin = true;
//eslint-enable no-param-reassign

module.exports = {
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType,
  ObjectType,
  standardFunctions,
  lengthFunction
};
