const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const addr = process.env.ADB_ADDR;

const lsDevices = async _ => {
    const { stdout, stderr } = await exec('adb devices');
    // console.log('lsDevices stdout', stdout)
    // console.log('lsDevices stderr', stderr)
    return [stdout.includes(addr), stdout, stderr];
};

const connect = async _ => {
    const [lsResult, lsStdout, lsStderr] = await lsDevices();

    console.log('lsResult', lsResult)

    if (!lsResult) {
        console.log(`Connecting to ${addr}...`);

        const { stdout, stderr } = await exec(`adb connect ${addr}`);

        if (!stdout.includes(`connected to ${addr}`)) {
            return {
                data: {
                    lsStdout,
                    lsStderr,
                    connStdout: stdout, 
                    connStderr: stderr,
                },
                message: stderr.length > 0 ? stderr : stdout,
            };
        }

        console.log(`Connect ${addr}...OK`);
    } else {
        console.log(`already connected to ${addr}`)
    }

    return null;
};

const powerOff = async _ => {
    const connErr = await connect();

    if (connErr !== null) {
        console.log(connErr);
        return {response: null, error: connErr};
    }

    const { stdout, stderr } = await exec(`adb shell reboot -p`);

    return {
        response: stdout,
        error: stderr,
    }
};

export default powerOff;