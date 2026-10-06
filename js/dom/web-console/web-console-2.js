





(function(){

  var obj   = {};
  
  
        var df              = false;
        
        
  //:
  
        var ace
        ;
        
        
        obj.initmod   = function(params){
        
              ace     = params.ace;
              if(!ace)debugger;
              
              
        }//initmod
        
        
  //:
  
  
        obj.init    = function(){
        
              Range           = ace.require('ace/range').Range;
              
        }//init
        
        
  //:
  
  
        obj.create    = function(root){
        
              var params    = {
                    mode            : 'r',
                    onInput         : function (text) {},
                    onRightClick    : function (obj) {},
              };
              
              var cons      = new Console(params,root);
                                                                                //window.console.log(cons);
              return cons;
              
        }//create
        
        
        
        
        
        
    //var Range = ace.require("ace/range").Range;
    var log = console.log.bind(console);
    var fileRegex = /((?:https?:\/\/|www\.)(?:(?:[^\.\:])*(?:\.|\:))(?:[^:\/]+\/)*([^:\/]+)*)(?::(\d*))?(?::(\d*))?/;
    var evalFileRegex = /\((((?:[^):\/]+\/)*([^):\/]+)*)(?::(\d*))?(?::(\d*))?)/;
    
    var htmlEscape = function(text, format) {
        if (typeof text == "symbol") text = text.toString();
        text = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        if (format === false) return text;
        if (!format) return text.replace(/\n/g, "&crarr;");
        return text
            .replace(/^(\s(?!\n))+/gm, function(m) {
                return (
                    "<span style='display:inline-block;margin-left:" +
                    m.length * 10 +
                    "px'></span>"
                );
            })
            .replace(/\n/g, "<br>")
            .replace(
                /\t/g,
                "<span style='display:inline-block;margin-left:20px'></span>"
            );
    };
    
    var maxLogLength = 140;
    var maxHistoryLength = 140;
    var maxObjectPreviewLength = 60;
    var maxStringPreviewLength = 30;
    
    var inputCodeTemplate =
        "<div class='js-console inputLine'>" +
            "<div class='js-console inputArrow'></div>" +
            "<div class='js-console inputCode'></div>" +
            "<div style='clear:both'></div>" +
        "</div>";
    var outputTemplate =
        "<div class='js-console outputLine'>" +
            "<div class='js-console outputIcon'></div>" +
            "<div class='js-console outputData'></div>" +
            "<div style='clear:both'></div>" +
        "</div>";
    var consoleTemplate =
        "<div class='js-console output'></div>" +
        inputCodeTemplate.replace("inputCode", "inputCode input");
        
    var dividerClass = "ace_print-margin";
    var lBrace = "<span class='ace_lparen'>{</span>";
    var rBrace = "<span class='ace_rparen'>}</span>";
    var lBrack = "<span class='ace_lparen'>(</span>";
    var rBrack = "<span class='ace_rparen'>)</span>";
    var lSquareBrack = "<span class='ace_lparen'>[</span>";
    var rSquareBrack = "<span class='ace_rparen'>]</span>";
    var ddd = "<span class='dotdotdot'>...</span>";
    var colon = "<span class='ace_punctuation ace_operator'>:</span>";
    var comma = "<span class='ace_punctuation ace_operator'>,</span>";
    var undef = "<span class='ace_constant ace_language'>undefined</span>";
    var nul = "<span class='ace_constant ace_language'>null</span>";
    var func = "<span class=''>f</span>" + lBrack + rBrack;
    
    function getNumericText(val, clas) {
        return "<span class='" + (clas || "") + " ace_constant ace_numeric'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getStringText(val, clas) {
        return "<span class='" + (clas || "") + " ace_string'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getRegexText(val, clas) {
        return "<span class='" + (clas || "") + " ace_string'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getBooleanText(val, clas) {
        return "<span class='" + (clas || "") + " ace_constant ace_language ace_boolean'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getErrorText(val, clas) {
        return "<span class='" + (clas || "") + " errorText'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getKeyText(val, clas) {
        return "<span class='" + (clas || "") + " objectKey ace_constant ace_language'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getSymbolText(val, clas) {
        return "<span class='" + (clas || "") + " objectSymbol ace_string ace_language'>" + htmlEscape(val.toString()) + "</span>";
    }
    function getKeySymbolText(val, clas) {
        return "<span class='" + (clas || "") + " objectKeySymbol ace_constant ace_language'>" + htmlEscape(val.toString()) + "</span>";
    }
    
    function setupEditor(el, style, mode) {
        var editor = ace.edit(el);
        editor.setTheme("ace/theme/" + style);
        editor.getSession().setMode("ace/mode/" + mode);
        editor.getSession().setUseWrapMode(true);
        editor.getSession().setUseSoftTabs(true);
        editor.setShowPrintMargin(false);
        editor.setOptions({ maxLines: Infinity });
        editor.$blockScrolling = Infinity;
        editor.renderer.setShowGutter(false);
        editor.on("blur", function() {
            editor.session.selection.clearSelection();
        });
        return editor;
    }
    
    function createCollapseEl(clas, parClass) {
        var temp = document.createElement("div");
        temp.innerHTML =
            "<span class='js-console-collapsible js-console " + (parClass || "") + "'>" +
                "<div class='js-console-collapsible header-outer js-console'>" +
                    "<span class='js-console header-arrow'></span>" +
                    "<div class='js-console-collapsible header js-console " + clas + "'></div>" +
                "</div>" +
                "<br>" +
                "<div class='js-console-collapsible content js-console " + clas + "' style='display:none'></div>" +
            "</span>";
        var element = temp.firstElementChild;
        var headerOuter = element.querySelector(".header-outer");
        
        headerOuter.addEventListener("mouseup", function(e) {
            if (e.button === 0) {
                var consoleEl = element.closest(".js-console.root");
                var offset = consoleEl.scrollHeight - consoleEl.clientHeight - consoleEl.scrollTop;
                
                e.preventDefault();
                var contentEl = element.querySelector(".content");
                if (!element.classList.contains("open")) {
                    element.classList.add("open");
                    contentEl.style.display = "";
                } else {
                    element.classList.remove("open");
                    contentEl.style.display = "none";
                }
                
                var maxScroll = element.getBoundingClientRect().top - consoleEl.getBoundingClientRect().top + consoleEl.scrollTop;
                var minScroll = maxScroll - consoleEl.clientHeight + element.querySelector(".header").clientHeight;
                
                consoleEl.scrollTop = Math.min(
                    maxScroll,
                    Math.max(minScroll, consoleEl.scrollHeight - consoleEl.clientHeight - offset)
                );
            }
        });
        
        headerOuter.addEventListener("mousedown", function(e) {
            if (e.button === 0 && e.detail > 1) {
                e.preventDefault();
            }
        });
        
        return element;
    }
    
    function specialObj(obj) {
        return obj instanceof Function || obj instanceof RegExp || obj instanceof Error;
    }
    
    function getFileLocationElement(line, clas) {
        var fileMatch = line.match(fileRegex);
        var evalFileMatch = line.match(evalFileRegex);
        var out = {};
        if (fileMatch) {
            var file = fileMatch[2] || "(index)";
            var lineNumber = fileMatch[3] || "";
            if (file && lineNumber) file += ":";
            
            out.el = createCollapseEl("");
            out.el.querySelector(".header").insertAdjacentHTML("beforeend", file.replace(/%20/g, " ") + lineNumber);
            out.el.querySelector(".content").insertAdjacentHTML(
                "beforeend",
                "<a href='" + fileMatch[1] + "'>" + fileMatch[0].replace(/%20/g, " ") + "</a>"
            );
            out.match = fileMatch;
            out.start = fileMatch.index;
            out.end = out.start + fileMatch[0].length;
        } else if (evalFileMatch) {
            var file = evalFileMatch[3];
            var lineNumber = evalFileMatch[4] || "";
            if (file && lineNumber) file += ":";
            
            out.el = createCollapseEl("");
            out.el.querySelector(".header").insertAdjacentHTML("beforeend", file.replace(/%20/g, " ") + lineNumber);
            out.el.querySelector(".content").insertAdjacentHTML("beforeend", evalFileMatch[1].replace(/%20/g, " "));
            out.match = evalFileMatch;
            out.end = evalFileMatch.index + evalFileMatch[0].length;
            out.start = out.end - evalFileMatch[1].length;
        } else {
            return;
        }
        out.lineNumber = lineNumber;
        out.file = file;
        out.el.classList.add(clas);
        return out;
    }
    
    function DataObject(data, outputLineData, parent, name) {
        this.data = data;
        this.element = null;
        this.previewElement = null;
        this.prefix = "";
        this.outputLineData = outputLineData;
        this.parent = parent;
        this.name = name;
    }
    
    DataObject.prototype.getPreviewElement = function(prefix, depth) {
        if (prefix) this.prefix = prefix;
        if (this.data != null && typeof this.data == "object" && !specialObj(this.data)) {
            return this.createObjectName(depth);
        } else {
            var temp = document.createElement("div");
            temp.innerHTML = this.getNonObjectData(true);
            return temp.firstElementChild;
        }
    };
    
    DataObject.prototype.getElement = function(prefix, depth) {
        var This = this;
        var hadElement = this.element;
        if (prefix) this.prefix = prefix;
        if (depth == null) depth = 0;
        
        if (this.data instanceof Error) {
            if (!this.element) {
                this.element = createCollapseEl("errorMessage", "errorOutput");
                this.element.querySelector(".header").insertAdjacentHTML("beforeend", getErrorText(this.data));
                var errorStack = htmlEscape(this.data.stack, false);
                var errorLines = errorStack.split("\n");
                errorLines.shift();
                errorLines.forEach(function(line) {
                    var lineEl = document.createElement("span");
                    This.element.querySelector(".content").appendChild(lineEl);
                    var file = getFileLocationElement(line, "errorLocation");
                    if (file) {
                        lineEl.insertAdjacentHTML("beforeend", "<span style='margin-left:20px;'>" + line.substring(0, file.start) + "</span>");
                        lineEl.appendChild(file.el);
                        lineEl.insertAdjacentHTML("beforeend", "<span>" + line.substring(file.end) + "</span><br>");
                    } else {
                        lineEl.insertAdjacentHTML("beforeend", "<span style='margin-left:20px;'>" + line + "</span><br>");
                    }
                });
            }
        } else if (this.data != null && (typeof this.data == "object" || specialObj(this.data))) {
            var newElement = false;
            if (!this.element) {
                newElement = true;
                var isArray = this.data instanceof Array;
                var isFunc = this.data instanceof Function;
                this.element = createCollapseEl((isArray ? "array" : isFunc ? "function" : "object") + "Output");
            }
            
            if (depth <= 1) {
                if (!this.previewElement) {
                    if (specialObj(this.data)) {
                        this.previewElement = this.getPreviewElement(this.prefix);
                    } else {
                        this.previewElement = this.createObjectName(0);
                    }
                }
                var headerEl = this.element.querySelector(".header");
                headerEl.innerHTML = "";
                headerEl.appendChild(this.previewElement);
            }
            if (depth == 0) {
                this.createObjectData();
            } else if (newElement) {
                this.element.querySelector(".header-outer").addEventListener("click", function(e) {
                    var opens = This.element.classList.contains("open");
                    if (opens) {
                        This.getElement();
                        if (!specialObj(This.data))
                            This.element.querySelector(".header").innerHTML = This.prefix;
                    } else {
                        This.element.querySelector(".content").innerHTML = "";
                        if (!specialObj(This.data))
                            This.element.querySelector(".header").appendChild(This.previewElement);
                    }
                });
            }
        } else {
            if (!this.element) {
                var temp = document.createElement("div");
                temp.innerHTML = this.getNonObjectData();
                this.element = temp.firstElementChild;
            }
        }
        
        if (!hadElement && this.element) {
            this.element.data = this;
            this.element.addEventListener("mouseup", function(e) {
                if (e.button === 2) {
                    This.outputLineData.console.$trigger("rightClick", This);
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            });
        }
        
        return this.element;
    };
    
    DataObject.prototype.getNonObjectData = function(preview) {
        if (typeof this.data == "number")
            return "<span class='numberOutput'>" + this.prefix + getNumericText(this.data, "value") + "</span>";
        else if (typeof this.data == "string") {
            var text = this.data;
            if (preview && text.length > maxStringPreviewLength)
                text = text.substring(0, maxStringPreviewLength - 3) + "...";
            return "<span class='stringOutput'><table><tr><td>" + this.prefix + "</td><td class='indent'>" + getStringText('"' + text + '"', "value") + "</td></tr></table></span>";
        } else if (typeof this.data == "boolean")
            return "<span class='undefinedOutput'>" + this.prefix + getBooleanText(this.data, "value") + "</span>";
        else if (typeof this.data == "function")
            return "<span class='functionOutput'>" + this.prefix + func + "</span>";
        else if (this.data instanceof RegExp)
            return "<span class='regexOutput'>" + this.prefix + getRegexText(this.data, "value") + "</span>";
        else if (this.data === null)
            return "<span class='nullOutput'>" + this.prefix + nul + "</span>";
        else if (this.data === undefined)
            return "<span class='undefinedOutput'>" + this.prefix + undef + "</span>";
        else if (this.data instanceof Error)
            return "<span class='errorOutput'>" + this.prefix + getErrorText(this.data) + "</span>";
        else if (typeof this.data == "symbol")
            return "<span class='symbol'>" + this.prefix + getSymbolText(this.data) + "</span>";
        return "<span class='rawOutput'>" + this.prefix + this.data + "</span>";
    };
    
    DataObject.prototype.createObjectData = function() {
        var keys = Object.getOwnPropertyNames(this.data);
        if (Object.getOwnPropertySymbols)
            keys = keys.concat(Object.getOwnPropertySymbols(this.data));
        if (this.data && this.data.__proto__ != Object.prototype)
            keys.push("__proto__");
            
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            try {
                var obj;
                if (this.getterObj && key != "__proto__")
                    obj = this.getterObj[key];
                else obj = this.data[key];
                
                var dObj = new DataObject(obj, this.outputLineData, this, key);
                if (key == "__proto__")
                    dObj.getterObj = this.getterObj || this.data;
                    
                var contentEl = this.element.querySelector(".content");
                contentEl.appendChild(
                    dObj.getElement(
                        (typeof key == "symbol" ? getKeySymbolText(key) : getKeyText(key)) + colon + " ",
                        1
                    )
                );
                
                if (i < keys.length - 1)
                    contentEl.appendChild(document.createElement("br"));
            } catch (e) {}
        }
    };
    
    DataObject.prototype.createObjectName = function(depth) {
        var keys = Object.keys(this.data);
        if (Object.getOwnPropertySymbols)
            keys = keys.concat(Object.getOwnPropertySymbols(this.data));
        var isArray = this.data instanceof Array;
        var maxLength = maxObjectPreviewLength;
        
        var previewEl = document.createElement("span");
        previewEl.insertAdjacentHTML("beforeend", this.prefix);
        if (isArray) previewEl.insertAdjacentHTML("beforeend", "(" + keys.length + ") ");
        else if (this.data.__proto__ != Object.prototype)
            previewEl.insertAdjacentHTML("beforeend", this.data.__proto__.constructor.name + " ");
        previewEl.insertAdjacentHTML("beforeend", isArray ? lSquareBrack : lBrace);
        
        if (depth < 1) {
            for (var i = 0; i < keys.length && previewEl.textContent.length < maxLength; i++) {
                var key = keys[i];
                var obj;
                if (this.getterObj && key != "__proto__")
                    obj = this.getterObj[key];
                else obj = this.data[key];
                
                var dObj = new DataObject(obj);
                if (key == "__proto__")
                    dObj.getterObj = this.getterObj || this.data;
                    
                if (i > 0) previewEl.insertAdjacentHTML("beforeend", comma + " ");
                
                var previewSubEl = dObj.getPreviewElement(
                    isArray && key == i ? "" : htmlEscape(key) + colon + " ",
                    depth + 1
                );
                previewEl.appendChild(previewSubEl);
            }
            if (i < keys.length) previewEl.insertAdjacentHTML("beforeend", comma + " " + ddd);
        } else {
            previewEl.insertAdjacentHTML("beforeend", ddd);
        }
        
        previewEl.insertAdjacentHTML("beforeend", isArray ? rSquareBrack : rBrace);
        return previewEl;
    };
    
    var Console = function(data, element) {
        if (!(this instanceof Console)) {
            return new Console(data, element);
        }
        
        if (!data && element instanceof HTMLElement) {
            // Allows calling as new Console(element) if options are omitted
            var temp = data;
            data = element;
            element = temp;
        }
        
        if (!element && data instanceof HTMLElement) {
            element = data;
            data = {};
        }
        
        if (!data) data = {};
        
        var This = this;
        var el = element;
        el.innerHTML = consoleTemplate;
        el.classList.add("js-console", "root");
        el.oncontextmenu = function() { return false; };
        
        if (!data.theme) data.theme = "xcode";
        if (!data.mode) data.mode = "javascript";
        if (!data.style) data.style = "light";
        
        this.outputEl = el.querySelector(".output");
        this.inputEditor = setupEditor(el.querySelector(".input"), data.theme, data.mode);
        
        this.inputEditor.on("change", function() {
            el.scrollTop = el.scrollHeight;
            setTimeout(function() {
                el.scrollTop = el.scrollHeight;
            });
        });
        
        this.inputEditor.commands.addCommand({
            name: "enter",
            bindKey: { win: "Enter", mac: "Enter" },
            exec: function(editor) {
                This.$handleInput();
                return true;
            }
        });
        this.inputEditor.commands.addCommand({
            name: "arrowUp",
            bindKey: { win: "Up", mac: "Up" },
            exec: function(editor) {
                if (editor.selection.getCursor().row == 0) {
                    This.$prevHistory();
                    return true;
                }
                return false;
            }
        });
        this.inputEditor.commands.addCommand({
            name: "arrowDown",
            bindKey: { win: "Down", mac: "Down" },
            exec: function(editor) {
                if (editor.selection.getCursor().row == editor.session.getLength() - 1) {
                    This.$nextHistory();
                    return true;
                }
                return false;
            }
        });
        
        el.classList.add("ace-" + data.theme, data.style);
        
        el.addEventListener("click", function(e) {
            if (window.getSelection().toString() == "")
                This.inputEditor.focus();
        });
        
        this.data = data;
        this.outputs = [];
        this.inputs = [];
        this.elementLog = [];
        this.historyIndex = 0;
        this.element = element;
        this.maxLogLength = maxLogLength;
        this.maxHistoryLength = maxHistoryLength;
        this.showIcons = data.showIcons || false;
        this.messageID = 0;
        this.listeners = {
            input: [],
            elementRemove: [],
            rightClick: [],
            terminate: []
        };
        
        var keys = Object.keys(this.listeners);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var name = "on" + key[0].toUpperCase() + key.substring(1);
            if (this.data[name]) this.on(key, this.data[name]);
        }
        
        element.console = this;
    };
    
    Console.prototype.$handleInput = function(force) {
        var text = this.inputEditor.getValue();
        var elData = this.input(text);
        if (!this.$trigger("input", text) || force) {
            this.inputEditor.setValue("", -1);
        } else {
            this.$removeElement(elData.element);
        }
    };
    
    Console.prototype.input = function(text) {
        var temp = document.createElement("div");
        temp.innerHTML = inputCodeTemplate;
        var el = temp.firstElementChild;
        this.outputEl.appendChild(el);
        
        var editor = setupEditor(el.querySelector(".inputCode"), this.data.theme, this.data.mode);
        editor.setReadOnly(true);
        editor.renderer.$cursorLayer.element.style.display = "none";
        editor.setValue(text, -1);
        
        var ThisConsole = this;
        el.querySelectorAll("*").forEach(function(child) {
            child.addEventListener("click", function(e) {
                if (editor.getSelectedText() == "") ThisConsole.inputEditor.focus();
            });
        });
        
        var dataObj = {
            text: text,
            type: "input",
            element: el,
            editor: editor,
            id: this.messageID++,
            console: this
        };
        var prevInp = this.inputs[this.inputs.length - 1];
        if (!prevInp || text != prevInp.text) this.inputs.push(dataObj);
        this.elementLog.push(dataObj);
        this.historyIndex = this.inputs.length;
        this.$removeHistory();
        this.$removeElement();
        return dataObj;
    };
    
    Console.prototype.$print = function(clas) {
        var isMaxScroll = this.element.scrollTop >= this.element.scrollHeight - this.element.clientHeight - 10;
        
        var temp = document.createElement("div");
        temp.innerHTML = outputTemplate;
        var el = temp.firstElementChild;
        var out = el.querySelector(".outputData");
        
        var objects = Array.from(arguments);
        objects.shift();
        var dataObj = {
            objects: objects,
            type: clas,
            element: el,
            id: this.messageID++,
            console: this
        };
        
        var dataObjects = [];
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg instanceof Console.LineNumber || arg instanceof Console.PlainText || arg instanceof Console.HtmlElement) {
                out.appendChild(arg.element);
            } else {
                var dataObject = new DataObject(arg, dataObj);
                dataObjects.push(dataObject);
                out.appendChild(dataObject.getElement());
            }
        }
        
        el.classList.add(clas);
        if (this.showIcons)
            el.classList.add("ace_gutter-cell", "ace_" + (clas == "warn" ? "warning" : clas));
            
        this.outputEl.appendChild(el);
        if (isMaxScroll) this.element.scrollTop = this.element.scrollHeight;
        
        dataObj.dataObjects = dataObjects;
        this.outputs.push(dataObj);
        this.elementLog.push(dataObj);
        this.$removeElement();
        return dataObj;
    };
    
    Console.prototype.output = function() {
        var args = Array.from(arguments);
        args.unshift("return");
        var ret = this.$print.apply(this, args);
        ret.element.insertAdjacentHTML("beforeend", "<div class='" + dividerClass + "'></div>");
        return ret;
    };
    
    Console.prototype.log = function() {
        var args = Array.from(arguments);
        this.$makeStringsPlain(args);
        args.unshift("log");
        var ret = this.$print.apply(this, args);
        ret.arguments = Array.from(arguments);
        this.$addDivider(ret.element);
        return ret;
    };
    
    Console.prototype.error = function() {
        var args = Array.from(arguments);
        this.$makeStringsPlain(args);
        args.unshift("error");
        return this.$print.apply(this, args);
    };
    
    Console.prototype.warn = function() {
        var args = Array.from(arguments);
        this.$makeStringsPlain(args);
        args.unshift("warn");
        return this.$print.apply(this, args);
    };
    
    Console.prototype.info = function() {
        var args = Array.from(arguments);
        this.$makeStringsPlain(args);
        args.unshift("info");
        return this.$print.apply(this, args);
    };
    
    Console.prototype.clear = function() {
        while (this.elementLog.length > 0) {
            if (!this.$removeElement(0)) break;
        }
        return this;
    };
    
    Console.prototype.$removeElement = function(element) {
        if (element == null) {
            while (this.elementLog.length > this.maxLogLength) {
                if (!this.$removeElement(0)) break;
            }
            return;
        }
        
        var obj, index;
        if (typeof element == "number") {
            obj = this.elementLog[element];
            index = element;
        } else {
            element = element.closest(".js-console.outputLine, .js-console.inputLine");
            for (var i = 0; i < this.elementLog.length; i++) {
                var e = this.elementLog[i];
                if (e.element === element) {
                    obj = e;
                    index = i;
                    break;
                }
            }
        }
        
        if (obj) {
            if (this.$trigger("elementRemove", obj)) return;
            obj.element.remove();
            if (obj.editor) obj.editor.destroy();
            this.elementLog.splice(index, 1);
            return true;
        }
    };
    
    Console.prototype.$removeHistory = function(element) {
        if (element == null) {
            while (this.inputs.length > this.maxHistoryLength) {
                if (!this.$removeHistory(0)) break;
            }
            return;
        }
        var index = typeof element == "number" ? element : 0;
        this.inputs.splice(index, 1);
        if (this.historyIndex > index) this.historyIndex--;
        return true;
    };
    
    Console.prototype.$prevHistory = function() {
        this.historyIndex = Math.max(this.historyIndex - 1, 0);
        var h = this.inputs[this.historyIndex];
        if (h && h.text) this.inputEditor.setValue(h.text, 1);
        return this;
    };
    
    Console.prototype.$nextHistory = function() {
        this.historyIndex = Math.min(this.historyIndex + 1, this.inputs.length);
        if (this.historyIndex == this.inputs.length) {
            this.inputEditor.setValue("", 1);
        } else {
            var h = this.inputs[this.historyIndex];
            if (h && h.text) this.inputEditor.setValue(h.text, 1);
        }
        return this;
    };
    
    Console.prototype.$makeStringsPlain = function(args) {
        for (var i = 0; i < args.length; i++)
            if (typeof args[i] == "string" && args[i].length > 0)
                args[i] = new Console.PlainText(args[i]);
    };
    
    Console.prototype.$addDivider = function(element) {
        element.insertAdjacentHTML("beforeend", "<div class='" + dividerClass + "'></div>");
    };
    
    Console.prototype.on = function(event, func) {
        if (this.listeners[event]) this.listeners[event].push(func);
    };
    
    Console.prototype.$trigger = function(event) {
        var listeners = this.listeners[event];
        if (listeners) {
            var args = Array.from(arguments);
            args.shift();
            var out = undefined;
            for (var i = 0; i < listeners.length; i++) {
                var ret = listeners[i].apply(this, args);
                if (ret !== undefined) out = ret;
            }
            return out;
        }
        return false;
    };
    
    Console.PlainText = function(text) {
        this.text = text;
        var temp = document.createElement("span");
        temp.innerHTML = "<span class='js-console plainText'>" + htmlEscape(text, true) + "</span>";
        this.element = temp.firstElementChild;
    };
    
    Console.LineNumber = function(file) {
        var temp = document.createElement("span");
        temp.innerHTML = "<span class='lineNumber'>" + htmlEscape(file || "") + "</span>";
        this.element = temp.firstElementChild;
    };
    
    Console.HtmlElement = function(element) {
        this.element = element;
    };
    
    // Expose globally so `new Console(...)` works cleanly
    //window.Console = Console;
    
  return obj;
  
})();
