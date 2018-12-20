import assert from 'assert';
import {generate} from 'escodegen';
import {overrun, parseCode} from '../src/js/code-analyzer';
let simplefoo2='function foo(){\n' +
    '    let a = 1;\n' +
    '    let b = 2;\n' +
    '    let c = 0;\n' +
    '}';
let simplefoo2out='function foo() {\n' +
    '}';
let test3in='let a=0;';
let test3out='let a = 0;';
let test4in='let a=0;\n' +
    'let=3,z=4;';
let test4out='let a = 0;\n' +
    'let = 3, z = 4;';

let test5in='function foo(){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '}\n';
let test5out='function foo() {\n' +
    '}';

let test6in='function foo(){\n' +
    '    let a = 1;\n' +
    '    let b = 2;\n' +
    '    let c = 0;\n' +
    'c=c+1;\n' +
    'if(c<4){\n' +
    'c=5;\n' +
    '}\n' +
    '}\n';
let test6out='function foo() {\n' +
    '    if (0+1 < 4) {\n' +
    '    }\n' +
    '}';

let test7in='function foo(x){\n' +
    '    let a = 1;\n' +
    '    let b = 2;\n' +
    '    let c = 0;\n' +
    'c=c+1;\n' +
    'if(c<x){\n' +
    'c=5;\n' +
    '}\n' +
    '}\n';
let test7out='function foo(x) {\n' +
    '    if (0+1 < 1) {\n' +
    '    }\n' +
    '}';

let test8in='function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '        return x + y + z + c;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '        return x + y + z + c;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '        return x + y + z + c;\n' +
    '    }\n' +
    '}\n';

let test8out='function foo(x, y, z) {\n' +
    '    if (1+1+2 < 3) {\n' +
    '        return 1 + 2 + 3 + 0+5;\n' +
    '    } else if (1+1+2 < 3 * 2) {\n' +
    '        return 1 + 2 + 3 + 0+1+5;\n' +
    '    } else {\n' +
    '        return 1 + 2 + 3 + 0+3+5;\n' +
    '    }\n' +
    '}';
let test10in='function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    while (a < z) {\n' +
    '        c = a + b;\n' +
    '        z = c * 2;\n' +
    '    }\n' +
    '    \n' +
    '    return z;\n' +
    '}\n';
let test9in='function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '   c=a+b;\n' +
    '    \n' +
    '    return c;\n' +
    '}\n';
let test9out='function foo(x, y, z) {\n' +
    '    return 1+1+1+1+2;\n' +
    '}';


let test10out='function foo(x, y, z) {\n' +
    '    while (1+1 < 3) {\n' +
    '        z = c * 2;\n' +
    '    }\n' +
    '    return 3;\n' +
    '}';

describe('The javascript parser', () => {
    it('is parsing an empty input', () => {
        assert.equal(generate(overrun(parseCode(''),[])), '');
    });
    it('is parsing simple function correctly', () => {
        assert.equal(generate(overrun(parseCode(simplefoo2),[])), simplefoo2out);
    });
    it('is parsing a simple global let', () => {test3();});
    it('is parsing a complex let', () => {test4();});
    it('is parsing a simple function correctly', () => {test5();});
    it('is parsing a simple function with assignment correctly', () => {test6();});
    it('is parsing a simple function with params correctly', () => {test7();});
    it('is parsing a complex function with if correctly', () => {test8();});
    it('is parsing a complex func with while correctly', () => {test9();});
    it('is parsing a another comlex func statement correctly', () => {test10();});

});
const test3 = ()=>{
    assert.equal(generate(overrun(parseCode(test3in),'')), test3out);
};
const test4 = ()=>{
    assert.equal(generate(overrun(parseCode(test4in),'')), test4out);
};
const test5 = ()=>{
    assert.equal(generate(overrun(parseCode(test5in),'')), test5out);
};
const test6 = ()=>{
    assert.equal(generate(overrun(parseCode(test6in),'')), test6out);
};
const test7 = ()=>{
    assert.equal(generate(overrun(parseCode(test7in),'x=1;')), test7out);
};
const test8 = ()=>{
    assert.equal(generate(overrun(parseCode(test8in),'x=1;y=2;z=3;')), test8out);
};
const test9 = ()=>{
    assert.equal(generate(overrun(parseCode(test9in),'x=1;y=2;z=3;')), test9out);
};
const test10 = ()=>{
    assert.equal(generate(overrun(parseCode(test10in),'x=1;y=2;z=3;')), test10out);
};


