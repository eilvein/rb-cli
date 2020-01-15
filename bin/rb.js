#!/usr/bin/env node
const download = require('download-git-repo')
const program = require('commander')
const ora = require('ora')
const shell = require('shelljs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')
const fse = require('fs-extra')
const boxen = require('boxen')
const execa = require('execa')
const _ = require('lodash')
const checkVersion = require('../lib/generate').checkVersion
const writeJsonAttr = require('../lib/utils').writeJsonAttr
const __root = process.cwd()
const pkg = require('../package.json')
const error = chalk.bold.red
const blue = chalk.bold.blue
const warn = chalk.bold.yellow
const red = chalk.bold.red
const spinner = ora('准备创建')

// 升级提示
checkVersion()

//创建项目
function createProject(name, env) {
    let config = _.assign(
        {
            moduleName: null,
            moduleDescription: null,
            moduleType: false
        },
        env
    )
    let prompList = []
    if (config.moduleName !== 'string') {
        prompList.push({
            type: 'input',
            name: 'moduleName',
            message: '请输入项目名称',
            default: name,
            validate: input => {
                if (!input) {
                    return '不能为空'
                }
                return true
            }
        })
    }
    if (config.moduleDescription !== 'string') {
        prompList.push({
            type: 'input',
            name: 'moduleDescription',
            message: '请输入项目描述'
        })
    }
    if (config.moduleType === false) {
        prompList.push({
            type: 'list',
            name: 'moduleType',
            message: '选择初始化项目类型',
            choices: ['gulp', 'webpack', 'vue'],
            filter: val => {
                return val.toLowerCase()
            }
        })
    }

    inquirer.prompt(prompList).then(answers => {
        initProject(answers)
    })
}
// 初始化项目
function initProject(item) {
    let name = item.moduleName
    let type = item.moduleType
    let projectPath = __root + '/' + item.moduleName
    if (!fs.existsSync(projectPath)) {
        if (type === 'gulp') {
            initGulp(name, projectPath)
        } else if (type === 'webpack') {
            initWebpack(name, projectPath)
        }
    } else {
        console.log()
        console.log('---------------------------------------')
        console.log('项目' + error(`${name}已经存在`) + '请使用其他名称')
        console.log('删除项目' + name + '或重新命名项目名称')
        console.log('---------------------------------------')
        console.log()
    }
}
function initGulp(name, path) {
    spinner.color = 'yellow'
    spinner.text = '准备创建项目:' + blue(name)
    spinner.start()
    download('eilvein/gulp4-webpack4-es6-sass-pack', path, err => {
        if (!err) {
            spinner.succeed('项目创建成功')
            writeJsonAttr(`${path}/package.json`, {
                updataKey: true
            })
            console.log('---------------------------------------')
            console.log('cd ' + name)
            console.log('npm install')
            console.log('or')
            console.log('yarn install')
            console.log('---------------------------------------')
            console.log()
        } else {
            spinner.fail('项目创建失败')
        }
    })
}

function initWebpack(name, path) {
    spinner.color = 'yellow'
    spinner.text = '准备创建项目'
    spinner.start()
    download('eilvein/webpack2-es6', path, err => {
        if (!err) {
            spinner.succeed('项目创建成功')
            writeJsonAttr(`${path}/package.json`, {
                updataKey: true
            })
            console.log('---------------------------------------')
            console.log('cd ' + name)
            console.log('npm install')
            console.log('or')
            console.log('yarn install')
            console.log('---------------------------------------')
            console.log()
        } else {
            spinner.fail('项目创建失败')
        }
    })
}

function initVue() {
    spinner.color = 'yellow'
    spinner.text = '准备创建项目'
    spinner.start()
    download('eilvein/webpack2-es6', path, err => {
        if (!err) {
            spinner.succeed('项目创建成功')
            writeJsonAttr(`${path}/package.json`, {
                updataKey: true
            })
            console.log('---------------------------------------')
            console.log('cd ' + name)
            console.log('npm install')
            console.log('or')
            console.log('yarn install')
            console.log('---------------------------------------')
            console.log()
        } else {
            spinner.fail('项目创建失败')
        }
    })
}

// 更新项目
function updateProject(type) {
    let file = `${__root}/package.json`
    const packageObj = fse.readJsonSync(file)
    if (!packageObj.updataKey) {
        console.log()
        console.log(red('🙅‍♂️ 不在项目目录，无法更新'))
        console.log('---------------------------------------')
        console.log('Examples:')
        console.log('cd projectName')
        console.log('rb update -h')
        console.log('---------------------------------------')
        console.log()
        return
    }
    spinner.color = 'green'
    spinner.text = '准备更新项目'
    spinner.start()
    if (type === 'gulp') {
        download('eilvein/gulp4-webpack4-es6-sass-pack', __root, err => {
            if (!err) {
                writeJsonAttr(file, {
                    updataKey: true
                })
                spinner.succeed('项目更新成功')
                console.log('---------------------------------------')
                console.log(warn('如不需要projectName,可手动删除'))
                console.log('---------------------------------------')
                console.log()
            } else {
                spinner.fail('项目更新失败')
            }
        })
    } else if (type === 'webpack') {
        setTimeout(() => {
            spinner.succeed('暂无更新')
        }, 3000)
    } else {
        setTimeout(() => {
            spinner.succeed('暂无更新')
        }, 3000)
    }
}

program
    .version(pkg.version)
    .usage('<command> [options]')
    .description('A front-end development tool, rb-cli')

program
    .command('create <name>')
    .description('创建项目')
    .option('-d, --default', '默认值')
    .option('-i, --init', '初始项目')
    .action((name, env) => {
        if (name) {
            createProject(name, env)
        }
    })
    .on('--help', function() {
        console.log('')
        console.log('Examples:')
        console.log('')
        console.log('  $ rb create name')
    })

program
    .command('update')
    .description('更新项目')
    .option('-g, --gulp', '更新Gulp项目', 'gulp')
    .option('-w, --webpack', '更新Webpack目', 'webpack')
    .option('-v, --vue', '更新vue目', 'vue')
    .action(env => {
        if (env.gulp) updateProject(env.gulp)
        if (env.webpack) updateProject(env.webpack)
        if (env.vue) updateProject(env.vue)
        if (!env.webpack && !env.gulp && !env.vue) {
            env.help()
        }
    })
    .on('--help', () => {
        console.log('')
        console.log('Examples:')
        console.log('')
        console.log('  $ rb update -g')
        console.log('  $ rb update -w')
    })

program
    .command('serve [files]')
    .description('静态服务')
    .option('-w, --watch', '服务监听')
    .action(async (files, env) => {
        if (files) {
            shell.exec(`browser-sync start --server --files ${files}`)
        } else {
            env.help()
        }
    })
    .on('--help', () => {
        console.log('')
        console.log('Examples:')
        console.log('')
        console.log('  $ rb serve "*.html"')
    })

program
    .command('vue-version')
    .description('VUE-CLI版本')
    .action(async () => {
        const { stdout } = await execa('vue', ['--version'])
        console.log('VUE-CLI Version:', stdout)
    })

program.on('command:*', () => {
    console.log(boxen(warn('ROOBO CLI'), { padding: 1 }))
    program.help()
    process.exit(1)
})

program.parse(process.argv)

if (_.isEmpty(program.args) && process.argv.length === 2) {
    console.log(boxen(warn('ROOBO CLI'), { padding: 1 }))
    program.help()
}
