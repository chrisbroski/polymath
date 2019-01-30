const { readFileSync, writeFileSync } = require("fs");
const wabt = require("wabt")();

if (!process.argv[2]) {
    console.log('Please include the file name.');
    process.exit();
}

const inputWat = process.argv[2] + ".wat";
const outputWasm = process.argv[2] + ".wasm";

const wasmModule = wabt.parseWat(inputWat, readFileSync(inputWat, "utf8"));
const { buffer } = wasmModule.toBinary({});

writeFileSync(outputWasm, new Buffer(buffer));
