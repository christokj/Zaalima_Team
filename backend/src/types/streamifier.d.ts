declare module 'streamifier' {
    import { Readable } from 'stream';

    function createReadStream(obj: Buffer | string): Readable;

    export { createReadStream };
}
