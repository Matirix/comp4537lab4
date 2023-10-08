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

const dictionary = [];
let requestNum = 0;

function isNumber(word) {
  let nums = '1234567890';
  if (word == null) {
    return false;
  }
  for (let i = 0; i < word.length; i++) {
    if (nums.includes(word[i])) {
      return true;
    }
  }
}

http.createServer((req, res) => {
    const link = url.parse(req.url, true)
    const query = link.query;
    const pathname = link.pathname;


    if (pathname.startsWith("/api/definitions/")) {
        let qword = query.word ? query.word : null
        let qdef = query.definition ? query.definition : null
        requestNum++;
        let wordNum = false;
        let defNum = false;
        if (qword != null) {
          wordNum = isNumber(qword);
          defNum = isNumber(qdef);
        }

        if (req.method == 'GET' && qword != null && !wordNum) {
            let found = false;
            dictionary.forEach((word) => {
                if (word.getWord() == qword) {
                    res.writeHead(200, defaultHeader);
                    res.end(JSON.stringify({ requestNum: `Request #${requestNum}`, word: word.word, definition: word.definition }));
                    found = true;
                }
            });
            if (!found) {
                res.writeHead(404, defaultHeader);
                res.end(JSON.stringify({ error: `Request #${requestNum} Word '${qword}' not found!` }));
            }
        } else if (req.method == 'POST' && qword != null && qdef != null && !wordNum && !defNum) {
            const exists = dictionary.find(word => word.word == qword);
            if (exists !== undefined) {
              res.writeHead(401, defaultHeader);
              res.end(JSON.stringify({ error: `Request #${requestNum} Word Already Exists!` }));
            } else {
              dictionary.push(new WordDefinition(qword, qdef));
              res.writeHead(200, defaultHeader);
              res.end(JSON.stringify({ requestNum: `Request #${requestNum}`, totalWords: `Total words in the dictionary: ${dictionary.length}`, newEntry: `New entry recorded: ${qword}: ${qdef}` }));
              res.end();
            }
        } else {
            res.writeHead(404, defaultHeader)
            res.end(JSON.stringify({ error: `Request #${requestNum} Invalid Request, Missing word or definition or number` }));
        }
    } else {
        res.writeHead(404, defaultHeader)
        res.end(JSON.stringify({ error: `Request #${requestNum} Please go to /api/definitions/ to begin` }));
    }
    
}).listen(PORT)