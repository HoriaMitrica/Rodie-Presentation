// soundfont-player.d.ts
declare module 'soundfont-player' {
  export interface SoundfontOptions {
    format?: 'mp3' | 'ogg';
    soundfont?: 'MusyngKite' | 'FluidR3_GM';
    nameToUrl?: (name: string, soundfont: string, format: string) => string;
  }

  export interface Instrument {
    play: (midiNumber: number) => AudioBufferSourceNode;
    stop: () => void;
  }

  export type InstrumentName =
    | 'acoustic_grand_piano'
    | string;

  export function instrument(
    audioContext: AudioContext,
    name: InstrumentName,
    options?: SoundfontOptions
  ): Promise<Instrument>;

  const Soundfont: {
    instrument: typeof instrument;
  };

  export default Soundfont;
}
