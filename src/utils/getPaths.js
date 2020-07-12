import isPlainObject from 'lodash/isPlainObject';
import toPath from 'lodash/toPath';

/**
 * Returns the paths to "leaf" values within the object tree. A "leaf" value is a) a value that
 * is not an object, b) a value that is an empty object or c) a value whose key is a property path
 * with at least 2 components.
 *
 * Note that this function can handle both change objects that contain property paths and normal
 * object trees. It's behavior is undefined for normal object trees whose keys happen to use
 * property paths (e.g. `setting.enabled` when not intended to point to the child object `setting`).
 *
 * @param object - The object whose paths should be returned
 *
 * @returns An array of paths to the leaf values within the object tree, or an empty array if the
 *          object contains no keys.
 */
export function getPaths(object) {
  const result = [];

  for (const key of Object.keys(object)) {
    const value = object[key];

    if (toPath(key).length > 1 || !isPlainObject(value)) {
      result.push(key);
    } else {
      const subpaths = getPaths(value);

      if (subpaths.length > 0) {
        subpaths.forEach(subpath => result.push(`${key}.${subpath}`));
      } else {
        result.push(key);                    // Use the path to the object for empty objects
      }
    }
  }

  return result;
}
