const REGEXP_URL = '^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=.]+$';
const urlRegExp = new RegExp(REGEXP_URL);

module.exports = {
  urlRegExp,
};
