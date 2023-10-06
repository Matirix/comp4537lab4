const http = require('http');
const url = require('url');
const defaultHeader = {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"}
const PORT = process.env.PORT || 3000

class WordDefinition {
    constructor(word, definition) {
      this.word = word;
      this.definition = definition;
    }
    getWord() {
      return this.word;
    }
  
    getDefinition() {
      return this.definition;
    }
} 

const wordddd = new WordDefinition("hello", "a greeting")
const dictionary = [
    wordddd
];

http.createServer((req, res) => {
    const link = url.parse(req.url, true)
    const query = link.query;
    const pathname = link.pathname;

    if (pathname.startsWith("/api/definitions/")) {
        let qword = query.word ? query.word : null
        let qdef = query.definition ? query.definition : null

        if (req.method == 'GET' && qword != null) {
            let found = false;
            dictionary.forEach((word) => {
                if (word.getWord() == qword) {
                    res.writeHead(200, defaultHeader);
                    res.end(JSON.stringify({ word: word.word, definition: word.definition }));
                    found = true;
                }
            });
            if (!found) {
                res.writeHead(404, defaultHeader);
                res.end(JSON.stringify({ error: "Word does not exist!" }));
            }
        } else if (req.method == 'POST' && qword != null && qdef != null) {
            const exists = dictionary.find(word => word.word == qword);
            if (exists !== undefined) {
              res.writeHead(401, defaultHeader);
              res.end(JSON.stringify({ error: "Word Already Exists!" }));
            } else {
              dictionary.push(new WordDefinition(qword, qdef));
              res.writeHead(200, defaultHeader);
              res.end(JSON.stringify({ message: `Request #${dictionary.length}`, newEntry: `${qword} : ${qdef}` }));
              res.end();
            }
        } else {
            res.writeHead(404, defaultHeader)
            res.end(JSON.stringify({ error: "Invalid Request, Missing word or definition" }));
        }
    } else {
        res.writeHead(404, defaultHeader)
        res.end(JSON.stringify({ error: "Please go to /api/definitions/ to begin" }));
    }
    
}).listen(PORT)
