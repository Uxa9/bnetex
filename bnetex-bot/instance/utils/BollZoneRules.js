const list =  [
        {
            index: 10,
            intervals: 60,
            sigma: 2
        },
        {
            index: 11,
            intervals: 60,
            sigma: 3
        },        
        {
            index: 20,
            intervals: 240,
            sigma: 2
        },
        {
            index: 21,
            intervals: 240,
            sigma: 3
        },
        {
            index: 30,
            intervals: 1440,
            sigma: 2
        },
        {
            index: 31,
            intervals: 1440,
            sigma: 3
        },
        {
            index: 40,
            intervals: 7200,
            sigma: 2
        },
        {
            index: 41,
            intervals: 7200,
            sigma: 3
        },
        {
            index: 50,
            intervals: 10080,
            sigma: 2
        },
        {
            index: 51,
            intervals: 10080,
            sigma: 3
        },
        {
            index: 60,
            intervals: 43200,
            sigma: 2
        },
        {
            index: 61,
            intervals: 43200,
            sigma: 3
        },
        {
            index: 70,
            intervals: 129600,
            sigma: 2
        },
        {
            index: 71,
            intervals: 129600,
            sigma: 3
        },
        {
            index: 80,
            intervals: 259200,
            sigma: 2
        },
        {
            index: 81,
            intervals: 259200,
            sigma: 3
        }
    ]


    const getMaxIntervals = () => {
        return list.sort((a,b) => b.intervals - a.intervals)[0].intervals
    }

    // Список номеров правил
    const getBBRulesIndexes = () => {
        return list.map(i => i.index);
    }

    const getRulesMoreIntervals = (more) => {
        return list.filter(i => i.intervals > more)
    }

    const getBBRuleByIddex = (index) => {
        return list.filter(i => i.index == index)[0]
    }

    module.exports.getBBRulesIndexes = getBBRulesIndexes;
    module.exports.getMaxIntervals = getMaxIntervals;
    module.exports.getBBRuleByIddex = getBBRuleByIddex;
    module.exports.getRulesMoreIntervals = getRulesMoreIntervals;