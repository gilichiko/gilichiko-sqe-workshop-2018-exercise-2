/* eslint-disable no-console */
import * as esprima from 'esprima';
import * as estraverse from 'estraverse';


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

let data=[];
const overrun=(json,d)=>{
    data=d;
    runoverjson(json);
    return json;
};
const runoverjson =(json)=>{
    let type=json.type;
    //model.push(type);
    functions[type](json);
    //return model;
    return json;
};



const handleProgram = (json)=>{
    let list=json.body;
    list.forEach(function (element) {
        runoverjson(element);
    });
};


const handlecheck = (json)=>{
    if(json.type==='Literal') ;
    else if(json.type==='Identifier') handleidentifeir(json);
    else{
        if(json.type==='BinaryExpression'){handleBINexp(json);}
    }
};
const getval = (json)=>{
    let cond;
    if(json.type==='Literal') cond=json.raw;
    else{
        if(json.type==='Identifier') return getvalidentifier(json);
        else{
            cond=handleBINexpval(json);
        }
    }
    return cond;
};
const getvalidentifier=(json)=>{
    let iname = json.name;
    if(iname in maplocal) return maplocal[iname];
    else{
        if(iname in mapglobal) return mapglobal[iname];
        else return iname;
    }
};

const handleBINexpval = (json)=>{
    //console.log(json);
    let conl=getval(json.left);
    let conr=getval(json.right);
    let op=json.operator;
    let ret =conl.concat(op).concat(conr);
    return ret;
};
const removeline=(object) =>{
    return estraverse.replace(object,{
        enter: function (node) {
            if (node['type'] === 'VariableDeclaration'){
                this.remove();
            }
            if(node['type']==='ExpressionStatement'){
                let temp=node.expression;
                if(temp.type==='AssignmentExpression') if(temp.left.name in maplocal) this.remove();
            }
        }});
};
const handleBINexp = (json)=>{
    //console.log(json.operator);
    handlecheck(json.left);handlecheck(json.right);
};



const handleVaribledec = (json)=>{
    //model.push("handle-VARdecs");
    let list=json.declarations ;
    list.forEach(function(element){
        handleVaribledector(element);
        //if(infunc)  list[element]=null;
    });

};
const handleVaribledector = (json)=>{
    let name=json.id.name;
    let val=json.init;
    if(infunc){
        maplocal[name]=getval(val);
    }
    else{
        mapglobal[name]=getval(val);
    }
};
const handleIf = (json)=>{
    handlecheck(json.test);
    envrun(json.consequent);
    if(json.alternate!=null){
        envrun(json.alternate);
    }
};
const envrun =(json) =>{
    let temp1={};
    let temp2={};
    saveenv(temp1,temp2);
    runoverjson(json);
    resotrenv(temp1,temp2);
};
const saveenv=(temp1,temp2)=>{
    for (var i in maplocal) temp1[i]=maplocal[i];
    for (var j in mapglobal) temp2[j]=mapglobal[j];
};
const resotrenv=(temp1,temp2)=>{
    maplocal={};
    mapglobal={};
    for ( var j in temp2) mapglobal[j]=temp2[j];
    for (var i in temp1) maplocal[i]=temp1[i];
};
const handleWhile = (json)=>{
    handlecheck(json.test);
    let list=json.body;
    envrun(list);
};
const handleVaribledectorasparam = (json)=>{
    let name=json.name;

    let parsedata=esprima.parseScript(data);

    parsedata.body.forEach(function(element){
        let el=element.expression;
        if(el.left.name===name) mapglobal[name]=getval(el.right);
    });

};
//above
const handleVarassign = (json)=>{
    let name=json.left.name;
    let val=json.right;
    if(name in maplocal) maplocal[name]=getval(val);
    else mapglobal[name]=getval(val);
};
const handleRet = (json)=>{
    handlecheck(json.argument);
};
//const handleunarrexp= (json)=>{
//   if(json.argument.type==='Identifier') handleidentifeir(json.argument);
//};
const handleidentifeir = (json)=>{
    let name=json.name;
    if(name in maplocal){
        json.name=maplocal[name];
    }
    if (name in mapglobal) json.name=mapglobal[name];
};
const handleFuncdec = (json)=>{
    //model.push(makeTopush(json.id.loc.start.line,'FunctionDeclaration',json.id.name,'',''));
    let params=json.params;
    params.forEach(function(element){
        handleVaribledectorasparam(element);
    });
    let block=json.body;
    infunc=true;
    runoverjson(block);
    removeline(block);
};
const handleBlockstatment = (json)=>{
    let list=json.body;
    list.forEach(function(element){
        runoverjson(element);
    });

};
const handleExp = (json)=>{
    let type=json.expression.type;
    if(type==='AssignmentExpression') handleVarassign(json.expression);
    if(type==='SequenceExpression') handleSeqEXP(json.expression);
    if(type==='Identifier') handleidentifeir(json.expression);
};
const handleSeqEXP = (json)=>{
    let list=json.expressions;
    list.forEach(function(element){
        runoverjson(element);
    });
};
let functions=[];
functions['ExpressionStatement']= handleExp;
functions['BlockStatement']= handleBlockstatment;
functions['Program']= handleProgram;
functions['FunctionDeclaration']= handleFuncdec;
functions['WhileStatement']= handleWhile;
functions['ReturnStatement']= handleRet;
functions['IfStatement']= handleIf;
functions['VariableDeclaration']= handleVaribledec;
functions['SequenceExpression']= handleSeqEXP;
functions['AssignmentExpression']= handleVarassign;
functions['Identifier']= handleidentifeir;
let mapglobal={};
let maplocal={};
let infunc=false;
export {parseCode};
export {overrun};
