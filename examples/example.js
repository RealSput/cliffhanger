module.exports = {
  name: "my-first-cli",
  version: "1.0",
  description: "My first CLI tool made with Cliffhanger!",
  flags: {
    flag_a: {
      short: "-a",
      description: "Test Flag A",
      required: true,
      init: () => {
        console.log('Flag A used');
      },
    },
    flag_b: {
      short: "-b",
      description: "Test Flag B",
      amount_of_args: 1,
      init: (arg) => {
        console.log('Flag B used');
        console.log('Argument 1:', arg);
      },
    },
  },
};
