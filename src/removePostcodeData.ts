import * as fs from "graceful-fs";
import glob from 'glob';

function removePostcodeData() {
  glob('docs/api/*/*.json', (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((f) => fs.unlinkSync(f));
    }
  });
  glob('docs/api/*/', (err, dirs) => {
    if (err) {
      console.log(err);
    } else {
      dirs.forEach((d) => fs.rmdirSync(d));
    }
  });
}

removePostcodeData();