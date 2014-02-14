// Generated by CoffeeScript 1.7.1
(function() {
  var PDFImage,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  PDFImage = require('../image');

  module.exports = {
    initImages: function() {
      this._imageRegistry = {};
      return this._imageCount = 0;
    },
    image: function(src, x, y, options) {
      var bh, bp, bw, h, hp, image, ip, label, pages, w, wp, _ref, _ref1, _ref2, _ref3, _ref4;
      if (options == null) {
        options = {};
      }
      if (typeof x === 'object') {
        options = x;
        x = null;
      }
      x = (_ref = x != null ? x : options.x) != null ? _ref : this.x;
      y = (_ref1 = y != null ? y : options.y) != null ? _ref1 : this.y;
      if (this._imageRegistry[src]) {
        _ref2 = this._imageRegistry[src], image = _ref2[0], label = _ref2[1], pages = _ref2[2];
        if (_ref3 = this.page, __indexOf.call(pages, _ref3) < 0) {
          pages.push(this.page);
        }
      } else {
        image = PDFImage.open(src);
        label = "I" + (++this._imageCount);
        this._imageRegistry[src] = [image, label, [this.page]];
      }
      w = options.width || image.width;
      h = options.height || image.height;
      if (options.width && !options.height) {
        wp = w / image.width;
        w = image.width * wp;
        h = image.height * wp;
      } else if (options.height && !options.width) {
        hp = h / image.height;
        w = image.width * hp;
        h = image.height * hp;
      } else if (options.scale) {
        w = image.width * options.scale;
        h = image.height * options.scale;
      } else if (options.fit) {
        _ref4 = options.fit, bw = _ref4[0], bh = _ref4[1];
        bp = bw / bh;
        ip = image.width / image.height;
        if (ip > bp) {
          w = bw;
          h = bw / ip;
        } else {
          h = bh;
          w = bh * ip;
        }
        if (options.align === 'center') {
          x = x + bw / 2 - w / 2;
        } else if (options.align === 'right') {
          x = x + bw - w;
        }
      }
      if (this.y === y) {
        this.y += h;
      }
      this.save();
      this.transform(w, 0, 0, -h, x, y + h);
      this.addContent("/" + label + " Do");
      this.restore();
      return this;
    },
    embedImages: function(fn) {
      var images, item, proceed, src;
      images = (function() {
        var _ref, _results;
        _ref = this._imageRegistry;
        _results = [];
        for (src in _ref) {
          item = _ref[src];
          _results.push(item);
        }
        return _results;
      }).call(this);
      return (proceed = (function(_this) {
        return function() {
          var image, label, pages, _ref;
          if (images.length) {
            _ref = images.shift(), image = _ref[0], label = _ref[1], pages = _ref[2];
            return image.object(_this, function(obj) {
              var page, _base, _i, _len;
              for (_i = 0, _len = pages.length; _i < _len; _i++) {
                page = pages[_i];
                if ((_base = page.xobjects)[label] == null) {
                  _base[label] = obj;
                }
              }
              return proceed();
            });
          } else {
            return fn();
          }
        };
      })(this))();
    }
  };

}).call(this);
