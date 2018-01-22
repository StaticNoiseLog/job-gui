export function areEqual(obj1, obj2) {
  Object.keys(obj1).every(key => {
    let isit = true;//obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]);
    if (!isit) {
      console.log('SUCCESS?       : ' + obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
      console.log('hasOwnProperty : ' + obj2.hasOwnProperty(key));
      console.log('===            : ' + (obj1[key] === obj2[key]));
      console.log('key: ' + key);
      console.log('obj1[key]: ' + obj1[key]);
      console.log('obj1[key] length=' + obj1[key].length);
      console.log('obj2[key]: ' + obj2[key]);
      console.log('obj2[key]: length=' + obj2[key].length);

      console.log('TOHEX obj1[key]: ' + toHex(obj1[key]));
      console.log('TOHEX obj2[key]: ' + toHex(obj2[key]));

    }
    return true;
  });
  return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
}

export function removeCarriageReturnFromString(str) {
  return str && typeof str === 'string' || str instanceof String ? str.replace(/\r+/g, '') : str;
}

export function toHex(str) {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '-' + str.charCodeAt(i).toString(16);
  }
  return hex;
}
