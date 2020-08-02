/**
 * Creates a delay of `duration` ms.
 *
 * @param {number} duration
 * @returns {Promise} A promise that resolves after `duration` ms.
 */
export default function sleep(duration: number = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}
