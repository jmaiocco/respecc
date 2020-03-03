const { FunctionDeclaration, Parameter } = require("../ast");

class PrimitiveType {
  constructor(id) {
    Object.assign(this, { id });
  }
}

const NumberType = new PrimitiveType("Number");
const StringType = new PrimitiveType("String");
const NullType = new PrimitiveType("Null");
const BooleanType = new PrimitiveType("Boolean");

const standardFunctions = [
  new FunctionDeclaration("print", [new Parameter("s", StringType, null)])
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
  standardFunctions
};
