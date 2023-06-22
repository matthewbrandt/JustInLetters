
export const getQueryParams = () => {

    var args = document.location.search.substring(1).split('&');

    var argsParsed = {};

    var i, arg, kvp, key, value;

    for (i=0; i < args.length; i++) {

        arg = args[i];

        if (-1 === arg.indexOf('=')) {

            argsParsed[decodeURIComponent(arg).trim()] = true;
        }
        else {

            kvp = arg.split('=');

            key = decodeURIComponent(kvp[0]).trim();

            value = decodeURIComponent(kvp[1]).trim();

            argsParsed[key] = value;
        }
    }

    return argsParsed;
}

export const emoteParser = (message, emotes) => {
	message = sanitize(message);

	if (!emotes) return message;
	const stringReplacements = [];

	Object.entries(emotes).forEach(([id, positions]) => {
        
		const position = positions[0];
		const [start, end] = position.split('-');
		const stringToReplace = message.substring(parseInt(start, 10), parseInt(end, 10) + 1);

		stringReplacements.push({
			stringToReplace: stringToReplace,
			replacement: `<img 
				src="https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0" 
				style="width:30px;height:30px;transform:translateY(25%);"
			>`,
		});
	});

	const messageHTML = stringReplacements.reduce((acc, { stringToReplace, replacement }) => {
		return acc.split(stringToReplace).join(replacement);
	}, message);
	
	return messageHTML;
}

export const sanitize = (message) => {
	return DOMPurify.sanitize(message, {
		FORBID_ATTR: ['style', 'onerror', 'onload', 'class', 'width', 'height', 'dir'],
		ALLOWED_TAGS: ['img','br', 'p', 'a','marquee'],
	});
}

export const sanitizeStrict = (message) => {
	return DOMPurify.sanitize(message?.replace(/</g, '&lt;')?.replace(/>/g, '&gt;'), {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
	});
}
