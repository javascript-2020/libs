



              //window.zip   = {};
              

(()=>{



  
              var zip             = {};
              globalThis.zip      = zip;
              
              zip.files           = [];
              zip.file            = {};
              zip.data            = {};
              zip.dir             = {};
              zip.file.sig        = 0x04034b50;
              zip.data.sig        = 0x08074b50;
              zip.dir.entry       = 0x02014b50;
              zip.dir.end         = 0x06054b50;
              zip.buf             = (buf,off,len)=>{var buf2=new Uint8Array(len);for(var i=off;i<off+len;i++)buf2[i-off]=buf[i];return buf2}
              zip.rd4             = (buf,off)=>buf[off]|(buf[off+1]<<8)|(buf[off+2]<<16)|(buf[off+3]<<24);
              zip.rd2             = (buf,off)=>buf[off]|(buf[off+1]<<8);
              zip.file.start      = (buf,off)=>{for(var i=off;i<buf.length;i++)if(zip.rd4(buf,i)===zip.file.sig)return i}
              zip.file.end        = (buf,off)=>{
                                          for(var i=off;i<buf.length;i++){
                                                var v   = zip.rd4(buf,i);
                                                switch(v){
                                                  case zip.file.sig     : 
                                                  case zip.dir.entry    : return i;
                                                }//switch
                                          }//for
                                    }//end
              zip.file.fn         = (buf,off)=>{
                                          var len     = zip.rd2(buf,off+26);
                                          var buf2    = zip.buf(buf,off+30,len);
                                          var fn      = text.decode(buf2);//buf2.reduce((a,b)=>a+=String.fromCharCode(b),'');
                                          return fn;
                                    }//fn
              zip.file.data       = (buf,off)=>{
                                          var len     = zip.rd2(buf,off+26);
                                          var field   = zip.rd2(buf,off+28);
                                          var start   = off+30+field+len;
                                          var end     = zip.file.end(buf,off+4);
                                          var size    = end-start;
                                          var data    = zip.buf(buf,start,size);
                                          return data;
                                    }//data
              zip.data.start      = (buf,off)=>{for(var i=off;i<buf.length;i++)if(zip.rd4(buf,i)===zip.data.sig)return i}
              zip.data.size       = (buf,off)=>zip.rd4(buf,off+12);
              zip.dir.start       = (buf,off)=>{for(var i=off;i<buf.length;i++)if(zip.rd4(buf,i)===zip.dir.entry)return i}
              zip.dir.size        = (buf,off)=>zip.rd4(buf,off+32);
              zip.rd              = async file=>{
                                  
                                          var buf   = await _uint8(file);
                                          
                                          var off   = 0;
                                          var ec    = true;
                                          while(ec){
                                            
                                                var off2    = off;
                                                off2        = zip.file.start(buf,off2);
                                                if(off2!==undefined){
                                                  
                                                      var fn      = zip.file.fn(buf,off2);
                                                      var data2   = zip.file.data(buf,off2);
                                                      off         = zip.data.start(buf,off);
                                                      var size    = zip.data.size(buf,off);
                                                      var data    = new Uint8Array(size);
                                                      unzip(data2,data);
                                                      var blob    = _blob(data);
                                                      zip.files.push({fn,blob});
                                                }else{
                                                      ec    = false;
                                                }
                                                
                                          }//while
                                          return zip.files;
                                          
                                    }//rd


                                    
              var text            = new TextDecoder('utf-8');
              var datatype        = v=>Object.prototype.toString.call(v).slice(8,-1).toLowerCase();
              var _uint8          = async v=>{
                                      
                                          var buf;
                                          var uint8;
                                          
                                          switch(datatype(v)){
                                            
                                            case 'blob'         : buf     = await v.arrayBuffer();        break;
                                            case 'uint8array'   : uint8   = v;                            break;
                                            
                                          }//switch
                                          
                                          uint8   ||= new Uint8Array(buf);
                                          return uint8;
                                          
                                    }//_int8
              var _blob           = (v,type='application/octet-stream')=>{
                
                                          var blob;
                                          switch(datatype(v)){
                                            
                                            case 'uint8array'     : var buf   = v.buffer;
                                                                    blob    = new Blob([buf],{type});       break;
                                            case 'arraybuffer'    : blob    = new Blob([v],{type});         break;
                                            
                                          }//switch
                                          return blob;
                                          
                                    }//_blob
              var hs              = size=>{

                                          size    = Number(size);
                                          var i   = size==0 ? 0 : Math.floor(Math.log(size)/Math.log(1000));
                                          var s   = ((size/Math.pow(1000,i)).toFixed(2))*1+' '+['B','kB','MB','GB','TB'][i];
                                          return s;
                                          
                                    }//hs

              
              return zip;


              function unzip(zip,file){
              
                      
                      var TINF_OK           = 0;
                      var TINF_DATA_ERROR   = -3;

                      
                      function Tree() {
                                                                                /* table of code length counts */
                            this.table = new Uint16Array(16);   
                                                                                /* code -> symbol translation table */
                            this.trans = new Uint16Array(288);
                            
                      }
                      
                      function Data(source, dest) {
                        
                            this.source         = source;
                            this.sourceIndex    = 0;
                            this.tag            = 0;
                            this.bitcount       = 0;
                            
                            this.dest           = dest;
                            this.destLen        = 0;
                                                                                /* dynamic length/symbol tree */
                            this.ltree          = new Tree();  
                                                                                /* dynamic distance tree */
                            this.dtree          = new Tree();  
                            
                      }
                      
                                                                                /* --------------------------------------------------- *
                                                                                 * -- uninitialized global data (static structures) -- *
                                                                                 * --------------------------------------------------- */
                      
                      var sltree        = new Tree();
                      var sdtree        = new Tree();
                      
                                                                                /* extra bits and base tables for length codes */
                      var length_bits   = new Uint8Array(30);
                      var length_base   = new Uint16Array(30);
                      
                                                                                /* extra bits and base tables for distance codes */
                      var dist_bits     = new Uint8Array(30);
                      var dist_base     = new Uint16Array(30);
                      
                                                                                /* special ordering of code length codes */
                      var clcidx        = new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
                      
                                                                                /* used by tinf_decode_trees, avoids allocations every call */
                      var code_tree     = new Tree();
                      var lengths       = new Uint8Array(288+32);

                      
                      var offs = new Uint16Array(16);
                      




                                                                                /* -------------------- *
                                                                                 * -- initialization -- *
                                                                                 * -------------------- */
                      
                                                                                /* build fixed huffman trees */
                      tinf_build_fixed_trees(sltree, sdtree);
                      
                                                                                /* build extra bits and base tables */
                      tinf_build_bits_base(length_bits, length_base, 4, 3);
                      tinf_build_bits_base(dist_bits, dist_base, 2, 1);
                      
                                                                                /* fix a special case */
                      length_bits[28]   = 0;
                      length_base[28]   = 258;
                      
                      
                      var result    = tinf_uncompress(zip,file);
                      return result;




                      
                                                                                /* ----------------------- *
                                                                                 * -- utility functions -- *
                                                                                 * ----------------------- */
                                                                                  
                                                                                /* build extra bits and base tables */
                      function tinf_build_bits_base(bits, base, delta, first) {
                        
                            var i, sum;                          
                                                                                /* build bits table */
                            for (i = 0; i < delta; ++i) bits[i] = 0;
                            for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;
                          
                                                                                /* build base table */
                            for (sum = first, i = 0; i < 30; ++i) {
                              
                                  base[i] = sum;
                                  sum += 1 << bits[i];
                                  
                            }
                      }
                      
                                                                                /* build the fixed huffman trees */
                      function tinf_build_fixed_trees(lt, dt) {
                        
                            var i;
                          
                                                                                /* build fixed length tree */
                            for (i = 0; i < 7; ++i) lt.table[i] = 0;
                          
                            lt.table[7] = 24;
                            lt.table[8] = 152;
                            lt.table[9] = 112;
                          
                            for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
                            for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
                            for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
                            for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;
                          
                            /* build fixed distance tree */
                            for (i = 0; i < 5; ++i) dt.table[i] = 0;
                          
                            dt.table[5] = 32;
                          
                            for (i = 0; i < 32; ++i) dt.trans[i] = i;
                      }
                      
                                                                                /* given an array of code lengths, build a tree */
                      
                      function tinf_build_tree(t, lengths, off, num) {
                        
                            var i, sum;
                          
                                                                                /* clear code length count table */
                            for (i = 0; i < 16; ++i) t.table[i] = 0;
                          
                                                                                /* scan symbol lengths, and sum code length counts */
                            for (i = 0; i < num; ++i) t.table[lengths[off + i]]++;
                          
                            t.table[0] = 0;
                          
                                                                                /* compute offset table for distribution sort */
                            for (sum = 0, i = 0; i < 16; ++i) {
                              
                                  offs[i] = sum;
                                  sum += t.table[i];
                                  
                            }
                          
                                                                                /* create code->symbol translation table (symbols sorted by code) */
                            for (i = 0; i < num; ++i) {
                              
                                  if (lengths[off + i]) t.trans[offs[lengths[off + i]]++] = i;
                                  
                            }
                            
                      }
                      
                                                                                /* ---------------------- *
                                                                                 * -- decode functions -- *
                                                                                 * ---------------------- */
                      
                                                                                /* get one bit from source stream */
                      function tinf_getbit(d) {
                        
                            /* check if tag is empty */
                            if (!d.bitcount--) {
                              /* load next tag */
                              d.tag = d.source[d.sourceIndex++];
                              d.bitcount = 7;
                            }
                          
                            /* shift bit out of tag */
                            var bit = d.tag & 1;
                            d.tag >>>= 1;
                          
                            return bit;
                            
                      }
                      
                                                                                /* read a num bit value from a stream and add base */
                      function tinf_read_bits(d, num, base) {
                        
                            if (!num)
                              return base;
                          
                            while (d.bitcount < 24) {
                              d.tag |= d.source[d.sourceIndex++] << d.bitcount;
                              d.bitcount += 8;
                            }
                          
                            var val = d.tag & (0xffff >>> (16 - num));
                            d.tag >>>= num;
                            d.bitcount -= num;
                            return val + base;
                            
                      }
                      
                                                                                /* given a data stream and a tree, decode a symbol */
                      function tinf_decode_symbol(d, t) {
                        
                            while (d.bitcount < 24) {
                              d.tag |= d.source[d.sourceIndex++] << d.bitcount;
                              d.bitcount += 8;
                            }
                            
                            var sum = 0, cur = 0, len = 0;
                            var tag = d.tag;
                          
                                                                                /* get more bits while code value is above sum */
                            do {
                              
                                  cur = 2 * cur + (tag & 1);
                                  tag >>>= 1;
                                  ++len;
                              
                                  sum += t.table[len];
                                  cur -= t.table[len];
                                  
                            } while (cur >= 0);
                            
                            d.tag         = tag;
                            d.bitcount   -= len;
                          
                            return t.trans[sum + cur];
                            
                      }
                      
                                                                                /* given a data stream, decode dynamic trees from it */
                      function tinf_decode_trees(d, lt, dt) {
                        
                            var hlit, hdist, hclen;
                            var i, num, length;
                          
                            /* get 5 bits HLIT (257-286) */
                            hlit = tinf_read_bits(d, 5, 257);
                          
                            /* get 5 bits HDIST (1-32) */
                            hdist = tinf_read_bits(d, 5, 1);
                          
                            /* get 4 bits HCLEN (4-19) */
                            hclen = tinf_read_bits(d, 4, 4);
                          
                            for (i = 0; i < 19; ++i) lengths[i] = 0;
                          
                            /* read code lengths for code length alphabet */
                            for (i = 0; i < hclen; ++i) {
                              /* get 3 bits code length (0-7) */
                              var clen = tinf_read_bits(d, 3, 0);
                              lengths[clcidx[i]] = clen;
                            }
                          
                            /* build code length tree */
                            tinf_build_tree(code_tree, lengths, 0, 19);
                          
                            /* decode code lengths for the dynamic trees */
                            for (num = 0; num < hlit + hdist;) {
                              var sym = tinf_decode_symbol(d, code_tree);
                          
                              switch (sym) {
                                case 16:
                                  /* copy previous code length 3-6 times (read 2 bits) */
                                  var prev = lengths[num - 1];
                                  for (length = tinf_read_bits(d, 2, 3); length; --length) {
                                    lengths[num++] = prev;
                                  }
                                  break;
                                case 17:
                                  /* repeat code length 0 for 3-10 times (read 3 bits) */
                                  for (length = tinf_read_bits(d, 3, 3); length; --length) {
                                    lengths[num++] = 0;
                                  }
                                  break;
                                case 18:
                                  /* repeat code length 0 for 11-138 times (read 7 bits) */
                                  for (length = tinf_read_bits(d, 7, 11); length; --length) {
                                    lengths[num++] = 0;
                                  }
                                  break;
                                default:
                                  /* values 0-15 represent the actual code lengths */
                                  lengths[num++] = sym;
                                  break;
                              }
                            }
                          
                            /* build dynamic trees */
                            tinf_build_tree(lt, lengths, 0, hlit);
                            tinf_build_tree(dt, lengths, hlit, hdist);
                            
                      }
                      
                                                                                /* ----------------------------- *
                                                                                 * -- block inflate functions -- *
                                                                                 * ----------------------------- */
                      
                                                                                /* given a stream and two trees, inflate a block of data */
                      function tinf_inflate_block_data(d, lt, dt) {
                        
                            while (1) {
                              var sym = tinf_decode_symbol(d, lt);
                          
                              /* check for end of block */
                              if (sym === 256) {
                                return TINF_OK;
                              }
                          
                              if (sym < 256) {
                                d.dest[d.destLen++] = sym;
                              } else {
                                var length, dist, offs;
                                var i;
                          
                                sym -= 257;
                          
                                /* possibly get more bits from length code */
                                length = tinf_read_bits(d, length_bits[sym], length_base[sym]);
                          
                                dist = tinf_decode_symbol(d, dt);
                          
                                /* possibly get more bits from distance code */
                                offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);
                          
                                /* copy match */
                                for (i = offs; i < offs + length; ++i) {
                                  d.dest[d.destLen++] = d.dest[i];
                                }
                              }
                            }
                            
                      }
                      
                                                                                /* inflate an uncompressed block of data */
                      function tinf_inflate_uncompressed_block(d) {
                        
                            var length, invlength;
                            var i;
                            
                            /* unread from bitbuffer */
                            while (d.bitcount > 8) {
                              d.sourceIndex--;
                              d.bitcount -= 8;
                            }
                          
                            /* get length */
                            length = d.source[d.sourceIndex + 1];
                            length = 256 * length + d.source[d.sourceIndex];
                          
                            /* get one's complement of length */
                            invlength = d.source[d.sourceIndex + 3];
                            invlength = 256 * invlength + d.source[d.sourceIndex + 2];
                          
                            /* check length */
                            if (length !== (~invlength & 0x0000ffff))
                              return TINF_DATA_ERROR;
                          
                            d.sourceIndex += 4;
                          
                            /* copy block */
                            for (i = length; i; --i)
                              d.dest[d.destLen++] = d.source[d.sourceIndex++];
                          
                            /* make sure we start next block on a byte boundary */
                            d.bitcount = 0;
                          
                            return TINF_OK;
                            
                      }
                      
                                                                                /* inflate stream from source to dest */
                      function tinf_uncompress(source,dest){
                        
                            var d   = new Data(source,dest);
                            var bfinal,btype,res;
                          
                            do{
                              
                                                                                /* read final block flag */
                                  bfinal = tinf_getbit(d);
                              
                                                                                /* read block type (2 bits) */
                                  btype = tinf_read_bits(d, 2, 0);
                              
                                                                                /* decompress block */
                                  switch (btype) {
                                    
                                    case 0:
                                                                                /* decompress uncompressed block */
                                        res = tinf_inflate_uncompressed_block(d);
                                        break;
                                    case 1:
                                                                                /* decompress block with fixed huffman trees */
                                        res = tinf_inflate_block_data(d, sltree, sdtree);
                                        break;
                                    case 2:
                                                                                /* decompress block with dynamic huffman trees */
                                        tinf_decode_trees(d, d.ltree, d.dtree);
                                        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
                                        break;
                                    default:
                                        res = TINF_DATA_ERROR;
                                        
                                  }//switch
                              
                                  if (res !== TINF_OK)
                                    throw new Error('Data error');
                          
                            }while(!bfinal);
                          
                            if (d.destLen < d.dest.length) {
                                  if (typeof d.dest.slice === 'function')
                                        return d.dest.slice(0, d.destLen);
                                  else
                                        return d.dest.subarray(0, d.destLen);
                            }
                            
                            return d.dest;
                            
                      }//tinf_uncompress
                      



              



                      
              }//unzip
              


})()



