// urlにあるファイルをダウンロード

var url = "http://kujirahand.com/";
var savepath = "./results/test.htm";

var http = require('http');
var fs = require('fs');

var outfile = fs.createWriteStream(savepath);
http.get(url, function(res) {
 res.pipe(outfile);
 res.on('end', function() {
   outfile.close();
   console.log("ok");
  });
});