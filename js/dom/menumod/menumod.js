        function menumod(){
        
          var obj   = {};
          
  //:
              obj.callback    = {};
              
              var list      = [];
              list.find     = (v,rtype)=>find(list,v,rtype);
              
              
              var stack     = [];
              stack.find    = (v,rtype)=>find(stack,v,rtype);
              
              
              function find(list,v,rtype){
              
                    var n   = list.length;
                    for(var i=0;i<n;i++){
                    
                          var o   = list[i];
                          
                          var f   = false;
                          
                          if(v===i)f    = true;
                          if(v===o.node)f   = true;
                          if(v===o.node.id)f   = true;
                          
                          if(f){
                                switch(rtype){
                                  case 'index'      : return i;
                                  case 'node'       : return o.node;
                                  case 'callback'   : return o.callback;
                                }
                                return o;
                          }
                          
                    }//for
                    return null;
                    
              }//find
              
              
              var state         = {};
              
              state.cur         = null;
              state.prev        = null;
              
              state.opt         = null;
              state.select      = {};
              state.prev_opt    = {};
              
              
              var defz          = 12;
              
              
              var get           = {};
              
  //:
  
              obj.import=function(str){
              
                    state   = JSON.parse(str);
                    
              }//import
              
              
              obj.export=function(){
              
                    var str   = JSON.stringify(state);
                    return str;
                    
              }//export
              
  //:
  
              obj.click=function(node,drag=true,center=true,callback_fns){
              
                    add(node,drag,center,callback_fns);
                    
                    return click;
                    
                    
                    function click(e){
                    
                          open(node);
                          
                    }//click
                    
              }//click
              
  //:
  
              obj.add=function(node,drag='both',center=true,callback){return add(node,drag,center,callback)}
              
              function add(node,drag='both',center=true,callback){
                                                                                //console.log('add');
                    list.push({node,callback});
                    add.node(node,drag,center);
                    
              }//add
              
              
              obj.add.stack=function(node,drag='both',center=true,callback){return add.stack(node,drag,center,callback)}
              
              add.stack=function(node,drag,center,callback){
              
                    var cur                   = get.cur('node');
                    state.prev_opt[cur.id]    = state.opt;
                    
                    stack.push({node,callback});
                    add.node(node,drag,center);
                    
                    show(node);
                    
              }//add.stack
              
              
              add.node=function(node,drag,center){
              
                    node.style.zIndex   = defz;
                    node.tabIndex       = -1;
                    
                    if(drag){
                          $.drag(node,null,drag);
                    }
                    if(center){debugger;
                          $.center.width(node);
                    }
                    
                    var timer;
                    node.addEventListener('focusout',focusout);
                    node.onmouseenter   = e=>clearTimeout(timer);
                    node.onmouseleave   = e=>{
                    
                          timer    = setTimeout(fn,500);
                          
                          function fn(){
                                                                                //console.log('mouseleave',node);
                                var cur       = get.cur('node');
                                                                                //console.log('cur',cur);
                                if(cur!==node){
                                                                                //console.log('cur');
                                      return;
                                }
                                
                                if(stack.length){
                                      stack.pop();
                                      hide(node);
                                      cur   = get.cur('node');
                                      show(cur);
                                      return;
                                }
                                close();
                                
                          }//fn
                          
                    }//ml
                    
                    
                    var opts    = get.opts(node);
                    
                    opts.forEach((opt,i)=>{
                    
                          opt.addEventListener('click',e=>{
                          
                                e.stopPropagation();
                                
                                if(state.opt===i){
                                      state.select[node.id]   = !state.select[node.id];
                                }else{
                                      if(state.opt!==null){
                                            var prev                = opts[state.opt];
                                            prev.style.background   = '';
                                      }
                                      state.select[node.id]   = true;
                                }
                                opt.style.background    = 'lightyellow';
                                state.opt               = i;
                                
                                callback('opt',opt);
                                
                          });//click
                          
                          opt.addEventListener('mouseenter',e=>{
                          
                                  if(state.select[node.id]){
                                        return;
                                  }
                                  if(state.opt!==null){
                                        var prev                = opts[state.opt];
                                        prev.style.background   = '';
                                  }
                                  
                                  opt.style.background    = 'lightyellow';
                                  state.opt               = i;
                                  
                          });//mouseenter
                          
                          opt.addEventListener('mouseleave',e=>{
                          
                                if(state.select[node.id]){
                                      return;
                                }
                                if(state.opt===i){
                                      opt.style.background    = '';
                                      state.opt               = null;
                                }
                                
                          });//onmouseleave
                          
                    });
                    
              }//add.node
              
  //:
  
              obj.open=function(node){return open(node)}
              
              function open(node){
                                                                                //console.log('open',node);
                    if(typeof node=='string'){
                          node    = list.find(node,'node');
                    }
                    
                    if(state.cur!==null){
                          close();
                    }
                    
                    var index;
                    if(!node){
                          if(state.prev===null){
                                if(list.length==0){
                                      return;
                                }
                                index   = 0;
                          }else{
                                index   = state.prev;
                          }
                          node    = list.find(index,'node');
                    }else{
                          index   = list.find(node,'index');
                    }
                    
                    state.cur   = index;
                    show(node);
                    
                    keydown.add(kd);
                    
              }//open
              
              
              obj.close=function(){return close()}
              
              function close(){
                                                                                //console.log('close',state.cur);
                    keydown.rem(kd);
                    
                    if(state.cur===null){
                          return;
                    }
                    
                    var n   = stack.length;
                    for(var i=n-1;i>=0;i--){
                    
                          var node    = get.cur('node');
                          hide(node);
                          stack.pop();
                          
                          node        = get.cur('node');
                          show(node);
                          
                    }//for
                    
                    var node      = list.find(state.cur,'node');
                    hide(node);
                    state.prev    = state.cur;
                    state.cur     = null;
                    
                    //editor.focus();
                    
              }//close
              
  //:
  
              function show(node){
                                                                                //console.log('show',node.id);
                    state.opt   = null;
                    
                    var opts    = get.opts(node);
                    if(opts.length){
                          state.opt               = state.prev_opt[node.id]||0;
                          var opt                 = opts[state.opt];
                          opt.style.background    = 'lightyellow';
                    }
                    
                    $.show(node);
                    node.focus();
                    callback('show');
                    
              }//show
              
  //:
  
              function hide(node){
                                                                              //console.log('hide',node.id);
                    state.prev_opt[node.id]       = state.opt;
                    if(typeof state.opt=='number'){
                          var opts                = get.opts(node);
                          var opt                 = opts[state.opt];
                          opt.style.background    = '';
                          state.opt               = null;
                    }
                    
                    $.hide(node);
                    callback('hide');
                    
              }//hide
              
              
              hide.stack=function(){
              
                    var node    = stack.pop().node;
                    hide(node);
                    node        = get.cur('node');
                    show(node);
                    
              }//hide.stack
              
              
              hide.stack.all=function(){
              
                    while(stack.length){
                          hide.stack();
                    }
                    
              }//hide.stack.all
              
  //:
  
              function kd(e){
                                                                                //console.log('menu.kd',e.key);
                    var node      = get.cur('node');
                    var opts      = get.opts(node);
                    
                    var both      = true;
                    
                    switch(e.key){
                    
                      case 'ArrowDown'    : kd.arrowdown(e,node,opts);        break;
                      case 'ArrowUp'      : kd.arrowup(e,node,opts);          break;
                      case 'ArrowLeft'    : kd.arrowleft(e,node,opts);        break;
                      case 'ArrowRight'   : kd.arrowright(e,node,opts);       break;
                      case 'Enter'        : kd.enter(e,node,opts);            break;
                      case 'Escape'       : kd.escape(e,node,opts);           break;
                      case 'Tab'          : kd.tab(e,node,opts);              break;
                      
                      default             : both    = false;
                      
                    }//switch
                    
                    return {both};
                    
              }//kd
              
              
              kd.arrowdown=function(e,node,opts){
              
                    if(opts.length==0)return;
                    
                    if(typeof state.opt=='number'){
                          if(state.opt===opts.length-1){
                                return;
                          }
                          var opt                 = opts[state.opt];
                          opt.style.background    = '';
                          state.opt++;
                    }else{
                          state.opt   = 0;
                    }
                    var opt                 = opts[state.opt];
                    opt.style.background    = 'lightyellow';
                    state.select[node.id]   = false;
                    
              }//arrowdown
              
              
              kd.arrowup=function(e,node,opts){
              
                    if(opts.length==0)return;
                    
                    if(typeof state.opt=='number'){
                          if(state.opt==0){
                                return;
                          }
                          var opt   = opts[state.opt];
                          opt.style.background    = '';
                          state.opt--;
                    }else{
                          state.opt   = opts.length-1;
                    }
                    var opt                 = opts[state.opt];
                    opt.style.background    = 'lightyellow';
                    state.select[node.id]   = false;
                    
              }//arrowup
              
              
              kd.arrowleft=function(e,node,opts){
              
                    if(stack.length){
                          return;
                    }
                    var cur       = state.cur;
                    hide(node);
                    cur--;
                    if(cur<0){
                          cur   = list.length-1;
                    }
                    state.cur   = cur;
                    node        = list.find(cur,'node');
                    show(node);
                    
              }//arrowleft
              
              
              kd.arrowright=function(e,node,opts){
                                                                                //console.clear();console.log('arrowright');
                    if(stack.length){
                          return;
                    }
                    var cur     = state.cur;
                    hide(node);
                    cur++;
                    if(cur==list.length){
                          cur   = 0;
                    }
                    state.cur   = cur;
                    node        = list.find(cur,'node');
                    show(node);
                    
              }//arrowright
              
              
              kd.enter=function(e,node,opts){
              
                    if(typeof state.opt!='number'){
                          return;
                    }
                    state.select[node.id]   = true;   //!state.select[node.id];
                    var opt                 = opts[state.opt];
                    callback('opt',opt);
                    
                    both    = true;
                    
              }//enter
              
              
              kd.escape=function(e,node,opts){
              
                    if(stack.length){
                          hide.stack();
                          return;
                    }
                    close();
                    
              }//escape
              
              
              kd.tab=function(e,node,opts){
                                                                                //console.clear();console.log('tab');
                    if(stack.length){
                          return;
                    }
                    hide(node);
                    state.cur   = 0;
                    node        = list.find(0,'node');
                    show(node);
                      
              }//tab
              
              
  //:
  
  
              function focusout(e){
                                                                                //console.log('focusout');
                    var focus   = e.relatedTarget;
                                                                                //console.log(focus);
                    if(chk(focus)){
                                                                                //console.log('list');
                          return;
                    }
                    close();
                    
                    
                    function chk(){
                    
                          var n   = list.length;
                          for(var i=0;i<n;i++){
                          
                                var o    = list[i];
                                if($.is.parent(o.node,focus)){
                                                                                //console.log('list',o.node);
                                      return true;
                                }
                                
                          }//for
                          
                          var n   = stack.length;
                          for(var i=0;i<n;i++){
                          
                                var o   = stack[i];
                                if($.is.parent(o.node,focus)){
                                                                                //console.log('stack',o.node);
                                      return true;
                                }
                                
                          }//for
                          
                          return false;
                          
                    }//chk
                    
              }//onfocusout
              
  //:
  
              function callback(type,arg0){
              
                    var callback    = get.cur('callback');
                    if(typeof callback!='function'){
                          return;
                    }
                    callback.apply(null,arguments);
                    
              }//callback
              
  //:
  
              get.cur=function(rtype){
              
                    var cur   = list.find(state.cur,rtype);
                    if(stack.length){
                          cur   = stack.at(-1)[rtype];
                    }
                    return cur;
                    
              }//cur
              
              
              get.opts=function(node){
              
                    var list    = $.all(node,'.menu-opt');
                    list        = list.filter(opt=>{
                    
                          var menu    = opt.closest('.menu');
                          if(menu===node){
                                return true;
                          }
                          return false;
                          
                    });
                    return list;
                    
              }//opts

                
        var css    = `
        
        /*
          //menu:
        */
                .menu-hdr {
                      white-space           : nowrap;
                      align-items           : center;
                      border                : 1px solid lightgray;
                      box-sizing            : border-box;
                      border-radius         : 5px;
                      position              : relative;
                      cursor                : pointer;
                      display               : inline-flex;
                      margin-right          : 10px;
                      padding               : 0px 10px;
                      height                : 30px;
                }
                
                .menu {
                      border                : 3px solid cyan;
                      border-radius         : 7px;
                      box-shadow            : rgba(0, 0, 250, 0.5) 0px 13px 45px -10px;
                      background            : whitesmoke;
                      box-sizing            : border-box;
                      padding               : 10px;
                      outline               : none;
                }
                
                .menu-title {
                      text-align            : center;
                      background            : rgb(13,152,186);
                      margin-bottom         : 10px;
                      padding               : 3px;
                      color                 : white;
                      font-weight           : bold;
                }
                
                .menu-opt {
                      white-space           : nowrap;
                      cursor                : pointer;
                      margin-bottom         : 10px;
                      display               : flex;
                      justify-content       : space-between;
                      align-items           : center;
                      padding               : 5px 10px;
                }
                
                .menu-sep {
                      margin                : 10px 0;
                      border-top            : 1px solid lightgray;
                }
                                
          `;
          obj.css     = css;
          
          var style   = document.createElement('style');
          style.textContent    = css;
          document.head.append(style);
          
          obj.add.style=function(par){
          
                var style   = document.createElement('style');
                style.textContent   = css;
                par.append(style);
                
          }//style
          
          

                
          return obj;
          
        }//menumodmod
