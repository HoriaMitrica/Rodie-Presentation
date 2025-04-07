// react-piano.d.ts
declare module 'react-piano' {
    import { ComponentType } from 'react';
  
    export interface NoteRange {
      first: number;
      last: number;
    }
  
    export interface PianoProps {
      noteRange: NoteRange;
      playNote: (midiNumber: number) => void;
      stopNote: (midiNumber: number) => void;
      width?: number;
      keyWidthToHeight?: number;
      disabled?: boolean;
      keyboardShortcuts?: Record<string, number>;
      activeNotes?: number[];
      onPlayNoteInput?: (midiNumber: number) => void;
      onStopNoteInput?: (
        midiNumber: number,
        options: { prevActiveNotes: number[] }
      ) => void;
    }
  
    export interface KeyboardShortcutsConfig {
      firstNote: number;
      lastNote: number;
      keyboardConfig: 'HOME_ROW' | 'QWERTY';
    }
  
    export const Piano: ComponentType<PianoProps>;
    export const MidiNumbers: {
      fromNote: (note: string) => number;
      getAttributes: (midiNumber: number) => {
        note: string;
        octave: number;
        pitchName: string;
      };
    };
    export const KeyboardShortcuts: {
      create: (config: KeyboardShortcutsConfig) => Record<string, number>;
      HOME_ROW: 'HOME_ROW';
      QWERTY: 'QWERTY';
    };
  }
  