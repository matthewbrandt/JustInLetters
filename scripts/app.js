

function configShow() {
	let configWindow = document.getElementById('configWindow');
	configWindow.classList.add("showing");
}

function configHide() {
	let configWindow = document.getElementById('configWindow');
	configWindow.classList.remove("showing");
}

function sanitize(message) {
	return DOMPurify.sanitize(message, {
		FORBID_ATTR: ['style', 'onerror', 'onload', 'class', 'width', 'height', 'dir','img','br','a'],
		ALLOWED_TAGS: ['marquee','blink'],
	});
}

function messageParse(displayName, nameColour, message) {

	if (!message.startsWith('!')) {

		// santize html inputs to avoid issues
		let bionicMessage = sanitize(message);
		// if input was sanitised, return a fixed string value
		if (bionicMessage == '') {
			bionicMessage = '<strike>[REDACTED]</strike>';
		}
		else {
			bionicMessage = textVide.textVide(bionicMessage);
		}
		
		// create name element
		const nameTag = document.createElement('span');
		nameTag.style.color = nameColour;
		nameTag.innerHTML = displayName;
		
		// create message element
		const messageTag = document.createElement('p');
		const messageText = document.createTextNode(bionicMessage);
		messageTag.appendChild(nameTag);
		messageTag.insertAdjacentHTML(
			'beforeend',
			bionicMessage
		)
		//messageTag.appendChild(messageText);

		let chatContainer = document.getElementById('chatMessage');
		chatContainer.appendChild(messageTag);

		// result.appendChild(document.createElement('br'));

		// // create p element
		// let msgPara = document.createElement('p');
		// // set text of p element to message
		// msgPara.innerHTML = `${colouredName}: ${bionicMessage}`;
		// // push p elements into div
		
		// chatContainer.appendChild(msgPara);
		// // add username colour to span
		// chatContainer.span.style.color = 'red';

		window.scrollTo(0, document.body.scrollHeight);
	}
}

let channel;

const params = new URLSearchParams(window.location.search);
let paramsObj = Object.fromEntries(params);
let paramValue = paramsObj.c;

function fart(channel) {
	const client = new tmi.client({
		channels: [channel]
	});
	
	client.on('message', (channel, tags, message, self) => {
		if (self) return;
		messageParse(tags['display-name'],tags['color'],message);
	});
	
	client.connect();
}

// if URL parameter is present, overwrite localStorage value
if (paramValue !== undefined) {
	document.getElementById('noChannel').style.display = "none";
	document.getElementById('noChannelDefined').style.display = "block";
	localStorage.setItem('channelName',paramValue);
	channel = paramValue;
	// console.log("URL parameter found, overwriting localStorage")
	// clear parameter from the URL
	window.history.pushState({}, document.title, "/");
	document.getElementById('channelName').innerText = channel;
	fart(channel);
}

// if no URL parameter, determine channel from localstorage
else if (localStorage.getItem('channelName')) {
	document.getElementById('noChannel').style.display = "none";
	document.getElementById('noChannelDefined').style.display = "block";
	channel = localStorage.getItem('channelName');
	// console.log("localStorage channel found");
	document.getElementById('channelName').innerText = channel;
	fart(channel);
}

