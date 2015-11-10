/**
 * Combines multiple className strings into one.
 * http://jsperf.com/joinclasses-args-vs-array
 *
 * @param {...?string} classes
 * @return {string}
 */

function joinClasses(cn) {
  let className = cn;
  if (!className) {
    className = '';
  }
  let nextClass;
  const argLength = arguments.length;
  if (argLength > 1) {
    for (let ii = 1; ii < argLength; ii++) {
      nextClass = arguments[ii];
      if (nextClass) {
        className = (className ? className + ' ' : '') + nextClass;
      }
    }
  }
  return className;
}

module.exports = joinClasses;
