var utils = (function() {

    var __formatString = function(value, args) {     
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{'+i+'\\}', 'gi');
            value = value.replace(regexp, args[i]);
        }
        return value;
    };

    var __parseString = function(strDesc) {
        var resultStr;
        if (strDesc.indexOf("`") != -1) {
          var firstIndex = strDesc.indexOf("\`") + 1;
          console.log("1st index of ` ", firstIndex);
          var lastIndex = strDesc.lastIndexOf("\`");
          console.log("last index of ` ", lastIndex);
          resultStr = strDesc.slice(firstIndex, lastIndex);
        } 
        console.log("resultStr ", resultStr);
        return resultStr;  
    };

    var __replaceString = function(str, char1) {
        var resultStr = str;
        if (str.indexOf(char1) != -1) {
          resultStr = str.replace(char1, "_");
        }
        return resultStr;
    };

    return {
        formatString: __formatString,
        parseString: __parseString,
        replaceString: __replaceString
    };

})();