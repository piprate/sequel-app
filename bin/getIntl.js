import get from 'lodash-es/get.js';
import { DEFAULT_LOCALE, LOCALE } from '../src/routes/_static/intl.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {default: intl} = await import(path.join(__dirname, '../src/intl', LOCALE + '.js'))
const {default: defaultIntl} = await import(path.join(__dirname, '../src/intl', DEFAULT_LOCALE + '.js'))

export function warningOrError(message) {
  // avoid crashing the whole server on `yarn dev`
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message);
  }
  return '(Placeholder intl string)';
}

export function getIntl(path) {
  const res = get(intl, path, get(defaultIntl, path));
  if (typeof res !== 'string') {
    return warningOrError('Unknown intl string: ' + JSON.stringify(path));
  }
  return res;
}

export function trimWhitespace(str) {
  return str.trim().replace(/\s+/g, ' ');
}
