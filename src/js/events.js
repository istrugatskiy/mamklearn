// Handles the majority of events.
export const eventHandle = () => {
	window.addEventListener('click', (event) => {
		const keys = Object.keys(window.clickIncludesEvents);
		if (event.target.id in window.clickEvents) {
			window.clickEvents[event.target.id]();
		}
		for (var i = 0; i < keys.length; i++) {
			if (event.target.id.includes(keys[i])) {
				window.clickIncludesEvents[keys[i]](event);
				break;
			}
		}
	});
	window.addEventListener('keydown', event => {
		if(event.key == "Enter") {
			const keys = Object.keys(window.keyboardIncludesEvents);
			for (var i = 0; i < keys.length; i++) {
				if (event.target.id.includes(keys[i])) {
					window.keyboardIncludesEvents[keys[i]](event);
					break;
				}
			}
		}
	});
	window.addEventListener('submit', function (event) {
		event.preventDefault();
		if (event.target.id in window.submitEvents) {
			window.submitEvents[event.target.id]();
		}
	});
}
