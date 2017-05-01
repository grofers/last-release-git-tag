'use strict';

var _require = require('child_process');

var exec = _require.exec;

var semver = require('semver');

module.exports = function (pluginConfig, config, cb) {
  exec('git tag', function (err, stdout, stderr) {
    if (err) return cb(err);

    var tags = stdout.trim().split('\n').map(function (tag) {
      return tag.trim();
    }).filter(semver.valid)
    // semantic-release always puts a v in front.
    .filter(function (tag) {
      return tag.charAt(0) === 'v';
    }).sort(semver.compare);

    if (tags.length < 1) return cb(null, {});

    var tag = tags.pop();
    // semver.valid is poorly named, It actually parses it
    var version = semver.valid(tag);

    cb(null, {
      version: version,
      gitHead: tag
    });
  });
};