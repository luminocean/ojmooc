var parser = {};
module.exports = parser;

/**
 * 解析出printVal结果
 * @param text
 * @returns {number|string} 要查看的值
 */
parser.parsePrintVal = function(text){
    var result = '';

    var groupedLines = textToGroupedLines(text);
    var consoleLines = groupedLines.console;
    if(!consoleLines)
        return console.error('gdb输出结果中没有console类输出');

    consoleLines.forEach(function(line){
        var parseResult = parsePrintVal(line);
        if(parseResult){
            result =  parseResult;
        }
    });

    return result;
};

/**
 * 将gdb的输出转换成按功能分组的行数组
 * @param outputText gdb的输出
 * @returns {*} 解析结果
 */
function textToGroupedLines(outputText){
    var groupedLines = {};

    var lines = outputText.split('\n');
    //去除空行
    lines = lines.filter(function(line){
        if(line.match(/.+/)) return true;

    });
    //解析console输出行
    groupedLines.console = lines.filter(function(line){
        if(line.match(/^~[.\s]*/)) return true;
    });

    return groupedLines;
}

/**
 * 解析变量输出的行，返回要解析的变量的值
 * @param line
 */
function parsePrintVal(line){
    var results = line.match(/~"\$\d+\s=\s(.+)"/);
    if(results && results.length>1)
        return results[1];
}