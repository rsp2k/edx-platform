/* globals $, loadFixtures */

import {
  expectRequest,
  requests as mockRequests,
  respondWithJson,
} from 'edx-ui-toolkit/js/utils/spec-helpers/ajax-helpers';
import { WelcomeMessage } from '../WelcomeMessage';

describe('Welcome Message factory', () => {
  describe('Ensure button click', () => {
    const endpointUrl = '/course/course_id/dismiss_message/';

    beforeEach(() => {
      loadFixtures('course_experience/fixtures/welcome-message-fragment.html');
      new WelcomeMessage({ dismissUrl: endpointUrl });  // eslint-disable-line no-new
    });

    it('When button click is made, ajax call is made and message is hidden.', () => {
      const $message = $('.welcome-message');
      const requests = mockRequests(this);
      document.querySelector('.dismiss-message button').dispatchEvent(new Event('click'));
      expectRequest(
        requests,
        'POST',
        endpointUrl,
      );
      respondWithJson(requests);
      expect($message.attr('style')).toBe('display: none;');
      requests.restore();
    });
  });

  describe('Ensure cookies behave as expected', () => {
    const endpointUrl = '/course/course_id/dismiss_message/';
    function createWelcomeMessage() {
      loadFixtures('course_experience/fixtures/welcome-message-fragment.html');
      new WelcomeMessage({ dismissUrl: endpointUrl });  // eslint-disable-line no-new
    }

    it('Cookies are created if none exist.', () => {
      createWelcomeMessage();
      expect($.cookie('welcome-message-viewed')).toBe('True');
      expect($.cookie('welcome-message-timer')).toBe('True');
    });

    it('Nothing is hidden or dismissed if the timer is still active', () => {
      const $message = $('.welcome-message');
      $.cookie('welcome-message-viewed', 'True');
      $.cookie('welcome-message-timer', 'True');
      createWelcomeMessage();
      expect($message.attr('style')).toBe('');
    });

    it('Message is dismissed if the timer has expired and the message has been viewed.', () => {
      const $message = $('.welcome-message');
      const requests = mockRequests(this);
      $.cookie('welcome-message-viewed', 'True');
      createWelcomeMessage();
      expectRequest(
        requests,
        'POST',
        endpointUrl,
      );
      respondWithJson(requests);
      expect($message.attr('style')).toBe('display: none;');
      requests.restore();
    });
  });
});
