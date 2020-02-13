# Respecc++

<p align="center">
  <img width="440" height="168" src="https://github.com/jmaiocco/respecc/blob/master/general_images/LogoRev1.png">
</p>

## Brief Description
Respecc++ is a programming language designed to promote good manners and proper etiquette in our degenerate society. Many programmers nowadays view computers as tools rather than partners. When a cryptic error message is shown, programmers mutter curses and ask the compiler, "What the HECK are you doing today...?" Yet nobody ever asks the compiler, "How are you doing today?" We find this state of affairs to be deplorable, and we hope the creation of Respecc++ will improve human-computer interactions for years to come.

Although slightly more verbose than some modern languages, Respecc++ boasts an incredibly readable (and respectful) syntactic structure. Additionally, the compiler keeps track of whether any written program is civil or rude and assigns it a numerical value. Considerate code means that at compile time, everything is hunky-dory. However, if a programmer cuts too many corners with "rude" code, the compiler will remember that, *and we cannot promise anything good will come of making the compiler your enemy.* 

*Created by Luis Garcia, Timothy Herrmann, Joseph Maiocco, Kevin McInerney, Bennett Shingledecker, and Kevin Solis*.

## List of Features

* Two syntax styles: Polite longhand vs Rude shorthand, with the ability to mix and max different syntaxes at will.
* Politeness rating system that gauges your reltionship with the compiler and discourages user from too much code with the rude syntax.
* Features a global function **respecc_score()**, allowing users to find out in real time what their compiler truly thinks of them. 
* Consequences for programmers with low program politeness, decreasing the odds that the compiler will compile code correctly.
* Strong, dynamic typing for ease of use, but also allowing the user to manually impose static type restrictions with manifest typing.
  * Basic type system containing number, string, and boolean primitives, as well as array and dictionary types.
* Standard conditional (if, else if and else) and loop (for, while) statements.
* Recursive functions.
* Anonymous lambda functions and expressions.
* Option to seperate statements with newlines or semicolons, allowing multiple statements on a single line if desired.
* More features on the way as development progresses!


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

Please declare US_Denominations as a Number as [25, 10, 5, 1].

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
let fibonacci = (n) => {
  if (n === 1) {
    return [0, 1];
  } else {
    let series = fibonacci(n - 1);
    series.push(series[series.length - 1] + series[series.length - 2]);
    return series;
  }
}
fibonacci(12);
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
function gcd(firstValue, secondValue) {
  firstValue = Math.abs(firstValue);
  secondValue = Math.abs(secondValue);
  while(secondValue > 0) {
    let temporaryValue = secondValue;
    secondValue = firstValue % secondValue;
    firstValue = temporaryValue;
  }
  return firstValue;
}
gcd(90, 180);
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
function isEvenOrOdd(numericValue) {
  return numericValue % 2 === 0 ? "Even" : "Odd";
}

isEvenOrOdd(43);
```
