const util = require("util");
const {
  Constructor,
  ArrayType,
  DictionaryType,
  FunctionDeclaration,
  ClassDeclaration
} = require("../ast");
const {
  ObjectType,
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType
} = require("./builtins");

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

  isNotClassDeclaration(statement) {
    doCheck(
      statement.constructor !== ClassDeclaration,
      "Classes must be declared in root scope."
    );
  },

  isNotFunctionDeclaration(statement) {
    doCheck(
      statement.constructor !== FunctionDeclaration,
      "Functions must be declared as class member or in root scope."
    );
  },

  // Can we assign expression to a variable/param/field of type type?
  isAssignableTo(expression, type, message) {
    if (type === AnyType) {
      return;
    }
    let errorMessage = message
      ? message
      : `Expression of type ${util.format(expression.type)}
         not compatible with type ${util.format(type)}`;
    if (type.constructor === ArrayType || type.constructor === DictionaryType) {
      doCheck(
        JSON.stringify(expression.type) === JSON.stringify(type),
        errorMessage
      );
    } else {
      doCheck(
        expression.type === type || expression.type === AnyType,
        errorMessage
      );
    }
  },
  // Is the type of this expression an array or dictionary type? (For subscript)
  isArrayOrDictionary(expression) {
    doCheck(
      expression.type.constructor === ArrayType ||
        expression.type.constructor === DictionaryType ||
        expression.type === AnyType,
      "Not an array or a dictionary"
    );
  },

  functiontypeResolved(func) {
    doCheck(
      func.typeResolved,
      `Function ${func.id} needs to return value of type ${util.format(
        func.type
      )}`
    );
  },

  isNumber(expression) {
    doCheck(
      expression.type === NumberType || expression.type === AnyType,
      "Not a Number"
    );
  },

  isBoolean(expression) {
    doCheck(
      expression.type === BooleanType || expression.type === AnyType,
      "Not a Number"
    );
  },

  isFunction(value) {
    doCheck(value.constructor === FunctionDeclaration, "Not a function");
  },

  isFunctionOrObject(value) {
    doCheck(
      value.constructor === FunctionDeclaration ||
        value.constructor === ObjectType,
      "Not a function or Constructor"
    );
  },

  isClass(value) {
    doCheck(value.constructor === ObjectType, "Not an object");
  },

  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  },

  // Is the type of this expression a number or string type? (For relational operators)
  isNumberOrString(expression) {
    doCheck(
      expression.type === NumberType ||
        expression.type === StringType ||
        expression.type === AnyType,
      "Not an number or string"
    );
  },

  inLoop(context, keyword) {
    doCheck(context.inLoop, `${keyword} can only be used in a loop`);
  },

  inFunction(context, keyword) {
    doCheck(
      context.currentFunction,
      `${keyword} can only be used in a function`
    );
  },

  functionConstructorHasNoReturnValue(funcRef, returnVal) {
    doCheck(
      returnVal === null || funcRef.constructor === FunctionDeclaration,
      `Constructor ${funcRef.id} returned a value. Constructors may not return values.`
    );
  },

  inClass(context, keyword) {
    doCheck(
      context.currentClass,
      `Constructor ${keyword} can only be used in a ${keyword} class`
    );
  },

  constructorMatchesClass(constructorObj, classObj) {
    doCheck(
      classObj.id === constructorObj.id,
      `Constructor ${constructorObj.id} can't be used in ${classObj.id} class`
    );
  },

  // Same number of args and params; all types compatible
  legalArguments(args, params) {
    doCheck(
      args.length === params.length,
      `Expected ${params.length} args in call, got ${args.length}`
    );
    args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type));
  },

  anyLegalArguments(args, paramsList) {
    doCheck(
      paramsList.every(params => args.length === params.length),
      `No Constructor exists with params length ${args.length}`
    );
    paramsList.forEach(params =>
      args.forEach((arg, i) => this.isAssignableTo(arg, params[i].type))
    );
  },

  propertyOfAll(arr, prop) {
    return arr.length !== 0 &&
      arr.filter(e => e[prop] === arr[0][prop]).length === arr.length
      ? arr[0][prop]
      : AnyType;
  }

  /*
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
