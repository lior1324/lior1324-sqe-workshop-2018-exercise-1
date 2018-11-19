import assert from 'assert';
import {parseCode,getTable,fromArrayToTableString} from '../src/js/code-analyzer';

describe('The javascript parser', () => {

    it('is concatenating the array', () => { // 1
        assert.equal(
            fromArrayToTableString(['bana','na']),
            'banana'
        );
    });

    it('is tabling the empty String', () => { // 2
        assert.equal(
            getTable(parseCode('')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr></table>'
        );
    });

    it('is tabling simple Variable Declaration String', () => { // 3
        assert.equal(
            getTable(parseCode('let a = 1;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Variable Declaration</td><td>a</td><td></td><td>1</td></tr></table>'
        );
    });

    it('is tabling simple For Statement with {} String', () => { // 4
        assert.equal(
            getTable(parseCode('for(var i=0;i<5;i++){\n' +
                'i=i+1}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>For Statement</td><td></td><td>i< 5</td><td></td></tr><tr><td>2</td><td>Assignment Expression</td><td>i</td><td></td><td>i+ 1</td></tr></table>'
        );
    });

    it('is tabling simple For Statement with out {} String', () => { // 4
        assert.equal(
            getTable(parseCode('for(var i=0;i<6;i++)\n' +
                'i=i+1;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>For Statement</td><td></td><td>i< 6</td><td></td></tr><tr><td>2</td><td>Assignment Expression</td><td>i</td><td></td><td>i+ 1</td></tr></table>'
        );
    });

    it('is tabling simple While Statement String', () => { // 5
        assert.equal(
            getTable(parseCode('while(i>6)\n' +
                ' i=i+6')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>While Statement</td><td></td><td>i> 6</td><td></td></tr><tr><td>2</td><td>Assignment Expression</td><td>i</td><td></td><td>i+ 6</td></tr></table>'
        );
    });

    it('is tabling simple If Declaration String', () => {// 6
        assert.equal(
            getTable(parseCode('if(i<=d){\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>If Statement</td><td></td><td>i<= d</td><td></td></tr></table>'
        );
    });

    it('is tabling simple Assignment Expression String', () => { // 7
        assert.equal(
            getTable(parseCode('low = mid + 5;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Assignment Expression</td><td>low</td><td></td><td>mid+ 5</td></tr></table>'
        );
    });


    it('is tabling simple Function Declaration String', () => { // 8
        assert.equal(
            getTable(parseCode('function b (){\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>b</td><td></td><td></td></tr></table>'
        );
    });

    it('is tabling simple Return Statement String', () => { // 9
        assert.equal(
            getTable(parseCode('function b (){\n' +
                'return 1;\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>b</td><td></td><td></td></tr><tr><td>2</td><td>Return Statement</td><td></td><td></td><td>1</td></tr></table>'
        );
    });

    it('is tabling complex if statement String', () => { // 10
        assert.equal(
            getTable(parseCode('if(5>7){\n' +
                'x=x+x;\n' +
                '}\n' +
                'else\n' +
                '{\n' +
                'x=(1+2)+(3+4)\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>If Statement</td><td></td><td>5> 7</td><td></td></tr><tr><td>2</td><td>Assignment Expression</td><td>x</td><td></td><td>x+ x</td></tr><tr><td>5</td><td>Else Statement</td><td></td><td></td><td></td></tr><tr><td>6</td><td>Assignment Expression</td><td>x</td><td></td><td>1+ 2+ 3+ 4</td></tr></table>'
        );
    });


    it('is tabling the example that we got', () => { // 11
        assert.equal(
            getTable(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>binarySearch</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>X</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>V</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>n</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>low</td><td></td><td>null</td></tr><tr><td>2</td><td>Variable Declaration</td><td>high</td><td></td><td>null</td></tr><tr><td>2</td><td>Variable Declaration</td><td>mid</td><td></td><td>null</td></tr><tr><td>3</td><td>Assignment Expression</td><td>low</td><td></td><td>0</td></tr><tr><td>4</td><td>Assignment Expression</td><td>high</td><td></td><td>n- 1</td></tr><tr><td>5</td><td>While Statement</td><td></td><td>low<= high</td><td></td></tr><tr><td>6</td><td>Assignment Expression</td><td>mid</td><td></td><td>low+ high/ 2</td></tr><tr><td>7</td><td>If Statement</td><td></td><td>X< V[mid]</td><td></td></tr><tr><td>8</td><td>Assignment Expression</td><td>high</td><td></td><td>mid- 1</td></tr><tr><td>9</td><td>Else If Statement</td><td></td><td>X> V[mid]</td><td></td></tr><tr><td>10</td><td>Assignment Expression</td><td>low</td><td></td><td>mid+ 1</td></tr><tr><td>11</td><td>Else Statement</td><td></td><td></td><td></td></tr><tr><td>12</td><td>Return Statement</td><td></td><td></td><td>mid</td></tr><tr><td>14</td><td>Return Statement</td><td></td><td></td><td>-1</td></tr></table>'
        );

    });
    it('is tabling the example that we got with a slight changes', () => { // 12
        assert.equal(
            getTable(parseCode('function binarySearch(X, V, n){\n' +
                '    let low=9, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid+1])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[1+mid])\n' +
                '            low = V;\n' +
                '        else\n' +
                '            return V;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>binarySearch</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>X</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>V</td><td></td><td></td></tr><tr><td>1</td><td>Variable Declaration</td><td>n</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>low</td><td></td><td>9</td></tr><tr><td>2</td><td>Variable Declaration</td><td>high</td><td></td><td>null</td></tr><tr><td>2</td><td>Variable Declaration</td><td>mid</td><td></td><td>null</td></tr><tr><td>3</td><td>Assignment Expression</td><td>low</td><td></td><td>0</td></tr><tr><td>4</td><td>Assignment Expression</td><td>high</td><td></td><td>n- 1</td></tr><tr><td>5</td><td>While Statement</td><td></td><td>low<= high</td><td></td></tr><tr><td>6</td><td>Assignment Expression</td><td>mid</td><td></td><td>low+ high/ 2</td></tr><tr><td>7</td><td>If Statement</td><td></td><td>X< V[mid+ 1]</td><td></td></tr><tr><td>8</td><td>Assignment Expression</td><td>high</td><td></td><td>mid- 1</td></tr><tr><td>9</td><td>Else If Statement</td><td></td><td>X> V[1+ mid]</td><td></td></tr><tr><td>10</td><td>Assignment Expression</td><td>low</td><td></td><td>V</td></tr><tr><td>11</td><td>Else Statement</td><td></td><td></td><td></td></tr><tr><td>12</td><td>Return Statement</td><td></td><td></td><td>V</td></tr><tr><td>14</td><td>Return Statement</td><td></td><td></td><td>-1</td></tr></table>'
        );
    });
    it('is tabling a [] with identifier and literals', () => { // 13
        assert.equal(
            getTable(parseCode('        if (X < V[mid+mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[1+1])\n' +
                '            low = V;\n' +
                '        else\n' +
                '            go=8;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>If Statement</td><td></td><td>X< V[mid+ mid]</td><td></td></tr><tr><td>2</td><td>Assignment Expression</td><td>high</td><td></td><td>mid- 1</td></tr><tr><td>3</td><td>Else If Statement</td><td></td><td>X> V[1+ 1]</td><td></td></tr><tr><td>4</td><td>Assignment Expression</td><td>low</td><td></td><td>V</td></tr><tr><td>5</td><td>Else Statement</td><td></td><td></td><td></td></tr><tr><td>6</td><td>Assignment Expression</td><td>go</td><td></td><td>8</td></tr></table>'
        );
    });
    it('is tabling the binary expression at return', () => { // 14
        assert.equal(
            getTable(parseCode('function b (){\n' +
                'return 5+5;\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>b</td><td></td><td></td></tr><tr><td>2</td><td>Return Statement</td><td></td><td></td><td>5+ 5</td></tr></table>'
        );
    });
    it('is tabling the unary statement', () => { // 15
        assert.equal(
            getTable(parseCode('hello = -9')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Assignment Expression</td><td>hello</td><td></td><td>-9</td></tr></table>'
        );
    });
    it('is tabling long assignment inside', () => { // 16
        assert.equal(
            getTable(parseCode('hello = 1+2+5+7+8;\n' +
                'hello = 1+4+ji+dsa+5-9;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Assignment Expression</td><td>hello</td><td></td><td>1+ 2+ 5+ 7+ 8</td></tr><tr><td>2</td><td>Assignment Expression</td><td>hello</td><td></td><td>1+ 4+ ji+ dsa+ 5- 9</td></tr></table>'
        );
    });
    it('is tabling [] argument in return and let statements String', () => { // 17
        assert.equal(
            getTable(parseCode('function b(){\n' +
                'let x=Mid[i+5];\n' +
                'let x=Mid[d];\n' +
                'let x=Mid[1];\n' +
                'return Mid[1];\n' +
                '}')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>b</td><td></td><td></td></tr><tr><td>2</td><td>Variable Declaration</td><td>x</td><td></td><td>Mid[i+ 5]</td></tr><tr><td>3</td><td>Variable Declaration</td><td>x</td><td></td><td>Mid[d]</td></tr><tr><td>4</td><td>Variable Declaration</td><td>x</td><td></td><td>Mid[1]</td></tr><tr><td>5</td><td>Return Statement</td><td></td><td></td><td>Mid[1]</td></tr></table>'
        );
    });
    it('is tabling return with special #1 [] String', () => { // 18
        assert.equal(
            getTable(parseCode('function b(){ return Mid[d]; }\n')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>b</td><td></td><td></td></tr><tr><td>1</td><td>Return Statement</td><td></td><td></td><td>Mid[d]</td></tr></table>'
        );
    }); it('is tabling return with special #2 [] String', () => { // 19
        assert.equal(
            getTable(parseCode('function b(){ return Mid[i+5]; }')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Function Declaration</td><td>b</td><td></td><td></td></tr><tr><td>1</td><td>Return Statement</td><td></td><td></td><td>Mid[i+ 5]</td></tr></table>'
        );
    });
    it('is tabling return with special #3 [] String', () => { // 20
        assert.equal(
            getTable(parseCode('num = Mid[1+1]+3+4+Mid[1];\n' +
                'num = Mid[i]+3+4+5;\n' +
                'num = Mid[1]+3+4+5;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Assignment Expression</td><td>num</td><td></td><td>Mid[1+ 1]+ 3+ 4+ Mid[1]</td></tr><tr><td>2</td><td>Assignment Expression</td><td>num</td><td></td><td>Mid[i]+ 3+ 4+ 5</td></tr><tr><td>3</td><td>Assignment Expression</td><td>num</td><td></td><td>Mid[1]+ 3+ 4+ 5</td></tr></table>'
        );
    });
    it('is tabling declaration expert', () => { // 21
        assert.equal(
            getTable(parseCode('let x=1+1,y=-1,z=w;')),
            '<table border="1"><tr><td>Line</td><td>Type</td><td>Name</td><td>Condition</td><td>Value</td></tr><tr><td>1</td><td>Variable Declaration</td><td>x</td><td></td><td>1+ 1</td></tr><tr><td>1</td><td>Variable Declaration</td><td>y</td><td></td><td>-1</td></tr><tr><td>1</td><td>Variable Declaration</td><td>z</td><td></td><td>w</td></tr></table>'
        );
    });
});
