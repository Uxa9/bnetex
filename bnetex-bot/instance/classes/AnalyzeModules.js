module.exports = class AnalyzeModule {

    constructor(pair){

        // Set trading pair
        this.pair = pair;

        // Actual Market Data
        this.marketData = undefined;

    }

    /**
     * Initial Global Market Analyze Function
     */
    async analyze(){

        return {
            deposit: 2000,
            pattern: 221
        };
    }

    /**
     * Function updates actual market data by lastKline
     * @param {*} lastKline 
     */
    updateMarketData(lastKline){

        this.marketData = lastKline;

        return this;
    }
}   