class IDManager {
    constructor() {
        this.currentID = 0;
    }

    getNewID() {
        this.currentID++;
        return this.currentID;
    }
}

// Export an instance of the class
const instance = new IDManager();
module.exports = instance;