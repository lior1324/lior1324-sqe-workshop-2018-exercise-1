import $ from 'jquery';
import {parseCode,getTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        var table = document.getElementById('grandTable');
        var row = table.rows[1];
        var cell = row.cells[1];
        cell.innerHTML=getTable(parsedCode);
    });
});