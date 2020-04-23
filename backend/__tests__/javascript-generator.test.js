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
  return s.replace(/\s+/g, "").replace(/_\d+/g, "");
}

const noPenFixture = {
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
  lambdaExp: [
    String.raw`
      gimme moreDoggos = () -> "MORE DOGGOS"
    `,
    String.raw`
      let moreDoggos = (() => "MORE DOGGOS")
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
      (() => 30)();
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

const penFixture = { 
  allPenaltiesActive: [
    String.raw`
      gimme pn1: Number = 1234
      gimme pn2: String = "Is this gonna reverse? Probably"
    `,
    String`
      let pn1 = "1234";
      let pn2 = "ylbaborP ?esrever annog siht sI"
    `
  ]
};

const regFixture = {
  angelic1: [
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
  ]/*,
  polite1: [],
  impolite1: [],
  rude1: [],
  rudeAF1: []
*/
};

function testGivenFixture(fixture, penaltyFlag) {
  Object.entries(fixture).forEach(([name, [source, expected]]) => {
    test(`produces the correct output for ${name}`, done => {
      const ast = parse(source);
      analyze(ast);
      const actual = generate(ast, penaltyFlag);
      expect(stripped(actual)).toEqual(stripped(expected));
      done();
    });
  });
}


describe("The JavaScript generator without penalties", () => {
  testGivenFixture(noPenFixture, false);
});
describe("The JavaScript generator with penalties", () => {
  testGivenFixture(penFixture, true);
});
describe("The JavaScript generator that may have penalties", () => {
   testGivenFixture(regFixture, null);
});
