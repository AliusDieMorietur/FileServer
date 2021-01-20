import * as fs from 'fs';
import { generateToken } from './auth';
import * as formidable from 'formidable'  ;
import { readStorage, listStorage } from "./storage";

const upload = (req, res) => {
  const token = generateToken();
  fs.mkdirSync('./storage/' + token);

  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) throw err;

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, token }, null, 2));
  });

  form.on('fileBegin', (__name, file) => {
    file.path = './storage/' + token + '/' + file.name;
  });

  form.on('file', (__name, file) => {
    console.log('Uploaded ' + file.name);
  });
}

const download = (req, res) => {
  req.on('data', data => {
    const parsed = JSON.parse(data.toString());

    if (parsed[1] == "") {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(listStorage(parsed[0])));
    } else {
      res.end(fs.readFileSync(`./storage/${parsed[0]}/${parsed[1]}`));
    }

    // readStorage(data.toString()).then( data => res.end(fs.readFileSync(data)));
  });
};

export { upload, download };