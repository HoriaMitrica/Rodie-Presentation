import React from 'react';

import Soundfont from 'soundfont-player';
import { InstrumentName } from 'soundfont-player';

type SoundfontFormat = 'mp3' | 'ogg';
type SoundfontName = 'MusyngKite' | 'FluidR3_GM';

// Define the Instrument type based on what Soundfont.instrument returns
interface Instrument {
  play: (midiNumber: number) => AudioBufferSourceNode;
  stop: (midiNumber: number) => void;
}

interface SoundfontProviderProps {
  instrumentName: InstrumentName;
  hostname: string;
  format?: SoundfontFormat;
  soundfont?: SoundfontName;
  audioContext: AudioContext;
  render: (props: {
    isLoading: boolean;
    playNote: (midiNumber: number) => void;
    stopNote: (midiNumber: number) => void;
    stopAllNotes: () => void;
  }) => React.ReactNode;
}

interface SoundfontProviderState {
  activeAudioNodes: Record<number, AudioBufferSourceNode | null>;
  instrument: Instrument | null;
}

class SoundfontProvider extends React.Component<
  SoundfontProviderProps,
  SoundfontProviderState
> {
  static defaultProps = {
    format: 'mp3',
    soundfont: 'MusyngKite',
    instrumentName: 'acoustic_grand_piano' as InstrumentName,
  };

  constructor(props: SoundfontProviderProps) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps: SoundfontProviderProps) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName);
    }
  }

  loadInstrument = (instrumentName: InstrumentName) => {
    this.setState({
      instrument: null,
    });

    Soundfont.instrument(this.props.audioContext, instrumentName, {
      format: this.props.format,
      soundfont: this.props.soundfont,
      nameToUrl: (name: string, soundfont: string, format: string) => {
        return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
      },
    }).then((instrument: Instrument) => {
      this.setState({
        instrument,
      });
    });
  };

  playNote = (midiNumber: number) => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.instrument) return;
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState(prevState => ({
        activeAudioNodes: {
          ...prevState.activeAudioNodes,
          [midiNumber]: audioNode,
        },
      }));
    });
  };

  stopNote = (midiNumber: number) => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.activeAudioNodes[midiNumber];
      if (!audioNode) return;
      audioNode.stop();
      this.setState(prevState => ({
        activeAudioNodes: {
          ...prevState.activeAudioNodes,
          [midiNumber]: null,
        },
      }));
    });
  };

  stopAllNotes = () => {
    this.props.audioContext.resume().then(() => {
      Object.values(this.state.activeAudioNodes).forEach(node => {
        if (node) node.stop();
      });
      this.setState({
        activeAudioNodes: {},
      });
    });
  };

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes,
    });
  }
}

export default SoundfontProvider;
