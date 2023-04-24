var localStore = {};



module.exports = {
    setStoreValue: (key, value) => localStore[key] = value,
    getStoreValue: (key) => localStore[key]
}