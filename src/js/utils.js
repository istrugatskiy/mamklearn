// These are some helper functions used throughout the app!
export const $ = (a) => {
	return document.getElementById(a);
}

export const mathClamp = (num, min, max) => {
	return num <= min ? min : num >= max ? max : num;
}

export const getCaretCharacterOffsetWithin = (element) => {
	var caretOffset = 0;
	var doc = element.ownerDocument || element.document;
	var win = doc.defaultView || doc.parentWindow;
	var sel;
	if (typeof win.getSelection != "undefined") {
		sel = win.getSelection();
		if (sel.rangeCount > 0) {
			var range = win.getSelection().getRangeAt(0);
			var preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretOffset = preCaretRange.toString().length;
		}
	} else if ((sel = doc.selection) && sel.type != "Control") {
		var textRange = sel.createRange();
		var preCaretTextRange = doc.body.createTextRange();
		preCaretTextRange.moveToElementText(element);
		preCaretTextRange.setEndPoint("EndToEnd", textRange);
		caretOffset = preCaretTextRange.text.length;
	}
	return caretOffset;
}

export const characterCount = (thisVar, total) => {
	thisVar.nextElementSibling.innerHTML = `${thisVar.textContent.length}/${total}`;
}

export const deepEqual = (object1, object2) => {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		const val1 = object1[key];
		const val2 = object2[key];
		const areObjects = isObject(val1) && isObject(val2);
		if (
			areObjects && !deepEqual(val1, val2) ||
			!areObjects && val1 !== val2
		) {
			return false;
		}
	}

	return true;
}

export const isObject = (object) => {
	return object != null && typeof object === 'object';
}

// Creates object from template!
// Note modif can only replace children because of how templates work!
export const createTemplate = (templateID, place, modif = false, replace = false) => {
	let content = $(templateID).content.cloneNode(true);
	if(modif) {
		for (var i = 0; i < content.children.length; i++) {
			content.children[i].innerHTML = content.children[i].innerHTML.replaceAll(modif, replace);
		}
		
	}
	$(place).appendChild(content);
}

export const setTitle = (templateID) => {
	$('title').innerHTML = '';
	createTemplate(templateID, 'title');
}

export const uuidv4 = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

export const encodeHTML = (str) => {
	return str.replace(/[\u00A0-\u9999<>&#](?!#)/gim, function (i) {
		return '&#' + i.charCodeAt(0) + ';';
	});
}

export const decodeHTML = (str) => {
	return str.replace(/&#([0-9]{1,5});/gi, function (match, num) {
		return String.fromCharCode(parseInt(num));
	});
}

export const throwExcept = (msg) => {
	$('commError2').style.display = 'block';
	$('CommError').style.display = 'block';
	$('comError3').innerHTML = msg;
    document.body.display = 'none';
}

export const setCaretPosition = (element, offset) => {
	var range = document.createRange();
	var sel = window.getSelection();

	//select appropriate node
	var currentNode = null;
	var previousNode = null;

	for (var i = 0; i < element.childNodes.length; i++) {
		//save previous node
		previousNode = currentNode;

		//get current node
		currentNode = element.childNodes[i];
		//if we get span or something else then we should get child node
		while (currentNode.childNodes.length > 0) {
			currentNode = currentNode.childNodes[0];
		}

		//calc offset in current node
		if (previousNode != null) {
			offset -= previousNode.length;
		}
		//check whether current node has enough length
		if (offset <= currentNode.length) {
			break;
		}
	}
	//move caret to specified offset
	if (currentNode != null) {
		range.setStart(currentNode, offset);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
}

export const signOut = () => {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		window.location.reload();
	});
}

// Helper functions end here!
