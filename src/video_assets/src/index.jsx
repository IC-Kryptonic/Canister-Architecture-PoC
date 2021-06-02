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

  async doSearch() {
    const video = await video_backend.get_video_info(this.state.id);
    this.setState({ ...this.state, message: video.name + ": " +  video.description});
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
        <div>Video name is: "<span>{this.state.message}</span>"</div>
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
