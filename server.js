//importing http, fs and url modules
const http = require("http"),
  fs = require("fs"),
  url = require("url");

//creating server with http module
http
  .createServer((request, response) => {
    //defining addr as user url request
    let addr = request.url,
      q = new URL(addr, "http://localhost:8080"),
      filePath = "";

    //adds each request to the log.txt file
    fs.appendFile(
      "log.txt",
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log.");
        }
      }
    );

    //checks to see if the correct file name is in request and writes filepath, directs to index if not
    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filePath = "index.html";
    }

    //grabs file from ^ created path name
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
      response.writeHead(200, { "Content-type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);
console.log("My test server is running on Port 8080");
