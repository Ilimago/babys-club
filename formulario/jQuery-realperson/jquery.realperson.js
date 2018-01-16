/* http://keith-wood.name/realPerson.html
   Real Person Form Submission for jQuery v2.0.1.
   Written by Keith Wood (kwood{at}iinet.com.au) June 2009.
   Available under the MIT (http://keith-wood.name/licence.html) license. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

	var pluginName = 'realperson';
	
	var ALPHABETIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var ALPHANUMERIC = ALPHABETIC + '0123456789';
	var DOTS = [
		['   *   ', '  * *  ', '  * *  ', ' *   * ', ' ***** ', '*     *', '*     *'],
		['****** ', '*     *', '*     *', '****** ', '*     *', '*     *', '****** '],
		[' ***** ', '*     *', '*      ', '*      ', '*      ', '*     *', ' ***** '],
		['****** ', '*     *', '*     *', '*     *', '*     *', '*     *', '****** '],
		['*******', '*      ', '*      ', '****   ', '*      ', '*      ', '*******'],
		['*******', '*      ', '*      ', '****   ', '*      ', '*      ', '*      '],
		[' ***** ', '*     *', '*      ', '*      ', '*   ***', '*     *', ' ***** '],
		['*     *', '*     *', '*     *', '*******', '*     *', '*     *', '*     *'],
		['*******', '   *   ', '   *   ', '   *   ', '   *   ', '   *   ', '*******'],
		['      *', '      *', '      *', '      *', '      *', '*     *', ' ***** '],
		['*     *', '*   ** ', '* **   ', '**     ', '* **   ', '*   ** ', '*     *'],
		['*      ', '*      ', '*      ', '*      ', '*      ', '*      ', '*******'],
		['*     *', '**   **', '* * * *', '*  *  *', '*     *', '*     *', '*     *'],
		['*     *', '**    *', '* *   *', '*  *  *', '*   * *', '*    **', '*     *'],
		[' ***** ', '*     *', '*     *', '*     *', '*     *', '*     *', ' ***** '],
		['****** ', '*     *', '*     *', '****** ', '*      ', '*      ', '*      '],
		[' ***** ', '*     *', '*     *', '*     *', '*   * *', '*    * ', ' **** *'],
		['****** ', '*     *', '*     *', '****** ', '*   *  ', '*    * ', '*     *'],
		[' ***** ', '*     *', '*      ', ' ***** ', '      *', '*     *', ' ***** '],
		['*******', '   *   ', '   *   ', '   *   ', '   *   ', '   *   ', '   *   '],
		['*     *', '*     *', '*     *', '*     *', '*     *', '*     *', ' ***** '],
		['*     *', '*     *', ' *   * ', ' *   * ', '  * *  ', '  * *  ', '   *   '],
		['*     *', '*     *', '*     *', '*  *  *', '* * * *', '**   **', '*     *'],
		['*     *', ' *   * ', '  * *  ', '   *   ', '  * *  ', ' *   * ', '*     *'],
		['*     *', ' *   * ', '  * *  ', '   *   ', '   *   ', '   *   ', '   *   '],
		['*******', '     * ', '    *  ', '   *   ', '  *    ', ' *     ', '*******'],
		['  ***  ', ' *   * ', '*   * *', '*  *  *', '* *   *', ' *   * ', '  ***  '],
		['   *   ', '  **   ', ' * *   ', '   *   ', '   *   ', '   *   ', '*******'],
		[' ***** ', '*     *', '      *', '     * ', '   **  ', ' **    ', '*******'],
		[' ***** ', '*     *', '      *', '    ** ', '      *', '*     *', ' ***** '],
		['    *  ', '   **  ', '  * *  ', ' *  *  ', '*******', '    *  ', '    *  '],
		['*******', '*      ', '****** ', '      *', '      *', '*     *', ' ***** '],
		['  **** ', ' *     ', '*      ', '****** ', '*     *', '*     *', ' ***** '],
		['*******', '     * ', '    *  ', '   *   ', '  *    ', ' *     ', '*      '],
		[' ***** ', '*     *', '*     *', ' ***** ', '*     *', '*     *', ' ***** '],
		[' ***** ', '*     *', '*     *', ' ******', '      *', '     * ', ' ****  ']];

	/** Create the real person plugin.
		<p>Displays a challenge to confirm that the viewer is a real person.</p>
		<p>Expects HTML like:</p>
		<pre>&lt;input...></pre>
		<p>Provide inline configuration like:</p>
		<pre>&lt;input data-realperson="name: 'value'">...></pre>
	 	@module RealPerson
		@augments JQPlugin
		@example $(selector).realperson()
 $(selector).realperson({length: 200, toggle: false}) */
	$.JQPlugin.createPlugin({
	
		/** The name of the plugin. */
		name: pluginName,

		/** The set of alphabetic characters. */
		alphabetic: ALPHABETIC,
		/** The set of alphabetic and numeric characters. */
		alphanumeric: ALPHANUMERIC,
		/** The set dots that make up each character. */
		defaultDots: DOTS,

		/** More/less change callback.
			Triggered when the more/less button is clicked.
			@callback changeCallback
			@param expanding {boolean} True if expanding the text, false if collapsing. */
			
		/** Default settings for the plugin.
			@property [length=6] {number} Number of characters to use.
			@property [regenerate='Click to change'] {string} Instruction text to regenerate.
			@property [hashName='{n}Hash'] {string} Name of the hash value field to compare with,
						use {n} to substitute with the original field name.
			@property [dot='*'] {string} The character to use for the dot patterns.
			@property [dots=defaultDots] {string[][]} The dot patterns per letter in chars.
			@property [chars=alphabetic] {string} The characters allowed. */
		defaultOptions: {
			length: 6,
			regenerate: 'Click para cambiar',
			hashName: '{n}Hash',
			dot: '*',
			dots: DOTS,
			chars: ALPHABETIC
		},
		
		_getters: ['getHash'],

		_challengeClass: pluginName + '-challenge',
		_disabledClass: pluginName + '-disabled',
		_hashClass: pluginName + '-hash',
		_regenerateClass: pluginName + '-regen',
		_textClass: pluginName + '-text',

		_optionsChanged: function(elem, inst, options) {
			$.extend(inst.options, options);
			var text = '';
			for (var i = 0; i < inst.options.length; i++) {
				text += inst.options.chars.charAt(Math.floor(Math.random() * inst.options.chars.length));
			}
			inst.hash = hash(text + salt);
			var self = this;
			elem.closest('form').off('.' + inst.name).
				on('submit.' + inst.name, function() {
					var name = inst.options.hashName.replace(/\{n\}/, elem.attr('name'));
					var form = $(this);
					form.find('input[name="' + name + '"]').remove();
					form.append('<input type="hidden" class="' + self._hashClass + '" name="' + name +
						'" value="' + hash(text + salt) + '">');
					// console.log( salt );
					setTimeout(function() {
						form.find('input[name="' + name + '"]').remove();
					}, 0);
				});
			elem.prevAll('.' + this._challengeClass + ',.' + this._hashClass).remove().end().
				before(this._generateHTML(inst, text)).
				prevAll('div.' + this._challengeClass).click(function() {
					if (!$(this).hasClass(self._disabledClass)) {
						elem.realperson('option', {});
					}
				});
		},

		/* Enable the plugin functionality for a control.
		   @param elem {element} The control to affect. */
		enable: function(elem) {
			elem = $(elem);
			if (!elem.hasClass(this._getMarker())) {
				return;
			}
			elem.removeClass(this._disabledClass).prop('disabled', false).
				prevAll('.' + this._challengeClass).removeClass(this._disabledClass);
		},

		/* Disable the plugin functionality for a control.
		   @param elem {element} The control to affect. */
		disable: function(elem) {
			elem = $(elem);
			if (!elem.hasClass(this._getMarker())) {
				return;
			}
			elem.addClass(this._disabledClass).prop('disabled', true).
				prevAll('.' + this._challengeClass).addClass(this._disabledClass);
		},
		
		/* Retrieve the hash value.
		   @param elem {Element} The control with the hash.
		   @return {number} The hash value. */
		getHash: function(elem){
			var inst = this._getInst(elem);
			return inst ? inst.hash : 0;
		},
		
		/* Generate the additional content for this control.
		   @param inst {object} The current instance settings.
		   @param text {string} The text to display.
		   @return {string} The additional content. */
		_generateHTML: function(inst, text) {
			var text_hash = calcMD5(text + 'griant');
			// console.log( text_hash );
			var html = '<div class="' + this._challengeClass + '">' +
				'<div class="' + this._textClass + '">';
			for (var i = 0; i < inst.options.dots[0].length; i++) {
				for (var j = 0; j < text.length; j++) {
					html += inst.options.dots[inst.options.chars.indexOf(text.charAt(j))][i].
						replace(/ /g, '&#160;').replace(/\*/g, inst.options.dot) +
						'&#160;&#160;';
				}
				html += '<br>';
			}
			html += '</div><div class="' + this._regenerateClass + '">' +
				inst.options.regenerate + '</div></div>';
			html += '<input type="hidden" name="realpersonhash" value="'+ text_hash +'"/>';
			return html;
		},

		_preDestroy: function(elem, inst) {
			elem.closest('form').off('.' + inst.name);
			elem.prevAll('.' + this._challengeClass + ',.' + this._hashClass).remove();
		}
	});

	/* Load salt value and clear. */
	var salt = $.salt || '#salt';
	delete $.salt;
	$(function() {
		var saltElem = $(salt);
		if (saltElem.length) {
			salt = saltElem.text();
			saltElem.remove();
		}
		if (salt === '#salt') {
			salt = '';
		}
	});

	/* Compute a hash value for the given text.
	   @param value {string} The text to hash.
	   @return {number} The corresponding hash value. */
	function hash(value) {
		var hash = 5381;
		for (var i = 0; i < value.length; i++) {
			hash = ((hash << 5) + hash) + value.charCodeAt(i);
		}
		return hash;
	}

	/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}
 


})(jQuery);
