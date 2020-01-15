const fse = require('fs-extra')
const _ = require('lodash')

/**
 * @name: writeJsonAttr
 * @description:
 * @param {file, attr}
 * @return:
 */
function writeJsonAttr(file, attr) {
    fse.readJson(file)
        .then(packageObj => {
            let _packageObj = _.assign(packageObj, attr)
            fse.writeJsonSync(file, _packageObj, {
                spaces: '\t'
            })
        })
        .catch(err => {
            console.error(err)
        })
}

module.exports = {
    writeJsonAttr
}
