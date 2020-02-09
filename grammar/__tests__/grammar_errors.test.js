/*
 * Grammar Error Tests
 *
 * These tests check that our grammar will reject programs with various
 * syntax errors.
 */

const syntaxCheck = require("../syntax-checker");

//Examples from Toal's
//['keyword as id', 'else := 5'],
//['unclosed paren', 'let var x := (2 * 3 in end'],
//['unknown operator', 'x := 2 ** 5'],
//['chained relational operators', '1 < 3 < 5'],
//['unclosed comment', 'x := /*   hello 9'],
//['bad unicode escape', '"ab\\u{1f4%a9}c"'],
//['bad escape', '"ab\\q"'],
//['bad character in id', '$x := 1'],
const errors = [
  //Errors about bad punctuation
  [
    "Bad punctuation in Conditional - missing first comma in if",
    "Excuse me if Yes, could you... Thank You."
  ],
  [
    "Bad punctuation in Conditional - missing second comma in if",
    "Excuse me, if Yes could you... Thank You."
  ],
  [
    "Bad punctuation in Conditional - missing first comma in Otherwise",
    "Excuse me, if Yes, could you... Thank You. Otherwise could you... Thank You."
  ],
  [
    "Bad punctuation in Conditional - missing second comma in Otherwise",
    "Excuse me, if Yes, could you... Thank You. Otherwise, if Yes could you... Thank You."
  ],
  [
    "Bad punctuation in Loop - missing first comma of while",
    "Excuse me while Yes, could you... Thank You."
  ],
  [
    "Bad punctuation in Loop - missing second comma",
    "Excuse me, while Yes could you...Thank You."
  ],
  [
    "Bad punctuation in Block - space inserted before elipses at could you... ",
    "Excuse me, while Yes could you ... Thank You."
  ],
  [
    "Bad punctuation in Block - missing elipses in could you...",
    "Excuse me, while Yes, could you Thank You."
  ],
  [
    "Bad punctuation in Block - partially missing elipses in could you...",
    "Excuse me, if x < 3, could you.. Thank You."
  ],
  [
    "Bad punctuation in Block - partially missing elipses in could you...",
    "Excuse me, if x < 3, could you.. Thank You."
  ],
  [
    "Bad punctuation in Blocks - exclaims Thank You like greeting",
    "Excuse me while Yes, could you... Thank You!"
  ],
  [
    "Bad punctuation in Blocks - missing period at Thank You.",
    "Excuse me while Yes, could you... Thank You"
  ],
  ["Bad punctuation in VarDec - missing period", "Please declare i as 3"],
  [
    "Bad punctuation in Assignment - missing period",
    "Please populate i with 4"
  ],

  [("ambiguous statements", "x = 3x = 3")],
  ["negative power", "x = -2 ** 3;"],
  ["Bad Block", "Excuse me, if x < 3, could you.. Thank You."],
  ["chained relational operators", "1 < 3 < 5"],
  ["bad strings in print", "print(Hello World)"],
  ["bad index - float", "a = a[1.1] "],
  ["bad index - bool", "a = a[Yes] "],
  //new ones, adding more
  ["bad index - negative", "a[-1]"],
  ["bad grammar - forgot exclamination point", "You deserve a break"],
  ["bad grammar - forgot ;", "break"],
  ["unclosed comment", "x = -2 /*   set X"],

  //covered twice
  // [
  //   "bad grammar - forgot a period",
  //   "Otherwise, if x is equal to 6, could you.."
  // ],
  // [
  //   "bad grammar - forgot two periods",
  //   "Otherwise, if x is equal to 6, could you."
  // ],
  ["bad operator - wrong symbol order", "x => y"],
  ["bad operator - wrong symbol order", "x =< y"],
  ["bad grammar - thank you must be capitalized", "thank you."],
  ["incorrect syntax - too many spaces", "Please  populate y with 6."],
  ["keyword error - if not of, of(x = 5)"],
  ["incorrect syntax - need seperate lines", "Thank you. Farewell"],
  ["bad character in id", "$x := 1"],
  ["bad syntax - && not &", "a & b"],
  ['bad syntax - missing closing parentheses', 'print(x'],
  ['bad syntax - missing beginning parenthese','printx)'],
  ['bad syntax - missing comma ', '(x y)'],
  ['incorrect wording - Use Yes ', 'true'],
  ['incorrect wording - Use No ', 'false'],
  ['bad syntax - missing closing bracket', '{test'],
  ['bad syntax - missing opening bracket', 'test}'],
  ['bad syntax - use "" instead of ''', "'insertString'"],
  ['bad syntax - use "" instead of ``', '`insertString`'],
  ['incorrect usage - all inputs must be of same type', '{1, "string", 3}'],
  ['bad index - incorrect character', 'a = a[^] '],
];

describe("The syntax checker", () => {
  errors.forEach(([scenario, program]) => {
    test(`detects the error ${scenario}`, done => {
      expect(syntaxCheck(program)).toBe(false);
      done();
    });
  });
});
