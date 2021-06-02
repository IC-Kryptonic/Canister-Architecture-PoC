import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as video_idl, canisterId as video_id } from 'dfx-generated/rust_video';

const agent = new HttpAgent();
const video_backend = Actor.createActor(video_idl, { agent, canisterId: video_id });

import * as React from 'react';
import { render } from 'react-dom';

const MAX_CHUNK_SIZE = 1024 * 500; // 500kb

class TestVideoInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'Video Id',
      message: '',
      feed: null,
      upload_name: 'Upload Name',
      file: null,
      video: '',
    };
  }

  async componentDidMount() {
    let res = await video_backend
          .get_default_feed(10);
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
      chunksAsPromises.push(video_backend.get_chunk(i, video_id));
    }
    const nestedBytes = (await Promise.all(chunksAsPromises))
      .map( (val) => {
          if(val === undefined) {
              return null;
          } else {
              return val;
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
    const videoInfo = await video_backend.get_video_info(this.state.id);
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
    return video_backend.put_chunk(data, chunk, videoId);
  }

  async doUpload() {
    const chunkCount = Number(Math.ceil(this.state.file.size / MAX_CHUNK_SIZE));
    
    const id = await video_backend.create_video({
          "name": this.state.upload_name,
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


  onIdChange(ev) {
    this.setState({ ...this.state, id: ev.target.value });
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
          <input id="video_id" value={this.state.id} onChange={ev => this.onIdChange(ev)}></input>
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
