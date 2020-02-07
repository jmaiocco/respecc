# Respecc++

<p align="center">
  <img width="440" height="168" src="https://github.com/jmaiocco/respecc/blob/master/general_images/LogoRev1.png">
</p>

## Brief Description
Respecc++ is a programming language designed to promote good manners and proper etiquette in our degenerate society. Many programmers nowadays view computers as tools rather than partners. When a cryptic error message is shown, programmers mutter curses and ask the compiler, "What the HECK are you doing today...?" Yet nobody ever asks the compiler, "How are you doing today?" We find this state of affairs to be deplorable, and we hope the creation of Respecc++ will improve human-computer interactions for years to come.

Although slightly more verbose than some modern languages, Respecc++ boasts an incredibly readable (and respectful) syntactic structure. Additionally, the compiler keeps track of whether any written program is civil or rude and assigns it a numerical value. Considerate code means that at compile time, everything is hunky-dory. However, if a programmer cuts too many corners with "rude" code, the compiler will remember that, *and we cannot promise anything good will come of making the compiler your enemy.* 

*Created by Luis Garcia, Timothy Herrmann, Joseph Maiocco, Kevin McInerney, Bennett Shingledecker, and Kevin Solis*

## List of Features

## Example Programs

### Hello World
```
/*****************                                        /*****************
Respecc++ (Polite)                                        Respecc++ (Rude)                              
******************/                                       ******************/                          
Hello!                                                    print("Hello world!")                       
Do me a favor and run print with ("Hello world!")
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
Please declare i as a Number as 0.                            print(i) 
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
    Please declare result as a Number[].
    Please populate remaining with amount.
    Please populate i with 0.
    Excuse me, while i is less than 4, could you...
        Please populate result[ i ] with remaining / US_Denominations[ i ].
        Please populate remaining with remaining modded with US_Denominations[ i ].
        i++
    Thank You.
    Kindly return result
Thank You.

Please populate exampleAmount with 105.
Do me a favor and run MakeChange with (exampleAmount).

Bye Bye!

/*****************
Respecc++ (Rude) 
******************/

gimme US_Denominations = [25, 10, 5, 1]

function MakeChange(amount) {
    if (amount < 0) {
        print("Error")
        return -1
    }
    result = []
    remaining = amount
    i = 0
    while ( i < 4 ) {
        result[ i ] = remaining / US_Denominations[ i ]
        remaining= remaining % US_Denominations[ i ]
        i++
    }
    return result
}
exampleAmount = 105
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
};
let exampleAmount = 105;
makeChange(exampleAmount);
```
