/*
 * Semantic Analysis Context
 *
 * A context object holds state for the semantic analysis phase.
 *
 *   const Context = require('./semantics/context');
 */

const { ArrayType, DictionaryType } = require("../ast");
const {
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType,
  standardFunctions
} = require("./builtins");
require("./analyzer");

// When doing semantic analysis we pass around context objects.
//
// A context object holds:
//
//   1. A reference to the parent context (or null if this is the root context).
//      This allows to search for declarations from the current context outward.
//
//   2. A reference to the current function we are analyzing, if any. If we are
//      inside a function, then return expressions are legal, and we will be
//      able to type check them.
//
//   3. Whether we are in a loop (to know that a `break` is okay).
//
//   4. A map for looking up all identifiers declared in this context.

class Context {
  constructor({
    parent = null,
    currentFunction = null,
    currentClass = null,
    inLoop = false
  } = {}) {
    Object.assign(this, {
      parent,
      currentFunction,
      currentClass,
      inLoop,
      locals: new Map()
    });
  }

  createChildContextForFunctionBody(currentFunction) {
    // When entering a new function, we're not in a loop anymore
    return new Context({
      parent: this,
      currentFunction: currentFunction,
      currentClass: this.currentClass,
      inLoop: false
    });
  }

  createChildContextForClassBody(currentClass) {
    // When entering a new function, we're not in a loop anymore
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      currentClass: currentClass,
      inLoop: false
    });
  }

  createChildContextForLoop() {
    // When entering a loop body, just set the inLoop field, retain others
    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      currentClass: this.currentClass,
      inLoop: true
    });
  }

  createChildContextForBlock() {
    // For a block, we have to retain both the function and loop settings.

    return new Context({
      parent: this,
      currentFunction: this.currentFunction,
      currentClass: this.currentClass,
      inLoop: this.inLoop
    });
  }

  // Adds a declaration to this context.
  add(declaration) {
    if (this.locals.has(declaration.id)) {
      throw new Error(`${declaration.id} already declared in this scope`);
    }
    const entity = /*declaration instanceof TypeDec ? declaration.type :*/ declaration;
    this.locals.set(declaration.id, entity);
  }

  // Returns the entity bound to the given identifier, starting from this
  // context and searching "outward" through enclosing contexts if necessary.
  lookup(id) {
    if (id != null && id.constructor === ArrayType) {
      return new ArrayType(this.lookup(id.type));
    }
    if (id != null && id.constructor === DictionaryType) {
      return new DictionaryType(this.lookup(id.type1), this.lookup(id.type2));
    }
    for (let context = this; context !== null; context = context.parent) {
      if (context.locals.has(id)) {
        return context.locals.get(id);
      }
    }
    throw new Error(`Identifier ${id} has not been declared`);
  }
}

Context.INITIAL = new Context();
[
  NumberType,
  StringType,
  NullType,
  BooleanType,
  AnyType,
  ...standardFunctions
].forEach(entity => {
  Context.INITIAL.add(entity);
});

module.exports = Context;
