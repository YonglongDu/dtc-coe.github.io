import * as fs from "graceful-fs";
import { glob } from 'glob';

function removePostcodeData() {
  glob('docs/postcode/*/*.json', (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((f) => fs.unlinkSync(f));
    }
  });
  glob('docs/postcode/*/', (err, dirs) => {
    if (err) {
      console.log(err);
    } else {
      dirs.forEach((d) => fs.rmdirSync(d));
    }
  });
}

removePostcodeData();