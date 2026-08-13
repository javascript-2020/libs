


/*

//viewport-manager:d

22-04-26


*/


(function(){

  var obj   = {
        version   : 'v1.0',
  };
  
  
        var version='v2.0'
        ;
        
        
        obj.initmod   = function(params){
        
              ('mod' in params) && (mod=params.mod);
              ('version' in params) && (version=params.version);
              
        }//initmod
        
        
  //:
  
  
        var main      = {};
        main.root     = null;
        main.list     = [];
        
        var ontop     = {};
        ontop.root    = null;
        ontop.list    = [];
        
        
        var list      = [];
        obj.list      = list;
        
        
        var front;
        
        
        
        obj.is      = {};
        var is      = {};
        
        
  //:
  
  
        obj.init    = async function(){
        }//init
        
        
  //:
  
  
        obj.initdom   = function({par}={}){
        
              par                       ||= document.body;
              
              main.root                   = document.createElement('div');
              main.root.id                = 'viewport-manager';
              main.root.style.zIndex      = 1;
              par.append(main.root);
              
              ontop                       = document.createElement('div');
              ontop.id                    = 'viewport-manager-ontop';
              ontop.style.zIndex          = 2;
              par.append(ontop);
              
        }//initdom
        
        
  //:
  
  
        obj.new   = async function({par,initmod,title,icon}={}){
        
              if(par!==false){
                    par     ||= main.root;
              }
              initmod       ||= {};
              
              var node        = document.createElement('view-port');
              node.toggleAttribute('component',true);
              if(par){
                    par.append(node);
              }
              if(version){
                    node.toggleAttribute(version,true);
              }
              
              var mod2        = mod.create({mod,name:'view-port'});
              var result      = await mod.build({root:node,mod:mod2});
              
              //await mod2.auto();
              
              var viewport    = mod2['view-port'];
              viewport.initmod(mod.base,initmod,{vm:obj});
              await viewport.init();
              await viewport.initdom();
              
              if(title){
                    viewport.title(title);
              }
              if(icon){
                    viewport.icon(icon);
              }
              
              viewport.root.addEventListener('mousedown',md);
              
              tofront(viewport);
              
              list.push(viewport);
              main.list.push(viewport);
              
              return viewport;
              
              
              function md(e){
              
                    tofront(viewport);
                    
              }//md
              
        }//new
        
        
  //:
  
  
        obj.tofront   = tofront;
        
        function tofront(viewport){
        
        
              var root;
              var list;
              var f   = false;
              if(viewport.host.parentNode===root){
                    f       = 'main';
                    ({root,list}    = main);
              }
              if(viewport.host.parentNode===ontop.root){
                    f       = 'ontop';
                    ({root,list}    = ontop);
              }
              if(!f){
                    return;
              }
              
              
              list.forEach(viewport2=>{
              
                    if(viewport.host.parentNode===root){
                          if(viewport2===viewport){
                                //viewport2.host.style.zIndex    = list.length;
                                viewport2.host.classList.add('active');
                                viewport2.host.classList.remove('inactive');
                                root.append(viewport2.host);
                          }else{
                                //var z   = Number(viewport2.host.style.zIndex);
                                //z--;
                                viewport2.host.style.zIndex    = z;
                                viewport2.host.classList.remove('active');
                                viewport2.host.classList.add('inactive');
                          }
                    }
                    
              });
              front   = viewport;
              
        }//tofront
        
        
        obj.remove    = function(viewport){
        
              var index   = list.findIndex(viewport2=>viewport2===viewport);
              if(index==-1){
                    return;
              }
              list.splice(index,1);
              
              var list2     = main.list;
              if(is.ontop(viewport)){
                    list2   = ontop.list;
              }
              var index   = list2.findIndex(viewport2=>viewport2===viewport);
              if(index==-1){
                    return;
              }
              list2.splice(index,1);
              
        }//remove
        
        
        
  //:
  
  
        is.main   = function(viwport){
        
              if(main.list.find(viewport2=>viewport2===viewport)){
                    return true;
              }
              return false;
              
        }//main
        
        
        is.ontop    = function(viewport){
        
              if(ontop.list.find(viewport2=>viewport2===viewport)){
                    return true;
              }
              return false;
              
        }//ontop
        
        
        
        
  return obj;
  
})

