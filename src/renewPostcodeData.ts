import fetch from 'node-fetch';
import JSZip from 'jszip';
import csv from 'csv-parser';
import iconv from 'iconv-lite';
import * as fs from "graceful-fs";

function createFile(data: string[]) {
  try {
    const dir = data[2].slice(0, 3);
    const file = data[2].slice(3);
    if (dir.length !== 3 || file.length !== 4) {
      console.log(`unknown postal code: ${data[2]}`);
      return;
    }
    fs.mkdirSync(`docs/api/${dir}`, { recursive: true });
    fs.writeFileSync(
      `docs/api/${dir}/${file}.json`,
      JSON.stringify({
        local_government_code: data[0],
        zip_code: data[2],
        address: [data[6], data[7], data[8]],
        address_kana: [data[3], data[4], data[5]]
      }),
    );
  } catch (err) {
    console.log(err);
  }
}

export default async function renewPostcodeData() {
  const res = await fetch('https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip');
  // バイナリデータはarrayBufferメソッドを叩いて取り出す
  const arrayBuffer = await res.arrayBuffer();
  // Uint8ContentsのArrayBuffer型 -> Buffer型に変換
  const buffer = Buffer.from(arrayBuffer);

  var new_zip = new JSZip();
  // more files !
  new_zip.loadAsync(buffer)
    .then(function(zip) {
      const fileName = Object.keys(zip.files)[0];
      const converterStream = iconv.decodeStream('shift_jis');
      zip.file(fileName).nodeStream().pipe(converterStream)
        .pipe(csv({ headers: false }))
        .on('data', (data) => createFile(data));
    });
}