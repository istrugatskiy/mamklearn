// Handles the majority of events.
export const eventHandle = () => {
	window.addEventListener('click', (event) => {
		const keys = Object.keys(window.clickIncludesEvents);
		const eventTarget = (event.target! as HTMLElement).id;
		if (eventTarget in window.clickEvents) {
			window.clickEvents[eventTarget](event);
		}
		for (var i = 0; i < keys.length; i++) {
			if (eventTarget.includes(keys[i])) {
				window.clickIncludesEvents[keys[i]](event);
				break;
			}
		}
	});
	window.addEventListener('keydown', event => {
		if(event.key == "Enter") {
			const keys = Object.keys(window.keyboardIncludesEvents);
			const eventTarget = (event.target! as HTMLElement).id;
			for (var i = 0; i < keys.length; i++) {
				if (eventTarget.includes(keys[i])) {
					window.keyboardIncludesEvents[keys[i]](event);
					break;
				}
			}
		}
	});
	window.addEventListener('submit', function (event) {
		event.preventDefault();
		const eventTarget = (event.target! as HTMLElement).id;
		if (eventTarget in window.submitEvents) {
			window.submitEvents[eventTarget](event);
		}
	});
}
