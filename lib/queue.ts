export interface QueueItem<T> {
    (): Promise<T>
}

export default class Queue<T> {
    /**
     * Determine whether the queue is still on process or not.
     */
    protected isProcessing: boolean;

    /**
     * The items of queue.
     * 
     * @type {Array<QueueItem<T>>}
     */
    protected items: Array<QueueItem<T>>;

    /**
     * Create a new queue instance.
     */
    constructor() {
        this.isProcessing = false;
        this.items = [];
    }

    /**
     * Add an element to the end of the queue.
     * 
     * @param {QueueItem<T>} element
     * @return {void} 
     */
    enqueue(element: QueueItem<T>): void {
        this.items.push(element);
    }

    /**
     * Remove an element from the front of the queue .
     * 
     * @returns {QueueItem<T>}
     */
    dequeue(): QueueItem<T> {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    /**
     * Check if the queue is empty.
     * 
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    /**
     * Get the front element of the queue.
     * 
     * @returns {QueueItem<T>}
     */
    peek(): QueueItem<T> {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    /**
     * Get the length of items inside queue.
     * 
     * @returns {number}
     */
    get length(): number {
        return this.items.length;
    }

    /**
     * Clean up queue.
     * 
     * @returns {void}
     */
    cleanup(): void {
        this.items = [];
    }

    /**
     * Start processing the queue.
     * 
     * @returns {void}
     */
    process(): void {
        setInterval(async () => {
            if (!this.isEmpty() && !this.isProcessing) {
                const job = this.dequeue();

                this.isProcessing = true;

                await job();

                this.isProcessing = false;
            }
        }, 10000);
    }
}