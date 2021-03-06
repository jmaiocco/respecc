# Respecc++

<p align="center">
  <img width="440" height="168" src="https://github.com/jmaiocco/respecc/blob/master/general_images/LogoRev1.png">
</p>

**Tired of reading bland README.me files? Visit our website! https://jmaiocco.github.io/respecc/**

## Brief Description
Respecc++ is a programming language designed to promote good manners and proper etiquette in our degenerate society. Many programmers nowadays view computers as tools rather than partners. When a cryptic error message is shown, programmers mutter curses and ask the compiler, "What the HECK are you doing today...?" Yet nobody ever asks the compiler, "How are you doing today?" We find this state of affairs to be deplorable, and we hope the creation of Respecc++ will improve human-computer interactions for years to come.

Although slightly more verbose than some modern languages, Respecc++ boasts an incredibly readable (and respectful) syntactic structure. Additionally, the compiler keeps track of whether any written program is civil or rude and assigns it a numerical value. Considerate code means that at compile time, everything is hunky-dory. However, if a programmer cuts too many corners with "rude" code, the compiler will remember that, *and we cannot promise anything good will come of making the compiler your enemy.* 

*Created by Luis Garcia, Timothy Herrmann, Joseph Maiocco, Kevin McInerney, Bennett Shingledecker, and Kevin Solis*.

## Features

* Two syntax styles: Polite (longhand) vs Rude (shorthand), with the ability to mix and match different syntaxes at will.
* Politeness rating system that gauges your relationship with the compiler and discourages users from coding too much with the rude syntax.
* Features a global function **respecc_score()** that lets users find out in real time what their compiler truly thinks of them. 
* Consequences for programmers with low program politeness, decreasing the odds that the compiler will compile code correctly.
* Strong, dynamic typing for ease of use, but also allowing the user to manually impose static type restrictions with manifest typing.
  * Basic type system containing number, string, and boolean primitives, as well as array and dictionary types.
* Standard conditional (if, else if and else) and loop (for, while) statements.
* Recursive functions.
* Anonymous lambda functions and expressions.
* Option to seperate statements with newlines or semicolons, allowing multiple statements on a single line if desired.
* More features on the way as development progresses!

## Static Semantic Rules 
* Identifiers must be declared before they are used. 
* Identifiers cannot be redeclared within the same scope. 
* break statements may only appear in loops. 
* return statements may only appear in functions. 
* Subscripted identifiers must refer to arrays or dictionaries.
* Arrays can only be accessed with Number subscripts. 
* Functions must be defined before they are called. 
* Functions must return values of the same type with which they are defined. 
* Arguments passed to a function must match the number, typing and ordering of the parameters of that function. 
* Arguments passed to an instance of a class must match the number, typing and ordering of the parameters/fields of the class constructor. 

## Code Optimizations
* Optimizes binary numerical operations.
* Optimizes variable assignments to self.
* Code after return statement is not generated.
* Code after break statement is not generated.
* Functions that are not called are not generated.

## Example Programs

### Hello World
```
/*****************                                        /*****************
Respecc++ (Polite)                                        Respecc++ (Rude)                              
******************/                                       ******************/                          
Hello!                                                    print("Hello world!")                       
Do me a favor and run print with ("Hello world!").
Bye Bye! 

/*****************
JavaScript 
******************/
console.log("Hello world!")
```
### Basic for-loop functionality

```
/*****************                                        /*****************
Respecc++ (Polite)                                        Respecc++ (Rude)                            
******************/                                       ******************/                   
Salutations!                                              for (gimme i = 0; i < 10; i++) {                        
Please declare i as a Number as 0.                          print(i) 
Excuse me, while i is less than 10, could you...          }
  Do me a favor and run print with (i).
Thank You.
Bye Bye!

/*****************
JavaScript 
******************/
for(let i=0; i < 10; i++) {
  console.log(i);
}
```

### Changemaker

```
/*****************
Respecc++ (Polite) 
******************/
Hello!

Please declare US_Denominations as a Array<Number> as [25, 10, 5, 1].

Favor MakeChange(amount) could you...
  Excuse me, if (amount is less than 0), could you...
    Do me a favor and run print with ("Error").
    Kindly return -1
  Thank You.
  Please declare result as a Array<Number>.
  Please declare remaining as a Number as amount.
  Please declare i as a Number as 0.
  Excuse me, while i is less than 4, could you...
    Please populate result[ i ] with remaining / US_Denominations[ i ].
    Please populate remaining with remaining modded with US_Denominations[ i ].
    i++
  Thank You.
  Kindly return result
Thank You.

Please declare exampleAmount as a Number as 105.
Do me a favor and run MakeChange with (exampleAmount).

Bye Bye!

/*****************
Respecc++ (Rude) 
******************/
gimme US_Denominations: Array<Number> = [25, 10, 5, 1]

function MakeChange(amount) {
  if (amount < 0) {
    print("Error")
    return -1
  }
  gimme result: Array<Number> = []
  gimme remaining = amount
  gimme i = 0
  while ( i < 4 ) {
    result[ i ] = remaining / US_Denominations[ i ]
    remaining = remaining % US_Denominations[ i ]
    i++
  }
  return result
}
gimme exampleAmount = 105
MakeChange(exampleAmount)

/*****************
JavaScript 
*****************/
let makeChange = (amount) => {
  if (amount < 0) {
    throw new RangeError('amount cannot be negative');
  }
  const result = [];
  let remaining = amount;
  [25, 10, 5, 1].forEach((value) => {
    result.push(Math.floor(remaining / value));
    remaining %= value;
  });
  return result;
}
let exampleAmount = 105;
makeChange(exampleAmount);
```

### Fibonacci Number Sequence
```
/*****************
Respecc++ (Polite) 
******************/
Salutations!

Favor Fibonacci(n: Number, length: Number) could you... 
  Excuse me, if (n is equal to 1), could you...
    Please declare series as a Array<Number> as [0, 1].
    Kindly return series.
  Thank You.
  Otherwise, could you...
    Please declare series as a Array<Number> as the result of running Fibonacci with (n minus 1, length minus 1).
    Please populate series[length] with (series[length minus 1] plus series[length minus 2]).
    Kindly return series.
  Thank You.
Thank You.

Do me a favor and run Fibonacci with (12, 12).
Farewell!

/*****************
Respecc++ (Rude) 
******************/
function Fibonacci(n, length) { 
  if (n == 1) {
    gimme series = [0, 1]
    return series
  } else {
    gimmme series = Fibonacci(n - 1, length - 1)
    series[length] = series[length - 1] + series[length - 2]
    return series
  }
}

Fibonacci(12, 12)


/*****************
JavaScript 
*****************/
function Fibonacci(n, length) {
  if ((n === 1)) {
    let series = [0, 1];
    return series
  } else {
    let series = Fibonacci((n - 1), (length - 1));
    series[length] = (series[(length - 1)] + series[(length - 2)]);
    return series
  }
};
Fibonacci(12,12)
```


### Greatest Common Divisor (GCD)
```
/*****************
Respecc++ (Polite) 
******************/
Hey!

Favor GCD(firstValue: Number, secondValue: Number) could you...
  Excuse me, if (firstValue is less than 0), could you...
    Please populate firstValue with  -firstValue.
  Thank You.
  Excuse me, if (secondValue is less than 0), could you...
    Please populate secondValue with -secondValue.
  Thank You.
   Please declare temporaryValue as a Number.
  Excuse me, while (secondValue is greater than 0), could you...
    Please populate temporaryValue with secondValue.
    Please populate secondValue with firstValue modded with secondValue.
    Please populate firstValue with temporaryValue.
  Thank You.
  Kindly return firstValue
Thank You.

Do me a favor and run GCD with (90, 180).

Bye Bye!

/*****************
Respecc++ (Rude) 
******************/
function GCD(firstValue, secondValue) {
  if (firstValue < 0) {
    firstValue = -firstValue
  }
  if (secondValue < 0) {
    secondValue = -secondValue
  }
  gimme temporaryValue = 0
  while (secondValue > 0) {
    temporaryValue = secondValue
    secondValue = firstValue % secondValue
    firstValue = temporaryValue
  }
  return firstValue
}


GCD(90, 180)

/*****************
JavaScript 
*****************/
function GCD(firstValue, secondValue) {
  if ((firstValue < 0)) {
    firstValue = -firstValue
  };
  if ((secondValue < 0)) {
    secondValue = -secondValue
  };
  let temporaryValue = 0;
  while ((secondValue > 0)) {
    temporaryValue = secondValue;
    secondValue = (firstValue % secondValue);
    firstValue = temporaryValue
  };
  return firstValue
}
```

### IsEvenOrOdd
```
/*****************
Respecc++ (Polite) 
******************/
Hey!

Favor IsEvenOrOdd(numericValue: Number) could you...
  Kindly return numericValue modded with 2 is equal to 0 ? "Even" : "Odd"
Thank You.

Do me a favor and run IsEvenOrOdd with (43).

Farewell!

/*****************
Respecc++ (Rude) 
******************/
function IsEvenOrOdd(numericValue) {
  return numericValue % 2 == 0 ? "Even" : "Odd"
}

IsEvenOrOdd(43)

/*****************
JavaScript 
*****************/
function IsEvenOrOdd(numericValue) {
  return (((numericValue % 2) === 0) ? "Even" : "Odd")
};
IsEvenOrOdd(43)
```

## Language Grammar Specification in Ohm
```
respecc {
  Program      = br* greeting? br* Statement (br+ Statement)* br* farewell? br*
  Statement    = Assignment
               | Declaration
               | Conditional
               | Loop
               | FuncCallStmt
               | SimpleStmt
  SimpleStmt   = "return" Exp? "."?                              -- return_impolite
               | "Kindly return" Exp? "."?                       -- return_polite
               | "break"                                         -- break_impolite
               | "You deserve a break!"                          -- break_polite
  Conditional  = "if" "(" Exp ")" Block
                 (br* "else if" "(" Exp ")" Block)*
                 (br* "else" Block)?                             -- if_impolite
               | "Excuse me, if " Exp "," Block
                 (br* "Otherwise, if " Exp "," Block)*
                 (br* "Otherwise," Block)?                       -- if_polite
  Loop         = "while" "(" Exp ")" Block                       -- while_impolite
               | "for"  "(" (VarDec)? ";" Exp?
                 ";" Assignment? ")" Block                       -- for_impolite
               | "Excuse me, while " Exp "," Block               -- while_polite
  FuncCallStmt = Var Args                                         -- call_impolite
               | "Do me a favor and run " Var
                 ("with" Args)? "."                              -- call_polite
  FuncCallExp  = Var Args                                         -- call_impolite
               | "the result of running" Var
                 ("with" Args  )?                                -- call_polite
  Assignment   = Var "=" Exp                                     -- impolite
               | Increment
               | "Please populate " Var "with " Exp "."          -- polite
  Declaration  = VarDec | FuncDec | ClassDec
  ClassDec     = "class" id ClassBlock                           -- impolite
               | "Have you ever heard of a"  id "?" ClassBlock   -- polite
  ClassBlock   = br* "{" br* ClassMember?
                 (br+ ClassMember)* br* "}"                      -- impolite
               | br* "Let's get classy..." br* ClassMember?
                 (br+ ClassMember)* br* "Thank You."             -- polite
  ClassMember  = Constructor | VarDec | FuncDec
  Constructor  =  id  Params  Block                              -- impolite
               |  "To construct a" id "by using" Params
                  "," Block                                      -- polite
  Type         =  "Array" "<"Type">"                             -- array
               |  "Dict" "<"Type","Type">"                       -- dict
               |  primtype
               |  id
  FuncDec      = "Favor" id Params
                  (("as a "|":") (Type|"Void"))? Block           -- polite
               | "function" id Params
                  (("as a "|":") (Type|"Void"))? Block           -- impolite
  VarDec       = "Please declare " id
                 (("as a "|":") Type)? ("as " Exp)? "."?         -- polite
               | "gimme" id (("as a "|":") Type)? ("=" Exp)?     -- impolite
  Params       = "(" ListOf<Param, ","> ")"
  Param        = id ((":"|"as a") Type)?
  Args         = "(" ListOf<Exp, ","> ")"
  Block        =  "could you..."  br* Statement?
                  (br+ Statement)* br* "Thank You."              -- polite
               |  "{"  br* Statement? (br+ Statement)* br* "}"   -- impolite
  Exp          =  Exp1 "?" Exp1 ":" Exp                          -- ternary
               |  Exp1
  Exp1         =  Params "->" Block                              -- lambda_blk
               |  Params "->" Exp2                               -- lambda_exp
               |  Exp2
  Exp2         =  Exp2 orop Exp3                                 -- binary
               |  Exp3
  Exp3         =  Exp3 andop Exp4                                -- binary
               |  Exp4
  Exp4         =  Exp5 relop Exp5                                -- binary
               |  Exp5
  Exp5         =  Exp5 addop Exp6                                -- binary
               |  Exp6
  Exp6         =  Exp6 mulop Exp7                                -- binary
               |  Exp7
  Exp7         =  prefixop Exp9                                  -- prefix
               |  Exp8
  Exp8         =  Exp9 expoop Exp8                               -- binary
               |  "-" Exp9                                       -- negate
               |  Exp9
  Exp9         =  Literal
               |  FuncCallExp
               |  Var
               |  "(" Exp ")"                                    -- parens
  Increment    =  incop Var                                      -- prefix
               |  Var incop                                      -- postfix
  Var          =  Var "[" Exp "]"                                -- subscript
               |  Var "." id                                     -- select
               |  id                                             -- id
  Literal      = ArrayLit
               | DictLit
               | numlit
               | stringlit
               | boollit
               | nulllit
  ArrayLit     = "[" ListOf<Exp, ",">"]"
  DictLit      = "{" ListOf<DictEntry, ","> "}"
  DictEntry    = Exp ":" Exp
  keyword      =  ("Boolean" | "if" | "break" | "else" | "int"
               |  "for" | "and" | "return" | "Number" | "plus"
               |  "null" | "while" | "true" | "String"
               |  "or" | "Yes" | "No" | "minus" | "times" | "not"
               |  "Favor" | "function" | "gimme" | "respecc_score"
               |  "class" | "Null" | "Void") ~idrest
  id           = ~keyword letter idrest*
  idrest       = letter | digit | "_"
  boollit      = "Yes" | "No"
  intlit       = digit+
  numlit       = digit+ ("." digit+)?
  nulllit      = "Null"
  stringlit    = "\"" char* "\"" | "\'" char* "\'"
  char         = ~"\\" ~"\"" ~"\n" any | escape
  escape       = "\\" ("\\" | "\"" | "n" | "t" | codepoint)
  codepoint    = "u{" hexDigit+ "}"
  andop        = "&&" | "and"
  orop         = "||" | "or"
  mulop        = "*" | "/" | "%" | "times" | "divided by" | "modded with"
  addop        = "+" | "-" | "plus" | "minus"
  expoop       = "**" | "raised to the power of"
  relop        = "<=" | "<" | ">=" | ">" | "==" | "!="  | "is less than or equal to"
               | "is greater than or equal to" | "is less than" | "is greater than"
               | "is equal to" | "is not equal to"
  incop        =  "++" | "--"
  prefixop     =  ~"--" "-" | "!" | "not"
  primtype     =  "Boolean" | "Number" | "String"
  space        := comment | " " | "\t" | "\r"
  comment      = "/*" (~"*/" any)* "*/"
               | "//" (~"\n" any)* ("\n")?
               | "BTW..." (~"\n" any)* ("\n")?
               | "By the way..." (~"\n" any)* ("\n")?
  br           =  "\n"
  greeting     = "Hello!" | "Hey!" | "Hi There!" | "Salutations!"
  farewell     = "Bye Bye!" | "Farewell!" | "Godspeed!"
}
```

## Casual Presentation Slides (4/30/2020)

<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide0.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide1.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide2.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide3.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide4.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide5.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide6.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide7.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide8.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide9.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide10.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide11.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide12.png">
</p>
<p align="center">
  <img width="480" height="240" src="https://github.com/jmaiocco/respecc/blob/master/general_images/slide13.png">
</p>

