;(function() {
  var _       = require('lodash'),
      cheerio = require('cheerio');

  cheerio.prototype.wrap = function() {
    //parent() won't return the top, so we have to wrap in some fake element to get inner html
    return cheerio("<div></div>").append(this);
  }

  var R3ndr = function(template) {
    if(!_.isString(template)) throw new Error('Template must be set.');

    var self = this;

    self.$ = cheerio.load(template);
    self.$root = self.$.root().children();

    self.find = function find($root, selector) {
      var $rootWrapper = $root.wrap(),
          found = $rootWrapper.find('#' + selector);
      if (!found.length) {
        return $rootWrapper.find('.' + selector);
      }
      return found;
    };

    self.injectData = function injectData($element, name, value) {
      if (!value) {
        return;
      }

      if (_.contains(['text', 'html'], name)) {
        $element.html(value);
      } else {
        $element.attr(name, value);
      }
    };

    self.renderRoot = function renderRoot($root, data, directives) {
      _.forIn(directives, function(directive, name) {
        if (_.isFunction(directive)) {
          $root.attr(name, directive.call(data, {index: 0, value: $root.attr(name)}));
        }
      });
    };

    self.renderElement = function renderElement($root, $clone, index, data, directives) {
      self.renderDirectives($clone, index, data, directives);
      if (index === 0) {
        $root.html($clone);
      } else {
        $root.append($clone);
      }
    };

    self.renderDirectives = function renderDirectives($element, index, data, directives) {
      _.each(directives, function (directive, name) {
        self.applyDirective(self.find($element, name), index, data, directive);
      });
    };

    self.applyDirective = function applyDirective($element, index, data, directive) {
      if (!$element[0]) {
        return;
      }
      _.each(directive, function (func, name) {
        var attributes = {index: index, value: $element.attr(name)};
        self.injectData($element, name, func.call(data, attributes));
      });
    };

    return {
      render: function render(data, directives) {
        if (data === undefined) {
          return;
        }

        var $ = self.$,
            $root = self.$root,
            $rootClone = $root.clone();

        self.renderRoot($rootClone, data, directives);

        if (_.isArray(data)) {
          _.each(data, function (item, index) {
            var $clone = $root.first().children().clone();
            self.renderElement($rootClone, $clone, index, item, directives);
          });
        } else { // Assume an object
          _.each(directives, function (directive, name) {
            var $newRoot = self.find($rootClone, name),
                $newRootClone = $newRoot.clone(),
                childData = data[name];

            if (_.isArray(childData)) {
              _.each(childData, function (childItem, index) {
                var $clone = $newRoot.first().clone();
                self.renderElement($newRootClone, $clone, index, childItem, directives);
              });
              $newRoot.replaceWith($newRootClone.children());
            } else {
              self.applyDirective(self.find($rootClone, name), 0, childData ? childData : data, directive);
            }
          });
        }

        return $rootClone.wrap().html();
      }
    }
  };

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = R3ndr;
  }

  if (typeof window !== 'undefined' && window !== null) {
    window.R3ndr = window.R = R3ndr;
  }

  if (typeof define !== 'undefined' && define !== null ? define.amd : void 0) {
    define(function() {
      return R3ndr;
    });
  }
}).call(this);