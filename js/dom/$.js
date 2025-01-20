(()=>{

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

        
        $.input   = {};
        $.is      = {};
        $.center  = {};
        
        
        $.all=function(root,sel){
        
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
        
        
        $.show=function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              node.style.display    = '';
              
        }//show
        
        
        $.hide=function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              node.style.display    = 'none';
              
        }//hide
        
        
        $.rem=function(root,sel){
        
              var node    = $(root,sel);
              if(!node){
                    return;
              }
              node.remove();
              return node;
              
        }//remove


        $.clear=function(root){
        
              root.replaceChildren();
              
        }//clear
        
        
        $.nodename=function(root,sel){
        
              var node    = $(root,sel);
              if(!node)return;
              var nn    = node.nodeName.toLowerCase();
              return nn;
              
        }//nodename
        
        

        //$.computed:b
        $.computed=new Proxy({},{get:(target,prop)=>(node,numeric)=>{
        
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
        $.style=new Proxy({},{get:(target,prop)=>(node,numeric=true)=>{
        
              var value     = node.style[prop];
              if(numeric!==false){
                    value   = parseFloat(value);
              }
              return value;
              
        }});
        
        //$.create:b
        $.create=new Proxy({},{get (target,prop){
        
              var node    = document.createElement(prop);
              
              function set(...args){
              
                    args.forEach(arg=>{
                    
                          var type    = datatype(arg);
                          set[type](arg);
                          
                    });
                    
                    return node;
                    
              }//set
              
              set.object=function(attr){
              
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
                                for(var sname in attr.style)
                                      node.style[sname]    = attr.style[sname];
                          }else{
                                node[name]    = attr[name];
                          }
                          
                    })//for
                    
              }//object
              
              set.string=function(str){
              
                    var tn    = document.createTextNode(str);
                    node.append(tn);
                    
              }//string
              
              
              return set;
              
        }});
        
  //:

        
        $.chkbox=function(root,sel,callback){
        
              if(!callback){
                    callback    = sel;
                    sel         = root;
                    root        = document;
              }
              
              var node        = $(root,sel);
              var chkbox      = $(node,'[type=checkbox]');
              node.onclick    = click;
              
              var chk   = {read,set,id:node.id};
              return chk;
              
              
              function click(e){
              
                    if(e.target!==chkbox){
                          chkbox.checked    = !chkbox.checked;
                    }
                    callback(chk);
                    
              }//click
              
              function read(){return chkbox.checked}
              function set(v=true){chkbox.checked=v}
              
        }//chkbox
        
        
        $.chkbox.group=function(root,sel0){
        
              var list    = [];
              var n       = arguments.length;
              for(var i=1;i<n;i++){
              
                    var sel     = arguments[i];
                    var chk     = $.chkbox(root,sel,chk=>set(chk.id));
                    list.push(chk);
                    
              }//for
              
              
              function read(){
              
                    var n   = list.length;
                    for(var i=0;i<n;i++){
                    
                          var chk   = list[i];
                          if(chk.read()){
                                return chk;
                          }
                          
                    }//for
                    
              }//read
              
              function set(id){list.forEach(chk=>chk.id==id ? chk.set() : chk.set(false))}
              set.index=function(index){set(list[index].id)}
              
              
              var group   = {read,set};
              return group;
              
        }//group
        
        
        $.input.paste=function(root,name,def=''){
        
              $(root,`#${name}-paste`).onclick    = async e=>{
                                                        var txt                   = await navigator.clipboard.readText();
                                                        $(root,`#${name}`).value    = txt;
                                                  };
              $(root,`#${name}`).value            = def;
              
        }//input.paste


        $.is.parent=function(par,node){
        
              while(node){
              
                    if(node===par)return true;
                    node    = node.parentNode;
                    
              }//while
              return false;
              
        }//is.parent


        $.center.width=function(node){
        
              var w             = $.computed.width(node)||$.style.width(node);
              if(!w){
                    return;
              }
              var mw            = document.body.clientWidth;
              var l             = (mw-w)/2;
              node.style.left   = l+'px';
              
        }//width
        
        $.center.height=function(node){
        
              var h               = $.computed.height(node)||$.style.height(node);
              if(!h){
                    return;
              }
              var mh              = document.body.clientHeight;
              var h               = (mh-h)/2;
              node.style.height   = h+'px';
              
        }//height
        
        
        $.drag=function(el,callback,type,params){
        
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



        $.select=function(root,sel){
        
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

        
        $.buildnode2=function(node,params){
        
              for(var key in params){
              
                    if(key in node.style){
                          node.style[key]   = params[key];
                    }
                    
              }//for
              
        }//buildnode2
        
        
        $.scrollbottom=function(node){
        
              var h             = node.scrollHeight;
              node.scrollTop    = h;
              
        }//scrollbottom
        
        
        $.track=function(node,callback){
        
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


        
        $.caret=function(node,timeout=50){
        
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
        
        
        $.mousetext=function(e,text){
        
              var left            = e.pageX+'px';
              var top             = e.pageY+'px';
              var style           = {position:'absolute',left,top,padding:'10px',border:'1px solid dimgray',borderRadius:'3px',zIndex:999999,background:'white'};
              var append          = document.body;
              var div             = $.create.div({style,text,append});
              var rem             = ()=>div.remove();
              div.onmouseleave    = rem;
              div.onclick         = rem;
              var time            = 700;
              setTimeout(rem,time);
              
        }//mousetext
        
        
        $.slider=function(node1,slider_node,node2,callback,params={}){

              if(typeof node1=='string'){
                    node1   = $(view,node1);
              }
              if(typeof slider_node=='string'){
                    slider_node   = $(view,slider_node);
              }
              if(typeof node2=='string'){
                    node2   = $(view,node2);
              }

              $.track(slider_node,slider);


              function slider(ox,oy){

                    if(params.mode=='vert'){
                          slider.vert(ox);
                    }else{
                          slider.horiz(oy);
                    }

              }//slider


              slider.md=function(){

                    if(typeof callback?.md=='function'){
                          callback.md();
                    }

              }//slider.md


              slider.mu=function(){

                    if(typeof callback?.mu=='function'){
                          callback.mu();
                    }

              }//slider.mu


              slider.vert=function(ox){

                    var w1    = node1.offsetWidth;
                    var w2    = node2.offsetWidth;

                    if(w1+ox<25)return;
                    if(w2-ox<25)return;

                    node1.style.width   = w1+ox+'px';
                    node2.style.width   = w2-ox+'px';

              }//vert


              slider.horiz=function(oy){

                    var h1    = node1.offsetHeight;
                    var h2    = node2.offsetHeight;

                    if(h1+oy<40)return;
                    if(h2-oy<40)return;

                    node1.style.height    = h1+oy+'px'
                    node2.style.height    = h2-oy+'px';

              }//horiz

        }//slider

        
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
              var n       = list.length;
              for(var i=0;i<n;i++){
              
                    var stylesheet    = list[i];
                                                                      //stylesheet.ownerNode &&
                                                                      //console.log(stylesheet.ownerNode.id);
                    var rules         = stylesheet.cssRules;
                    var n             = rules.length;
                    for(var j=0;j<n;j++){
                    
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
                    
              }//for
              return null;
                    
        }//find.css
        
        
        $.stylesheet.copyrule=function(style,selector,style2){

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

        
        $.stylesheet.insert=function(style){
        
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
        
        
        
        
        
return $;

})();
