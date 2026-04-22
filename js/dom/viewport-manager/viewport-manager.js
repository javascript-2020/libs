


/*

//viewport-manager:d

22-04-26


*/


(function(){

  var obj   = {};
  
  
        obj.initmod   = function(params){
        
              mod   = params.mod;
              
        }//initmod
        
        
  //:
  
  
        var root;
        var list    = [];
        
        
  //:
  
  
        obj.init    = async function(){
        }//init
        
        
  //:
  
  
        obj.initdom   = function({par}){
        
              par           ||= document.body;
              
              root            = document.createElement('div');
              div.id          = 'viewport-manager';
              par.append(root);
              
              
        }//initdom
        
        
  //:
  
  
        obj.new   = function({par}){
        
              par           ||= root;
              
              var node        = document.createElement('view-port');
              node.toggleAttribute('component',true);
              par.append(node);
              
              var mod2        = mod.create({mod,name:'view-port'});
              var result      = await mod.build({root:node,mod:mod2});
              await mod2.auto();
              
              var viewport    = mod2['view-port'];
              viewport.initmod({vm:obj});
              viewport.pos({x:200,y:200});
              viewport.css(`snippet-editor {display:block;height:100%}`);
              viewport.css(`snippet-editor::part(root) {height:100%}`);
              
              return {viewport};
              
        }//new
        
        
        obj.tofront   = function(viewport){
        
        
        }//tofront
        
        
        obj.remove    = function(viewport){
        
              var index   = list.findIndex(viewport2=>viewport2===viewport);
              if(index==-1){
                    return;
              }
              list.splice(index,1);
              
        }//remove
        
        
  return obj;
  
})

