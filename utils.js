var types = {
    "fire": "🔥",
    "water": "💧",
    "earth": "🌲"
  };

(function ($) {

    forData = function (index, data) {
        console.log("forData func. running!");
        console.log("index: ");
        console.log(index);
        console.log("data: ");
        console.log(data);
        var element = $("*").find(`[data-for='cards']`); //var element = $("*").find(`[data-for='${index}']`);
        var parent = element.parent();
        var array = JSON.stringify(data);
        console.log("Elem. Length: ");
        console.log(element.length);

        if (!element.length)
            return;
        console.log("One1");
        if (!index)
            throw new Error("Invalid index as parameter");
        console.log("One2");
        if (!array)
            throw new Error("Invalid value in data-for");
        console.log("One3");
        if (array[0] != "[" || array[array.length - 1] != "]")
            throw new Error("ForEach value is not an array");
        console.log("One4");
        console.log("Two");
        array = eval(array);
        const length = array.length;
        console.log("Three");
        for (let idx = 0; idx < length; idx++) {
            const obj = array[idx];
            const clone = element.clone();
            console.log("Four");
            if (Object(obj)) {
                console.log("Five");
                Object.keys(obj).forEach(key => {
                    const childAttr = `[data-each=${key}]`;
                    console.log(`[data-each=${key}]`);
                    const child = clone.find(childAttr);
                    if (child) {
                        child.empty();
                        console.log("APPENDING BELOW VALUE TO CHILD:");
                        console.log(obj[key]);
                        if (key == "tier") {
                            tierSymbol = "★";
                            console.log(tierSymbol.repeat([parseInt(obj[key])]));
                            child.append(tierSymbol.repeat([parseInt(obj[key])]));
                            console.log("Now displaying tier!");
                        }
                        else if (key == "quantity") {
                            child.append("x" + obj[key]);
                        }
                        else if (obj[key] in types) {
                            console.log(obj[key] + " is in types!");
                            console.log("Appending: " + types[obj[key]]);
                            child.append(types[obj[key]]);
                        } else {
                            console.log("Failed Checks: " + key);
                            child.append(obj[key]);

                        }
                        
                        
                    }

                    if (key == "image") {
                        const av = clone.find(`[data-avatar=${key}]`);
                        const url = obj[key];
                        av.css('background-image', `url('${url}')`);
                        console.log("Found and set BG Image!");
                    }
                })
            }
            clone.appendTo(parent);
        }

        element.remove();

    }


})(jQuery);