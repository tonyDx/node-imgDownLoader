(function() {
  "use strict";
  const http = require("http");
  const fs = require("fs");
  const path = require("path");

  let urlList = [
    "http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/0/0_1.jpg",
    "http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/0/0_35.jpg",
    "http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/1/1_1.jpg",
    "http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/1/1_131.jpg",
    "http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/2/2_1.jpg",
  ];

  for(let i=0;i<35;i++){
  	urlList.push("http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/0/0_"+i+".jpg");
  }
  for(let i=0;i<=131;i++){
  	urlList.push("http://image.uc.cn/s/uae/g/2u/market/art_museum_v9/resource/assets/1/1_"+i+".jpg");
  }
  // 你自己在这里加for循环吧
  // 
  // 
  // 
  // 链接push进数组；
  // 

  console.log(urlList);
  function getHttpReqCallback(imgSrc, dirName, index) {
    var fileName = index + "-" + path.basename(imgSrc);
    var callback = function(res) {
      console.log("request: " + imgSrc + " return status: " + res.statusCode);
      var contentLength = parseInt(res.headers['content-length']);
      var fileBuff = [];
      res.on('data', function (chunk) {
        var buffer = new Buffer(chunk);
        fileBuff.push(buffer);
      });
      res.on('end', function() {
        console.log("end downloading " + imgSrc);
        if (isNaN(contentLength)) {
          console.log(imgSrc + " content length error");
          return;
        }
        var totalBuff = Buffer.concat(fileBuff);
        console.log("totalBuff.length = " + totalBuff.length + " " + "contentLength = " + contentLength);
        if (totalBuff.length < contentLength) {
          console.log(imgSrc + " download error, try again");
          startDownloadTask(imgSrc, dirName, index);
          return;
        }
        fs.appendFile(dirName + "/" + fileName, totalBuff, function(err){});
      });
    };

    return callback;
  }

  var startDownloadTask = function(imgSrc, dirName, index) {
    console.log("start downloading " + imgSrc);
    var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, index));
    req.on('error', function(e){
      console.log("request " + imgSrc + " error, try again");
      startDownloadTask(imgSrc, dirName, index);
    });
    req.end();
  }

  urlList.forEach(function(item, index, array) {
    startDownloadTask(item, './', index);
  })
})();