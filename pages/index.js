import {
    NativeSelect,
    InputLabel,
    FormControl,
    Button,
    Alert,
} from '@mui/material';

import { useEffect, useState } from 'react';
import apiRequest from '@/utils/apiRequest';

const index = () => {
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(40);
    const [apiResult, setApiResult] = useState(
        {
            response: null,
            error: null,
        }
    );
    const [message, setMessage] = useState(
        {
            msg: '',
            severity: 'error',
        }
    );

    const hm2m = _ => (hour * 60) + min

    useEffect(() => console.log('apiResult', apiResult), [apiResult])

    useEffect(() => {
        if (apiResult.error) {
            setMessage({
                msg: apiResult.error.message,
                severity: 'error',
            });
        } else if (apiResult.response && apiResult.response.data && apiResult.response.data.endTime) {
            console.log('Date.now()                     ', Date.now())
            console.log('apiResult.response.data.endTime', apiResult.response.data.endTime)

            const timeLeft = apiResult.response.data.endTime - Date.now();

            setMessage({
                msg: `Таймер установлен. Осталось ${Math.ceil(timeLeft / 1000 / 60)} мин.`,
                severity: 'info',
            });
        } else if (apiResult.response && apiResult.response.data && apiResult.response.data.endTime === null) {
            setMessage({
                msg: '',
                severity: 'error',
            });
        }
    }, [apiResult])

    useEffect(() => {
        apiRequest({}).then(res => setApiResult(res))
    }, [])

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='justify-center ml-[0em] max-w-[70em] mt- max-h-full'>
                <div className='justify-center flex'>
                    <FormControl>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Час
                        </InputLabel>
                        <NativeSelect
                            defaultValue={hour}
                            onChange={e => setHour(parseInt(e.target.value))}
                            style={{ fontSize: '1.3rem' }} // Increase font size
                        >
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </NativeSelect>
                    </FormControl>
                    <FormControl className='mx-5'>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                            Мин
                        </InputLabel>
                        <NativeSelect
                            defaultValue={min}
                            onChange={e => setMin(parseInt(e.target.value))}
                            style={{ fontSize: '1.3rem' }} // Increase font size
                        >
                            <option value={0}>0</option>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                            <option value={30}>30</option>
                            <option value={35}>35</option>
                            <option value={40}>40</option>
                            <option value={45}>45</option>
                            <option value={50}>50</option>
                            <option value={55}>55</option>
                        </NativeSelect>
                    </FormControl>

                </div>
                <br/>
                <br/>
                <div className='flex flex-col'>
                    <Button
                        className='mt-4'
                        onClick={() => apiRequest(
                            { timer: hm2m(min) }
                        ).then(res => setApiResult(res))}
                    >Установить таймер</Button>
                    <Button
                        className='mt-4'
                        color="error"
                        onClick={() => apiRequest(
                            { poweroff: true }
                        ).then(res => setApiResult(res))}
                    >Выключить сейчас</Button>
                </div>
                {message.msg !== '' && (
                    <div className='mt-5 ml-1 max-w-[40em] flex'>
                        <Alert severity={message.severity}>{message.msg}</Alert>
                        {apiResult.response && apiResult.response.data && apiResult.response.data.endTime && (
                            <Button
                                onClick={() => apiRequest(
                                    { clean: true }
                                ).then(res => setApiResult(res))}
                            >Отменить таймер</Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default index;
