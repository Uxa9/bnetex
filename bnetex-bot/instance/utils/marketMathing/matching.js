const matchingTable = [
  {
    back: "123",
    prev: 1,
    zone: 0,
    depositPercent: 20,
    index: 1
  },
  {
    back: "023",
    prev: 0,
    zone: 1,
    depositPercent: 20,
    index: 1
  },

  {
    back: "013",
    prev: 1,
    zone: 2,
    depositPercent: 20,
    index: 2
  },
  {
    back: "023",
    prev: 2,
    zone: 1,
    depositPercent: 20,
    index: 2
  },

  {
    back: "013",
    prev: 3,
    zone: 2,
    depositPercent: 20,
    index: 3
  },
  {
    back: "012",
    prev: 2,
    zone: 3,
    depositPercent: 20,
    index: 3
  },

  {
    back: "123",
    prev: 3,
    zone: 4,
    depositPercent: 16,
    index: 4
  },
  {
    back: "124",
    prev: 4,
    zone: 3,
    depositPercent: 16,
    index: 4
  },

  {
    back: "234",
    prev: 4,
    zone: 5,
    depositPercent: 10,
    index: 5
  },
  {
    back: "235",
    prev: 5,
    zone: 4,
    depositPercent: 10,
    index: 5
  },

  {
    back: "245",
    prev: 4,
    zone: 3,
    depositPercent: 2,
    index: 6
  },
  {
    back: "235",
    prev: 3,
    zone: 4,
    depositPercent: 2,
    index: 6
  },

  {
    back: "345",
    prev: 3,
    zone: 2,
    depositPercent: 2,
    index: 7
  },
  {
    back: "245",
    prev: 2,
    zone: 3,
    depositPercent: 2,
    index: 7
  },

  {
    back: "234",
    prev: 2,
    zone: 1,
    depositPercent: 1,
    index: 8
  },
  {
    back: "134",
    prev: 1,
    zone: 2,
    depositPercent: 1,
    index: 8
  },

  {
    back: "124",
    prev: 2,
    zone: 3,
    depositPercent: 1,
    index: 9
  },
  {
    back: "134",
    prev: 3,
    zone: 2,
    depositPercent: 1,
    index: 9
  },
];

module.exports = (situation) => {


  let formatted = {
    back: situation.backPattern.join(""),
    prev: situation.prevZone,
    zone: situation.zone,
  };

  //console.log(formatted)

  

  let result = null;

  for (let index = 0; index < matchingTable.length; index++) {
    const element = matchingTable[index];

    if(
        element.back == formatted.back &&
        element.prev == formatted.prev &&
        element.zone == formatted.zone
    ){
        result = {
            index: element.index,
            depositPercent: element.depositPercent
        }
    }

  }

  

  return result;
};
