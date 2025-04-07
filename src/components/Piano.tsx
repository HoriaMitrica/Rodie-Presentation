import React, { useState, useEffect, useRef } from 'react';
import { Piano as ReactPiano, MidiNumbers, KeyboardShortcuts } from 'react-piano';
import 'react-piano/dist/styles.css';
import '../styles/piano.css';

import SoundfontProvider from './SoundfontProvider';
import PianoWithRecording from './PianoWithRecording';
import { RecordingState, NoteEvent, RecordingMode } from '../types/piano';

const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

const PianoComponent: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<RecordingState>({
    events: [],
    currentTime: 0,
    mode: 'IDLE',
    currentEvents: [],
  });
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const playbackTimeoutRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(0);
  const soundfontRef = useRef<any>(null);

  useEffect(() => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);

    return () => {
      context.close();
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    };
  }, []);

  // Handle playback of recorded notes
  useEffect(() => {
    if (isPlaying && recording.mode === 'PLAYING' && recording.events.length > 0) {
      currentTimeRef.current = 0;
      playNextEvents();
    } else if (!isPlaying && playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
      setActiveNotes([]);
    }
  }, [isPlaying, recording.mode, recording.events]);

  const playNextEvents = () => {
    if (!isPlaying || recording.mode !== 'PLAYING') return;

    // Find events that should be played at the current time
    const currentEvents = recording.events.filter(
      event => event.time <= currentTimeRef.current && 
      event.time + event.duration > currentTimeRef.current
    );

    // Update active notes for visual feedback
    setActiveNotes(currentEvents.map(event => event.midiNumber));

    // Find the next time we need to update
    const nextTimes = recording.events
      .map(event => [event.time, event.time + event.duration])
      .flat()
      .filter(time => time > currentTimeRef.current)
      .sort((a, b) => a - b);

    if (nextTimes.length > 0) {
      const nextTime = nextTimes[0];
      const timeUntilNext = (nextTime - currentTimeRef.current) * 1000; // Convert to ms
      
      playbackTimeoutRef.current = window.setTimeout(() => {
        currentTimeRef.current = nextTime;
        playNextEvents();
      }, timeUntilNext);
    } else {
      // End of recording
      setIsPlaying(false);
      setRecording(prev => ({
        ...prev,
        mode: 'IDLE',
        currentEvents: [],
      }));
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      // Stop playback
      setIsPlaying(false);
      setRecording(prev => ({
        ...prev,
        mode: 'IDLE',
        currentEvents: [],
      }));
    } else {
      // Start playback
      if (recording.events.length === 0) return; // Don't start if nothing is recorded
      
      setIsPlaying(true);
      setRecording(prev => ({
        ...prev,
        mode: 'PLAYING',
        currentEvents: [],
      }));
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setRecording(prev => ({
        ...prev,
        mode: 'IDLE',
      }));
    } else {
      // Start recording
      setIsRecording(true);
      setRecording({
        events: [],
        currentTime: 0,
        currentEvents: [],
        mode: 'RECORDING',
      });
    }
  };

  const clearRecording = () => {
    setIsPlaying(false);
    setIsRecording(false);
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }
    setRecording({
      events: [],
      currentTime: 0,
      mode: 'IDLE',
      currentEvents: [],
    });
    setActiveNotes([]);
  };

  const noteRange = {
    first: MidiNumbers.fromNote('c3'),
    last: MidiNumbers.fromNote('b4'),
  };

  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: noteRange.first,
    lastNote: noteRange.last,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  const handlePlayNote = (midiNumber: number) => {
    setActiveNotes(prev => [...prev, midiNumber]);
  };

  const handleStopNote = (midiNumber: number) => {
    setActiveNotes(prev => prev.filter(note => note !== midiNumber));
  };

  if (!audioContext) return <div>Loading audio context...</div>;

  return (
    <div className={`piano-container ${isRecording ? 'recording' : ''} ${isPlaying ? 'playing' : ''}`}>
      <div className="piano-controls">
        <button
          className={`control-button ${isPlaying ? 'active' : ''}`}
          onClick={togglePlayPause}
          title={isPlaying ? 'Stop' : 'Play Recording'}
          disabled={recording.events.length === 0 && !isPlaying}
        >
          {isPlaying ? 'Stop' : 'Play Recording'}
        </button>
        <button
          className={`control-button ${isRecording ? 'active' : ''}`}
          onClick={toggleRecording}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
          disabled={isPlaying}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          className="control-button"
          onClick={clearRecording}
          title="Clear Recording"
          disabled={recording.events.length === 0 && !isRecording}
        >
          Clear
        </button>
      </div>

      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        hostname={soundfontHostname}
        audioContext={audioContext}
        render={({ isLoading, playNote, stopNote }) => {
          // Store the playNote and stopNote functions in the ref for playback
          soundfontRef.current = { playNote, stopNote };
          
          return (
            <div className="piano-wrapper">
              <PianoWithRecording
                recording={recording}
                setRecording={setRecording}
                playNote={(midiNumber) => {
                  playNote(midiNumber);
                  handlePlayNote(midiNumber);
                }}
                stopNote={(midiNumber) => {
                  stopNote(midiNumber);
                  handleStopNote(midiNumber);
                }}
                noteRange={noteRange}
                width={1000}
                keyboardShortcuts={keyboardShortcuts}
                disabled={isLoading}
                activeNotes={activeNotes}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default PianoComponent;
