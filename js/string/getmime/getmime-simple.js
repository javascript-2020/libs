

        function getmime(filename){
          
              var list    = {
                
                    // Text
                    
                    'txt': 'text/plain',
                    'html': 'text/html',
                    'htm': 'text/html',
                    'css': 'text/css',
                    'js': 'application/javascript',
                    'json': 'application/json',
                    'csv': 'text/csv',
                    'xml': 'application/xml',

                
                    // Images
                    
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'webp': 'image/webp',
                    'svg': 'image/svg+xml',
                    'ico': 'image/x-icon',
                    'bmp': 'image/bmp',
                    'tiff': 'image/tiff',

                
                    // Audio
                    
                    'mp3': 'audio/mpeg',
                    'wav': 'audio/wav',
                    'ogg': 'audio/ogg',
                    'm4a': 'audio/mp4',

                
                    // Video
                    
                    'mp4': 'video/mp4',
                    'webm': 'video/webm',
                    'mov': 'video/quicktime',
                    'avi': 'video/x-msvideo',
                    'mkv': 'video/x-matroska',

                
                    // Fonts
                    
                    'woff': 'font/woff',
                    'woff2': 'font/woff2',
                    'ttf': 'font/ttf',
                    'otf': 'font/otf',

                
                    // Docs
                    
                    'pdf': 'application/pdf',
                    'doc': 'application/msword',
                    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'xls': 'application/vnd.ms-excel',
                    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ppt': 'application/vnd.ms-powerpoint',
                    'pptx'      : 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

                
                    // Archives
                    
                    'zip'       : 'application/zip',
                    'tar': 'application/x-tar',
                    'gz': 'application/gzip',
                    'rar': 'application/vnd.rar',
                    '7z': 'application/x-7z-compressed'
                    
              };
              
              var i       = filename.lastIndexOf('.');
              var ext     = filename.slice(i+1);
              
              var def     = 'application/octet-stream';
              var mime    = list[ext]||def
              
              return mime;              
              
        }//getmime





