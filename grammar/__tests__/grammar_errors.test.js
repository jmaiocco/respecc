/*
 * Grammar Error Tests
 *
 * These tests check that our grammar will reject programs with various
 * syntax errors.
 */

const syntaxCheck = require('../syntax-checker');

const errors = [

    ['ambiguous statements', 'x = 3x = 3'],
    ['negative power', 'x = -2 ** 3;'],
    ['Bad Block', "Excuse me, if x < 3, could you.. Thank You."],
    ['chained relational operators', '1 < 3 < 5'],
    ['bad strings in print', 'print(Hello World)'],
    ['bad grammar - forgot period', 'Thank You'],
    ['bad grammar - forgot exclamination point', 'You deserve a break'],
    ['unclosed comment', 'x = -2 /*   set X'],
    ['bad grammar - forgot a period', 'Otherwise, if x is equal to 6, could you..'],
    ['bad grammar - forgot two periods', 'Otherwise, if x is equal to 6, could you.'],
    ['bad operator - wrong symbol order', 'x => y'],
    ['bad operator - wrong symbol order', 'x =< y'],
    ['bad grammar - thank you must be capitalized', 'thank you.'],
    ['incorrect syntax - too many spaces', 'Please  populate y with 6.'],
    ['keyword error - if not of', 'of(x = 5)'],
    ['incorrect syntax - need seperate lines', 'Thank you. Farewell'],
    ['bad character in id', '$x := 1'],
    ['bad syntax - && not &', 'a & b'],
];


describe('The syntax checker', () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, (done) => {
      expect(syntaxCheck(program)).toBe(false);
      done();
    });
  });
});
