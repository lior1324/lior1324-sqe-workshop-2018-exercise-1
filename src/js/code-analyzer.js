import * as esprima from 'esprima';

let bigTableArr=[];
bigTableArr.push('<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>');

const getTable = (parsedCode)=>{
    bigTableArr=[];
    bigTableArr.push('<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr>');
    for(var i in parsedCode){ // im walking above all the out side.
        if(i==='body'){
            for (var j in parsedCode[i]){// thats the array of all the functions.
                bodyResender(parsedCode[i][j]);
            }
        }
    }
    bigTableArr.push('</table>');
    return fromArrayToTableString(bigTableArr);
};


const fromArrayToTableString = (table) =>{
    var hugeString='';
    var tableLength = table.length;
    for (var i = 0; i < tableLength; i++) {
        // alert(myStringArray[i]);
        hugeString =hugeString+table[i];
    }
    return hugeString;
};

const bodyResender=(parsedCode) =>{

    if (parsedCode['type'] === 'VariableDeclaration') {
        variableDeclarationFinder(parsedCode);
    }
    else if (parsedCode['type'] === 'FunctionDeclaration') {
        functionDeclarationFinder(parsedCode);
    }
    else if (parsedCode['type'] === 'WhileStatement') {
        whileStatementFinder(parsedCode);
    }
    else if (parsedCode['type'] === 'ExpressionStatement') {
        expressionStatementFinder(parsedCode);
    }
    else
    {
        bodyResender2(parsedCode);
    }
};

const bodyResender2 =(parsedCode)=>
{
    if (parsedCode['type'] === 'IfStatement') {
        ifStatementFinder(parsedCode,'If Statement'); // i for regualr if
    }
    else if (parsedCode['type'] === 'ReturnStatement') {
        returnStatementFinder(parsedCode);
    }
    else /*if (parsedCode['type'] === 'ForStatement') */{
        forStatementFinder(parsedCode);
    }
};

const forStatementFinder=(parsedCode)=>{
    var forLocation=0,forTest='';
    forLocation=parsedCode['loc']['start']['line'];
    forTest=binaryExpressionFinder(parsedCode['test']);
    //alert(forLocation + forTest)
    bigTableArr.push('<tr><td>'+forLocation+'</td><td>'+'For Statement'+'</td><td></td><td>'+forTest+'</td><td></td></tr>');
    if(parsedCode['body']['type']==='BlockStatement'){
        for (var j in parsedCode['body']['body']){
            bodyResender(parsedCode['body']['body'][j]);
        }
    }
    else{
        bodyResender(parsedCode['body']);
    }
};

const returnStatementFinder =(parsedCode)=> {
    var returnArgument = '', returnLine = 0;
    returnLine=parsedCode['loc']['start']['line'];
    if (parsedCode['argument']['type'] === 'BinaryExpression') {
        returnArgument = binaryExpressionFinder(parsedCode['argument']);
    }
    else if (parsedCode['argument']['type'] === 'Identifier') {
        returnArgument = parsedCode['argument']['name'];
    } else if(parsedCode['argument']['type'] ==='UnaryExpression'){
        returnArgument=parsedCode['argument']['operator']+parsedCode['argument']['argument']['raw'];
    } else{
        returnArgument = MemberExpressionArgumentFinder(parsedCode);
    }
    bigTableArr.push('<tr><td>'+returnLine+'</td><td>'+'Return Statement'+'</td><td></td><td></td><td>'+returnArgument+'</td></tr>');
    //alert(returnLine+returnArgument);
};

const ifStatementFinder =(parsedCode,elseif)=>
{
    var IfLocation=0,IfTest='',elseOrIf=elseif;
    IfLocation=parsedCode['loc']['start']['line'];
    IfTest=binaryExpressionFinder(parsedCode['test']);
    //alert(IfLocation+IfTest+elseOrIf+' e = else if, f = normal if');
    bigTableArr.push('<tr><td>'+IfLocation+'</td><td>'+elseOrIf+'</td><td></td><td>'+IfTest+'</td><td></td></tr>');
    if(parsedCode['consequent']['type']==='BlockStatement'){
        for (var j in parsedCode['consequent']['body']){
            bodyResender(parsedCode['consequent']['body'][j]);
        }
    }
    else{
        bodyResender(parsedCode['consequent']);
    }
    if(parsedCode['alternate']!=null){
        elseIfStatementFinder(parsedCode['alternate']);
    }
};

const elseIfStatementFinder =(parsedCode)=>
{
    var elseRow=0;
    if(parsedCode['type']==='IfStatement'){ // case of else if
        ifStatementFinder(parsedCode,'Else If Statement');} // e for else if
    else{ // case of else
        if(parsedCode['type']==='BlockStatement'){
            elseRow = parsedCode['loc']['start']['line']; // check if block or not {}....
            //alert('normal else row '+elseRow);
            bigTableArr.push('<tr><td>'+elseRow+'</td><td>'+'Else Statement'+'</td><td></td><td></td><td></td></tr>');
            for (var j in parsedCode['body']){
                bodyResender(parsedCode['body'][j]);}
        }
        else{
            elseRow = parsedCode['loc']['start']['line']-1;
            //alert('normal else row '+elseRow);
            bigTableArr.push('<tr><td>'+elseRow+'</td><td>'+'Else Statement'+'</td><td></td><td></td><td></td></tr>');
            bodyResender(parsedCode);}
    }
};


const expressionStatementFinder=(parsedCode)=>
{
    /*if(parsedCode['expression']['type']==='AssignmentExpression'){*/
    assigmentExpressionFinder(parsedCode['expression']);
    /*}*/
};

const assigmentExpressionFinder= (parsedCode)=>
{
    let leftName,lineOfTheleft=0, rightName;
    lineOfTheleft = parsedCode['left']['loc']['start']['line'];
    leftName = parsedCode['left']['name'];
    if(parsedCode['right']['type']==='BinaryExpression'){
        rightName=binaryExpressionFinder(parsedCode['right']);
    }
    else if(parsedCode['right']['type']==='Identifier'){
        rightName=parsedCode['right']['name'];
    } else if(parsedCode['right']['type'] ==='UnaryExpression'){
        rightName=parsedCode['right']['operator']+parsedCode['right']['argument']['raw'];
    } else {
        rightName=parsedCode['right']['raw'];
    }
    //alert(leftName + lineOfTheleft + rightName);
    bigTableArr.push('<tr><td>'+lineOfTheleft+'</td><td>'+'Assignment Expression'+'</td><td>'+leftName+'</td><td></td><td>'+rightName+'</td></tr>');
};

const binaryExpressionFinder=(parsedCode)=>{
    var sumName='';
    if(parsedCode['right']['type']==='BinaryExpression'){
        sumName = sumName+binaryExpressionFinder(parsedCode['right']);}
    else if(parsedCode['right']['type']==='Identifier'){
        sumName= sumName+parsedCode['right']['name'];
    }else {
        sumName= sumName+binaryExpressionRightFinder2(parsedCode)/*parsedCode['right']['raw']*/;}
    sumName = parsedCode['operator']+' '+sumName;
    if(parsedCode['left']['type']==='BinaryExpression'){
        sumName = binaryExpressionFinder(parsedCode['left'])+sumName;}
    else if(parsedCode['left']['type']==='Identifier'){
        sumName= parsedCode['left']['name']+sumName;
    }else {
        sumName=/*parsedCode['left']['raw']*/binaryExpressionLeftFinder2(parsedCode)+ sumName;}
    return sumName;
};


const binaryExpressionLeftFinder2=(parsedCode)=>{
    if(parsedCode['left']['type']==='MemberExpression'){
        if(parsedCode['left']['property']['type']==='BinaryExpression')
            return parsedCode['left']['object']['name'] +'['+ binaryExpressionFinder(parsedCode['left']['property'])+']';
        else if(parsedCode['left']['property']['type']==='Identifier')
            return parsedCode['left']['object']['name'] +'['+ parsedCode['left']['property']['name']+']';
        else
            return parsedCode['left']['object']['name'] +'['+ parsedCode['left']['property']['raw']+']';
    }
    else{
        return parsedCode['left']['raw'];
    }
};

const MemberExpressionArgumentFinder=(parsedCode)=>{
    if(parsedCode['argument']['type']==='MemberExpression'){
        if(parsedCode['argument']['property']['type']==='BinaryExpression')
            return parsedCode['argument']['object']['name'] +'['+ binaryExpressionFinder(parsedCode['argument']['property'])+']';
        else if(parsedCode['argument']['property']['type']==='Identifier')
            return parsedCode['argument']['object']['name'] +'['+ parsedCode['argument']['property']['name']+']';
        else
            return parsedCode['argument']['object']['name'] +'['+ parsedCode['argument']['property']['raw']+']';
    }
    else{
        return parsedCode['argument']['raw'];
    }
};

const MemberExpressionInitFinder=(parsedCode)=>{
    if(parsedCode['init']['type']==='MemberExpression'){
        if(parsedCode['init']['property']['type']==='BinaryExpression')
            return parsedCode['init']['object']['name'] +'['+ binaryExpressionFinder(parsedCode['init']['property'])+']';
        else if(parsedCode['init']['property']['type']==='Identifier')
            return parsedCode['init']['object']['name'] +'['+ parsedCode['init']['property']['name']+']';
        else
            return parsedCode['init']['object']['name'] +'['+ parsedCode['init']['property']['raw']+']';
    }
    else{
        return parsedCode['init']['raw'];
    }
};

const binaryExpressionRightFinder2=(parsedCode)=>{
    if(parsedCode['right']['type']==='MemberExpression'){
        if(parsedCode['right']['property']['type']==='BinaryExpression')
            return parsedCode['right']['object']['name'] +'['+ binaryExpressionFinder(parsedCode['right']['property'])+']';
        else if(parsedCode['right']['property']['type']==='Identifier')
            return parsedCode['right']['object']['name'] +'['+ parsedCode['right']['property']['name']+']';
        else
            return parsedCode['right']['object']['name'] +'['+ parsedCode['right']['property']['raw']+']';
    }
    else{
        return parsedCode['right']['raw'];
    }
};


const whileStatementFinder=(parsedCode)=>
{
    var whileLocation=0,whileTest='';
    whileLocation=parsedCode['loc']['start']['line'];
    whileTest=binaryExpressionFinder(parsedCode['test']);
    //alert(whileLocation + whileTest)
    bigTableArr.push('<tr><td>'+whileLocation+'</td><td>'+'While Statement'+'</td><td></td><td>'+whileTest+'</td><td></td></tr>');
    if(parsedCode['body']['type']==='BlockStatement'){
        for (var j in parsedCode['body']['body']){
            bodyResender(parsedCode['body']['body'][j]);
        }
    }
    else{
        bodyResender(parsedCode['body']);
    }
};

const functionDeclarationFinder=(function1)=>
{
    let functionName,lineOfTheFunction=0;
    functionName = function1['id']['name'];
    lineOfTheFunction = function1['id']['loc']['start']['line'];
    //alert(functionName+lineOfTheFunction);
    bigTableArr.push('<tr><td>'+lineOfTheFunction+'</td><td>'+'Function Declaration'+'</td><td>'+functionName+'</td><td></td><td></td></tr>');
    for (let j in function1['params'])
    {
        functionParams(function1['params'][j]);
    }
    let arrayRowsInside=function1['body']['body'];
    for (let j in arrayRowsInside)
    {
        bodyResender(arrayRowsInside[j]);
    }
};

const functionParams=(param)=>
{
    var paramName,lineOfTheparam=0;
    paramName = param['name'];
    lineOfTheparam=param['loc']['start']['line'];
    //alert(lineOfTheparam+paramName);
    bigTableArr.push('<tr><td>'+lineOfTheparam+'</td><td>'+'Variable Declaration'+'</td><td>'+paramName+'</td><td></td><td></td></tr>');
    // all are not values.

};

const variableDeclarationFinder=(variable)=>
{
    for(var j in variable['declarations'])
    {
        oneVarDeclaration(variable['declarations'][j]);
    }
};

const oneVarDeclaration=(varDec)=>
{
    var nameOftheVar=0,lineOftheVar=0,valueOftheVar='';
    nameOftheVar = varDec['id']['name'];
    lineOftheVar=varDec['id']['loc']['start']['line'];
    if(varDec['init']==null){
        valueOftheVar='null';
    }else{
        if(varDec['init']['type']==='BinaryExpression'){
            valueOftheVar=binaryExpressionFinder(varDec['init']);}
        else if(varDec['init']['type']==='Identifier'){
            valueOftheVar=varDec['init']['name'];
        } else if(varDec['init']['type'] ==='UnaryExpression'){
            valueOftheVar=varDec['init']['operator']+varDec['init']['argument']['raw'];
        } else {
            valueOftheVar=MemberExpressionInitFinder(varDec);} // here
    }
    //alert(nameOftheVar + lineOftheVar+ valueOftheVar);
    bigTableArr.push('<tr><td>'+lineOftheVar+'</td><td>'+'Variable Declaration'+'</td><td>'+nameOftheVar+'</td><td></td><td>'+valueOftheVar+'</td></tr>');
};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};


export {getTable};
export {fromArrayToTableString};
export {parseCode};
