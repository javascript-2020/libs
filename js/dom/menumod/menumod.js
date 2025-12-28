


/*


*/


        
//mod.menumod   = menumod;


function menumod(){
                                                                                  //console.groupCollapsed('menumod',1);
                                                                                  //console.trace();
                                                                                  //console.groupEnd();
  var obj       = {};
  obj.menumod   = menumod;

        var df=false,did='menumod'
        ;
  
  
        var keydown;
        
        
        obj.initmod   = function(params){
          
              keydown   = params.keydown;
              
        }//initmod
        
        
  //:
  
        
        obj.on                  = {};
        obj.input               = {};
        var kd                  = {};
        
        
        var list                = [];
        list.find               = (v,rtype)=>find(list,v,rtype);
        
        
        var stack               = [];
        stack.find              = (v,rtype)=>find(stack,v,rtype);
        
        
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
  
  
        obj.import    = function(str){
        
              state   = JSON.parse(str);
              
        }//import
        
        
        obj.export    = function(){
        
              var str   = JSON.stringify(state);
              return str;
              
        }//export
  
        
  //:
  
  
        obj.click   = function(node,params){
        
              var drag,center,callback;
              if(datatype(params)=='object'){
                    ({drag='both',center,callback}   = params);
              }else{
                    [node,drag='both',center,callback]    = arguments;
              }
              
              add(node,drag,center,callback);
              
              return click;
              
              
              function click(e){
              
                    open(node);
                    
              }//click
              
        }//click
  
        
  //:
  
  
        obj.add   = function(node,params){return add.apply(null,arguments)}
        
        function add(node,params){
                                                                          //console.log('add');
              var drag,center,callback;
              if(datatype(params)=='object'){
                    ({drag='both',center,callback}   = params);
              }else{
                    [node,drag='both',center,callback]    = arguments;
              }
                                                                          
              list.push({node,callback});
              add.node(node,drag,center);
              
        }//add
        
        
        obj.add.stack   = function(node,drag='both',center,callback){return add.stack.apply(null,arguments)}
        
        add.stack   = function(node,params){
        
              var drag,center,callback;
              if(datatype(params)=='object'){
                    ({drag='both',center,callback}   = params);
              }else{
                    [node,drag='both',center,callback]    = arguments;
              }
                    
              var cur                   = get.cur('node');
              state.prev_opt[cur.id]    = state.opt;
              
              stack.push({node,callback});
              add.node(node,drag,center);
              
              show(node);
              
        }//add.stack
        
        
        add.node    = function(node,drag,center){
        
              node.style.zIndex   = defz;
              node.tabIndex       = -1;
              
              if(drag===true){
                    drag    = 'both';
              }
              if(drag){
                    $.drag(node,null,drag);
              }
              if(center){
                    $.center.width(node);
              }
              
              var timer;
              node.addEventListener('focusout',focusout);
              node.onmouseenter   = e=>clearTimeout(timer);
              node.onmouseleave   = e=>{
              
                    timer    = setTimeout(fn,500);
                    
                    function fn(){
                                                                                      debug('mouseleave',node);
                          var cur       = get.cur('node');
                                                                                      debug('cur',cur);
                          if(cur!==node){
                                                                                      debug('cur');
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
  
  
        obj.open    = function(node){return open(node)}
        
        function open(node){
                                                                          debug('open',node);
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
              
              if(keydown){
                    keydown.bubbles.add(menu_kd);
              }
              
              state.cur   = index;
              show(node);
              
              
        }//open
        
        
        obj.close   = function(node){return close(node)};
        
        function close(node){
                                                                                debug('close',node,state.cur);
              if(node){
                    var cur   = get.cur('node');
                    if(cur!==node){
                          return;
                    }
              }
              
              if(keydown){
                    keydown.rem(menu_kd);
              }
              
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
              
              if(typeof obj.on.close=='function'){
                    obj.on.close();
              }
              
              return true;
              
        }//close
        
        
        obj.prev    = function(){return prev()}
        
        function prev(){
        
              if(stack.length){
                    return;
              }
              var cur       = state.cur;
              var node      = get.cur('node');
              hide(node);
              cur--;
              if(cur<0){
                    cur   = list.length-1;
              }
              state.cur   = cur;
              node        = list.find(cur,'node');
              setTimeout(show,50,node);
              
        }//prev
        
        
        obj.next    = function(){return next()}
        
        function next(){
        
              if(stack.length){
                    return;
              }
              var cur     = state.cur;
              var node    = get.cur('node');
              hide(node);
              cur++;
              if(cur==list.length){
                    cur   = 0;
              }
              state.cur   = cur;
              node        = list.find(cur,'node');
              setTimeout(show,50,node);
        
        }//next
  
        
  //:
  
        function show(node){
                                                                                debug('show',node.id);
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
  
        function hide(node){//debugger;
                                                                                debug('hide',node.id);
              state.prev_opt[node.id]       = state.opt;
              if(typeof state.opt=='number'){
                    var opts                = get.opts(node);
                    var opt                 = opts[state.opt];
                    if(!opt)debugger;
                    opt.style.background    = '';
                    state.opt               = null;
              }
              
              $.hide(node);
              callback('hide');
              
        }//hide
        
        
        hide.stack    = function(){
        
              var node    = stack.pop().node;
              hide(node);
              node        = get.cur('node');
              show(node);
              
        }//hide.stack
        
        
        hide.stack.all    = function(){
        
              while(stack.length){
              
                    hide.stack();
                    
              }//while
              
        }//hide.stack.all
  
        
  //:
  
        
        function menu_kd(e){
                                                                          debug('menu.kd',e.key);
              var node      = get.cur('node');
              if(!node){
                    return;
              }
              var opts      = get.opts(node);
              
              var both      = true;
              
              switch(e.key){
              
                case 'ArrowDown'    : kd.arrowdown(e,node,opts);        break;
                case 'ArrowUp'      : kd.arrowup(e,node,opts);          break;
                case 'ArrowLeft'    : kd.arrowleft(e,node,opts);        break;
                case 'ArrowRight'   : kd.arrowright(e,node,opts);       break;
                case 'Enter'        : kd.enter(e,node,opts);            break;
                case 'Escape'       : kd.escape(e,node,opts);           break;
                //case 'Tab'          : kd.tab(e,node,opts);              break;
                
                default             : both    = false;
                
              }//switch
              
              return {both};
              
        }//kd
        
        
        kd.arrowdown    = function(e,node,opts){
        
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
        
        
        kd.arrowup    = function(e,node,opts){
        
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
        
        
        kd.arrowleft    = function(e,node,opts){
        
              prev();
              
        }//arrowleft
        
        
        kd.arrowright   = function(e,node,opts){
                                                                          
              next();
              
        }//arrowright
        
        
        kd.enter    = function(e,node,opts){
        
              if(typeof state.opt!='number'){
                    return;
              }
              state.select[node.id]   = true;   //!state.select[node.id];
              var opt                 = opts[state.opt];
              callback('opt',opt);
              
              both    = true;
              
        }//enter
        
  
        kd.escape   = function(e,node,opts){
        
              if(stack.length){
                    hide.stack();
                    return;
              }
              close();
              
        }//escape
        
        
        kd.tab    = function(e,node,opts){
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
                                                                          debug('focusout');
              var focus   = e.relatedTarget;
                                                                          //console.log(focus);
              if(chk(focus)){
                                                                          debug('chk');
                    return;
              }
              close();
              
              
              function chk(){
              
                    if(!focus){
                          return true;
                    }
                    
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
  
  
        get.cur   = function(rtype){
        
              var cur   = list.find(state.cur,rtype);
              if(stack.length){
                    cur   = stack.at(-1)[rtype];
              }
              return cur;
              
        }//cur
        
        
        get.opts    = function(node){
        
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


  //:
  
  
        var css    = `
        
/*
  //menu:
*/
        
  .menu-root
    {
          display             : inline;
          position            : relative
    }
  
  .menu-icon {
          padding               : 3px;
          width                 : 20px;
          background            : buttonface;
          border                : 1px solid gray;
          border-radius         : 3px;
          box-sizing            : border-box;
          width                 : 20px;
          height                : 30px;
          cursor                : pointer;
          content               : url(data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAt1BMVEVHcEwbmPYcgfMchvQbsfkay/wbtvkbnfccefMayfwbmfYch/QchvQbtfkbmfYa1P0ddfIcivQcl/Ycj/Ubp/gcmfYdbPEbrvkazPwcmfYbqfgayfwayPwbv/sbvvobsvkazPwbqvga0fwbvPobtvocjvUbofcbpvccfPMcgPMcgvMdafAdbfEckfUbtvka0PwcfPIaxvsbwfsbvPodb/EcnPYclvYckfUbpvccjPQdd/IbofcbrPiPy8D0AAAAMHRSTlMAA/79/v7+5ycVZ3Y3h0xhu9jp8kFeF9OkVfQOrZi+Mh1z/iUJQ+/dx4fOYq7hybzs5xU1AAABIklEQVQ4y+2Ux3aDMBBFpTR6M92AwYB7S6EG/v+7MsJJnBBKVsnGdwHozT1HQgxC6MrfEkiSM+Y4khSgUxhazLDHWGF4QveAO2gyLnGQ9QS4wcDaXGJYiPGegVnU50UzUvdgTsd7AfrMaEaqXvO+sfAAHP0uzz+SmhCfR7FwB5gdpm+SyoeHEJ5P67o2tbanmRBP5/iSgFkUxaplaisIv3kAu6yqihK/RiIF0ZJtT6NTaZpS9iWwm0D/uXB7kmXZ5LOgN0O7ayvEQ57nKtssCbMqDA5i9+YulLIsVQ5MzKnwqCz6Phev3AIcxhy5K3x/A/DbG2CzIdctP9RS9PrxnTU92KOYll8bZHqs7Wk5AcY9hIx9kuyN3/xuxm5nXA+df+cNJSAgjMbiFSoAAAAASUVORK5CYII=);
  }
  
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
  
  .menu-item
    {display:flex;align-items:center;padding:5px 10px}
    
  .menu-sep {
          margin                : 10px 0;
          border-top            : 1px solid lightgray;
  }

        `;
          
        obj.css     = css;


  //:
  
  
        obj.add.style   = function(par){    //d

              par                 = par||document.head;
              var style           = document.createElement('style');
              style.id            = 'menumod';
              style.textContent   = css;
              par.append(style);
              
        }//style
        
        
        obj.input.norm    = function(root){
        
              var list    = $.all(root,'input:not([type])');
              list.forEach((input,i)=>{
              
                    input.addEventListener('keydown',keydown);
                    input.onfocus   = e=>input.select();
                    
                    function keydown(e){
                    
                          if(e.key=='ArrowDown'){
                                e.stopPropagation();
                                i++;
                                if(i==list.length){
                                      i   = 0;
                                }
                                var input2    = list[i];
                                input2.focus();
                          }
                          if(e.key=='ArrowUp'){
                                e.stopPropagation();
                                i--;
                                if(i<0){
                                      i   = list.length-1;
                                }
                                var input2    = list[i];
                                input2.focus();
                          }
                          if(e.key=='ArrowLeft'){
                                e.stopPropagation();
                                if(e.ctrlKey){
                                      //debugger;
                                      prev();
                                }
                          }
                          if(e.key=='ArrowRight'){
                                e.stopPropagation();
                                if(e.ctrlKey){
                                      next();
                                }
                          }
                          
                    }//keydown
                    
              });
            
        }//norm


          
  //:          

          
        function debug(...args){
        
              if(!df && !obj.df)return;
              args.unshift(`[ ${did} ]`);
              console.groupCollapsed.apply(console,args);
              console.trace();
              console.groupEnd();
              
        }//debug
        
        
        
              
  return obj;
          
}//menumodmod





