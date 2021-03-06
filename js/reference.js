// Generated by CoffeeScript 1.7.1

/*
PDFReference - represents a reference to another object in the PDF object heirarchy
By Devon Govett
 */

(function() {
  var PDFObject, PDFReference, setImmediate, zlib;

  zlib = require('zlib');

  setImmediate = setImmediate != null ? setImmediate : process.nextTick;

  PDFReference = (function() {
    function PDFReference(id, data) {
      this.id = id;
      this.data = data != null ? data : {};
      this.gen = 0;
      this.stream = null;
      this.finalizedStream = null;
    }

    PDFReference.prototype.object = function(compress, fn) {
      var out;
      if (this.finalizedStream == null) {
        return this.finalize(compress, (function(_this) {
          return function() {
            return _this.object(compress, fn);
          };
        })(this));
      }
      out = ["" + this.id + " " + this.gen + " obj"];
      out.push(PDFObject.convert(this.data));
      if (this.stream) {
        out.push("stream");
        out.push(this.finalizedStream);
        out.push("endstream");
      }
      out.push("endobj");
      return fn(out.join('\n'));
    };

    PDFReference.prototype.add = function(s) {
      if (this.stream == null) {
        this.stream = [];
      }
      return this.stream.push(Buffer.isBuffer(s) ? s.toString('binary') : s);
    };

    PDFReference.prototype.finalize = function(compress, fn) {
      var data, i;
      if (compress == null) {
        compress = false;
      }
      if (this.stream) {
        data = this.stream.join('\n');
        if (compress && !this.data.Filter) {
          data = new Buffer((function() {
            var _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = data.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
              _results.push(data.charCodeAt(i));
            }
            return _results;
          })());
          return zlib.deflate(data, (function(_this) {
            return function(err, compressedData) {
              if (err) {
                throw err;
              }
              _this.finalizedStream = compressedData.toString('binary');
              _this.data.Filter = 'FlateDecode';
              _this.data.Length = _this.finalizedStream.length;
              return fn();
            };
          })(this));
        } else {
          this.finalizedStream = data;
          this.data.Length = this.finalizedStream.length;
          return setImmediate(fn);
        }
      } else {
        this.finalizedStream = '';
        return setImmediate(fn);
      }
    };

    PDFReference.prototype.toString = function() {
      return "" + this.id + " " + this.gen + " R";
    };

    return PDFReference;

  })();

  module.exports = PDFReference;

  PDFObject = require('./object');

}).call(this);
