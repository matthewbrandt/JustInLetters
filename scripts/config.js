export const clientInfoTags = {
    username: 'client',
    'display-name': 'Client',
    color: `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`,
};

const defaults = {
    showBadges: true,
    bionic: true,
    channels: [],
    ignored: [
        'streamlabs',
        'streamelements',
        'nightbot',
        'moobot',
        'wizebot',
        'streamdeckerbot',
        'vivbot',
        'dinu',
        'streamkit',
        'tipeeebot',
        'logviewer',
        'buttsbot',
        'lattemotte',
        'mirrobot',
        'streamjar',
        'overrustlelogs',
        'amazeful',
        'amazefulbot',
        'creatisbot',
        'soundalerts',
        'fossabot',
        'mikuia',
        'rainmaker',
        'playwithviewersbot',
        'own3d',
        'streamholics',
        'lolrankbot',
        'songlistbot',
        'wzbot',
        'pokemoncommunitygame',
        'sery_bot',
        '7tvApp',
        '',
    ],
};

const currentConfig = JSON.parse(localStorage.getItem('config') ?? '{}');

window.config = {
    ...defaults,
    ...currentConfig,
};

if (Object.keys(currentConfig).length < Object.keys(defaults).length) {
    localStorage.setItem('config', JSON.stringify(defaults));
}

window.onstorage = (event) => {
    window.config = JSON.parse(localStorage.getItem('config') ?? '{}');
};

export const setConfig = (newConfig) => {
    window.config = {
        ...config,
        ...newConfig,
    };

    localStorage.setItem('config', JSON.stringify(config));
    window.dispatchEvent(new Event('storage'));
};

const showButton = document.getElementById("showDialog");
const dialog = document.getElementById("dialog");
const confirmBtn = dialog.querySelector("#confirmBtn");

if (window.config.channels.length === 0) {
    dialog.showModal();
}

showButton.addEventListener("click", () => {
    dialog.showModal();
});

dialog.addEventListener("close", (e) => {
});

const badges = document.querySelector("#badges");
badges.checked = window.config.showBadges;

const channels = document.querySelector("#channels");
channels.value = window.config.channels.join('\n');

const ignored = document.querySelector("#ignored");
ignored.value = window.config.ignored.join('\n');

const bionic = document.querySelector("#bionic");
bionic.checked = window.config.bionic;

confirmBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const newChannels = channels.value.split('\n').map(c => c.trim());
    if (newChannels.length === 0) {
        alert('You must have at least one channel!');
        return;
    }
    if (!newChannels.some(c => c === '')) {
        newChannels.push('');
    }

    const newIgnored = ignored.value.split('\n').map(c => c.trim());
    if (!newIgnored.some(c => c === '')) {
        newIgnored.push('');
    }

    setConfig({
        showBadges: badges.checked,
        bionic: bionic.checked,
        channels: newChannels,
        ignored: newIgnored,
    })

    dialog.close();
});