import whichCountry from 'which-country'
import 'jquery.cookie';
import $ from 'jquery'

export class Currency {  // eslint-disable-line import/prefer-default-export

  setCookie(countryCode, l10nData) {
    var userCountryData = _.pick(l10nData, countryCode),
        countryL10nData = userCountryData[countryCode];

    if (countryL10nData) {
        countryL10nData.countryCode = countryCode;
        $.cookie('edx-price-l10n', countryL10nData, {
            expires: 1
        });

        this.setCountry(countryL10nData);
    }
  }

  setCountry(countryL10nData) {
    console.log('setting country');
  }

  getL10nData(countryCode) {
    this.setCookie($('#currency-data').value());
  }

  getCountry(position) {
      const countryCode = whichCountry([position.coords.longitude, position.coords.latitude]),
            l10nCookie = $.cookie('edx-price-l10n');

      if (countryCode) {
          if (true) { // || flags.course_details_localize_price) {
              if (l10nCookie && l10nCookie.countryCode === countryCode) {
                  // If pricing cookie has been set use it
                  this.setCountry(l10nCookie);
              } else {
                  // Else make API call and set it
                  this.getL10nData(countryCode);
              }
          } else {
              this.setCountry({
                  countryCode: countryCode
              });
          }
      }
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition(this.getCountry.bind(this));
  }

  constructor() {
    this.getUserLocation();
  }
}
