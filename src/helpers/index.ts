export function shallowObject(a: any, b: any, compare?: any): boolean {
  let ka = 0;
  let kb = 0;

  if (compare) {
    for (let key in a) {
      if (a.hasOwnProperty(key) && !compare(a[key], b[key])) return false;

      ka++;
    }
  } else {
    for (let key in a) {
      if (a.hasOwnProperty(key) && a[key] !== b[key]) return false;

      ka++;
    }
  }

  for (let key in b) {
    if (b.hasOwnProperty(key)) kb++;
  }

  return ka === kb;
}
