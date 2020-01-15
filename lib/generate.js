const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

function checkVersion() {
    const notifier = updateNotifier({
        pkg
        // pkg: {
        //     name: 'rb-cli',
        //     version: '1.4.0'
        // },
        // updateCheckInterval: 0
    })
    if (notifier.update) {
        notifier.notify()
    }
}

module.exports = {
    checkVersion
}
