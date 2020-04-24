/*
 * JavaScript Code Generator Tests
 *
 * These tests check that the JavaScript generator produces the target
 * JavaScript that we expect.
 */

const parse = require("../../ast/parser");
const analyze = require("../../semantics/analyzer");
const generate = require("../javascript-generator");

function stripped(s) {
  if (typeof s === "string") {
    return s.replace(/\s+/g, "").replace(/_\d+/g, "");
  }
  return s;
}

//Penalties NEVER Occur
const noPenaltyFixture = {
  hello: [String.raw`print("Hello")`, 'console.log   ("Hello")'],
  oneVar: [String.raw`gimme x = 1`, "let x_1 = 1"],
  forLoopWithBreak: [
    String.raw`for (gimme i = 0; i < 10; i++) { break }`,
    String.raw`for (let i = 0; (i < 10); i++) { break }`
  ],
  ternaryExp: [
    String.raw`gimme trn = Yes ? 1 : 2`,
    String.raw`let trn = (true ? 1 : 2)`
  ],
  null: [String.raw`gimme nl = Null`, String.raw`let nl = null`],
  lambdaBlock: [
    String.raw`
      gimme doggos = () -> {return "doggos"}
    `,
    String.raw`
      let doggos = (() => {return "doggos"})
    `
  ],
  lambdaBlockParams: [
    String.raw`
      gimme moreDoggos = (doggos2) -> {return doggos2}
    `,
    String.raw`
      let moreDoggos = ((doggos2) => {return doggos2})
    `
  ],
  lambdaBlockNoReturn: [
    String.raw`
      gimme sad = () -> {return}
    `,
    String.raw`
      let sad = (() => {return})
    `
  ],
  lambdaExp: [
    String.raw`
      gimme evenMoreDoggos = () -> "MORE DOGGOS"
    `,
    String.raw`
      let evenMoreDoggos = (() => "MORE DOGGOS")
    `
  ],
  lambdaExpParams: [
    String.raw`
      gimme tooManyDoggos = (doggos3) -> doggos3
    `,
    String.raw`
      let tooManyDoggos = ((doggos3) => doggos3)
    `
  ],
  conditional: [
    String.raw`
      gimme z:Number = 3
      if(z == 0) {
        z = z + 1
      } else if(z == 1) {
        z = z + 2
      } else if(z == 2) {
        z = z + 3
      } else {
        z = z * z
      }
    `,
    String.raw`
      let z = 3;
      if((z === 0)) {
        z = (z + 1)
      } else if((z === 1)) {
        z = (z + 2)
      } else if((z === 2)) {
        z = (z + 3)
      } else {
        z = (z * z)
      }
    `
  ],
  changeMaker: [
    String.raw`Hello!
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
          Please populate result[ i ] with roundDown(remaining / US_Denominations[ i ]).
          Please populate remaining with roundDown(remaining modded with US_Denominations[ i ]).
          i++
        Thank You.
        Kindly return result
      Thank You.
      Please declare exampleAmount as a Number as 105.
      Do me a favor and run MakeChange with (exampleAmount).
      Bye Bye!`,
    String.raw`let US_Denominations_1 = [25, 10, 5, 1];
        function MakeChange_2(amount_3) {
          if ((amount_3 < 0)) {
            console.log("Error");
            return -1
          };
          let result_4 = [];
          let remaining_5 = amount_3;
          let i_6 = 0;
          while ((i_6 < 4)) {
            result_4[i_6] = Math.floor((remaining_5 / US_Denominations_1[i_6]));
            remaining_5 = Math.floor((remaining_5 % US_Denominations_1[i_6]));
            i_6++
          };
          return result_4
        };
        let exampleAmount_7 = 105;
        MakeChange_2(exampleAmount_7)`
  ],

  dogClass: [
    String.raw`Hello!
        Have you ever heard of a Dog? Let's get classy...
        Please declare name as a String.
        To construct a Dog by using (name as a String), could you...
          Please populate this.name with name.
        Thank You.
        Favor getName() as a String could you...
          Kindly return this.name
        Thank You.

      Thank You.
      Please declare cc as Dog("cece")
      print(cc.getName())
      Bye Bye!`,
    String.raw`class Dog_1 {
    name_2;
    getName_3() {
      return this.name_2
    }
    constructor(..._) {
      if (_.length === 1) {
        let name_4 = _[0];
        this.name_2 = name_4
      }
    }
  };
  let cc_5 = new Dog_1("cece");
  console.log(cc_5.getName_3())`
  ],
  countryClass: [
    String.raw`class Country{
      gimme statePopulations : Dict<String, Number>
      gimme states  : Array<String>

      Country(states:Array<String>, pops:Dict<String,Number>){
        this.states = states
        this.statePopulations = pops
      }
    }
    gimme calexit = Country(["The Bay", "NorCal", "SoCal"], {"Wales":200,"London":500,"Stratford-Upon-Avon":2})
  `,
    String.raw`class Country_13 {
        statePopulations_14 = {};
        states_15 = []
        constructor(..._) {
          if (_.length === 2) {
            let states_16 = _[0];
            let pops_17 = _[1];
            this.states_15 = states_16;
            this.statePopulations_14 = pops_17
          }
        }
      };
      let calexit_18 = new Country_13(["The Bay", "NorCal", "SoCal"], {
        "Wales": 200,
        "London": 500,
        "Stratford-Upon-Avon": 2
      })`
  ],
  fibonacci: [
    String.raw`
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
    `,
    String.raw`
      function Fibonacci(n, length) {
        if ((n === 1)) {
          let series = [0, 1];
          return series
        } else {
          let series = Fibonacci((n - 1), (length - 1));
          series[length] = (series[(length - 1)] + series[(length - 2)]);
          return series
        }
      }
    `
  ],
  gcd: [
    String.raw`
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
    `,
    String.raw`
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
    `
  ],
  isEvenOrOdd: [
    String.raw`
      Hey!

      Favor IsEvenOrOdd(numericValue: Number) could you...
        Kindly return numericValue modded with 2 is equal to 0 ? "Even" : "Odd"
      Thank You.

      Do me a favor and run IsEvenOrOdd with (43).

      Farewell!
    `,
    String.raw`
      function IsEvenOrOdd(numericValue) {
        return (((numericValue % 2) === 0) ? "Even" : "Odd")
      };
      IsEvenOrOdd(43)
    `
  ],
  builtins: [
    String.raw`
      Hello!
      respecc()
      Please declare word as a String as "lengthtest".
      print(word.length())
      Please declare rdup as a Number as 22.55.
      Please declare rddn as a Number as 22.55.
      rdup = roundUp(rdup)
      rddn = roundDown(rddn)
      Please declare abs as a Number as -999.
      abs = absoluteVal(abs)
      Please declare dog as a String as "dog".
      Please declare house as a String as "house".
      Please declare doghouse as a String as concatenate(dog, house).

      Bye Bye!
    `,
    String.raw`
      (() => 56)();
      let word = "lengthtest";
      console.log(word.length);
      let rdup = 22.55;
      let rddn = 22.55;
      rdup = Math.ceil(rdup);
      rddn = Math.floor(rddn);
      let abs = -999;
      abs = Math.abs(abs);
      let dog = "dog";
      let house = "house";
      let doghouse = dog.concat(house)
    `
  ]
};

//Penalties ALWAYS Occur
const penaltyFixture = {
  allPenaltiesActive: [
    String.raw`
      gimme pn1: Number = 1234
      gimme pn2: Boolean = Yes
      gimme pn3: Boolean = No
      gimme pn4: String = "Is this gonna reverse? Probably"
    `,
    /letpn1=\"(?!1234)(\d)+\";letpn2=false;letpn3=true;letpn4=\"ylbaborP\?esreverannogsihtsI\"/
  ]
};

//Penalties RANDOMLY Occur
const regularFixture = {
  angelic: [
    String.raw`
      Salutations!

      Favor MakeDonation(amount:Number) could you...
        Please declare charityFunds as a Number as 0.
        Please populate charityFunds with amount.
        Kindly return charityFunds.
      Thank You.

      Please declare personalMoney as a Number as 100000.00.
      Do me a favor and run print with ("You had $" plus personalMoney).
      Please declare donation as a Number as 0.
      Please populate donation with personalMoney.
      Please populate personalMoney with personalMoney minus donation.
      Please declare newCharityFunds as a Number as the result of running MakeDonation with (donation).
      Do me a favor and run print with ("The charity now has $" plus newCharityFunds).
      Do me a favor and run print with ("You now have $" plus personalMoney).
      Do me a favor and run print with ("Wow, that was pretty generous of you!").

      Farewell!
    `,
    String.raw`
      function MakeDonation_1(amount_2) {
        let charityFunds_3 = 0;
        charityFunds_3 = amount_2;
        return charityFunds_3
      };
      let personalMoney_4 = 100000;
      console.log(("You had $" + personalMoney_4));
      let donation_5 = 0;
      donation_5 = personalMoney_4;
      personalMoney_4 = (personalMoney_4 - donation_5);
      let newCharityFunds_6 = MakeDonation_1(donation_5);
      console.log(("The charity now has $" + newCharityFunds_6));
      console.log(("You now have $" + personalMoney_4));
      console.log("Wow, that was pretty generous of you!")
      `
  ],
  polite: [
    String.raw`
      Hey!

      gimme helpNeeded: Boolean = Yes
      Excuse me, if (helpNeeded), could you...
        Do me a favor and run print with ("I can help out!").
      Thank You.
      Otherwise, could you...
        Do me a favor and run print with ("Ok, let me know if you need anything!").
      Thank You.

      Bye Bye!
    `,
    String.raw`
     let helpNeeded = true;
     if (helpNeeded) {
       console.log("I can help out!")
     } else {
       console.log("Ok, let me know if you need anything!")
     }
    `
  ],
  impolite: [
    String.raw`
      Hey!

      gimme timeOff:Number = 150
      Excuse me, while ( timeOff > 0 ), could you...
        print("Ah...I bet everyone is struggling at work right now")
        timeOff--
      Thank You.

      Farewell!
    `,
    /lettimeOff=(?:1\d\d|\"1\d\d\");while\(\(timeOff>(?:-?\d\d?|\"-?\d\d?\")\)\){console\.log\(\"(?:Ah\.\.\.Ibeteveryoneisstrugglingatworkrightnow|wonthgirkrowtagnilggurtssienoyrevetebI\.\.\.hA)\"\);timeOff\-\-}/,
  ],
  rude: [
    String.raw`
      Hey!

      gimme debt: Number = -80
      debt = absoluteVal(debt)
      print(debt)
      print("Looks like I don't owe you anything. *smug*")

      Bye Bye!
    `,
    /letdebt=-(\d\d|\"\d\d\");debt=Math\.abs\(debt\);console\.log\(debt\);console\.log\(\"(?:LookslikeIdon\'toweyouanything\.\*smug\*|\*gums\*\.gnihtynauoyewot\'nodIekilskooL)\"\)/
  ],
  rudeAF: [
    String.raw`
      gimme areGroupMembersWorking: Boolean = Yes
      for(gimme week = 0; week < 15; week++) {
        if(areGroupMembersWorking) {
          break
        } else {
          break
        }
      }
    `,
    /letareGroupMembersWorking=(?:true|false);for\(letweek=(?:\d\d?|\"\d\d?\");\(week<(?:\d\d|\"\d\d\")\);week\+\+\)\{if\(areGroupMembersWorking\)\{break\}else\{break\}\}/,
  ]
};

function testGivenFixture(fixture, penaltyFlag) {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, done => {
        
      console.log(`\n\n\n${name}\n\n\n`);

      const ast = parse(source);
      analyze(ast);
      const actual = generate(ast, penaltyFlag);
      if (expected instanceof RegExp) {
        expect(stripped(actual)).toMatch(expected);
      } else {
        expect(stripped(actual)).toMatch(stripped(expected));
      }
      done();
    });
  });
}

describe("The JavaScript generator without penalties", () => {
  testGivenFixture(noPenaltyFixture, false);
});
describe("The JavaScript generator with penalties", () => {
  testGivenFixture(penaltyFixture, true);
});
describe("The JavaScript generator that may have penalties", () => {
  testGivenFixture(regularFixture);
});
