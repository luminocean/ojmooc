
exports.parseGdbOutputText = function(outputText){
    var gdbOutput = {};

    var lineData = parseGdbOutputLines(outputText);
    var consoleLines = lineData.console;
    consoleLines.forEach(function(line){
        var value = undefined;
        if(value=parsePrintVal(line))
            gdbOutput.printVal = value;
    });

    return gdbOutput;
};

/**
 * 解析变量输出的行，返回要解析的变量的值
 * @param line
 */
function parsePrintVal(line){
    var results = line.match(/~"\$\d+\s=\s(.+)"/);
    if(results)
        return results[1];
}

/**
 * 将gdb的输出按照功能分成不同的行
 * 每种输出占用返回对象的一个属性，该属性为解析后的行的数组
 */
function parseGdbOutputLines(outputText){
    var lines = outputText.split('\n');

    //去除空行
    var lines = lines.filter(function(line){
        if(line.match(/.+/)){
            return true;
        }
    });

    //console输出行
    var consoleOutputLines = lines.filter(function(line){
        if(line.match(/^~[.\s]*/)){
            return true;
        }
    });

    var parsedLineData = {};
    parsedLineData.console = consoleOutputLines;

    return parsedLineData;
}