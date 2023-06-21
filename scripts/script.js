import badgeLinks from "../data/badges.json?v=1.0.1" assert { type: "json" };
import { clientInfoTags } from "./config.js?v=1.0.1";

let lastMessage;
const streamers  = [];

const messageParse = (channel, tags, message) => {

	if (!message.startsWith('!')) {

		if (channel.replace('#', '') == tags['username']) {
			if (!streamers.some(s => s.username == channel.replace('#', ''))) {
				streamers.push(tags);
			}
		}

		const streamer = streamers.find(s => s.username == channel.replace('#', ''));
		
 		// parse links
		message = message.replace(/(https?:\/\/[^\s]+)/gu, '<a href="$1" target="_blank">$1</a>');
		
		const bionicMessage = window.config.bionic
			? textVide.textVide(message)
			: `<b>${message}</b>`;

		if (lastMessage && lastMessage['username'] === tags['username']) {
			const lastMessageTag = document.querySelector('#chatContainer')?.lastChild?.querySelector('.message-content');

			lastMessageTag.insertAdjacentHTML(
				'beforeend',
				'<br>',
			);
			lastMessageTag.insertAdjacentHTML(
				'beforeend',
				bionicMessage,
			);
			return;
		}

		const badges = Object.entries(tags.badges ?? [])?.map((b) => {
			const [key, val] = b;
			if (!badgeLinks["badge_sets"][key].versions[val]) {
				console.log(`Badge not found: ${key} ${val}`);
				return
			};
			return `${badgeLinks["badge_sets"][key].versions[val].image_url_2x}`;
		})?.filter(Boolean) ?? [];

		
		const nameAndBadgeTag = document.createElement('div');
		nameAndBadgeTag.classList.add('nameAndBadge');

		const nameTag = document.createElement('span');
		nameTag.classList.add('name');
		nameTag.style.color = tags['color'];
		nameTag.innerHTML = tags['display-name'];
		
		const channelTag = document.createElement('span');
		channelTag.classList.add('channel');
		channelTag.style.color = streamer?.['color'];
		channelTag.innerHTML = channel;

		const badgesTag = document.createElement('span');
		badgesTag.classList.add('badges');

		if (config.showBadges) {
			for (const badge of badges) {
				const img = document.createElement('img');
				img.classList.add('badge');
				img.src = badge;
				badgesTag.appendChild(img);
			}
		}
		
		const messageTag = document.createElement('p');
		messageTag.classList.add('message');

		if (channel && window.config.channels.length > 2) {
			messageTag.appendChild(channelTag);
		}

		messageTag.appendChild(badgesTag);
		messageTag.appendChild(nameTag);

		const messageTextTag = document.createElement('span');
		messageTextTag.classList.add('message-content');
		
		messageTag.appendChild(messageTextTag);
		
		messageTextTag.insertAdjacentHTML(
			'beforeend',
			'<br>',
		);
		messageTextTag.insertAdjacentHTML(
			'beforeend',
			bionicMessage
		)

		let chatContainer = document.getElementById('chatContainer');
		chatContainer.appendChild(messageTag);

		window.scrollTo(0, document.body.scrollHeight);

		lastMessage = tags;
	}
}

const startTMI = () => {

	const client = new tmi.client({
		channels: window.config.channels.filter(c => c !== ''),
	});

	client.on('message', (channel, tags, message, self) => {
		if (self) return;
		// ignore messages from ignored users
		if (window.config.ignored.some((i) => i.toLowerCase() == tags['username'])) return; 
		
		messageParse(channel, tags, message);
	});

	client.on("connecting", () => {
		messageParse('', clientInfoTags, `Connecting...`);
	});
	client.on("connected", () => {
		messageParse('', clientInfoTags, `Connected!`);
	});
	client.on("disconnected", (reason) => {
		messageParse('', clientInfoTags, `Disconnected from server: ${reason}`);
	});
	
	client.connect();

	return client;
}

let currentClient = startTMI();

window.onstorage = () => {
	currentClient.disconnect();
	currentClient = startTMI();
};