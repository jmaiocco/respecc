const util = require("util");
const { ArrayType, DictionaryType, FunctionDeclaration } = require("../ast");
const { NumberType, StringType, NullType, BooleanType } = require("./builtins");

function doCheck(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

module.exports = {
  // Is this type an array type?
  isArrayType(type) {
    doCheck(type.constructor === ArrayType, "Not an array type");
  },

  isDictionaryType(type) {
    doCheck(type.constructor === DictionaryType, "Not a dictionary type");
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type) {
    if (type.constructor === ArrayType || type.constructor === DictionaryType) {
      doCheck(
        JSON.stringify(expression.type) === JSON.stringify(type),
        `Expression of type ${util.format(expression.type)}
       not compatible with type ${util.format(type)}`
      );
    } else {
      doCheck(
        expression.type === type,
        `Expression of type ${util.format(expression.type)}
       not compatible with type ${util.format(type)}`
      );
    }
  },
  // Is the type of this expression an array or dictionary type? (For subscript)
  isArrayorDictionary(expression) {
    doCheck(
      expression.type.constructor === ArrayType ||
        expression.type.constructor === DictionaryType,
      "Not an array or a dictionary"
    );
  },

  isNumber(expression) {
    doCheck(expression.type === NumberType, "Not a Number");
  },

  isFunction(value) {
    doCheck(value.constructor === FunctionDeclaration, "Not a function");
  },

  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  },

  // Is the type of this expression a number or string type? (For relational operators)
  isNumberOrString(expression) {
    doCheck(
      expression.type === NumberType || expression.type === StringType,
      "Not an number or string"
    );
  },

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type));
  },

  propertyOfAll(arr, prop) {
    return arr.length !== 0 &&
      arr.filter(e => e[prop] === arr[0][prop]).length === arr.length
      ? arr[0][prop]
      : null;
  }

  /*
  isRecord(expression) {
    doCheck(expression.type.constructor === RecordType, 'Not a record');
  },

  mustNotHaveAType(expression) {
    doCheck(!expression.type, 'Expression must not have a type');
  },


  isNotReadOnly(lvalue) {
    doCheck(
      !(lvalue.constructor === IdExp && lvalue.ref.readOnly),
      'Assignment to read-only variable',
    );
  },

  fieldHasNotBeenUsed(field, usedFields) {
    doCheck(!usedFields.has(field), `Field ${field} already declared`);
  },

  // If there is a cycle in types, they must go through a record
  noRecursiveTypeCyclesWithoutRecordTypes() {
    // TODO - not looking forward to this one
  },
  */
};
