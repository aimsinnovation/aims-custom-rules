/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-1 implementation in JavaScript | (c) Chris Veness 2002-2013 | www.movable-type.co.uk      */
/*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */
/*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Sha1 = {};  // Sha1 namespace

/**
* Generates SHA-1 hash of string
*
* @param {String} msg                String to be hashed
* @param {Boolean} [utf8encode=true] Encode msg as UTF-8 before generating hash
* @returns {String}                  Hash of msg as hex character string
*/
Sha1.hash = function(msg, getString, encodeUtf8, count) {
    // Convert to byte array

    if (msg.constructor == String)
        if (encodeUtf8)
            msg = UTF8.stringToBytes(msg);
        else
            msg = Unicode.stringToBytes(msg);

    /* else, assume byte array already */

    var m = util.bytesToWords(msg),
        l = msg.length * 8,
        w = [],
        H0 = 1732584193,
        H1 = -271733879,
        H2 = -1732584194,
        H3 = 271733878,
        H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {

        var a = H0,
            b = H1,
            c = H2,
            d = H3,
            e = H4;

        for (var j = 0; j < 80; j++) {

            if (j < 16) w[j] = m[i + j];
            else {
                var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                w[j] = (n << 1) | (n >>> 31);
            }

            var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                    j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                        j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                            (H1 ^ H2 ^ H3) - 899497514);

            H4 = H3;
            H3 = H2;
            H2 = (H1 << 30) | (H1 >>> 2);
            H1 = H0;
            H0 = t;

        }

        H0 += a;
        H1 += b;
        H2 += c;
        H3 += d;
        H4 += e;

    }

    var res = util.wordsToBytes([H0, H1, H2, H3, H4]);


    if (count)
        res.splice(count, res.length - count);

    if (getString)
        return util.bytesToHex(res);

    return res;
};

Sha1.guid = function (s) {
    var b = Sha1.hash(s, false, false, 16);
    var hash = [];
    hash[0] = b[3];
    hash[1] = b[2];
    hash[2] = b[1];
    hash[3] = b[0];
    hash[4] = b[5];
    hash[5] = b[4];
    hash[6] = b[7];
    hash[7] = b[6];

    hash[8] = b[8];
    hash[9] = b[9];
    hash[10] = b[10];
    hash[11] = b[11];
    hash[12] = b[12];
    hash[13] = b[13];
    hash[14] = b[14];
    hash[15] = b[15];

    hash = util.bytesToHex(hash);

    return hash.substr(0, 8) + '-' + hash.substr(8, 4) + '-' + hash.substr(12, 4) + '-' + hash.substr(16, 4) + '-' + hash.substr(20, 12);
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Crypto utilities
var util = {

    // Bit-wise rotate left
    rotl: function (n, b) {
        return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotate right
    rotr: function (n, b) {
        return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function (n) {

        // If number given, swap endian
        if (n.constructor == Number) {
            return util.rotl(n, 8) & 0x00FF00FF |
                               util.rotl(n, 24) & 0xFF00FF00;
        }

        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++)
            n[i] = util.endian(n[i]);
        return n;

    },

    // Generate an array of any length of random bytes
    randomBytes: function (n) {
        for (var bytes = []; n > 0; n--)
            bytes.push(Math.floor(Math.random() * 256));
        return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= bytes[i] << (24 - b % 32);
        return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function (words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function (bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            var first = (bytes[i] >>> 4).toString(16);
            var second = (bytes[i] & 0xF).toString(16);

            hex.push(first == "" ? "0" : first);
            hex.push(second == "" ? "0" : second);
        }


        return hex.join("");
    },

    // Convert a hex string to a byte array
    hexToBytes: function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function (bytes) {

        // Use browser-native function if it exists
        if (typeof btoa == "function") return btoa(Binary.bytesToString(bytes));

        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 <= bytes.length * 8)
                    base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                else base64.push("=");
            }
        }

        return base64.join("");

    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function (base64) {

        // Use browser-native function if it exists
        if (typeof atob == "function") return Binary.stringToBytes(atob(base64));

        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
                                   (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
        }

        return bytes;

    }

};

// UTF-8 encoding
var UTF8  = {

    // Convert a string to a byte array
    stringToBytes: function (str) {
        return Binary.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function (bytes) {
        return decodeURIComponent(escape(Binary.bytesToString(bytes)));
    }

};

Unicode = {
    stringToBytes: function (msg) {
        var res = [];
        for (var i = 0; i < msg.length; ++i) {
            res.push(msg.charCodeAt(i) & 255);
            res.push(msg.charCodeAt(i) >> 8);
        }

        return res;
    }
};

// Binary encoding
var Binary = {
    // Convert a string to a byte array
    stringToBytes: function (str) {
        for (var bytes = [], i = 0; i < str.length; i++)
            bytes.push(str.charCodeAt(i) & 0xFF);
        return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function (bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
            str.push(String.fromCharCode(bytes[i]));
        return str.join("");
    }

};


module.exports = Sha1