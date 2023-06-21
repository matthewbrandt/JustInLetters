// ==UserScript==
// @name        Bread
// @match       *://*/*
// @version     2.7.0
// @author      Toby (v1.0.5), ltGuillaume
// @license     MIT
// @description Bread (Bionic Reading) - Read text faster & easier
// @grant       GM_addStyle
// @grant       GM_getValue
// @run-at      document-start
// ==/UserScript==

/* source: https://github.com/tobyxdd/bread (v1.0.5) */
/* jshint esversion: 6 */

let
	minWordLength = 4,    // Minimum word length
	minTextLength = 20,   // Minimum text length
	boldRatio     = 0.4,  // Bold ratio (percentage of letters per word)
	breadSites    = ['127.0.0.1','https://twitch.tv']     /* Configure sites bread will be triggered on
*/

insertTextBefore = (text, node, bold) => {
	if (bold) {
		let span = document.createElement('span');
		span.className = 'bread';
		span.appendChild(document.createTextNode(text));

		node.parentNode.insertBefore(span, node);
	} else {
		node.parentNode.insertBefore(document.createTextNode(text), node);
	}
},
processNode = root => {
	let walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode: function (node) {
			return (
				node.parentNode.nodeName !== 'INPUT' &&
				node.parentNode.nodeName !== 'NOSCRIPT' &&
				node.parentNode.nodeName !== 'SCRIPT' &&
				node.parentNode.nodeName !== 'STYLE' &&
				node.parentNode.nodeName !== 'TEXTAREA' &&
				node.parentNode.nodeName !== 'TITLE' &&
			 (node.parentNode.nodeName === 'A' ||
				node.parentNode.nodeName === 'EM' ||
				node.parentNode.nodeName === 'STRONG' ||
				node.nodeValue.length	 >= minTextLength)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
		}
	});

	let node;
	while (node = walker.nextNode()) {
		let text = node.nodeValue;
		let wStart = -1, wLen = 0, eng = null;

		for (let i = 0; i <= text.length; i++) {	// We use <= here because we want to include the last character in the loop
			let cEng = i < text.length ? /[\p{Letter}\p{Mark}]/u.test(text[i]) : false;

			if (i == text.length || eng !== cEng) {
				// State flipped or end of string
				if (eng && wLen >= minWordLength) {
					let word = text.substring(wStart, wStart + wLen);
					let numBold = Math.ceil(word.length * boldRatio);
					let bt = word.substring(0, numBold), nt = word.substring(numBold);
					insertTextBefore(bt, node, true);
					insertTextBefore(nt, node, false);
				} else if (wLen > 0) {
					let word = text.substring(wStart, wStart + wLen);
					insertTextBefore(word, node, false);
				}
				wStart = i;
				wLen = 1;
				eng = cEng;
			} else {
				wLen++;
			}
		}

		node.nodeValue = '';	// Can't remove the node (otherwise the tree walker will break) so just set it to empty
	}
};

// GM_addStyle(`
// 	span.bread {
// 		display: contents !important;
// 		font-weight: bolder !important;
// 	}
// `);

// let breadNode = breadSites != false ? 'body' : false;
// for (domain in breadSites) {
// 	if (document.location.host.includes(domain)) {
// 		if (Array.isArray(breadSites[domain])) {
// 			GM_addStyle(breadSites[domain][1]);
// 			breadSites[domain] = breadSites[domain][0];
// 		}
// 		breadNode = breadSites[domain] || 'body';
// 		break;
// 	}
// }

let breadNode = 'body';
if (breadNode) window.addEventListener('load', e => {
	let node = document.querySelector(breadNode);
	console.log(node);
	if (!node)
		return console.log('Bread: cannot find node', breadNode);
	if (processDyn != false) {
		const observer = new MutationObserver(
			mutations => mutations.forEach(
				mutation => mutation.addedNodes.forEach(
					addedNode => processNode(addedNode)
				)
			)
		);
		observer.observe(node, { subtree: true, childList: true });
	}
	processNode(node);

const bioread = (text) => 
	text.split(" ").map(w => 
		`<b>${w.split("").slice(0,Math.ceil(w.length/2)).join("")}</b>${w.split("").slice(Math.ceil(w.length / 2),w.length).join("")} `).join(" ")

// example
document.querySelector('body').innerHTML = bioread('your text goes here.')

}, false);