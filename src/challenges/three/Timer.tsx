import { Button, HStack, Text } from "@chakra-ui/react";

import TimerContextProvider, { useTimer } from './TimerContext'

type TimerProps = {
  children: JSX.Element;
};

type TimerResult = {
  minutes: string
  seconds: string
  milliseconds: string
}


const getDisplayTime = (currentTime: number): TimerResult => {
  const milliseconds = (currentTime % 100).toString().padStart(2, "0")[1];
  const secondsCompute = (Math.floor(currentTime / 10)) % 60;
  const seconds = secondsCompute >= 1 ? secondsCompute.toString().padStart(2, "0") : "00"
  const minutes = (currentTime > 600 ? Math.floor(currentTime / 600) : 0).toString().padStart(2, "0");

  return {
    minutes,
    seconds,
    milliseconds
  }
}

export default function Timer({ children }: TimerProps) {
  return (
    <TimerContextProvider>
      {children}
    </TimerContextProvider>
  );
}

export function TimerDisplay() {
  const { timeCount: { value } } = useTimer()
  const { minutes, seconds, milliseconds } = getDisplayTime(value)

  return (
    <Text
      fontSize="7xl"
      color="gray.600"
      sx={{
        fontVariantNumeric: "tabular-nums"
      }}
    >
      {minutes}:{seconds}:{milliseconds}
    </Text>
  );
}

export function TimerControls() {
  const { timeCount: { action, value }, timerAction: { START, PAUSE, RESET } } = useTimer()
  return (
    <HStack>
      <Button
        {...action === 'PAUSE' && ({ display: 'none' })}
        onClick={START} colorScheme="green">Start</Button>
      <Button
        {...action === 'START' && ({ display: 'none' })}
        onClick={PAUSE} colorScheme="red">Pause</Button>
      <Button
        {...value <= 0 && ({ display: 'none' })}
        onClick={RESET} >Reset</Button>
    </HStack>
  );
}