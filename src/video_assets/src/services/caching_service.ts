const VIDEO_LIMIT = 20;

const videoCache: {
    [videoPrincipalString: string]: {
        url: string,
        date: number
    }
} = {};

const getVideoFromCache = (videoPrincipalString: string): string => {
    let cacheEntry = videoCache[videoPrincipalString];
    // if entry does not exist
    if (!cacheEntry) {
        return null;
    }
    return cacheEntry.url;
}

const putVideoInCache = (videoPrincipalString: string, url: string) => {
    videoCache[videoPrincipalString] = {
        url: url,
        date: Date.now()
    }

    // Remove oldest video if cache cap is reached
    if (Object.keys(videoCache).length > VIDEO_LIMIT) {
        let principalIdToRemove = null;
        let oldestTimestamp = Date.now();
        for (const [key, value] of Object.entries(videoCache)) {
            if (value.date < oldestTimestamp) {
                principalIdToRemove = key;
                oldestTimestamp = value.date;
            }
        }
        delete videoCache[principalIdToRemove];
    }
}

export {
    getVideoFromCache,
    putVideoInCache
}
