#!/usr/bin/env node
const concurrently = require('concurrently')
const args = require('minimist')(process.argv.slice(2))
const { determineArguments, prefixColors, getInstallPath, isServerlessInstalled } = require('./helpers')

exports.start = async function () {
    const determinedArgs = await determineArguments(args)
    const installedPath = `${__dirname}/../node_modules`

    const serviceCommands = determinedArgs.map((dirAndPort) => {
        const { directory, port, stage } = dirAndPort
        return {
            command: `cd ${process.cwd()}/${directory} && ${installedPath}/nodemon/bin/nodemon.js --exec "cross-env NODE_ENV=${stage} serverless offline start --stage ${stage} --functionsFile cloud --dontPrintOutput --lambdaPort ${port}" -e "js,yml"`,
            name: directory,
            prefixColor: prefixColors[Math.floor(Math.random() * prefixColors.length)]
        }
    })

    // const installResult = await isServerlessInstalled()

    // if (!installResult) {
    //     throw new Error('Serverless does not appear to be installed. This may be a false positive, try re-running with --skipInstallCheck')
    // }

    const { result } = concurrently(serviceCommands, {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        restartTries: 3,
    });
    
    result.then(() => {
        // success
    }, () => {
        // failure
    });
}