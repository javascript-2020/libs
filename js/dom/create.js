
function create(){

        var create    = new Proxy({},{get (target,prop){
              var node    = document.createElement(prop);
              return attr=>{
                    for(var name in attr){
                          if(name=='style'){
                                for(var sname in attr.style)
                                      node.style[sname]    = attr.style[sname];
                          }else{
                                node[name]    = attr[name];
                          }
                    }
                    return node;
              };
        }});
        return create;

}


