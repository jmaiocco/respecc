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
  isAssignableTo(expression, type, message, returnBool) {
    if (type === AnyType) {
      return true;
    }
    let errorMessage = message
      ? message
      : `Expression of type ${util.format(expression.type)}
         not compatible with type ${util.format(type)}`;
    if (type.constructor === ArrayType || type.constructor === DictionaryType) {
      if (returnBool) {
        return JSON.stringify(expression.type) === JSON.stringify(type);
      } //TODO: This conditional is never used in analyzer
      doCheck(
        JSON.stringify(expression.type) === JSON.stringify(type),
        errorMessage
      );
    } else {
      if (returnBool) {
        return expression.type === type || expression.type === AnyType;
      }
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
      "Not a Boolean"
    );
  },

  isFunction(value) {
    doCheck(value.constructor === FunctionDeclaration, "Not a function");
  }, //TODO: not used because isFunctionOrObject is used instead

  isFunctionOrObject(value) {
    doCheck(
      value.constructor === FunctionDeclaration ||
        value.constructor === ObjectType, //TODO:Does not check for Lambdas: value.constructor == Variable Declaration
      "Not a function or Constructor"
    );
  },

  isClass(value) {
    doCheck(value.constructor === ObjectType, "Not an object");
  },

  expressionsHaveTheSameType(e1, e2) {
    doCheck(e1.type === e2.type, "Types must match exactly");
  }, //TODO: Never used in analyzer

  // Is the type of this expression a number or string type? (For relational operators)
  isNumberOrString(expression) {
    doCheck(
      expression.type === NumberType ||
        expression.type === StringType ||
        expression.type === AnyType,
      "Not an number or string"
    );
  }, //TODO: Not used in analyzer

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
      paramsList.some(params => args.length === params.length),
      `No Constructor exists with params length ${args.length}`
    );
    doCheck(
      paramsList
        .filter(params => args.length === params.length)
        .some(params =>
          args.every((arg, i) =>
            this.isAssignableTo(arg, params[i].type, "", true)
          )
        ),
      "No Constructor exists that can accept the specified types"
    );
  },

  propertyOfAll(arr, prop) {
    return arr.length !== 0 &&
      arr.filter(e => e[prop] === arr[0][prop]).length === arr.length
      ? arr[0][prop]
      : AnyType;
  },

  objectNoMatchingConstructors(objectType) {
    let params = objectType.callingParams;
    for (let i = 0; i < params.length; i++) {
      for (let j = i + 1; j < params.length; j++) {
        if (params[i].length === params[j].length) {
          let paramsMatch = true;
          params[i].forEach((param, k) => {
            if (
              param.type !== params[j][k].type &&
              param.type !== AnyType &&
              params[j][k].type !== AnyType
            ) {
              paramsMatch = false;
            }
          });
          doCheck(
            !paramsMatch,
            `Object ${objectType.id} cannot have multiple
            Constructors of the same number and type`
          );
        }
      }
    }
  },

  memberExists(instance, memberID) {
    doCheck(
      instance.type.locals.has(memberID),
      `Identifier ${memberID}
    does not exist in ${instance.id}`
    );
  }
};
