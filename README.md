# Cliffhanger
A tool for creating powerful CLIs

# Tutorial
First, install the package:
```
npm i -g @cliffhanger-js/cliffhanger
```

Next, use the `init` command to create a new project:
```
cliffhanger init my_first_project
```

You will then see a folder named "my_first_project" pop up.

Run this in order to run your first project:
```
cd my_first_project
node .
```

Note that you can also use `cliffhanger run`.

Congratulations, you now have your first Cliffhanger app! 🥳

# Examples
Example 1 (simple CLI tool):
```js
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
```
