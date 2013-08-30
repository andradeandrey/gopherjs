"use strict";

var Slice = function(data, length, capacity) {
  if (capacity === undefined) {
    capacity = length;
  }
  if (data === undefined) {
    data = new Array(capacity);
  }
  this.array = data;
  this.offset = 0;
  this.length = data.length;
  if (length !== undefined) {
    this.length = length;
  }
};

Slice.prototype.length = function() {
  return this.length;
};

Slice.prototype.get = function(index) {
  return this.array[this.offset + index];
};

Slice.prototype.set = function(index, value) {
  this.array[this.offset + index] = value;
};

Slice.prototype.subslice = function(begin, end) {
  var s = new this.constructor(this.array);
  s.offset = this.offset + begin;
  s.length = this.length - begin;
  if (end !== undefined) {
    s.length = end - begin;
  }
  return s;
};

Slice.prototype.toArray = function() {
  return this.array.slice(this.offset, this.offset + this.length);
};

String.prototype.toSlice = function() {
  var array = new Uint8Array(this.length);
  for (var i = 0; i < this.length; i++) {
    array[i] = this.charCodeAt(i);
  }
  return new Slice(array);
};

var Map = function(data, capacity) {};

var Interface = function(value) {
  return value;
};

var Channel = function() {};

var starExpr = function(value) {
  return value;
};

var len = function(slice) {
  return slice.length;
};

var cap = function(slice) {
  return slice.array.length;
};

var make = function(constructor, arg1, arg2) {
  return new constructor(undefined, arg1, arg2);
};

var copy = function(dst, src) {
  var n = Math.min(src.length, dst.length);
  for (var i = 0; i < n; i++) {
    dst.set(i, src.get(i));
  }
  return n;
};

var append = function(slice, toAppend) {
  var newArray = slice.array;
  var newOffset = slice.offset;
  var newLength = slice.length + toAppend.length;

  if (slice.offset + newLength > newArray.length) {
    newArray = new newArray.constructor(newLength);
    for (var i = 0; i < slice.length; i++) {
      newArray[i] = slice.array[slice.offset + i];
    }
    newOffset = 0;
  }

  for (var j = 0; j < toAppend.length; j++) {
    newArray[newOffset + slice.length + j] = toAppend.get(j);
  }

  var newSlice = new slice.constructor(newArray);
  newSlice.offset = newOffset;
  newSlice.length = newLength;
  return newSlice;
};

var string = function(s) {
  return String.fromCharCode(s);
};

var panic = function(msg) {
  throw msg;
};

var print = function(a) {
  console.log(a.toArray().join(""));
};

var float64 = function(v) { return v; };

var newNumericArray = function(len) {
  var a = new Array(len);
  for (var i = 0; i < len; i++) {
    a[i] = 0;
  }
  return a;
};

var fmt = {
  Println: function(a) {
    console.log.apply(console, a.toArray());
  },
  Sprintf: function(format, a) {
    return a.get(0).toString();
  }
};

var os = {
  Exit: process.exit,
};

var reflect = {
  DeepEqual: function(a, b) {
    if (a === b) {
      return true;
    }
    if (a.constructor === Number) {
      return false;
    }
    if (a.constructor !== b.constructor) {
      return false;
    }
    if (a.length !== undefined) {
      if (a.length !== b.length) {
        return false;
      }
      for (var i = 0; i < a.length; i++) {
        if (!this.DeepEqual(a.get(i), b.get(i))) {
          return false;
        }
      }
      return true;
    }
    var keys = Object.keys(a);
    for (var j = 0; j < keys.length;  j++) {
      if (!this.DeepEqual(a[keys[j]], b[keys[j]])) {
        return false;
      }
    }
    return true;
  }
};
