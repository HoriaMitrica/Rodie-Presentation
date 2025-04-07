export type RecordingMode = 'IDLE' | 'RECORDING' | 'PLAYING';

export interface NoteEvent {
  midiNumber: number;
  time: number;
  duration: number;
}

export interface RecordingState {
  events: NoteEvent[];
  currentTime: number;
  mode: RecordingMode;
  currentEvents: NoteEvent[];
} 