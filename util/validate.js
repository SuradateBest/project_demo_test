export default function vaildateTag(word) {
   return word.indexOf("#") === -1 ? "#" + word : word;
}

