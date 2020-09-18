import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
const TV_ON = 125;
const DVD_ON = 30;
const TV_OFF = 5;
const DVD_OFF = 5;
const DVD_PLAY = 5;
const DVD_PAUSE = 3;
const DVD_EJECT = 2;
const DVD_LOAD = 2;
const TV_VOLUME = 2;
const dvdStateStopped = 'stopped';
const dvdStatePlaying = 'playing';
const dvdStatePaused = 'paused';

function ResetTestButton(props) {
  return (
    <div className="centerMe">
      <button className="resetButton" onClick={props.onClick}>
        {"RESET TEST"}
      </button>
    </div>
  );

}

function TvImage(props) {
  return (
    <img src={props.src} alt={props.alt}></img>
  )
}

function ImageButton(props) {
  return (
    <img src={props.src} alt={props.alt} onClick={props.onClick} height="60"></img>
  )
}

class TvControls extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div style={{
          "height": "5px",
          "backgroundColor": "hsl(" + (60 - (this.props.PowerLevel * 60) / 200) + ", 100%, 50%)"
        }}>
          &nbsp;&nbsp;</div>
        <div style={{
          "height": "5px",
          "backgroundColor": "hsl(" + (60 - (this.props.ResidualPower * 60) / 100) + ", 100%, 50%)"
        }}>
          &nbsp;&nbsp;</div>
        <div className="centerMeWithoutWrapGrey">
          <div>
            <div className="controlLabel">TV Controls</div>
          </div>
          <p className='newline'></p>
          <ImageButton src={this.props.tvPowerSrc} alt="TV POWER OFF" onClick={() => { this.props.switchTvPower() }}></ImageButton>
          <ImageButton src={this.props.volumeUpSrc} alt="VOLUME UP" onClick={() => { this.props.volumeUp() }}></ImageButton>
          <ImageButton src={this.props.volumeDownSrc} alt="VOLUME DOWN" onClick={() => { this.props.volumeDown() }}></ImageButton>
          <ImageButton src={this.props.muteSrc} alt="MUTE" onClick={() => { this.props.mute() }}></ImageButton>
          <div>
            <p className="controlLabel" style={{
              color:
                this.props.tvPower && !this.props.muted ? "lime" : "red"
            }}> {'VOLUME: ' + this.props.volume} %</p>
          </div>
          <div className="controlLabel">{this.props.muted ? 'MUTED' : 'NOT MUTED'}</div>
          <div classname="controlLabel" style={{
            "font-family": "Arial",
            "font-weight": "bold",
            "font-size": "large",
            backgroundColor:
              this.props.tvPower ? "lime" : "red"
          }}>
            TV Status: {this.props.tvPower ? 'TV ON' : 'TV OFF'} </div>
        </div>
      </div>
    )
  }
}

class DvdControls extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="centerMeWithoutWrapGrey">
          <div>
            <div className="controlLabel">DVD Controls</div>
          </div>
          <p className='newline'></p>
          <ImageButton src={this.props.dvdPowerSrc} alt="DVD POWER" onClick={() => { this.props.switchDvdPower() }}></ImageButton>
          <ImageButton src={this.props.dvdPlaySrc} alt="DVD PLAY" onClick={() => { this.props.dvdPlay() }}></ImageButton>
          <ImageButton src={this.props.dvdPauseSrc} alt="DVD PAUSE" onClick={() => { this.props.dvdPause() }}></ImageButton>
          <ImageButton src={this.props.dvdStopSrc} alt="DVD STOP" onClick={() => { this.props.dvdStop() }}></ImageButton>
          <ImageButton src={this.props.dvdEjectSrc} alt="DVD EJECT" onClick={() => { this.props.dvdEject() }}></ImageButton>
          <div classname="dvdStatusLabel" style={{
            "font-family": "Arial",
            "font-weight": "bold",
            "font-size": "large",
            backgroundColor:
              this.props.dvdPower ? "lime" : "red"
          }}>
            DVD Status: {this.props.dvdPower ? 'DVD ON' : 'DVD OFF'} </div>
          <div style={{
            "font-family": "Arial",
            "font-weight": "bold",
            "font-size": "large",
            "padding-left": "10px",
            backgroundColor:
              this.props.dvdState === dvdStateStopped ? 'red' :
                (this.props.dvdState === dvdStatePlaying ? 'lime' :
                  'orange')
          }}> {
              this.props.dvdState === dvdStateStopped ? 'DVD STOPPED' :
                (this.props.dvdState === dvdStatePlaying ? 'DVD PLAYING' :
                  'DVD PAUSED')
            } </div>

        </div>
      </div>
    )
  }
}

class Screener extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resetted: 'true',
      tvPower: false,
      dvdPower: false,
      dvdEjected: false,
      imgSrc: require('./img/TVOffDvdOff.png'),
      tvPowerSrc: require('./img/LightRedPowerOff.png'),
      volumeUpSrc: require('./img/GreenUpGrey.png'),
      volumeDownSrc: require('./img/GreenDownGrey.png'),
      muteSrc: require('./img/RedVolumeGrey.png'),
      dvdPowerSrc: require('./img/DvdPowerOff.png'),
      dvdPlaySrc: require('./img/Play.png'),
      dvdPauseSrc: require('./img/Pause.png'),
      dvdStopSrc: require('./img/Stop.png'),
      dvdEjectSrc: require('./img/Eject.png'),
      // refreshFxn : this.refreshTvImage,
      triggerRefresh: false,
      volume: 50,
      volumeColor: "green",
      dvdState: dvdStateStopped,
      muted: false,
      PowerLevel: 0,
      ResidualPower: 0,
      LoadedFlag: false,
      TVSwitchCount: 0,
      UnmutedLevel: 100,
      ShortedFlag: false,
    }
  }

  handleResetButton() {
    this.ResetTest();
  }

  refreshTvImage() {
    var bTvOff = Boolean(!this.state.tvPower);
    var bDvdOff = Boolean(!this.state.dvdPower)
    if (!this.state.dvdEjected) {
      if (bTvOff && bDvdOff)
        this.setState({ imgSrc: require('./img/TVOffDvdOff.png') });
      else if (bTvOff && !bDvdOff)
        this.setState({ imgSrc: require('./img/TVOffDvdOn.png') });
      else if (!bTvOff && bDvdOff)
        this.setState({ imgSrc: require('./img/TVOnDvdOff.png') });
      else if (!bTvOff && !bDvdOff)
        this.setState({ imgSrc: require('./img/TVOnDvdOn.png') });
    }
    else if (this.state.dvdEjected) {
      if (bTvOff && bDvdOff)
        this.setState({ imgSrc: require('./img/TVOffDvdOffDiskEjected.png') });
      else if (bTvOff && !bDvdOff)
        this.setState({ imgSrc: require('./img/TVOffDvdOnDiskEjected.png') });
      else if (!bTvOff && bDvdOff)
        this.setState({ imgSrc: require('./img/TVOnDvdOffDiskEjected.png') });
      else if (!bTvOff && !bDvdOff)
        this.setState({ imgSrc: require('./img/TVOnDvdOnDiskEjected.png') });
    }

  }

  switchTvPower() {
    if (this.state.TVSwitchCount >= 4)
      return;

    if (!this.state.tvPower && !this.state.ShortedFlag) {
      var currentVolume = this.state.volume;
      var originalVolume = 50;
      var volumePower = this.state.PowerLevel;
      volumePower = (TV_VOLUME * currentVolume * 0.75) - (TV_VOLUME * originalVolume * 0.75);
      var newPower = this.state.PowerLevel;
      newPower = newPower + TV_ON - TV_OFF + volumePower;

      this.setState({ tvPower: true });
      this.setState({ PowerLevel: newPower });
      this.setState({
        ResidualPower: this.state.ResidualPower
          + TV_ON * 0.10
      });
      this.setState({ TVSwitchCount: this.state.TVSwitchCount + 1 });
      this.AdjustPowerLevel();
      this.setState({ triggerRefresh: true });
    }
    else if (this.state.tvPower && !this.state.ShortedFlag) {
      currentVolume = this.state.volume;
      originalVolume = 50;
      volumePower = this.state.PowerLevel;
      volumePower = (TV_VOLUME * currentVolume * 0.75) - (TV_VOLUME * originalVolume * 0.75);
      newPower = this.state.PowerLevel;
      newPower += TV_OFF - TV_ON - volumePower;

      this.setState({ tvPower: false });
      this.setState({ PowerLevel: newPower });
      this.setState({
        ResidualPower: this.state.ResidualPower
          + TV_ON * 0.10
      });

      if (this.state.muted) {
        this.setState({ muted: false });
        this.setState({ UnmutedLevel: this.state.CurrentVolume });
      }

      this.setState({ TVSwitchCount: this.state.TVSwitchCount + 1 });

      this.setState({ triggerRefresh: true });
      this.AdjustPowerLevel();
    }
  }

  switchDvdPower() {
    if (!this.state.dvdPower && !this.state.ShortedFlag) {
      this.setState({ dvdPower: true });
      this.setState({ PowerLevel: this.state.PowerLevel + DVD_ON - DVD_OFF });
      this.setState({
        ResidualPower: this.state.ResidualPower
          + DVD_ON * 0.10
      });
      this.setState({ triggerRefresh: true });
      this.AdjustPowerLevel();
    }
    else if (this.state.dvdPower && !this.state.ShortedFlag) {
      this.setState({ dvdPower: false });
      this.setState({ dvdState: dvdStateStopped });
      this.setState({ PowerLevel: this.state.PowerLevel + DVD_OFF - DVD_ON });
      this.setState({
        ResidualPower: this.state.ResidualPower
          + DVD_OFF * 0.10
      });
      this.setState({ triggerRefresh: true });
      this.AdjustPowerLevel();
    }
  }

  dvdStop() {
    if (this.state.dvdPower && !this.state.dvdEjected &&
      (this.state.dvdState === dvdStatePaused || this.state.dvdState === dvdStatePlaying)) {
      if (this.state.dvdState === dvdStatePaused)
        this.setState({ PowerLevel: this.state.PowerLevel - DVD_PAUSE });
      else if (this.state.dvdState === dvdStatePlaying)
        this.setState({ PowerLevel: this.state.PowerLevel - DVD_PLAY });

      this.setState({ dvdState: dvdStateStopped });
      this.AdjustPowerLevel();
      this.setState({ triggerRefresh: true });
    }
  }

  dvdPlay() {
    if (this.state.dvdPower && !this.state.dvdEjected && !this.state.LoadedFlag &&
      (this.state.dvdState === dvdStateStopped || this.state.dvdState === dvdStatePaused)) {
      if (this.state.dvdState === dvdStatePaused)
        this.setState({ PowerLevel: this.state.PowerLevel - DVD_PAUSE });

      this.setState({ dvdState: dvdStatePlaying });
      this.setState({ PowerLevel: this.state.PowerLevel + DVD_PLAY });

      this.setState({ ResidualPower: this.state.ResidualPower + DVD_PLAY * 0.10 });
      this.AdjustPowerLevel();
      this.setState({ triggerRefresh: true });
    }
  }

  dvdSetToPause() {
    this.setState({ dvdState: dvdStatePaused });
    this.setState({ PowerLevel: this.state.PowerLevel + DVD_PAUSE - DVD_PLAY });
    this.setState({ ResidualPower: this.state.ResidualPower + DVD_PAUSE * 0.10 });
    this.setState({ triggerRefresh: true });
  }

  dvdSetToPlay() {
    this.setState({ dvds: dvdStatePlaying });
    this.setState({ PowerLevel: this.state.PowerLevel + DVD_PLAY - DVD_PAUSE });
    this.setState({ ResidualPower: this.state.ResidualPower + DVD_PLAY * 0.10 });
    this.setState({ triggerRefresh: true });
  }

  dvdPause() {
    if (this.state.dvdPower && !this.state.dvdEjected) {
      if (this.state.dvdState === dvdStatePlaying) {
        this.dvdSetToPause();
      }
      else if (this.state.dvdState === dvdStatePaused) {
        this.dvdSetToPlay();
      }
      this.AdjustPowerLevel();
    }
  }

  dvdEject() {
    if (!this.state.dvdEjected && !(this.state.dvdState === dvdStatePaused)
      && !this.state.ShortedFlag) {
      this.setState({ dvdEjected: true });
      this.setState({ dvdState: dvdStateStopped });
      this.setState({ PowerLevel: this.state.PowerLevel + DVD_EJECT - DVD_LOAD });
      this.setState({ ResidualPower: this.state.ResidualPower + DVD_EJECT * 0.10 });
      this.setState({ triggerRefresh: true });
    }
    else if (this.state.dvdEjected && !this.state.ShortedFlag) {
      this.setState({ dvdEjected: false });
      this.setState({ dvdState: dvdStateStopped });
      this.setState({ PowerLevel: this.state.PowerLevel + DVD_LOAD - DVD_EJECT });
      this.setState({ ResidualPower: this.state.ResidualPower + DVD_LOAD * 0.10 });
      this.setState({ LoadedFlag: true });
      this.setState({ triggerRefresh: true });
    }
  }

  refreshButtons() {
    if (!Boolean(this.state.tvPower)) {
      this.setState({ tvPowerSrc: require('./img/LightRedPowerOff.png') });
      this.setState({ volumeUpSrc: require('./img/GreenUpGrey.png') });
      this.setState({ volumeDownSrc: require('./img/GreenDownGrey.png') });
      this.setState({ muteSrc: require('./img/RedVolumeGrey.png') });
      this.setState({ dvdStopSrc: require('./img/Stop.png') });
    }
    else {
      this.setState({ tvPowerSrc: require('./img/GreenPowerOn.png') });
      this.setState({ volumeUpSrc: require('./img/GreenUpKey.png') });
      this.setState({ volumeDownSrc: require('./img/GreenDownKey.png') });
      if (!this.state.muted)
        this.setState({ muteSrc: require('./img/RedVolume.png') });
      else
        this.setState({ muteSrc: require('./img/DarkVolumeRedX.png') });
    }

    if (this.state.dvdEjected)
      this.setState({ dvdEjectSrc: require('./img/EjectActive.png') });
    else
      this.setState({ dvdEjectSrc: require('./img/Eject.png') });

    if (!this.state.dvdPower) {
      this.setState({ dvdPowerSrc: require('./img/DvdPowerOff.png') });
      this.setState({ dvdPlaySrc: require('./img/Play.png') });
      this.setState({ dvdPauseSrc: require('./img/Pause.png') });
    } else {
      this.setState({ dvdPowerSrc: require('./img/DvdPowerOn.png') });
      if (this.state.dvdState === dvdStatePlaying)
        this.setState({ dvdPlaySrc: require('./img/PlayActive.png') });
      else
        this.setState({ dvdPlaySrc: require('./img/Play.png') });

      if (this.state.dvdState === dvdStatePaused)
        this.setState({ dvdPauseSrc: require('./img/PauseActive.png') });
      else
        this.setState({ dvdPauseSrc: require('./img/Pause.png') });

      if (this.state.dvdState === dvdStateStopped)
        this.setState({ dvdStopSrc: require('./img/StopActive.png') });
      else
        this.setState({ dvdStopSrc: require('./img/Stop.png') });

    }

  }

  volumeDown() {
    if (this.state.tvPower &&
      !this.state.muted && this.state.volume > 0) {
      var newPower = this.state.PowerLevel;
      newPower -= TV_VOLUME * this.state.volume * 0.75;
      this.setState({
        PowerLevel: newPower
      });
      var newVolume = this.state.volume - 10;

      this.setState({ volume: newVolume });
      newPower += TV_VOLUME * newVolume * 0.75;

      this.setState({ PowerLevel: newPower });

      this.setState({
        ResidualPower: this.state.ResidualPower +
          TV_VOLUME * newVolume * 0.05
      });
      this.setState({ triggerRefresh: true });
      this.AdjustPowerLevel();
    }
  }

  volumeUp() {
    if (this.state.tvPower && !this.state.muted
      && this.state.volume < 100 && this.state.volume < this.state.UnmutedLevel) {
      var newPower = this.state.PowerLevel;
      var newVolume = this.state.volume;
      newPower -= TV_VOLUME * newVolume * 0.75;

      this.setState({ PowerLevel: newPower });

      newVolume += 10;
      this.setState({ volume: newVolume });
      newPower += TV_VOLUME * newVolume * 0.75;

      this.setState({ PowerLevel: newPower });

      this.setState({ ResidualPower: this.state.ResidualPower + TV_VOLUME * newVolume * 0.05 });
      this.AdjustPowerLevel();
      this.setState({ triggerRefresh: true });
    }
  }

  mute() {
    if (!this.state.tvPower)
      return;

    if (this.state.muted) {
      this.setState({ muted: false });
      this.setState({ UnmutedLevel: this.state.volume });
      this.setState({ triggerRefresh: true });
    }
    else if (!this.state.muted) {
      this.setState({ muted: true });
      this.setState({ triggerRefresh: true });
    }
  }

  ResetVisuals() {
    this.setState({ dvdState: dvdStateStopped });
    this.setState({ dvdPower: false });
    this.setState({ tvPower: false });
    this.setState({ triggerRefresh: true });
  }

  AdjustPowerLevel() {
    var power = this.state.PowerLevel;

    if (this.state.PowerLevel > 200 || this.state.ResidualPower > 100) {
      this.setState({ ShortedFlag: true });

      this.ResetVisuals();
    }
  }



  ResetTest() {
    this.setState({ PowerLevel: 0 });
    this.setState({ ResidualPower: 0 });
    this.setState({ LoadedFlag: false });
    this.setState({ TVSwitchCount: 0 });
    this.setState({ ShortedFlag: false });
    this.setState({ tvPower: false });
    this.setState({ dvdPower: false });

    this.setState({ volume: 50 });
    this.setState({ UnmutedLevel: 100 });
    this.setState({ muted: false });
    this.setState({ dvdEjected: false });

    this.AdjustPowerLevel();
    this.setState({ triggerRefresh: true });
  }

  render() {
    if (this.state.triggerRefresh) {
      this.refreshButtons();
      this.refreshTvImage();
      this.setState({ triggerRefresh: false });
    }
    return (
      <div>
        <ResetTestButton onClick={() => this.handleResetButton()}></ResetTestButton>
        <p className='newline'></p>
        <div className="centerMeWithoutWrap">
          <TvImage id="tvi" alt="TV OFF" src={this.state.imgSrc} />
        </div>
        <p className='newline'></p>
        <div className="centerMeWithoutWrap">
          <div classname="buttonPanel">
            <TvControls
              tvPowerSrc={this.state.tvPowerSrc}
              volumeUpSrc={this.state.volumeUpSrc}
              volumeDownSrc={this.state.volumeDownSrc}
              muteSrc={this.state.muteSrc}
              refreshFxn={() => this.state.refreshFxn()}
              switchTvPower={() => this.switchTvPower()}
              volumeUp={() => this.volumeUp()}
              volumeDown={() => this.volumeDown()}
              mute={() => this.mute()}
              volume={this.state.volume}
              volumeColor={this.state.volumeColor}
              muted={this.state.muted}
              tvPower={this.state.tvPower}
              PowerLevel={this.state.PowerLevel}
              ResidualPower={this.state.ResidualPower}
            ></TvControls>
          </div>
        </div>
        <p className='newline'></p>
        <div className="centerMeWithoutWrap">
          <div classname="buttonPanel">
            <DvdControls
              dvdPowerSrc={this.state.dvdPowerSrc}
              dvdPlaySrc={this.state.dvdPlaySrc}
              dvdPauseSrc={this.state.dvdPauseSrc}
              dvdStopSrc={this.state.dvdStopSrc}
              dvdEjectSrc={this.state.dvdEjectSrc}
              refreshFxn={() => this.state.refreshFxn()}
              switchDvdPower={() => this.switchDvdPower()}
              dvdStop={() => this.dvdStop()}
              dvdPlay={() => this.dvdPlay()}
              dvdPause={() => this.dvdPause()}
              dvdEject={() => this.dvdEject()}
              dvdPower={this.state.dvdPower}
              dvdState={this.state.dvdState}
              PowerLevel={this.state.PowerLevel}
              ResidualPower={this.state.ResidualPower}
            ></DvdControls>
          </div>
        </div>
      </div>

    );
  }
}
// ========================================

ReactDOM.render(
  <Screener />,
  document.getElementById('root')
);
