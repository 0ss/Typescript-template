import { readFileSync } from "fs";
import { join } from "path";
const cyrb53 = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// test the collision of the hash function
const testCollision = () => {
  const file = readFileSync(join(__dirname, "words.json"), "utf-8");
  const words = JSON.parse(file);
  const arr: any[] = [];
  const set = new Set();
  for (const word in words) {
    // console.log(word, cyrb53(word));
    arr.push(cyrb53(word));
    set.add(cyrb53(word));
  }
  for (const word in words) {
    const newWord = word + words[Math.floor(Math.random() * words.length)];
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }
  for (const word in words) {
    const newWord = word + randomString();
    arr.push(cyrb53(newWord));
    set.add(cyrb53(newWord));
  }

  // console.log("length ", arr.length);
  // console.log("set length ", set.size);
  // console.log("collision ", arr.length - set.size);
};
function randomString(length: number = 5) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
testCollision();
