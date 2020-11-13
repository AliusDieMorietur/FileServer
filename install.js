const fs = require('fs');
const path = require('path');

const copy = (from, to) => {
    fs.readdir(from, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        for (const file of files){
            const concatFrom = path.join(from, file.name);
            const concatTo = path.join(to, file.name);

            if (file.isDirectory())
                copy(concatFrom, concatTo);
            else {
                fs.mkdirSync(to, { recursive: true });
                fs.copyFileSync(concatFrom, concatTo);
            }
        }
    });
}

copy('./src/server/db', './target/server/db/');
copy('./src/server/static', './target/server/static');
fs.mkdirSync("./target/server/storage", { recursive: true });
fs.mkdirSync("./target/server/logs", { recursive: true });
fs.appendFileSync("./target/server/logs/log.txt", "");