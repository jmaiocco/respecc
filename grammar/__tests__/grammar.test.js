/*
 * Grammar Success Test
 *
 * These tests check that our grammar accepts a program that features all of
 * syntactic forms of the language.
 */

const syntaxCheck = require("../syntax-checker");

const politeChangemaker = String.raw`
Hello!

Please declare US_Denominations as a Number as [25, 10, 5, 1].

Favor MakeChange(amount) could you...
  Excuse me, if (amount is less than 0), could you...
    Do me a favor and run print with ("Error").
    Kindly return -1
  Thank You.
  Please declare result as a Array<Number>.
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
  `;

const politeFibonacci = String.raw`
Salutations!

Favor Fibonacci(n: Number, length: Number) could you...
  Excuse me, if (n is equal to 1), could you...
    Please declare series as [0, 1].
    Kindly return series
  Thank You.
  Otherwise, could you...
    Please populate series with Fibonacci(n minus 1, length minus 1).
    Please populate series[length] with (series[length minus 1] plus series[length minus 2]).
    Kindly return series
  Thank You.
Thank You.

Do me a favor and run Fibonacci with (12, 12).
Farewell!
`;

const politeGCD = String.raw`
Hey!

Favor GCD(firstValue: Number, secondValue: Number) could you...
  Excuse me, if (firstValue is less than 0), could you...
    Please populate firstValue with (0 - firstValue).
  Thank You.
  Excuse me, if (secondValue is less than 0), could you...
    Please populate secondValue with (0 - secondValue).
  Thank You.
  Excuse me, while (secondValue is greater than 0), could you...
    Please declare temporaryValue as secondValue.
    Please populate secondValue with firstValue modded with secondValue.
    Please populate firstValue with temporaryValue.
  Thank You.
  Kindly return firstValue.
Thank You.

Do me a favor and run GCD with (90, 180).

Bye Bye!
`;

const politeIsPrime = String.raw`
Hi There!
Favor isPrime(num) could you...
 Excuse me, if (num is less than or equal to 1), could you...
    Kindly return Yes
  Thank You.
  Otherwise, if (num is less than or equal to 3), could you...
    Kindly return Yes
  Thank You.
  Otherwise, if (num%2 is equal to 0  or (num%3 is equal to 0)), could you...
    Kindly return No
  Thank You.

  Please declare i as 5.
  Excuse me, while i*i is less than or equal to 0 or ( num%(i+2) is equal to 0 ), could you...
    Kindly return Yes
  Thank You.
  i = i + 6
  Kindly return No
Thank You.
Farewell!

`;

const politePseudoRandom = String.raw`
Hey!
//Generate pseudorandom number
Please declare a as 1103515245.
Please declare m as 2 raised to the power of 31.
Please declare c as 12345.
Please declare x as 4.

Favor linearCongruentialGenerator() could you...
  Excuse me, if x is less than or equal to 0 and x is less than m, could you...
    Please populate x with (a times x plus c) modded with m.
    Kindly return x
  Thank You.
  Kindly return "invalid input"
Thank You.

Do me a favor and run linearCongruentialGenerator.

Bye Bye!
`;
const politeTilingCount = String.raw`
//Number of ways for tiling a 3*n board with 2*1 domino tiles
Salutations!
Favor countWays(n) could you...
  Please declare a as [1,0].
  Please declare b as [0,1].
  Please declare i as 2.
  Excuse me, while i is less than (n plus 1), could you...
    Please populate a[i] with a[i minus 2]+2 times b[i minus 1].
    Please populate b[i] with a[i minus 1] +b[i minus 2].
    Please populate i with i plus 1.
  Kindly return a[n].
  Thank You.
Thank You.
Godspeed!
`;

const politeBubbleSort = String.raw`
Hello!
Please declare numbers as [1,3,4,5,28,3].
Favor bubbleSort(comparator, arr, arrlen) could you...
	Please declare i as 0.
    Excuse me, while i is less than arrlen minus 1, could you...
      Please declare j as 0.
      Excuse me, while j is less than arrlen minus i minus 1, could you...
        Excuse me, if (comparator(arr[j],arr[j plus 1]) is greater than 0), could you...
      	  Please declare temp as arr[j].
          Please populate arr[j] with arr[j plus 1].
          Please populate arr[j plus 1] with temp.
        Please populate j with j plus 1.
        Thank You.
      Thank You.
      Please populate i with i plus 1.
    Thank You.
    Kindly return arr.
Thank You.
Do me a favor and run bubbleSort with((a,b)->(a-b),numbers,6).
Godspeed!
`;

describe("The (polite) syntax checker", () => {
  test("accepts sample changemaker in polite form", done => {
    expect(syntaxCheck(politeChangemaker)).toBe(true);
    done();
  });

  test("accepts sample fibonnacci function in polite form", done => {
    expect(syntaxCheck(politeFibonacci)).toBe(true);
    done();
  });

  test("accepts sample GCD program in polite form", done => {
    expect(syntaxCheck(politeGCD)).toBe(true);
    done();
  });
  test("accepts sample prime checker in polite form", done => {
    expect(syntaxCheck(politeIsPrime)).toBe(true);
    done();
  });
  test("accepts sample PseudoRandom number generator in polite form", done => {
    expect(syntaxCheck(politePseudoRandom)).toBe(true);
    done();
  });
  test("accept sample tiling configuration program in polite form", done => {
    expect(syntaxCheck(politeTilingCount)).toBe(true);
    done();
  });
  test("accepts sample BubbleSort program in polite form", done => {
    expect(syntaxCheck(politeBubbleSort)).toBe(true);
    done();
  });
});

//Rude Forms of Programs
const rudeChangemaker = String.raw`
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
`;

const rudeFibonacci = String.raw`
function Fibonacci(n, length) {
  if (n == 1) {
    gimme series = [0, 1]
    return series
  } else {
    series = Fibonacci(n - 1, length - 1)
    series[length] = series[length minus 1] plus series[length minus 2]
    return series
  }
}

Fibonacci(12, 12)
`;

const rudeGCD = String.raw`
function GCD(firstValue, secondValue) {
  if (firstValue < 0) {
    firstValue = (0 - firstValue)
  }
  if (secondValue < 0) {
    secondValue = (0 - secondValue)
  }
  while (secondValue > 0) {
    gimme temporaryValue = secondValue
    secondValue = firstValue % secondValue
    firstValue = temporaryValue
  }
  return firstValue
}

GCD(90, 180)
`;

const rudeIsPrime = String.raw`
function isPrime (num) {
  if (num <= 1) {
    return Yes
  } else if (num <= 3) {
    return Yes
  } else if (num%2 == 0 || num%3 == 0) {
    return No
  }

  gimme i = 5
  while (i*i <= num) {
    if (num%i == 0 || num%(i+2) == 0) {
      return false
    }
    i = i+6
  }
  return Yes
}

`;

const rudePseudoRandom = String.raw`
//Generates pseudorandom number
gimme a = 1103515245
gimme m = 2**31
gimme c = 12345
gimme x = 4

function linearCongruentialGenerator(){

  if (x>=0 && x< m){
    x= (a* x + c) % m;
    return  x
  }
  return "invalid input"
}

linearCongruentialGenerator()
`;
const rudeTilingCount = String.raw`
//Number of ways for tiling a 3*n board with 2*1 domino tiles
function countWays(n) {
  gimme a = [1,0]
  gimme b = [0,1]
  for(gimme i=2; i <n+1;i++){
    a[i] = a[i-2]+2*b[i-1]
    b[i] = a[i-1]+b[i-2]
  }
  return a[n]
}
`;

const rudeBubbleSort = String.raw`
gimme numbers = [1,3,4,5,28,3]

function bubbleSort(comparator, arr, arrlen) {
	for(gimme i=0;i<arrlen-1;i++){
      for(gimme j=0;j<arrlen-i-1;j++){
        if(comparator(arr[j],arr[j+1]) > 0){
          gimme temp = arr[j]
          arr[j] = arr[j+1]
          arr[j+1] = temp
        }
      }
    }
    return arr
}

bubbleSort((a,b)->(a-b),numbers,6)
`;
describe("The (rude) syntax checker", () => {
  test("accepts sample changemaker in rude form", done => {
    expect(syntaxCheck(rudeChangemaker)).toBe(true);
    done();
  });
  test("accepts sample Fibonacci function in rude form", done => {
    expect(syntaxCheck(rudeFibonacci)).toBe(true);
    done();
  });
  test("accepts sample GCD function in rude form", done => {
    expect(syntaxCheck(rudeGCD)).toBe(true);
    done();
  });
  test("accepts sample prime checker in rude form", done => {
    expect(syntaxCheck(rudeIsPrime)).toBe(true);
    done();
  });
  test("accepts sample pseudorandom number generator in rude form", done => {
    expect(syntaxCheck(rudePseudoRandom)).toBe(true);
    done();
  });
  test("accepts sample tiling configuration counter in rude form", done => {
    expect(syntaxCheck(rudeTilingCount)).toBe(true);
    done();
  });
  test("accepts sample BubbleSort program in rude form", done => {
    expect(syntaxCheck(rudeBubbleSort)).toBe(true);
    done();
  });
});
