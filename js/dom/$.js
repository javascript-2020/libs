



(()=>{


        $.initmod=function(){}
        
        
        $.in      = {};
        $.icon    = {};
        
        
        
        function $(root,sel){
        
              if(arguments.length==2){
                    if(!sel){
                          if(datatype.is.node(root)){
                                return root;
                          }
                    }
                    if(typeof root=='string'){
                          var t   = root;
                          root    = sel;
                          sel     = t;
                    }
              }else{
                    if(datatype.is.node(root)){
                          return root;
                    }
                    sel     = root;
                    root    = document;
              }
              var node    = root.querySelector(sel);
              return node;
              
        }//$
        
        
        $.full    = function(sel,par,all){
        
              var list      = par ? [par] : [document.head,document.body];
              var result    = [];
              
              while(list.length){
              
                    var node    = list.shift();
                    
                    if(node){
                          if( node.nodeType==Node.ELEMENT_NODE              ||
                              node.nodeType==Node.DOCUMENT_FRAGMENT_NODE
                          ){
                                var f   = false;
                                if(node.matches && node.matches(sel))f    = true;
                                if(node.nodeName.toLowerCase()===sel)f   = true;
                                if(f){
                                      if(!all){
                                            return node;
                                      }
                                      result.push(node);
                                }
                                
                                if(node.shadowRoot){
                                      list.push(node.shadowRoot);
                                }
                                if(node.childNodes){
                                      [...node.childNodes].forEach(node=>list.push(node));
                                }
                          }
                    }
                    
              }//while
              
              if(!all){
                    return null;
              }
              return result;
              
        }//full
        
        
        $.$   = function(rootnode,nodename){
        
              if(rootnode){
                    var node    = $(rootnode,nodename);
                    return node;
              }
              var node    = $.full(nodename);
              return node;
              
        }//$
        
        
        $.input   = {};
        $.is      = {};
        $.center  = {};
        
        
        $.all   = function(root,sel){
        
              if(!sel){
                    if(datatype.is.node(root)){
                          return root;
                    }
                    sel   = root;
                    root    = document;
              }
              var list    = [...root.querySelectorAll(sel)];
              return list;
              
        }//all
        
        
        $.show    = function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              node.style.display    = '';
              
        }//show
        
        
        $.hide    = function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              node.style.display    = 'none';
              
        }//hide
        
        
        $.rem   = function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              node.remove();
              return node;
              
        }//remove
        
        
        $.clear   = function(root){
        
              root.replaceChildren();
              
        }//clear
        
        
        $.nodename    = function(root,sel){
        
              var node    = $(root,sel);
              if(!node)return;
              var nn    = node.nodeName.toLowerCase();
              return nn;
              
        }//nodename
        
        
        
        //$.computed:b
        
        $.computed    = new Proxy({},{get:(target,prop)=>(node,numeric)=>{
        
              var doc       = node.ownerDocument;
              var win       = doc.defaultView;
              if(!win){
                    return null;
              }
              var cstyle    = win.getComputedStyle(node);
              var value     = cstyle.getPropertyValue(prop);
              if(numeric!==false){
                    value   = parseFloat(value);
              }
              return value;
              
        }});
        
        
        //$.style:b
        
        $.style   = new Proxy({},{get:(target,prop)=>(node,numeric=true)=>{
        
              var value     = node.style[prop];
              if(numeric!==false){
                    value   = parseFloat(value);
              }
              return value;
              
        }});
        
        
        //$.create:b
        
        $.create    = new Proxy({},{get (target,prop){
        
              var node    = document.createElement(prop);
              
              function set(...args){
              
                    args.forEach(arg=>{
                    
                          var type    = datatype(arg);
                          set[type](arg);
                          
                    });
                    
                    return node;
                    
              }//set
              
              
              set.object    = function(attr){
              
                    var keys    = Object.keys(attr);
                    keys.forEach(name=>{
                    
                          if(name=='text'){
                                attr['textContent']    = attr['text'];
                                name    = 'textContent';
                          }
                          if(name=='append'){
                                var par    = attr['append'];
                                if(par===null || par==='body'){
                                      par   = document.body;
                                }
                                if(par==='head'){
                                      par   = document.head;
                                }
                                par.append(node);
                                return;
                          }
                          
                          if(name=='style'){
                                if(typeof attr.style=='string'){
                                      node.style    = attr.style;
                                }else{
                                      for(var sname in attr.style){
                                      
                                            node.style[sname]    = attr.style[sname];
                                            
                                      }//for
                                }
                          }else{
                                //if(name==='onclick')debugger;
                                node[name]    = attr[name];
                          }
                          
                    })//for
                    
              }//object
              
              
              set.string    = function(str){
              
                    var tn    = document.createTextNode(str);
                    node.append(tn);
                    
              }//string
              
              
              return set;
              
        }});
        
        
        $.define    = function(html){
        
              html                  = html.trim();
              var template          = document.createElement('template');
              template.innerHTML    = html;
              var node              = template.content.firstChild;
              return node;
              
        }//define
        
        
  //:
  
  
        $.chkbox    = function(root,sel,callback){
        
              if(callback===undefined){
                    if(arguments.length==2){
                          if(typeof sel=='function'){
                                callback    = sel;
                                sel         = root;
                                root        = document;
                          }
                    }else{
                          if(typeof root=='string'){
                                sel     = root;
                                root    = document;
                          }
                    }
              }
              
              var node        = $(root,sel);
              var chkbox      = $(node,'[type=checkbox]');
              node.onclick    = click;
              
              
              var chk   = {read,set,id:node.id,root:node,chkbox};
              
              Object.defineProperty(chk,'checked',{
              
                    get:()=>chkbox.checked,
                    set:v=>chkbox.checked=!!v,
              });
              
              return chk;
              
              
              function click(e){
              
                    if(e.target!==chkbox){
                          chkbox.checked    = !chkbox.checked;
                    }
                    
                    //chk.checked  = chkbox.checked;
                    
                    if(typeof callback=='function'){
                          callback(chk);
                    }
                    
              }//click
              
              function read(){return chkbox.checked}
              function set(v=true){chkbox.checked=v}
              
        }//chkbox
        
        
        $.chkbox.group    = function(root,sel0){
        
              var list    = [];
              
              add.apply(null,arguments);
              
              function add(root,sel0){
              
                    var n       = arguments.length;
                    for(var i=1;i<n;i++){
                    
                          var sel     = arguments[i];
                          var chk     = $.chkbox(root,sel,chk=>set(chk.id));
                          list.push(chk);
                          
                    }//for
                    
              }//add
              
              
              function read(){
              
                    var n   = list.length;
                    for(var i=0;i<n;i++){
                    
                          var chk   = list[i];
                          if(chk.read()){
                                return chk;
                          }
                          
                    }//for
                    
              }//read
              
              
              function set(id){
              
                    list.forEach(chk=>chk.id!=id && chk.set(false));
                    
                    var chk   = list.find(chk=>chk.id==id);
                    if(typeof group.callback=='function'){
                          group.callback(chk,id);
                    }
                    
              }//set
              
              
              set.index   = function(index){set(list[index].id)}
              
              var group   = {read,set,add,callback:null};
              Object.defineProperty(group,'len',{get:()=>list.length});
              
              return group;
              
        }//group
        
        
        $.input.paste   = function(root,name,def=''){
        
              $(root,`#${name}-paste`).onclick    = async e=>{
              
                                                          var txt                     = await navigator.clipboard.readText();
                                                          $(root,`#${name}`).value    = txt;
                                                          
                                                    };
              $(root,`#${name}`).value            = def;
              
        }//input.paste
        
        
        $.is.parent   = function(par,node){
        
              while(node){
              
                    if(node===par)return true;
                    node    = node.parentNode;
                    
              }//while
              return false;
              
        }//is.parent
        
        
        $.is.node   = function(node){
        
              if(typeof node!='object')return false;
              if(node===null)return false;
              if(!node.nodeType)return false;
              if(!node.nodeName)return false;
              return true;
              
        }//node
        
        
        $.center.width    = function(node){
        
              var w             = $.computed.width(node)||$.style.width(node);
              if(!w){
                    return;
              }
              var mw            = document.body.clientWidth;
              var l             = (mw-w)/2;
              node.style.left   = l+'px';
              
        }//width
        
        
        $.center.height   = function(node){
        
              var h               = $.computed.height(node)||$.style.height(node);
              if(!h){
                    return;
              }
              var mh              = document.body.clientHeight;
              var h               = (mh-h)/2;
              node.style.height   = h+'px';
              
        }//height
        
        
        $.drag    = function(el,callback,type,params){
        
              params    = params||{};
              type      = type||'both';
              
              timer     = timer(mu);
              
              var dragtype;
              var top;
              var left;
              var width;
              var height;
              var mx;
              var my;
              var doc;
              
              el.addEventListener('mousedown',md);
              
              
              function md(e){
              
                    doc   = el.ownerDocument;
                    mx    = e.pageX;
                    my    = e.pageY;
                    
                    dragtype    = null;
                    
                    if(params.cancelevent2===true){
                          if(e.shiftKey){
                                e.stopPropagation();
                          }
                    }else{
                          if(params.cancelevent!==false){
                                e.stopPropagation();
                          }
                    }
                    
                    if(type==='both'||type==='pos'){
                          if(e.button===0){
                                dragtype    = 'pos';
                                left        = get.left(el);
                                top         = get.top(el);
                          }//left
                    }
                    
                    if(type==='both'||type==='size'){
                          if(e.button===2){
                                dragtype    = 'size';
                                width       = get.width(el);
                                height      = get.height(el);
                          }//right
                    }
                    
                    if(type==='horiz'){
                          if(e.btnname==='right'){
                                dragtype    = 'horiz';
                                width       = get.width(el);
                          }
                    }
                    
                    if(type==='vert'){
                          if(e.btnname==='right'){
                                dragtype    = 'vert';
                                height      = get.height(el);
                          }
                    }
                    
                    doc.addEventListener('mouseup',mu);
                    doc.addEventListener('mousemove',mm);
                    doc.addEventListener('contextmenu',cm);
                    el.addEventListener('contextmenu',cm);
                    
                    timer.reset();
                    
                    return false;
                    
              }//md
              
              
              function cm(e){
              
                    e.preventDefault();
                    
              }//contextmenu
              
              
              function mu(e){
              
                    timer.abort();
                    
                    doc.removeEventListener('mouseup',mu);
                    doc.removeEventListener('mousemove',mm);
                    doc.removeEventListener('contextmenu',cm);
                    
              }//mu
              
              
              function mm(e){
              
                    timer.reset();
                    
                    var ox    = e.pageX-mx;
                    var oy    = e.pageY-my;
                    mx        = e.pageX;
                    my        = e.pageY;
                    
                    e.preventDefault();
                    
                    if(dragtype==='pos'){
                          left    = left+ox;
                          el.style.left   = left+'px';
                          
                          top     = top+oy;
                          el.style.top    = top+'px';
                    }
                    
                    if( (dragtype==='horiz')    ||
                        (dragtype==='size')     ){
                          var w   = width+ox;
                          if(params.minw){
                                if(h<params.minw){
                                      w   = params.minw;
                                }
                          }
                          if(params.maxw){
                                if(w>params.maxw){
                                      w   = params.maxw;
                                }
                          }
                          width   = w;
                          el.style.width    = width+'px';
                    }
                    
                    if( (dragtype==='vert')   ||
                        (dragtype==='size')   ){
                          var h   = height+oy;
                          if(params.minh){
                                if(h<params.minh){
                                      h   = params.minh;
                                }
                          }
                          if(params.maxh){
                                if(h>params.maxh){
                                      h   = params.maxh;
                                }
                          }
                          height    = h;
                          el.style.height   = height+'px';
                    }
                    
                    if(callback){
                          callback(e,dragtype,ox,oy,el);
                    }
                    
              }//mm
              
              var get   = new Proxy({},{get:(target,prop)=>node=>{
              
                    var doc       = node.ownerDocument;
                    var win       = doc.defaultView;
                    var cstyle    = win.getComputedStyle(node);
                    var value     = cstyle.getPropertyValue(prop);
                    value         = parseInt(value);
                    return value;
                    
              }});
              
              
              function timer(callback,auto=false,delay=500){
              
                    var timer;
                    var abort   = ()=>clearTimeout(timer);
                    var reset   = ()=>(abort(),timer=setTimeout(callback,delay));
                    auto && reset();
                    return {reset,abort};
                    
              }//timer
              
        }//drag
        
        
        $.select    = function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              
              switch(node.nodeName){
              
                case 'INPUT'    :
                case 'TEXTAREA'   : node.select();        break;
                default           :
                                    var range   = document.createRange();
                                    range.selectNodeContents(node);
                                    var sel     = window.getSelection();
                                    sel.removeAllRanges();
                                    sel.addRange(range);
                                    
              }//switch
              
              return node;
              
        }//select
        
        
        $.buildnode2    = function(node,params){
        
              for(var key in params){
              
                    if(key in node.style){
                          node.style[key]   = params[key];
                    }
                    
              }//for
              
        }//buildnode2
        
        
        $.scrollbottom    = function(node){
        
              var h             = node.scrollHeight;
              node.scrollTop    = h;
              
        }//scrollbottom
        
        
        $.track   = function(node,callback){
        
              node.addEventListener('mousedown',md);
              
              var mx;
              var my;
              
              
              function md(e){
              
                    mx    = e.pageX;
                    my    = e.pageY;
                    document.addEventListener('mousemove',mm);
                    document.addEventListener('mouseup',mu);
                    
                    if(typeof callback.md=='function'){
                          callback.md();
                    }
                    
              }//md
              
              
              function mm(e){
              
                    var ox    = e.pageX-mx;
                    var oy    = e.pageY-my;
                    mx        = e.pageX;
                    my        = e.pageY;
                    
                    if(typeof callback=='function'){
                          callback(ox,oy);
                    }else{
                          if(typeof callback.mm=='function'){
                                callback.mm(ox,oy);
                          }
                          
                    }
                    
              }//mm
              
              
              function mu(e){
              
                    document.removeEventListener('mousemove',mm);
                    document.removeEventListener('mouseup',mu);
                    
                    if(typeof callback.mu=='function'){
                          callback.mu();
                    }
                    
              }//mu
              
        }//track
        
        
        $.caret   = function(node,timeout=50){
        
              if(timeout){
                    setTimeout(caret,timeout);
                    return;
              }
              caret();
              
              
              function caret(){
              
                    var doc     = node.ownerDocument;
                    var win     = doc.defaultView;
                    
                    var range   = doc.createRange();
                    var sel     = win.getSelection();
                    
                    range.selectNodeContents(node);
                    range.collapse(false);
                    
                    sel.removeAllRanges();
                    sel.addRange(range);
                    
                    node.focus();
                    range.detach();
                    
              }//caret
              
        }//caret
        
        
        $.mousetext   = function(e,text,{ox=5,oy=5}={}){
        
              var left            = e.pageX+ox+'px';
              var top             = e.pageY+oy+'px';
              var style           = {
                                          position        : 'absolute',
                                          left            : left,
                                          top             : top,
                                          padding         : '10px',
                                          border          : '1px solid dimgray',
                                          borderRadius    : '3px',
                                          zIndex          : 999999,
                                          background      : 'white'
                                    };
              var append          = document.body;
              var div             = $.create.div({style,text,append});
              var rem             = ()=>div.remove();
              div.onmouseleave    = rem;
              div.onclick         = rem;
              var time            = 700;
              setTimeout(rem,time);
              
        }//mousetext
        
        
        $.slider    = function(node1,slider_node,node2,callback,params={}){
        
              var minw        = params.minw||40;
              var minh        = params.minh||40;
              params.root   ||= document.body;
              
              if(typeof node1=='string'){
                    node1         = $(params.root,node1);
              }
              if(typeof slider_node=='string'){
                    slider_node   = $(params.root,slider_node);
              }
              if(typeof node2=='string'){
                    node2         = $(params.root,node2);
              }
                                                                                params.df && console.log(node1,slider_node,node2);
              $.track(slider_node,slider);
              
              
              function slider(ox,oy){
              
                    if(params.mode=='horiz'){
                          slider.horiz(oy);
                    }else{
                          slider.vert(ox);
                    }
                    
              }//slider
              
              
              slider.md   = function(){
              
                    document.body.style.userSelect    = 'none';
                    if(typeof callback?.md=='function'){
                          callback.md();
                    }
                    
              }//slider.md
              
              
              slider.mu   = function(){
              
                    document.body.style.userSelect    = '';
                    if(typeof callback?.mu=='function'){
                          callback.mu();
                    }
                    
              }//slider.mu
              
              
              slider.vert   = function(ox){
              
                    var w1    = node1.offsetWidth;
                    var w2    = node2.offsetWidth;
                                                                                params.df && console.log(ox,w1,w2);
                    if(w1+ox<minw)return;
                    if(w2-ox<minw)return;
                    
                    node1.style.width   = w1+ox+'px';
                    node2.style.width   = w2-ox+'px';
                    
              }//vert
              
              
              slider.horiz    = function(oy){
              
                    var h1    = node1.offsetHeight;
                    var h2    = node2.offsetHeight;
                                                                                params.df && console.log(oy,h1,h2);
                    if(h1+oy<minh)return;
                    if(h2-oy<minh)return;
                    
                    node1.style.height    = h1+oy+'px'
                    node2.style.height    = h2-oy+'px';
                    
              }//horiz
              
              return slider_node;
              
        }//slider
        
        
        $.slider.glass    = function(node1,slider_node,node2,callback,params={},mod){
        
              if(typeof mod.glass=='function'){
                    if(!callback.md){
                          callback.md   = ()=>mod.glass();
                    }
                    if(!callback.mu){
                          callback.mu   = ()=>mod.glass(false);
                    }
              }
              
              var node    = $.slider(node1,slider_node,node2,callback,params);
              return node;
              
        }//glass
        
        
        $.closest   = function(node,css){
        
              node    = node.host||node;
              
              while(node){
              
                    var f   = node.closest(css);
                    if(f){
                          return f;
                    }
                    node    = node.getRootNode()?.host;
                    
              }//while
              return null;
              
        }//closest
        
        
        $.icon.copy    = function(icon){
        
              var css;
              var root;
              
              if(arguments.length==2){
                    var a1    = arguments[0];
                    var a2    = arguments[1];
                    if(typeof a1=='string'){
                          css     = a1;
                          root    = a2;
                    }else{
                          css     = a2;
                          root    = a1;
                    }
                    icon        = $(root,css);
              }
/*
              if(typeof icon=='string'){
                    var css     = icon;
                    var root    = arguments[1];
                    icon        = $(root,css);
              }
*/
              var par         = icon.parentNode;
              var input       = par.querySelector('input:not([type])');
              
              $.icon.copy2(icon,input);
              
        }//copy
        
        
        $.icon.copy2    = function({icon,input,callback}){
        
              if(arguments.length!=1){
                    [icon,input]    = arguments;
              }
              
              icon.onclick    = click;
              
              async function click(e){
              
                    var txt   = input.value;
                    await navigator.clipboard.writeText(txt);
                    $.mousetext(e,'copied');
                    if(callback){
                          callback(icon);
                    }
                    
              }//click
              
        }//copy2
        
        
        $.icon.paste    = function(icon){
        
              var css;
              var root;
              
              if(arguments.length==2){
                    var a1    = arguments[0];
                    var a2    = arguments[1];
                    if(typeof a1=='string'){
                          css     = a1;
                          root    = a2;
                    }else{
                          css     = a2;
                          root    = a1;
                    }
                    icon        = $(root,css);
              }
/*
              if(typeof icon=='string'){
                    var css     = icon;
                    var root    = arguments[1];
                    icon        = $(root,css);
              }
*/
              var par         = icon.parentNode;
              var input       = par.querySelector('input:not([type])');
              
              $.icon.paste2(icon,input);
              
        }//paste
        
        
        $.icon.paste2   = function({icon,input,callback,remove}){
        
              if(arguments.length!=1){
                    [icon,input]    = arguments;
              }
              
              icon.onclick    = click;
              
              
              async function click(){
              
                    var txt       = await navigator.clipboard.readText();
                    input.value   = txt;
                    if(remove){
                          await navigator.clipboard.writeText('');
                    }
                    if(callback){
                          callback(icon);
                    }
                    
              }//click
              
        }//paste2
        
        
        $.stylesheet        = {};
        $.stylesheet.find   = {};
        
        $.stylesheet.find.css   = function(selector,rtype){
        
              var doc   = document;
              if(arguments.length==3){
                    doc         = arguments[0];
                    selector    = arguments[1];
                    rtype       = arguments[2];
              }
                                                                        //console.log(document.title);
              var list    = doc.styleSheets;
              var ni      = list.length;
              for(var i=0;i<ni;i++){
              
                    var stylesheet    = list[i];
                                                                      //stylesheet.ownerNode &&
                                                                      //console.log(stylesheet.ownerNode.id);
                    var err;
                    try{
                    
                          var rules   = stylesheet.cssRules;
                          
                    }//try
                    catch(err2){
                    
                          err   = err2;
                          
                    }//catch
                    if(err){
                                                                                console.log(err);
                                                                                console.log(stylesheet);
                    }else{
                    
                          var nj             = rules.length;
                          for(var j=0;j<nj;j++){
                          
                                var rule    = rules[j];
                                if(rule.selectorText===selector){
                                      switch(rtype){
                                      
                                        case 'cssText'    :
                                        case 'csstext'    : return rule.cssText;
                                        case 'style'      : return rule.parentStyleSheet;
                                        case 'selector'   :
                                        case 'sel'        : return rule.selectorText;
                                        
                                      }//switch
                                      return rule.cssText;
                                }
                                
                          }//for
                          
                    }
                    
              }//for
              return null;
              
        }//find.css
        
        
        $.stylesheet.copyrule   = function(style,selector,style2){
        
              if(typeof style=='string'){
                    style     = $(style);
              }
              if(typeof style2=='string'){
                    style2    = $(style);
              }
              
              var rules                     = style.sheet.cssRules;
              var n                         = rules.length;
              var css;
              for(var i=0;i<n;i++){
              
                    var rule    = rules[i];
                    if(rule.selectorText===selector){
                          css   = rule.cssText;
                          break;
                    }
                    
              }//for
              if(css){
                    style2.sheet.insertRule(css);
              }
              
        }//copyrule
        
        
        $.stylesheet.insert   = function(style){
        
              var doc   = document;
              var n     = arguments.length;
              for(var i=1;i<n;i++){
              
                    var sel   = arguments[i];
                    var css   = $.stylesheet.find.css(doc,sel,'csstext');
                    if(css){
                          style.sheet.insertRule(css);
                    }else{
                          console.log(sel,'not found');
                    }
                    
              }//for
              
        }//insert
        
        
        $.loc   = function(node){
        
        
        }//loc
        
        
        $.in.shadow   = function(node){
        
              var root    = node.getRootNode();
              var type    = datatype(root);
              if(type==='shadowroot'){
                    return true;
              }
              return false;
              
        }//shadow
        
        
  //:
  
  
  
        $.editor    = function(node,{mode,kd}={}){
        
              mode    ||= 'javascript';
              
              switch(mode){
              
                case 'js'   : mode    = 'javascript';       break;
                
              }//switch
              
              if(kd){
                    node.onkeydown    = kd;
              }
              
              var editor    =  ace.edit(node);
              editor.setShowInvisibles(false);
              editor.setShowPrintMargin(false);
              editor.setPrintMarginColumn(false);
              editor.setBehavioursEnabled(false);
              editor.setDisplayIndentGuides(false);
              editor.setScrollSpeed(2);
              editor.setFontSize(16);
              editor.session.setOptions({tabSize:2,useSoftTabs:true});
              //editor.setGhostText('\n\nctrl-enter - run & autosave\nctrl-s - save\nctrl-del - delete');
              editor.session.setMode('ace/mode/'+mode);
              
              editor.focus();
              
              
              if($.in.shadow(node)){
                    var shadow    = node.getRootNode();
                    import_style();
              }
              
              
              return editor;
              
              
              import_style.ct   = 0;
              
              function import_style(){
              
                    import_style.ct++;
                    if(import_style.ct>=10){
                                                                            console.log('import_style timeout');
                          return;
                    }
                    
                    var ids   = ['ace-tm','ace_editor\\.css','ace_scrollbar\\.css','error_marker\\.css',];
                    var n     = ids.length;
                    for(var i=0;i<n;i++){
                    
                          var id      = ids[i];
                          var style   = $('#'+id);
                          if(!style){
                                setTimeout(import_style,500);
                                return;
                          }
                          
                    }//for
                    
                    for(var i=0;i<n;i++){
                    
                          var id      = ids[i];
                          var style   = $('#'+id);
                          var copy    = style.cloneNode(true);
                          shadow.append(copy);
                          
                    }//for
                    
                    
              }//style
              
        }//editor
        
        
        $.editor.max    = function(node,params={}){
        
              var {mode,kd}   = params;
              
              var editor    = $.editor.apply(null,arguments);
              editor.session.on('change',onchange);
              editor.setOption('maxLines',Infinity);
              
              onchange();
              
              return editor;
              
              
              function onchange(e){
                                                                                //console.log('onchange');
                    var lh      = editor.renderer.lineHeight;
                    var lines   = editor.session.getLength();
                    var h       = lh*lines;
                    
                    var w       = editor.renderer.scrollBar.getWidth()
                    h+=w;
                    
                    editor.container.style.height = h+'px';
                    editor.resize();
                    
                    if(params.on?.change){
                          params.on.change();
                    }
                    
              }//onchange
              
        }//max
        
        
        
        
        //  https://github.com/ajaxorg/ace
        //  https://github.com/ajaxorg/ace-builds
        
        //  https://stackoverflow.com/questions/tagged/ace-editor?tab=Active
        
        
        
        $.editor.ace    = function(){
        
              var src   = [
                    'https://cdn.jsdelivr.net/npm/ace-builds@1.37.0/src-min-noconflict/ace.js',
                    'https://ajaxorg.github.io/ace-builds/src-noconflict/ace.js',
              ];
              
              var resolve,promise=new Promise(res=>resolve=res);
              
              var script      = document.createElement('script');
              script.src      = src[1];
              script.onload   = onload;
              document.head.append(script);
              
              return promise;
              
              
              function onload(){
              
                    resolve(window.ace);
                    
              }//onload
              
        }//ace
        
        
        $.editor.ace.import_style   = function(root,complete){
        
              var ids   = ['ace-tm','ace_editor\\.css','ace_scrollbar\\.css','error_marker\\.css',];
              var ct    = 0;
              var max   = 10;
              
              import_style();
              
              function import_style(){
              
                    ct++;
                    if(ct>=max){
                                                                            console.log('import_style timeout');
                          return;
                    }
                    
                    
                    var n     = ids.length;
                    for(var i=0;i<n;i++){
                    
                          var id      = ids[i];
                          var style   = $('#'+id);
                          if(!style){
                                setTimeout(import_style,500);
                                return;
                          }
                          
                    }//for
                    
                    for(var i=0;i<n;i++){
                    
                          var id      = ids[i];
                          var style   = $('#'+id);
                          var copy    = style.cloneNode(true);
                          root.append(copy);
                          
                    }//for
                    
                    if(typeof complete=='function'){
                          complete();
                    }
                    
              }//import_style
              
        }//import_style
        
        
        
        
        
        $.htmlentities    = function(v){
        
              if(!v){
                    return '';
              }
              
              var str   = v;
              if($.is.node(v)){
                    str   = v.innerHTML;
              }
              
              const div         = document.createElement('div');
              div.textContent   = str;
              var entities      = div.innerHTML;
              return entities;
              
        }//htmlentities
        
        
        $.htmlentities.decode   = function(v){
        
              if(!v){
                    return '';
              }
              
              var str   = v;
              if($.is.node(v)){
                    str   = v.innerHTML;
              }
              
              var txt         = document.createElement('textarea');
              txt.innerHTML   = str;
              var html        = txt.value;
              return html;
              
        }//decode
        
        
        
        
        
        
        
  return $;
  
})();



