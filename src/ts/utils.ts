// These are some helper functions used throughout the app!

export const getID = (inputEvent: Event) => {
	var input = (inputEvent.target as HTMLElement).id;
	var inputChars = Array.from(input);
	var output = '';
	for (var i = inputChars.length; i >= 0; i--) {
		if(!Number.isNaN(Number.parseInt(inputChars[i]))) {
			output = inputChars[i] + output;
		}
	}
	return output;
}

export const $ = (a: string): HTMLElement => {
	return document.getElementById(a)!;
}

// Thanks stackoverflow lol
export const ordinalSuffix = (i: number) => {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

export const clearChildren = (element: string) => {
	while($(element).firstChild) $(element).removeChild($(element).lastChild!);
}

export const mathClamp = (num: number, min: number, max: number) => {
	return num <= min ? min : num >= max ? max : num;
}

export const getCaretCharacterOffsetWithin = (element: HTMLElement) => {
	var caretOffset = 0;
	const doc = element.ownerDocument;
	const win = doc.defaultView!;
	const sel = win.getSelection();
	if (sel!.rangeCount > 0) {
		var range = win.getSelection()!.getRangeAt(0);
		var preCaretRange = range.cloneRange();
		preCaretRange.selectNodeContents(element);
		preCaretRange.setEnd(range.endContainer, range.endOffset);
		caretOffset = preCaretRange.toString().length;
	}
	return caretOffset;
}

export const characterCount = (thisVar: Element, total: string | null) => {
	thisVar.nextElementSibling!.textContent = `${thisVar.textContent!.length}/${total}`;
}

export const deepEqual = (object1: any, object2: any) => {
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

export const isObject = (object: object) => {
	return object != null && typeof object === 'object';
}

// Creates object from template!
// Note modif can only replace children because of how templates work!
export const createTemplate = (templateID: string, place: string, modif: any = false, replace: any = false) => {
	let content = ($(templateID) as HTMLTemplateElement).content.cloneNode(true);
	if(modif) {
		for (var i = 0; i < content.childNodes.length; i++) {
			if((content.childNodes[i] as HTMLElement).innerHTML) {
				(content.childNodes[i] as HTMLElement).innerHTML = (content.childNodes[i] as HTMLElement).innerHTML.split(modif).join(replace);
			}
		}
	}
	$(place).appendChild(content);
}

export const setTitle = (templateID: string) => {
	clearChildren('title');
	createTemplate(templateID, 'title');
}

export const throwExcept = (msg: string) => {
	$('commError2').style.display = 'block';
	$('CommError').style.display = 'block';
	$('comError3').textContent = msg;
}

export const setCaretPosition = (element: HTMLElement, offset: number) => {
	var range = document.createRange();
	var sel = window.getSelection();

	//select appropriate node
	var currentNode: any = null;
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
		sel!.removeAllRanges();
		sel!.addRange(range);
	}
}

export const signOut = () => {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		window.location.reload();
	});
}