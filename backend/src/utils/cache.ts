import NodeCache from 'node-cache';

const cache = new NodeCache({
    stdTTL: 300, // default TTL (in seconds), 5 minutes
    checkperiod: 600, // check for expired keys every 10 minutes
});

export default cache;
