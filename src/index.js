#!/usr/bin/env node

const colors = require("@colors/colors/safe");
const {
    spawnSync
} = require('child_process');
const path = require('path');
const fs = require('fs');

// files
const default_config = (name) => `module.exports = {
  name: "${name}",
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
};`;

const default_main = () => `const cliffhanger = require('@cliffhanger-js/cliffhanger');
cliffhanger.run();`;

function find_fn(json, name) {
    for (let i in json.flags) {
        let curr = json.flags[i];
        if (curr.short == name || i == name.slice(2)) {
            return curr.init;
        }
    }
}

function start(json) {
    let argv = process.argv.slice(2);
    if (
        argv.length == 0 ||
        (json.help_cmd ? argv.includes(json.help_cmd) : argv.includes("-h")) ||
        argv.includes("--help")
    ) {
        console.log(
            json.name,
            "(version " + json.version + ")",
            "\n" + json.description,
            "\n"
        );

        console.log(
            `Usage: ${json.name} [options]`
        );
        console.log("Options:");
        for (let i in json.flags) {
            let flag = json.flags[i];
            console.log(
                "--" + i,
                `${flag.short ? `(short: ${flag.short})` : ``}: ${flag.description}`
            );
        }
        if (argv.length == 0) {
            for (let i in json.flags) {
                let current = json.flags[i];
                if (
                    current.required &&
                    (!argv.includes('--' + i) || !argv.includes(current.short))
                ) {
                    console.log(
                        colors.red(
                            `ERROR: The '${i}'${current.short ? ` (short: ${current.short})` : ""
              } option is required!`
                        )
                    );
                    return;
                }
            }
        }
    } else {
        let new_argv = [];
        argv.forEach(x => {
            if (x.startsWith('-') && x[1] !== '-') {
                let r = x.slice(1);
                if (r.length > 1) {
                    r.split('').forEach(x => new_argv.push('-' + x));
                } else {
                    new_argv.push(x);
                }
            } else {
                new_argv.push(x);
            }
        });

        argv = new_argv;

        for (let i in json.flags) {
            let current = json.flags[i];

            if (
                current.required &&
                (!argv.includes('--' + i) && !argv.includes(current.short))
            ) {
                console.log(
                    colors.red(
                        `ERROR: The '${i}'${current.short ? ` (short: ${current.short})` : ""
            } option is required!`
                    )
                );
                return;
            } else {
                argv.forEach((x, p) => {
                    let val = x.replaceAll('-', '');
                    if (i == val || current.short == x) {
                        let amount_of_args = current.amount_of_args || 0;
                        let argv_l = process.argv.slice(p + amount_of_args + 1);

                        argv_l = argv_l.slice(0, amount_of_args);

                        if (amount_of_args > argv_l.length) {
                            console.log(
                                colors.red(
                                    `ERROR: Expected ${amount_of_args} ${amount_of_args == 1 ? 'argument' : 'arguments' } for the flag \`${i}\`, got ${argv_l.length} arguments`
                                )
                            );
                            return;
                        }
                        let a = amount_of_args !== 0 ? argv_l : [];
                        find_fn(json, x)(...a);
                    }
                })
            }
        }
    }
}

function run() {
    start(require(path.join(process.cwd(), 'cliffhanger.config.js')));
};

if (require.main === module) {
    let p = process.argv[2];
    if (!p) {
        console.log(colors.red("ERROR: No command used! Use 'init' to create a new Cliffhanger project or 'run' to run the current Cliffhanger project"));
    } else {
        switch (p) {
            case "init":
                let name = process.argv[process.argv.length - 1];
                if (!name) {
                    console.log(colors.red("ERROR: No name for a project found!"));
                    return;
                }
                fs.mkdirSync(name);
                process.chdir(path.join(process.cwd(), name));
                fs.mkdirSync('src');
                spawnSync('npm init -y && npm i @cliffhanger-js/cliffhanger', {
                    shell: true
                });
                fs.writeFileSync('cliffhanger.config.js', default_config(name));
                fs.writeFileSync('src/index.js', default_main());

                let json = JSON.parse(fs.readFileSync('package.json').toString());
                json.main = "src/index.js";

                fs.writeFileSync('package.json', JSON.stringify(json, null, 2));
                break;
            case "run":
                run();
                break;
        }
    }
}

module.exports = {
    run
};
