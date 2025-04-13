import { MouseSensor, TouchSensor } from '@dnd-kit/core';

const isInteractiveElement = (event: Event) => {
  const target = event.target as HTMLElement;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'BUTTON' ||
    target.tagName === 'A' ||
    target.isContentEditable
  );
};

export class CustomMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
        return !isInteractiveElement(nativeEvent);
      },
    },
  ];
}

export class CustomTouchSensor extends TouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart' as const,
      handler: ({ nativeEvent }: { nativeEvent: TouchEvent }) => {
        return !isInteractiveElement(nativeEvent);
      },
    },
  ];
}
