const { readFileSync } = require("fs");

var filename = "hello";

if (process.argv[2]) {
    filename = process.argv[2];
}

const run = async () => {
  const buffer = readFileSync("./" + filename + ".wasm");
  const module = await WebAssembly.compile(buffer);
  const instance = await WebAssembly.instantiate(module);
  console.log(instance.exports.helloWorld());
};

run();
