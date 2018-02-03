import React from 'react';

function FormatTime(props) {
  return <h1 className="text-center">{props.time.toLocaleTimeString()}</h1>;
}

class CurentTime extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  tick() {
    this.setState({
      time: new Date()
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render () {
    return (
      <FormatTime time={this.state.time} />
    );
  }
}

export default CurentTime;
