const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

class BrainfuckCompiler {
    constructor(code) {
        this.code = code;
        this.memory = new Uint8Array(30000);
        this.pointer = 0;
        this.output = '';
        this.input = '';
        this.inputPointer = 0;
        this.loopStack = [];
    }

    compile() {
        for (let i = 0; i < this.code.length; i++) {
            const command = this.code[i];
            switch (command) {
                case '>':
                    this.pointer++;
                    break;
                case '<':
                    this.pointer--;
                    break;
                case '+':
                    this.memory[this.pointer]++;
                    break;
                case '-':
                    this.memory[this.pointer]--;
                    break;
                case '.':
                    this.output += String.fromCharCode(this.memory[this.pointer]);
                    break;
                case ',':
                    if (this.inputPointer < this.input.length) {
                        this.memory[this.pointer] = this.input.charCodeAt(this.inputPointer++);
                    } else {
                        // If no more input, set cell to 0
                        this.memory[this.pointer] = 0;
                    }
                    break;
                case '[':
                    if (this.memory[this.pointer] === 0) {
                        // Jump to the matching ']'
                        let loopCount = 1;
                        while (loopCount !== 0) {
                            i++;
                            if (this.code[i] === '[') {
                                loopCount++;
                            } else if (this.code[i] === ']') {
                                loopCount--;
                            }
                        }
                    } else {
                        this.loopStack.push(i);
                    }
                    break;
                case ']':
                    if (this.memory[this.pointer] !== 0) {
                        i = this.loopStack[this.loopStack.length - 1];
                    } else {
                        this.loopStack.pop();
                    }
                    break;
            }
        }
        return this.output;
    }
}

class Scratch3HiddenBlocks {
    constructor (runtime) {
        this.runtime = runtime;
    }

    getInfo () {
        return {
            id: 'extrablocks',
            name: 'Extra Blocks',
            blocks: [
                {
                    opcode: 'writeLog',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
                {
                    opcode: 'brainfuck',
                    blockType: BlockType.REPORTER,
                    text: 'brainfuck [CODE]',
                    arguments: {
                        CODE: {
                            type: ArgumentType.STRING,
                            defaultValue: "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }

    writeLog (args) {
        const text = Cast.toString(args.TEXT);
        log.log(text);
    }

    brainfuck () {
        const code = Cast.toString(args.CODE);

        const compiler = new BrainfuckCompiler(code);
        const output = compiler.compile();

        return output;
    }
}

module.exports = Scratch3HiddenBlocks;
