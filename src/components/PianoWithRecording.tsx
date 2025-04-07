import React, { useState, useRef } from 'react';
import { Piano } from 'react-piano';
import { RecordingState, NoteEvent } from '../types/piano';

const MIN_DURATION = 0.1; // Minimum duration for a note to be considered

interface PianoWithRecordingProps {
  recording: RecordingState;
  setRecording: (recording: RecordingState) => void;
  playNote: (midiNumber: number) => void;
  stopNote: (midiNumber: number) => void;
  noteRange: {
    first: number;
    last: number;
  };
  width?: number;
  keyboardShortcuts?: Record<string, number>;
  disabled?: boolean;
  activeNotes?: number[];
}

const PianoWithRecording: React.FC<PianoWithRecordingProps> = ({
  recording,
  setRecording,
  playNote,
  stopNote,
  noteRange,
  width,
  keyboardShortcuts,
  disabled,
  activeNotes,
}) => {
  const keyPressStartTime = useRef<Record<number, number>>({});

  const onPlayNoteInput = (midiNumber: number) => {
    // Record the timestamp when the key is pressed
    keyPressStartTime.current[midiNumber] = Date.now();
  };

  const onStopNoteInput = (
    midiNumber: number,
    { prevActiveNotes }: { prevActiveNotes: number[] }
  ) => {
    const start = keyPressStartTime.current[midiNumber];
    const end = Date.now();

    if (start) {
      // Calculate the duration and ensure it's not too short
      const duration = Math.max((end - start) / 1000, MIN_DURATION); // Convert ms to seconds
      console.log(`Note ${midiNumber} pressed for ${duration} seconds.`); // Debugging log

      const newEvent: NoteEvent = {
        midiNumber,
        time: recording.currentTime,
        duration,
      };

      // Update the recording state
      setRecording({
        ...recording,
        events: [...recording.events, newEvent],
        currentTime: recording.currentTime + duration,
      });

      // Clean up the time tracking
      delete keyPressStartTime.current[midiNumber];
    }
  };

  const { mode, currentEvents } = recording;
  const currentActiveNotes =
    mode === 'PLAYING' ? currentEvents.map(e => e.midiNumber) : activeNotes;

  return (
    <div>
      <Piano
        playNote={playNote}
        stopNote={stopNote}
        onPlayNoteInput={onPlayNoteInput}
        onStopNoteInput={onStopNoteInput}
        activeNotes={currentActiveNotes}
        noteRange={noteRange}
        width={width}
        keyboardShortcuts={keyboardShortcuts}
        disabled={disabled}
      />
    </div>
  );
};

export default PianoWithRecording;
