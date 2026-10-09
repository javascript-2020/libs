



(()=>{



        function inspect(obj,opts){
        
                                                                                // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
              inspect.colors    = {
                    'bold'        : [1,22],
                    'italic'      : [3,23],
                    'underline'   : [4,24],
                    'inverse'     : [7,27],
                    'white'       : [37,39],
                    'grey'        : [90,39],
                    'black'       : [30,39],
                    'blue'        : [34,39],
                    'cyan'        : [36,39],
                    'green'       : [32,39],
                    'magenta'     : [35,39],
                    'red'         : [31,39],
                    'yellow'      : [33,39]
              };
                                                                                // Don't use 'blue' not visible on cmd.exe
              inspect.styles    = {
                    'special'     : 'cyan',
                    'number'      : 'yellow',
                    'boolean'     : 'yellow',
                    'undefined'   : 'grey',
                    'null'        : 'bold',
                    'string'      : 'green',
                    'date'        : 'magenta',
                    // "name"     : intentionally not styling
                    'regexp'      : 'red'
              };
              
                                                                                // default options
              var ctx   = {
                    seen      : [],
                    stylize   : stylizeNoColor
              };
                                                                                // legacy...
              if(arguments.length>=3)ctx.depth    = arguments[2];
              if(arguments.length>=4)ctx.colors   = arguments[3];
              if(isBoolean(opts)){
                                                                                // legacy...
                    ctx.showHidden    = opts;
              }else if(opts){
                                                                                // got an "options" object
                    _extend(ctx, opts);
              }
                                                                                // set default options
              if(isUndefined(ctx.showHidden))ctx.showHidden   = false;
              if(isUndefined(ctx.depth))ctx.depth   = 2;
              if(isUndefined(ctx.colors))ctx.colors   = false;
              if(isUndefined(ctx.customInspect))ctx.customInspect   = true;
              if(ctx.colors)ctx.stylize   = stylizeWithColor;
              
              return formatValue(ctx,obj,ctx.depth);
              
              
              
              function stylizeNoColor(str,styleType){
              
                    return str;
                    
              }//stylizeNoColor
              
              
              function stylizeWithColor(str,styleType){
              
                    var style   = inspect.styles[styleType];
                    
                    if(style){
                          return '\u001b['+inspect.colors[style][0]+'m'+str+
                                 '\u001b['+inspect.colors[style][1]+'m';
                    }else{
                          return str;
                    }
                    
              }//stylizeWithColor
              
              
              
              function isBoolean(arg){
              
                    return typeof arg==='boolean';
                    
              }//iisBoolean
              
              
              function isUndefined(arg) {
              
                    return arg===void 0;
                    
              }//isUndefined
              
              
              function isFunction(arg) {
              
                    return typeof arg==='function';
                    
              }//isFunction
              
              
              function isString(arg){
              
                    return typeof arg==='string';
                    
              }//isString
              
              
              function isNumber(arg) {
              
                    return typeof arg==='number';
                    
              }//isNumber
              
              
              function isNull(arg) {
              
                    return arg===null;
                    
              }//isNull
              
              
              function hasOwn(obj,prop){
              
                    return Object.prototype.hasOwnProperty.call(obj,prop);
                    
              }//hasOwn
              
              
              function isRegExp(re){
              
                    return isObject(re) && objectToString(re)==='[object RegExp]';
                    
              }//isRegExp
              
              
              function isObject(arg) {
              
                    return typeof arg==='object' && arg!==null;
                    
              }//isObject
              
              
              function isError(e) {
              
                    return isObject(e) && (objectToString(e)==='[object Error]' || e instanceof Error);
                    
              }//isError
              
              
              function isDate(d) {
              
                    return isObject(d) && objectToString(d)==='[object Date]';
                    
              }//isDate
              
              
              function objectToString(o) {
              
                    return Object.prototype.toString.call(o);
                    
              }//objectToString
              
              
              function arrayToHash(array) {
              
                    var hash    = {};
                    array.forEach(function(val,idx){
                    
                          hash[val]   = true;
                          
                    });
                    return hash;
                    
              }//arrayToHash
              
              
  //:
  
              function formatArray(ctx,value,recurseTimes,visibleKeys,keys){
              
                    var output    = [];
                    for(var i=0,l=value.length;i<l;++i){
                    
                          if(hasOwn(value,String(i))){
                                output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),true));
                          }else{
                                output.push('');
                          }
                          
                    }//for
                    
                    keys.forEach(function(key){
                    
                          if(!key.match(/^\d+$/)){
                                output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,true));
                          }
                          
                    });
                    return output;
                    
              }//formatArray
              
              
              function formatError(value){
              
                    return '['+Error.prototype.toString.call(value)+']';
                    
              }//formatError
              
              
              function formatValue(ctx,value,recurseTimes){
              
                                                                                // Provide a hook for user-specified inspect functions.
                                                                                // Check that value is an object with an inspect function on it
                    if( ctx.customInspect &&
                        value &&
                        isFunction(value.inspect) &&
                                                                                // Filter out the util module, it's inspect function is special
                        value.inspect!==inspect &&
                                                                                // Also filter out any prototype objects using the circular check.
                        !(value.constructor && value.constructor.prototype===value)){
                        
                              var ret   = value.inspect(recurseTimes,ctx);
                              if(!isString(ret)){
                                    ret   = formatValue(ctx,ret,recurseTimes);
                              }
                              return ret;
                              
                    }
                    
                                                                                // Primitive types cannot have properties
                    var primitive   = formatPrimitive(ctx,value);
                    if(primitive){
                          return primitive;
                    }
                    
                                                                                // Look up the keys of the object.
                    var keys          = Object.keys(value);
                    var visibleKeys   = arrayToHash(keys);
                    
                    try{
                    
                          if(ctx.showHidden && Object.getOwnPropertyNames){
                                keys    = Object.getOwnPropertyNames(value);
                          }
                          
                    }//try
                    
                    catch (e) {
                      // ignore
                    }
                    
                                                                                // IE doesn't make error fields non-enumerable
                                                                                // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                    if(isError(value) && (keys.indexOf('message')>=0 || keys.indexOf('description')>=0)){
                          return formatError(value);
                    }
                    
                                                                                // Some type of object without properties can be shortcutted.
                    if(keys.length===0){
                          if(isFunction(value)){
                                var name    = value.name ? ': '+value.name : '';
                                return ctx.stylize('[Function'+name+']','special');
                          }
                          if(isRegExp(value)){
                                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                          }
                          if(isDate(value)){
                                return ctx.stylize(Date.prototype.toString.call(value), 'date');
                          }
                          if(isError(value)){
                                return formatError(value);
                          }
                    }
                    
                    var base      = '';
                    var array     = false;
                    var braces    = ['{', '}'];
                    
                                                                                // Make Array say that they are Array
                    if(Array.isArray(value)){
                          array     = true;
                          braces    = ['[',']'];
                    }
                    
                                                                                // Make functions say that they are functions
                    if(isFunction(value)){
                          var n   = value.name ? ': '+value.name : '';
                          base    = ' [Function'+n+']';
                    }
                    
                                                                                // Make RegExps say that they are RegExps
                    if(isRegExp(value)){
                          base    = ' '+RegExp.prototype.toString.call(value);
                    }
                    
                                                                                // Make dates with properties first say the date
                    if(isDate(value)){
                          base    = ' '+Date.prototype.toUTCString.call(value);
                    }
                    
                                                                                // Make error with message first say the error
                    if(isError(value)){
                          base    = ' '+formatError(value);
                    }
                    
                    if(keys.length===0 && (!array || value.length==0)){
                          return braces[0] + base + braces[1];
                    }
                    
                    if(recurseTimes<0){
                          if(isRegExp(value)){
                                return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');
                          } else {
                                return ctx.stylize('[Object]','special');
                          }
                    }
                    
                    ctx.seen.push(value);
                    
                    var output;
                    if(array){
                          output    = formatArray(ctx,value,recurseTimes,visibleKeys,keys);
                    }else{
                          output    = keys.map(function(key) {
                          
                                return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array);
                                
                          });
                    }
                    
                    ctx.seen.pop();
                    
                    return reduceToSingleString(output,base,braces);
                    
              }//formatValue
              
              
              function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){
              
                    var name;
                    var str;
                    var desc;
                    
                    desc    = {value:void 0};
                    try{
                                                                                // ie6 -> navigator.toString
                                                                                // throws Error: Object doesn't support this property or method
                          desc.value    = value[key];
                          
                    }//try
                    
                    catch(e){
                    
                          // ignore
                          
                    }//catch
                    
                    try{
                                                                                // ie10 -> Object.getOwnPropertyDescriptor(window.location, 'hash')
                                                                                // throws TypeError: Object doesn't support this action
                          if(Object.getOwnPropertyDescriptor){
                                desc    = Object.getOwnPropertyDescriptor(value,key) || desc;
                          }
                          
                    }//try
                    
                    catch(e){
                    
                          // ignore
                          
                    }//catch
                    
                    if(desc.get){
                          if(desc.set){
                                str   = ctx.stylize('[Getter/Setter]','special');
                          }else{
                                str   = ctx.stylize('[Getter]','special');
                          }
                    }else{
                          if(desc.set){
                                str   = ctx.stylize('[Setter]','special');
                          }
                    }
                    if(!hasOwn(visibleKeys,key)){
                          name    = '['+key+']';
                    }
                    if(!str){
                          if(ctx.seen.indexOf(desc.value)<0){
                                if(isNull(recurseTimes)){
                                      str   = formatValue(ctx,desc.value,null);
                                } else {
                                      str   = formatValue(ctx,desc.value,recurseTimes-1);
                                }
                                if(str.indexOf('\n')>-1){
                                      if(array){
                                            str   = str.split('\n').map(function(line){
                                            
                                                  return '  '+line;
                                                  
                                            }).join('\n').substr(2);
                                      }else{
                                            str   = '\n'+str.split('\n').map(function(line){
                                            
                                                  return '   '+line;
                                                  
                                            }).join('\n');
                                      }
                                }
                          }else{
                                str   = ctx.stylize('[Circular]','special');
                          }
                    }
                    
                    if(isUndefined(name)){
                          if(array && key.match(/^\d+$/)){
                                return str;
                          }
                          name    = JSON.stringify('' + key);
                          if(name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){
                                name    = name.substr(1,name.length-2);
                                name    = ctx.stylize(name,'name');
                          }else{
                                name    = name.replace(/'/g,"\'")
                                              .replace(/\\"/g,'"')
                                              .replace(/(^"|"$)/g,"'");
                                name    = ctx.stylize(name,'string');
                          }
                    }
                    
                    return name+': '+str;
                    
              }//formatProperty
              
              
              function formatPrimitive(ctx, value) {
              
                    if(isUndefined(value))
                          return ctx.stylize('undefined','undefined');
                          
                    if(isString(value)){
                          var simple    = '\''+JSON.stringify(value).replace(/^"|"$/g,'')
                                                                    .replace(/'/g,"\\'")
                                                                    .replace(/\\"/g,'"')+'\'';
                          return ctx.stylize(simple,'string');
                    }
                    
                    if(isNumber(value))
                          return ctx.stylize(''+value,'number');
                          
                    if(isBoolean(value))
                          return ctx.stylize(''+value,'boolean');
                                                                                // For some reason typeof null is "object", so special case here.
                    if(isNull(value))
                          return ctx.stylize('null','null');
                          
              }//formatPrimitive
              
              
              function reduceToSingleString(output,base,braces){
              
                    var numLinesEst   = 0;
                    var length    = output.reduce(function(prev,cur){
                    
                          numLinesEst++;
                          if(cur.indexOf('\n')>=0)numLinesEst++;
                          return prev+cur.replace(/\u001b\[\d\d?m/g,'').length+1;
                          
                    },0);
                    
                    if(length>60){
                          return braces[0]                        +
                                 (base==='' ? '' : base+'\n ')    +
                                 ' '                              +
                                 output.join(',\n  ')             +
                                 ' '                              +
                                 braces[1];
                    }
                    
                    return braces[0]+base+' '+output.join(', ')+' '+braces[1];
                    
              }//reduceToSingleString
              
              
              function _extend(origin,add){
                                                                                // Don't do anything if add isn't an object
                    if(!add || !isObject(add))return origin;
                    
                    var keys    = Object.keys(add);
                    var i       = keys.length;
                    while(i--){
                    
                          origin[keys[i]]   = add[keys[i]];
                          
                    }//while
                    return origin;
                    
              }//_extend
              
              
        }//inspect
        
        
        
  //:
  
  
        inspect.build   = build;
        
        function build(args){
        
              var str     = '';
              var args    = [...args];
              args        = args.map(v=>{
              
                    var type    = datatype(v);
                    switch(type){
                    
                      case 'function'         :
                      case 'asyncfunction'    : str   = v.toString();       break;
                      case 'string'           : str   = v;                  break;
                      default                 : str   = inspect(v,{colors:true});         break;
                      
                    }//switch
                    return str;
                    
              });
              
              var txt     = args.join(' ');
              return txt;
              
        }//build
        
        
        build.html    = function(args){
        
              var txt     = build(args);
              var html    = ansi(txt);
              return html;
              
        }//html
        
        
  //:
  
  
        inspect.format    = format;
        
        function format(args){
        
              if(typeof args[0]!=='string')return args;
              
              let fmt         = args[0];
              let out         = [];
              let argIndex    = 1;
              
              out.push(fmt.replace(/%[sdifoO]/g,match=>{
              
                    var val   = args[argIndex++];
                    
                    switch (match) {
                    
                      case '%s'   : return ''+val;
                      case '%d'   :
                      case '%i'   : return parseInt(val, 10);
                      case '%f'   : return parseFloat(val);
                      case '%o'   :
                      case '%O'   : return format.fn(val);
                      default     : return match;
                      
                    }//switch
                    
              }));
              
              
              while(argIndex<args.length){
              
                    var v   = args[argIndex++];
                    out.push(v);
                    
              }//while
              
              return out;
              
              
              function fn(val){
              
                    if(val===null)return 'null';
                    if(val===undefined)return 'undefined';
                    
                    switch(typeof val){
                    
                      case 'number'   : return val;
                      case 'string'   : return val;
                      
                    }//switch
                    
                    return JSON.stringify(val,null,4);
              }//fn
              
        }//format
        
        
        format.fn   = function(val,seen=new WeakSet()){
        
              if(val === null)return 'null';
              if(val === undefined)return 'undefined';
              
                                                                                  // Prevent circular references
              if(typeof val==='object' || typeof val==='function'){
                    if(seen.has(val))return '[ Circular ]';
                    seen.add(val);
              }
              
                                                                                  // Primitive types
              switch(typeof val){
              
                case 'number'     : return String(val);
                case 'string'     : return val;
                case 'boolean'    : return String(val);
                case 'bigint'     : return val.toString() + 'n';
                case 'symbol'     : return val.toString();
                case 'function'   : return `[Function${val.name ? ': '+val.name : ''}]`;
                
              }//switch
              
              
              var type    = datatype(val);
                                                                                console.log('format.fn',type);
              if(type=='array'){
                    val       = val.map(v=>format.fn(v,seen));
                    var str   = val.join(', ')
                    return '['+str+']';
              }
              
              if(type=='date'){//val instanceof Date){
                    return `Date("${val.toISOString()}")`;
              }
              
              if(val instanceof RegExp){
                    return val.toString();
              }
              
              if(val instanceof Error){
                    return `${val.name}: ${val.message}`;
              }
              
              if(val instanceof Map){
                    const entries = [];
                    for (const [k, v] of val.entries()) {
                      entries.push(`${fn(k, seen)} => ${format.fn(v, seen)}`);
                    }
                    return `Map { ${entries.join(', ')} }`;
              }
              
              if(val instanceof Set){
                    const entries   = [...val].map(v=>format.fn(v,seen));
                    return `Set { ${entries.join(', ')} }`;
              }
              
              if(ArrayBuffer.isView(val) && !(val instanceof DataView)){
                    return `${val.constructor.name} [ ${Array.from(val).join(', ')} ]`;
              }
              
              if(val instanceof Node){
                    if(val.nodeType===1){
                          return `<${val.tagName.toLowerCase()}>`;
                    }
                    return val.toString();
              }
              
              if(typeof val==='object'){
                    const entries   = Object.entries(val).map(([k,v])=>{
                    
                          return `${k}: ${format.fn(v,seen)}`;
                          
                    });
                    return `{ ${entries.join(', ')} }`;
              }
              
              try{
              
                    return JSON.stringify(val);
                    
              }//try
              catch{
              
                    return String(val);
                    
              }//catch
              
        }//fn
        
        
        function ansi(text) {
                                                                                // Escape HTML special characters to prevent injection/rendering issues
            const safeText = text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
                
            // Map ANSI codes to their corresponding CSS styles using your dictionary values
            const colorMap = {
                1: { style: 'font-weight: bold;', end: 22 },
                3: { style: 'font-style: italic;', end: 23 },
                4: { style: 'text-decoration: underline;', end: 24 },
                7: { style: 'filter: invert(100%);', end: 27 },
                30: { style: 'color: black;', end: 39 },
                31: { style: 'color: red;', end: 39 },
                32: { style: 'color: green;', end: 39 },
                33: { style: 'color: goldenrod;', end: 39 },
                34: { style: 'color: blue;', end: 39 },
                35: { style: 'color: magenta;', end: 39 },
                36: { style: 'color: cyan;', end: 39 },
                37: { style: 'color: white;', end: 39 },
                90: { style: 'color: gray;', end: 39 }
            };
            
            // Reverse map for end codes
            const endToStarts = {};
            for (const [startCode, data] of Object.entries(colorMap)) {
                if (!endToStarts[data.end]) endToStarts[data.end] = [];
                endToStarts[data.end].push(Number(startCode));
            }
            
            let activeStyles = [];
            
            // Regex to match ANSI escape sequences (e.g., \x1b[31m or \u001b[1;31m)
            const ansiRegex = /\x1b\[([0-9;]*)m/g;
            
            // Split text by ANSI sequences and process chunks
            let parts = safeText.split(ansiRegex);
            let result = [];
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    // Regular text content
                    const part = parts[i];
                    if (part) {
                        if (activeStyles.length > 0) {
                            const combinedStyle = activeStyles.join(' ');
                            result.push(`<span style="${combinedStyle}">${part}</span>`);
                        } else {
                            result.push(part);
                        }
                    }
                } else {
                    // ANSI control code group
                    const codesStr = parts[i];
                    if (!codesStr || codesStr === '0') {
                        activeStyles = [];
                        continue;
                    }
                    
                    const codes = codesStr.split(';').map(Number);
                    for (const code of codes) {
                        if (code === 0) {
                            activeStyles = [];
                        } else if (colorMap[code]) {
                            const styleStr = colorMap[code].style;
                            if (!activeStyles.includes(styleStr)) {
                                activeStyles.push(styleStr);
                            }
                        } else if (endToStarts[code]) {
                            for (const startCode of endToStarts[code]) {
                                const styleStr = colorMap[startCode]?.style;
                                const index = activeStyles.indexOf(styleStr);
                                if (index > -1) {
                                    activeStyles.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
            
            return result.join('');
            
        }  //ansi
        
        
        return inspect;
        
        
        
})();