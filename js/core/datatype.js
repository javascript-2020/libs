function datatype(v){

      var str    =  Object.prototype.toString.call(v);
      var i      =  str.indexOf(' ');
      str        =  str.slice(i+1,-1);
      str        =  str.toLowerCase();
      return str;

}

