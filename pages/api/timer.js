import powerOff from "@/utils/powertool";

let timerInfo = {
    endTime: null,
};

let adbResponse = { response: null, error: null };

export default async function handler(req, res) {
    const {
        timer,
        clean,
        poweroff,
    } = req.query;

    if (poweroff) {
        try {
            adbResponse = await powerOff();
            console.log('adbResponse', adbResponse)
            if (adbResponse.error) {
                res.status(500).json({ endTime: timerInfo.endTime, error: adbResponse.error});
            } else {
                res.status(200).json({ endTime: timerInfo.endTime, ...adbResponse });
            }
        } catch(e) {
            console.log('e', e)
        }
    } 

    if (clean) {
        clearTimeout(timerInfo.timerId);
        timerInfo = {
            endTime: null,
        };
        adbResponse = { response: null, error: null };
        res.status(200).json({ endTime: timerInfo.endTime, ...adbResponse });
        return;
    }

    if (timerInfo.endTime === null && timer) {
        const minutes = parseInt(timer, 10);
        const endTime = Date.now() + minutes * 1000 * 60;

        timerInfo.endTime = endTime;

        console.log('now    ', Date.now())
        console.log('endTime', endTime)

        timerInfo = {
            timerId: setTimeout(() => {
                console.log(`Таймер ${endTime} завершен`);
                timerInfo = {
                    endTime: null,
                };
                adbResponse = powerOff();
            }, minutes * 60 * 1000),
            endTime: endTime
        };  
    }

    res.status(200).json({ endTime: timerInfo.endTime, ...adbResponse });
}