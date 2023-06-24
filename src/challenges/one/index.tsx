import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

interface IMouseLocationProps {
  containerRef: React.RefObject<HTMLElement>
  coordinateRef: React.RefObject<HTMLElement>
}

type TboundSize = { left: number, top: number }
const DEFAULT_BOUNDING_SIZE: TboundSize = { left: 0, top: 0 }


function useMouseLocation({ containerRef, coordinateRef }: IMouseLocationProps) {

  const boundingRef = useRef<TboundSize>(DEFAULT_BOUNDING_SIZE)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const onMouseTrack = ({ clientX, clientY }: MouseEvent) => {
    const { left, top } = boundingRef.current
    const x = Math.floor(clientX - left);
    const y = Math.floor(clientY - top);
    coordinateRef.current!.style.transform = `translate(${x}px, ${y}px)`
    setMousePosition(() => ({ x, y }))
  }

  const onRecalibrateBoundSize = (el: HTMLElement | null) => {
    if (!el) return DEFAULT_BOUNDING_SIZE
    const newBoundingSize = el.getBoundingClientRect()
    boundingRef.current = newBoundingSize
  }

  useEffect(() => {
    onRecalibrateBoundSize(containerRef.current)
    if (containerRef.current && coordinateRef.current) {
      containerRef.current.addEventListener('mousemove', onMouseTrack)
      containerRef.current.addEventListener('mouseenter', () => onRecalibrateBoundSize(containerRef.current))
    }
    // to maintain accuracy of coordinates on window-size/scroll
    window.addEventListener("resize", () => onRecalibrateBoundSize(containerRef.current))
    window.addEventListener("scroll", () => onRecalibrateBoundSize(containerRef.current))
  }, [containerRef.current, coordinateRef.current])

  return mousePosition
}

export default function One() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const coordinateRef = useRef<HTMLParagraphElement | null>(null)
  const { x, y } = useMouseLocation({ containerRef, coordinateRef });
  return (
    <Box
      h="350px"
      w="full"
      rounded="xl"
      bg="red.200"
      ref={containerRef}
      position="relative"
      mt={6}
      _hover={{
        shadow: "lg"
      }}
    >
      <Text
        p={2}
        rounded="md"
        fontSize="sm"
        color="gray.100"
        fontWeight="bold"
        ref={coordinateRef}
        position="absolute"
        pointerEvents="none"
        background="gray.600"
      >
        x: {x}, y: {y}
      </Text>
    </Box>
  );
}
