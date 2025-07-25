/**
 * Return a random integer [0, max)
 */
export function getRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}
