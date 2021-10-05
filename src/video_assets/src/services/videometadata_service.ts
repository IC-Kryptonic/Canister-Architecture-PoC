interface VideoOwner {
    name: string,
    shares: number
}

const VideoLikes: {[videoId: string]: number} = {};

function getVideoLikes(videoId: string): number {
    if(VideoLikes[videoId]) {
        return VideoLikes[videoId];
    } else {
        VideoLikes[videoId] = Math.floor(10 + Math.random() * 100);
        return VideoLikes[videoId];
    }
}

const VideoViews: {[videoId: string]: number} = {};

function getVideoViews(videoId: string): number {
    if(VideoViews[videoId]) {
        return VideoViews[videoId];
    } else {
        VideoViews[videoId] = Math.floor(100 + Math.random() * 1000);
        return VideoViews[videoId];
    }
}

// Currently only a mockup
function getVideoOwners(): VideoOwner[] {
    return [
        {
            name: "Proud owner 1", 
            shares: 20
        },
        {
            name: "Proud owner 2", 
            shares: 10
        },
        {
            name: "Proud owner 3", 
            shares: 5
        },
        {
            name: "Proud owner 4", 
            shares: 1
        },
    ]
}

interface VideoBidder {
    name: string,
    bid: number
}

// Currently only a mock-up
function getVideoBidders(): VideoBidder[] {
    return [
        {
            name: "Eager buyer 1", 
            bid: 15.55
        },
        {
            name: "Eager buyer 2", 
            bid: 13.33
        },
        {
            name: "Eager buyer 3", 
            bid: 10.11
        },
        {
            name: "Eager buyer 4", 
            bid: 5.23
        },
    ]
}

export {
    getVideoLikes,
    getVideoViews,
    VideoOwner,
    getVideoOwners,
    VideoBidder,
    getVideoBidders
}