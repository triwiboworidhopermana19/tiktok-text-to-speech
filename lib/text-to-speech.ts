import { DirResult, dirSync, tmpNameSync } from 'tmp'
import emojiStrip from 'emoji-strip'
import AudioLocale from './audio-locale'
import axios from 'axios'
import { createWriteStream, unlinkSync } from 'node:fs'
import sound from 'sound-play'

export default class TextToSpeech {
    /**
     * Temporary object directory.
     */
    protected readonly tmpobj: DirResult;

    /**
     * The url for creating audio text.
     */
    protected url: string;

    /**
     * Enable debug for comment. By default it's enable.
     * 
     * @type {boolean}
     */
    protected isDebugEnabled: boolean;

    /**
     * Create text to speech instance.
     */
    constructor() {
        this.tmpobj = dirSync();
        this.url = "https://translate.google.com/translate_tts";
        this.isDebugEnabled = true;
    }

    /**
    * Create audio based on given text.
    * 
    * @param {string} username
    * @param {string} comment 
    * @param {AudioLocale|null} locale 
    * @returns {Promise<string|null>}
    */
    async createAudioFromText(username: string, comment: string, locale: AudioLocale | null = null): Promise<string | null> {
        const cleanupText = emojiStrip(comment);

        if (cleanupText.length === 0) {
            return null;
        }

        let text: string;

        if (locale === AudioLocale.ID) {
            text = `${username} mengatakan ${cleanupText}`;
        } else {
            text = `${username} say ${cleanupText}`;
        }

        if (this.isDebugEnabled) {
            console.log(text);
        }

        const queryParams = new URLSearchParams({
            ie: 'UTF-8',
            total: '1',
            idx: '0',
            client: 'tw-ob',
            q: text,
            tl: locale ? locale : AudioLocale.EN
        })

        const response = await axios({
            responseType: 'stream',
            method: 'GET',
            url: `${this.url}?${queryParams}`
        })

        const audioPath = tmpNameSync({
            dir: this.tmpobj.name,
            postfix: '.mp3'
        });

        response.data.pipe(createWriteStream(audioPath));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve(audioPath);
            });
            response.data.on('error', (err: any) => {
                reject(err);
            });
        })
    }

    /**
     * Play the audio from given path.
     * 
     * @param {string} path 
     * @returns {Promise<void>}
     */
    async play(path: string): Promise<void> {
        if (!path || path.length === 0) {
            return
        }
        
        await sound.play(path);

        unlinkSync(path);
    }

    /**
     * Disable debug.
     * 
     * @returns {void}
     */
    disableDebug(): void {
        this.isDebugEnabled = false;
    }

    /**
     * Clean up text to speech process.
     * 
     * @returns {void}
     */
    cleanup(): void {
        this.tmpobj.removeCallback();
    }
}