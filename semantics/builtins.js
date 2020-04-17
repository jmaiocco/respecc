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

let concatenateFunction = new FunctionDeclaration(
  "concatenate",
  [new Parameter("s2", StringType, null)],
  StringType,
  null,
  null
  );



StringType.locals.set("length", lengthFunction);
StringType.locals.set("concatenate", concatenateFunction);
const standardFunctions = [
  new FunctionDeclaration("print", [new Parameter("s", AnyType, null)]),
  new FunctionDeclaration("roundDown", [new Parameter("n", NumberType, null)], NumberType),
  new FunctionDeclaration("roundUp", [new Parameter("n", NumberType, null)], NumberType,),
  new FunctionDeclaration(
    "getRespecc",
    [new Parameter("s", null, null)],
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