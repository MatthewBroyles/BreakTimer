function App(){
    const [display, setDisplay] = React.useState(25*60);
    const [breakTime, setBreakTime] = React.useState(5*60);
    const [sessionTime, setSessionTime] = React.useState(25*60);
    const [beep, setSwitchAudio] = React.useState(new Audio('./Alert.mp3'));
    const [timerStatus, setTimerStatus] = React.useState(false);
    const [breakStatus, setBreakStatus] = React.useState(false);

    const lengthIds = [{
        labelLabel: 'break-label',
        incrementLabel: 'break-increment',
        decrementLabel: 'break-decrement',
        lengthLabel: 'break-length'
    }, {
        labelLabel: 'session-label',
        incrementLabel: 'session-increment',
        decrementLabel: 'session-decrement',
        lengthLabel: 'session-length'
    }]

    const playSound = () => {
        let switchAudio = document.getElementById('beep');
        switchAudio.currentTime = 0;
        switchAudio.play();
    }

    const formatTime = (t) => {
        let m = Math.floor(t / 60);
        let s = t % 60;
        return(
            (m<10?"0"+m:m) + ":" + (s<10?"0"+s:s)
        );
    }
    const changeTime = (diff, type) => {
        if(type == 'session'){
            if(sessionTime <= 60 && diff < 0){
                return;
            } else if(sessionTime >= 3600 && diff > 0){
                return;
            }
            setSessionTime((prev) => prev + diff);
            if(!timerStatus){
                setDisplay(sessionTime + diff)
            }
        } else{
            if(breakTime <= 60 && diff < 0){
                return;
            } else if(breakTime >= 3600 && diff > 0){
                return;
            }
            setBreakTime((prev) => prev + diff);
        }
    }

    const timer = () => {
        let s = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime()+ s;
        let breakStatusVariable = breakStatus;
        if(!timerStatus){
            let interval = setInterval(() => {
                date = new Date().getTime();
                if(date>nextDate) {
                    setDisplay((prev) => {
                         if(prev <= 0 && !breakStatusVariable){
                             console.log('im in');
                             playSound();
                             breakStatusVariable=true;
                             setBreakStatus(true);
                             return breakTime;
                         } else if(prev <= 0 && breakStatus){
                             playSound()
                             breakStatusVariable=false;
                             setBreakStatus(false);
                             return sessionTime;
                         }
                        return prev - 1;
                    });
                    nextDate += s;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem('interval-id', interval)
        }

        if(timerStatus){
            clearInterval(localStorage.getItem('interval-id'));
        }


        setTimerStatus(!timerStatus);
    };

    const resetTime = () => {
        if(timerStatus){
            timer()
        }
        let switchAudio = document.getElementById('beep');
        switchAudio.pause();
        switchAudio.currentTime = 0;

        setBreakStatus(false);
        setDisplay(25*60);
        setBreakTime(5*60);
        setSessionTime(25*60);
    }


    return (
    <div className='whole'>
        <div className='container'>
            <p id='time-left' className='timeLeft'>{formatTime(display)}</p>
            <div className='trio'>
            <button id='start_stop' className='btn startStop' onClick={timer}>
                {timerStatus ? (
                    <i className='material-icons' id='start_stopi'>pause_circle_filled</i>
                ) : (
                    <i className='material-icons' id='start_stopi'>play_circle_filled</i>
                )}
            </button>

            <p id='timer-label' className='timerLabel'>{breakStatus ? 'Break' : 'Session'}</p>
            
            <button id='reset' className='btn reset' onClick={resetTime}>
                <i className='material-icons' id='reseti'>update</i>
            </button>
            </div>
            <audio src='./Alert.mp3' id='beep'/>
            <div className='dual'>
            <LengthButton title={'session length'} changeTime={changeTime} type={'session'} time={sessionTime} formatTime={formatTime} lengthIds={lengthIds[1]} />
            <LengthButton title={'break length'} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime} lengthIds={lengthIds[0]} />
            </div>
        </div>
        <p className='Author'>Matthew Broyles</p>
    </div>
    );
}

function LengthButton({ title, changeTime, type, time, formatTime, lengthIds}){
    return (
        <div>
            <div className='sets'>
                <button className={'btn '+lengthIds.decrementLabel} id={lengthIds.decrementLabel} onClick={() => changeTime(-60, type)}> 
                    <i className='material-icons'>arrow_downward</i>
                </button>
                <p id={lengthIds.lengthLabel} className={lengthIds.lengthLabel}>{formatTime(time)}</p>
                <button className={'btn '+lengthIds.incrementLabel} id={lengthIds.incrementLabel} onClick={() => changeTime(60, type)}>
                    <i className='material-icons'>arrow_upward</i>
                </button>
            </div>
            <p id={lengthIds.labelLabel} className={lengthIds.labelLabel}>{title == 'session length'? 'Session Time': 'Break Time'}</p>
        </div>
    )
}


ReactDOM.render(<App/>,document.getElementById('app'))