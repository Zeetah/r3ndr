(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {
  var _       = {},//require('lodash'),
      //cheerio = require('cheerio'),
      cheerio = {};


  cheerio.prototype.wrap = function() {
    //parent() won't return the top, so we have to wrap in some fake element to get inner html
    return cheerio("<div></div>").append(this);
  }

  var R3ndr = {
    render: function render(template, data, directives) {
      if (data === undefined) {
        return;
      }

      var self = this,
          $ = cheerio.load(template),
          $root = $.root().children(),
          $rootClone = $root.clone();

      if (_.isArray(data)) {
        self.renderRoot($rootClone, data, directives);
        _.each(data, function (item, index) {
          var $clone = $root.first().children().clone();
          self.renderElement($rootClone, $clone, index, item, directives);
        });
      } else { // Assume an object
        self.renderRoot($rootClone, data, directives);
        _.each(directives, function (directive, name) {
          var $newRoot = self.findElementByName($rootClone, name),
              $newRootClone = $newRoot.clone(),
              childData = data[name];

          if (_.isArray(childData)) {
            _.each(childData, function (childItem, index) {
              var $clone = $newRoot.first().clone();
              self.renderElement($newRootClone, $clone, index, childItem, directives);
            });
            $newRoot.replaceWith($newRootClone.children());
          } else {
            self.applyDirective(self.findElementByName($rootClone, name), 0, childData ? childData : data, directive);
          }
        });
      }

      return $rootClone.wrap().html();
    },

    findElementByName: function findElementByName($root, name) {
      var $rootWrapper = $root.wrap(),
          found = $rootWrapper.find('#' + name);
      if (!found.length) {
        return $rootWrapper.find('.' + name);
      }
      return found;
    },

    renderRoot: function renderRoot($root, data, directives) {
      var self = this;
      _.each(directives, function (directive, name) {
        if (_.isFunction(directive)) {
          var attributes = { index: 0, value: $root[0].attribs[name] };
          $root.attr(name, directive.call(data, attributes));
        }
      });
    },

    renderElement: function renderElement($root, $clone, index, data, directives) {
      this.renderDirectives($clone, index, data, directives);
      if (index === 0) {
        $root.html($clone.wrap().html());
      } else {
        $root.append($clone.wrap().html());
      }
    },

    renderDirectives: function renderDirectives($element, index, data, directives) {
      var self = this;
      _.each(directives, function (directive, name) {
        var $found = self.findElementByName($element, name);
        if ($found.length !== 0) {
          self.applyDirective($found, index, data, directive);
        }
      });
    },

    applyDirective: function applyDirective($element, index, data, directive) {
      if (!$element[0]) {
        return;
      }
      _.each(directive, function (func, name) {
        var attributes = { index: index, value: $element[0].attribs[name] },
            contentFunc = (name === 'text' || name === 'html') ? func : undefined,
            value;
        if (contentFunc) {
          value = contentFunc.call(data, attributes);
          if (value) {
            $element.html(value);
          }
        } else {
          value = func.call(data, attributes);
          if (value) {
            $element.attr(name, value);
          }
        }
      });
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
},{}]},{},[1]);
