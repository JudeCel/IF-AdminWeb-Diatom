function provideLog($provide) {
  $provide.factory('log', function() {
      var messages = [];

      function log(msg) {
        messages.push(msg);
        return msg;
      }

      log.toString = function() {
        return messages.join('; ');
      }

      log.toArray = function() {
        return messages;
      }

      log.reset = function() {
        messages = [];
      }

      log.fn = function(msg) {
        return function() {
          log(msg);
        }
      }

      log.$$log = true;

      return log;
    });
}