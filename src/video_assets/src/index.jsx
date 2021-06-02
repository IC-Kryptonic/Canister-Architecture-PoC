import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as video_idl, canisterId as video_id } from 'dfx-generated/rust_video';

const agent = new HttpAgent();
const video_backend = Actor.createActor(video_idl, { agent, canisterId: video_id });

import * as React from 'react';
import { render } from 'react-dom';

class TestVideoInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'Name',
      message: '',
    };
  }

  async doSearch() {
    const video = await video_backend.get_video_info(this.state.id);
    this.setState({ ...this.state, message: video.name + ": " +  video.description});
  }

  onIdChange(ev) {
    this.setState({ ...this.state, id: ev.target.value });
  }

  render() {
    return (
      <div style={{ "font-size": "30px" }}>
        <div style={{ "margin": "30px" }}>
          <input id="video_id" value={this.state.id} onChange={ev => this.onIdChange(ev)}></input>
          <button onClick={() => this.doSearch()}>Get Video Info!</button>
        </div>
        <div>Greeting is: "<span>{this.state.message}</span>"</div>
      </div>
    );
  }
}

render(<TestVideoInfo />, document.getElementById('app'));
