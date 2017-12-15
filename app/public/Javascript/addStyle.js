(function (scope) {
    // Create a new stylesheet in the bottom
    // of <head>, where the css rules will go
    var style = document.createElement('style');
    document.head.appendChild(style);
    var stylesheet = style.sheet;
    scope.css = function (selector, property, value) {
        // Append the rule (Major browsers)
        try { stylesheet.insertRule(selector+' {'+property+':'+value+'}', stylesheet.cssRules.length);
        } catch(err) {try { stylesheet.addRule(selector, property+':'+value); // (pre IE9)
        } catch(err) {console.log("Couldn't add style");}} // (alien browsers)
    }
})(window);
