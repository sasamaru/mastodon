import { unicodeMapping } from './emojione_light';
import Trie from 'substring-trie';
import NicoruImages from './nicoru';

const trie = new Trie(Object.keys(unicodeMapping));

const emojify = str => {
  let rtn = '';
  for (;;) {
    let match, i = 0;
    while (i < str.length && str[i] !== '<' && !(match = trie.search(str.slice(i)))) {
      i += str.codePointAt(i) < 65536 ? 1 : 2;
    }
    if (i === str.length)
      break;
    else if (str[i] === '<') {
      let tagend = str.indexOf('>', i + 1) + 1;
      if (!tagend)
        break;
      rtn += str.slice(0, tagend);
      str = str.slice(tagend);
    } else {
      const [filename, shortCode] = unicodeMapping[match];
      rtn += str.slice(0, i) + `<img draggable="false" class="emojione" alt="${match}" title=":${shortCode}:" src="/emoji/${filename}.svg" />`;
      str = str.slice(i + match.length);
    }
  }
  return rtn + str;
};

const nicoruToImage = str => str.replace(/:nicoru(\d*):/g, (match, deg) => {
  deg = deg ? deg : 0;
  return `<img draggable="false" class="emojione" alt="${match}" src="${NicoruImages.main}" style="transform:rotate(${deg}deg);" />`;
});

const _emojify = str => nicoruToImage(emojify(str));

export default _emojify;
