import { createC2pa } from 'c2pa';
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.js?url';

const sampleImages = [
  // Image with provenance data
  'https://cdn.jsdelivr.net/gh/contentauth/c2pa-js/tools/testing/fixtures/images/CAICAI.jpg',
  // Image without provenance data
  'https://cdn.jsdelivr.net/gh/contentauth/c2pa-js/tools/testing/fixtures/images/I.jpg',
];

(async () => {
  const output: string[] = [];

  const c2pa = await createC2pa({
    wasmSrc,
    workerSrc,
  });

  const stores = await c2pa.readAll(sampleImages);

  stores.forEach(({ manifestStore, source }) => {
    // We can get the filename of the asset that was loaded from
    // the `source` object
    const filename = source.metadata.filename;
    // Note: You would normally call `dispose()` when working with a
    // component-based UI library (e.g. on component un-mount)
    const { data, dispose } = source.thumbnail.getUrl();

    output.push(`
      <tr>
        <td><img src="${data.url}" class="thumbnail" /></td>
        <td>${filename}</td>
        <td>${!!manifestStore ? 'Yes' : 'No'}</td>
      </tr>
    `);
  });

  document.querySelector('#results tbody')!.innerHTML = output.join('');
})();
