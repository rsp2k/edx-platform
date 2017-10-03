export class Currency {  // eslint-disable-line import/prefer-default-export
  constructor() {
    const $testing = 'test';
    const $wc = require('which-country');
    const $countryCode = $wc([-71.09248360000001, 42.3654326]);
    console.log($countryCode);
  }
}
