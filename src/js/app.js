import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {overrun} from './code-analyzer';
import {generate} from 'escodegen';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let data=$('#gili').val();
        let newjson=overrun(parsedCode,data);
        colorgreen(generate(newjson));
        //$('#parsedCode').val((generate(newjson)));
    });

});
const colorgreen=(finalcode)=>{
    let lines = finalcode.split('\n');
    let result = '<div style="background-color: ' + 'white' + '">' + lines[0]+ '</div>';
    for (let i = 1; i<lines.length; i++){
        let color='white';
        if(lines[i].includes('(')&&lines[i].includes(')')){
            let toeval=lines[i].substring(lines[i].indexOf('(')+1,lines[i].indexOf(')'));
            color=evalgili(toeval);
        }
        result +='<div style="background-color: ' + color + '">' + lines[i]+ '</div>';
    }
    document.body.innerHTML  = result;
};
const evalgili=(toeval)=>{
    try {
        if(eval(toeval)) return 'green';
        else return 'red';
    }
    catch (err){
        return 'white';
    }
};
