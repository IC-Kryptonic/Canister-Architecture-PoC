import { Actor, HttpAgent, Principal} from '@dfinity/agent';
import { idlFactory as video_idl, canisterId as backendVideoId } from 'dfx-generated/rust_video';

const agent = new HttpAgent();
const videoBackend = Actor.createActor(video_idl, { agent, canisterId: backendVideoId });

import * as React from 'react';
import { render } from 'react-dom';

const MAX_CHUNK_SIZE = 1024 * 500; // 500kb

class TestVideoInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: 'search',
      message: '',
      feed: null,
      upload_name: 'Upload Name',
      file: null,
      video: '',
    };
  }

  async componentDidMount() {
    let res = await videoBackend
          .getDefaultFeed(10);
    let feed = res.map((video) =>
      <li>{video.name}</li>
    );
    this.setState({ feed: feed});
  }

  async getVideoChunks(videoInfo) {
    const { video_id, chunk_count } = videoInfo;
    const chunkBuffers = [];
    const chunksAsPromises = [];
    for (let i = 0; i <= Number(chunk_count.toString()); i++) {
      chunksAsPromises.push(videoBackend.getChunk(i, video_id));
    }
    const nestedBytes = (await Promise.all(chunksAsPromises))
      .map( (val) => {
          if(val[0] === undefined) {
              return null;
          } else {
              return val[0];
          }
      })
      .filter((v) => v !== null);
    nestedBytes.forEach((bytes) => {
      const bytesAsBuffer = Buffer.from(new Uint8Array(bytes));
      chunkBuffers.push(bytesAsBuffer);
    });
    const videoBlob = new Blob([Buffer.concat(chunkBuffers)], {
      type: "video/mp4",
    });
    const vidURL = URL.createObjectURL(videoBlob);
    return vidURL;
  }

  async doSearch() {
    const videoInfo = (await videoBackend.searchVideo(this.state.search))[0];
    this.setState({ ...this.state, message: videoInfo.name + ": " +  videoInfo.description});

    const video_file = await this.getVideoChunks(videoInfo);

    let video_tag = <video controls width="320" height="240" src={video_file} type="video/mp4"/>;
  
    this.setState({ ...this.state, video: video_tag});
  }


  async processAndUploadChunk(
    videoBuffer,
    byteStart,
    videoSize,
    videoId,
    chunk
  ) {
    const videoSlice = videoBuffer.slice(
      byteStart,
      Math.min(videoSize, byteStart + MAX_CHUNK_SIZE)
    );
    const data = Array.from(new Uint8Array(videoSlice));
    return videoBackend.putChunk(data, chunk, videoId);
  }

  async doUpload() {
    const chunkCount = Number(Math.ceil(this.state.file.size / MAX_CHUNK_SIZE));
    
    const id = await videoBackend.createVideo({
          "name": this.state.upload_name,
          "owner":  Principal.anonymous(),
          "description": '',
          "video_id": '',
          "chunk_count": chunkCount,
          "keywords": [],
    });

    const videoBuffer = (await this.state.file?.arrayBuffer()) || new ArrayBuffer(0);
    const putChunkPromises = [];

    let chunk = 0;
    for (
      let byteStart = 0;
      byteStart < this.state.file.size;
      byteStart += MAX_CHUNK_SIZE, chunk++
    ){
      putChunkPromises.push(
         this.processAndUploadChunk(videoBuffer, byteStart, this.state.file.size, id, chunk)
      );
    }

    await Promise.all(putChunkPromises);
    this.componentDidMount();
  }


  onSearchChange(ev) {
    this.setState({ ...this.state, search: ev.target.value });
  }

  onNameChange(ev) {
    this.setState({ ...this.state, upload_name: ev.target.value });
  }

  onFileChange(ev) {
    this.setState({ ...this.state, file: ev.target.files[0] });
  }

  render() {
    return (
      <div style={{ "font-size": "30px" }}>
        <ul>{this.state.feed}</ul>
        <div style={{ "margin": "30px" }}>
          <input id="search" value={this.state.search} onChange={ev => this.onSearchChange(ev)}></input>
          <button onClick={() => this.doSearch()}>Get Video Info!</button>
        </div>
        <div>
          {this.state.message}
          {this.state.video}
        </div>
        <div>
          <input id="upload_name" value={this.state.upload_name} onChange={ev => this.onNameChange(ev)}></input>
          <input id="video-upload" type="file" accept=".mp4" onChange={ev => this.onFileChange(ev)}/>
          <button onClick={() => this.doUpload()}>Upload</button>
        </div>
      </div>
    );
  }
}

render(<TestVideoInfo />, document.getElementById('app'));
