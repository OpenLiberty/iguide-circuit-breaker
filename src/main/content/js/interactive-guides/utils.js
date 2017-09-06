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

    var __getNameAction = function(strAction) {
        //console.log("AAA string ", strAction);
        var name;  
        if (strAction.indexOf("name=") !== -1) {
          var index = strAction.indexOf("name=") + 5;
          //console.log("index ", index);
          name = strAction.substring(index);
          //console.log("name ", name);
          var quote = name.substring(0, 1);
          //console.log("quote ", quote);
          var tmpString = name.substring(1);
          //console.log("tmpString ", tmpString);
          var lastIndex = tmpString.indexOf(quote);
          name = name.substring(0, lastIndex + 2);
          //console.log("name=", name);
        }
        return name;
    };
    
    var __getCallbackAction = function(strAction) {
        //console.log("BBB string ", strAction);
        var callbackStr;
        if (strAction.indexOf("callback=") !== -1) {
            var index = strAction.indexOf("callback=") + 9;
            //console.log("index ", index);
            callbackStr = strAction.substring(index);
            //console.log("callback ", callbackStr);
            var lastIndex = callbackStr.indexOf(")");
            callbackStr = callbackStr.substring(0, lastIndex + 2);
            //console.log("callback=", callbackStr);
        }
        return callbackStr;
    };
    
    var __getButtonName = function(strName) {
        var buttonName = strName.substring(1, strName.length - 1);
        var firstIndex = strName.indexOf("<b>") + 3;
        var lastIndex = strName.indexOf("</b>");
        var buttonName = strName.substring(firstIndex, lastIndex);
        console.log("buttonName ", buttonName);
        return buttonName;
    };
    
    var __parseActionTag = function(strDesc) {
        var resultStr;
        if (strDesc.indexOf("<action") !== -1) {
            var firstIndex = strDesc.indexOf("<action");
            //console.log("1st index of <action> ", firstIndex);
            var lastIndex = strDesc.lastIndexOf("</action>") + 9;
            //console.log("last index of </action> ", lastIndex);
            var origActionStr = strDesc.slice(firstIndex, lastIndex);
            console.log("original action ", origActionStr);
            var name =  __getNameAction(origActionStr); 
            if (name) {          
                var callback = __getCallbackAction(origActionStr);
                var buttonName = __getButtonName(origActionStr);
                var newActionStr = "<action role='button' tabindex='0' title=" + name + " aria-label=" + name + " onkeypress=" + callback + " onclick=" + callback + " ><b>" + buttonName + "</b></action>";
                console.log("new action ", newActionStr);
                //tabindex='0' title='Enter' role='button' aria-label='enter' onkeypress=\"circ
                resultStr = strDesc.replace(origActionStr, newActionStr)
                //console.log("resultStr ", resultStr);
            }
        } 
        console.log("resultStr ", resultStr);
        return resultStr;  
    };

    return {
        formatString: __formatString,
        parseString: __parseString,
        replaceString: __replaceString,
        parseActionTag: __parseActionTag
    };

})();