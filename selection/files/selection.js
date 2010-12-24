/*
 * Operations with selection
 */

(function() {

	var fieldSelection = {

		getSelection: function() {

			var e = this.jquery ? this[0] : this;

			return (

				/* Mozilla / dom 3.0 */
				('selectionStart' in e && function() {
					var l = e.selectionEnd - e.selectionStart;
					return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
				}) ||

				/* Explorer */
				(document.selection && function() {

					e.focus();

					var r = document.selection.createRange();
					if (r === null) {
						return { start: 0, end: e.value.length, length: 0 };
					}

					var re = e.createTextRange();
					var rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);
          var d = { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };

					return { start: rc.text.length, end: rc.text.length + r.text.length, length: r.text.length, text: r.text };
				}) ||

				/* browser not supported */
				function() {
					return { start: 0, end: e.value.length, length: 0 };
				}

			)();

		},

    createSelection: function(range) {

			var e = this.jquery ? this[0] : this;

      return (
        ( e.createTextRange && function() {

            /* 
            IE calculates the end of selection range based 
            from the starting point.
            Other browsers will calculate end of selection from
            the beginning of given text node.
            */

            var selRange = e.createTextRange();
            selRange.collapse(true);
            selRange.moveStart("character", range.start);
            selRange.moveEnd("character", range.length);
            selRange.select();
            e.focus();
            return this;
        }) ||

        /* For the other browsers */

        ( e.setSelectionRange && function(){

            e.setSelectionRange(range.start, range.end);
            e.focus();
            return this;
            }
        )

      )();
    }

	};

	jQuery.each(fieldSelection, function(i) { jQuery.fn[i] = this; });

})();
