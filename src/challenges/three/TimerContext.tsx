import { PropsWithChildren, createContext, useState, useContext, useEffect, useRef } from 'react'

type TAction = 'START' | 'PAUSE' | 'RESET'
interface ITimeContext {
    timeCount: {
        value: number, action: TAction
    };
    timerAction: {
        [key in TAction]: () => void
    }
}

const INITIAL_STATE: ITimeContext = {
    timeCount: { value: 0, action: 'START' },
    timerAction: {
        START: () => { },
        PAUSE: () => { },
        RESET: () => { },
    }
}
const TimeContext = createContext<ITimeContext>(INITIAL_STATE)

const TimeContextProvider = ({ children }: PropsWithChildren) => {
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [timeCount, setTimer] = useState<ITimeContext['timeCount']>(INITIAL_STATE.timeCount)

    const dispatchAction = (action: TAction): void => {
        switch (action) {
            case "START":
                timerRef.current = setInterval(() => {
                    setTimer((prev) => ({ action: 'PAUSE', value: prev.value + 1 }))
                }, 100)
                break;
            case "PAUSE":
            case "RESET":
                if (!timerRef.current) return;
                clearInterval(timerRef.current)
                if (action === 'RESET') {
                    setTimer(INITIAL_STATE.timeCount)
                } else {
                    setTimer((prev) => ({ ...prev, action: 'START' }))
                }
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        return () => {
            dispatchAction('RESET')
        }
    }, [])

    return (
        <TimeContext.Provider
            value={{
                timeCount,
                timerAction: {
                    START: () => dispatchAction('START'),
                    PAUSE: () => dispatchAction('PAUSE'),
                    RESET: () => dispatchAction('RESET'),
                }
            }}>
            {children}
        </TimeContext.Provider>
    )
}


export default TimeContextProvider


export const useTimer = (): ITimeContext => {
    const contextResult = useContext(TimeContext)
    return contextResult
}