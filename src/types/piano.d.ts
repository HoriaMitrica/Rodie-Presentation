export interface NoteEvent {
    midiNumber: number;
    time: number;
    duration: number;
  }
  
  export type RecordingMode = 'RECORDING' | 'PLAYING' | 'IDLE';
  
  export interface RecordingState {
    events: NoteEvent[];
    currentTime: number;
    mode: RecordingMode;
    currentEvents: NoteEvent[];
  }