import _l from '../../locales/index';

const AdvancedTerminal = props => {

    const data = [
        [1409, 1081],
        [1482, 1105],
        [792, 792],
        [213, 1470],
        [1145, 1308],
        [454, 70],
        [1323, 308],
        [858, 1467],
        [981, 495],
        [1062, 248],
        [320, 9],
        [481, 653],
        [551, 1062],
        [1235, 657],
        [873, 736],
        [641, 1329],
        [458, 304],
        [242, 160],
        [1282, 816],
        [873, 330],
        [643, 1359],
        [904, 1078],
        [363, 1046],
        [1138, 956],
        [1133, 1113],
        [635, 284],
        [629, 780],
        [1068, 238],
        [736, 918],
        [704, 873],
        [937, 1304],
        [172, 1213],
        [559, 79],
        [1207, 1086],
        [1474, 21],
        [499, 501],
        [363, 1290],
        [278, 956],
        [868, 1321],
        [1115, 563],
        [325, 1025],
        [1123, 179],
        [710, 1165],
        [119, 143],
        [152, 837],
        [917, 1445],
        [1418, 39],
        [703, 875],
        [1204, 1054],
        [730, 4]
    ];

    const data2 = [
        [165,	21590],
        [26,	21588],
        [30,	21586],
        [127,	21584],
        [97,	21582],
        [56,	21580],
        [146,	21578],
        [193,	21576],
        [34,	21574],
        [134,	21572],
        [22,	21570],
        [2,	    21568],
        [83,	21566],
        [143,	21564],
        [90,	21562],
        [14,	21560],
        [163,	21558],
        [69,	21556],
        [99,	21554],
        [145,	21552],
        [147,	21550],
        [156,	21548],
        [31,	21546],
        [10,	21544],
        [175,	21542],
        [186,	21540],
        [102,	21538],
        [22,	21536],
        [122,	21534],
        [75,	21532],
        [69,	21530],
        [65,	21528],
        [163,	21526],
        [54,	21524],
        [117,	21522],
        [102,	21520],
        [76,	21518],
        [59,	21516],
        [83,	21514],
        [53,	21512],
        [140,	21510],
        [52,	21508],
        [164,	21506],
        [148,	21504],
        [102,	21502],
        [75,	21500],
        [17,	21498],
        [24,	21496],
        [49,	21494],
        [16,	21492]
    ]

    const sellBuyParser = () => {
        return (
            data.map((pair, index) => {
                let style = {};

                if (index == 24) {
                    return (
                        <div
                            className="pair-row"
                            style={{
                                background : `linear-gradient(to right, #FF9393 0%, #FF9393
                                50%, #FFFFFF 
                                50%, #FFFFFF 100%)`
                            }}
                        >
                            <span
                                style={{
                                    color : 'white'
                                }}
                            >
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    )
                }

                if (index == 25) {
                    return (
                        <div
                            className="pair-row"
                            style={{
                                background : `linear-gradient(to right, #FF9393 0%, #FF9393
                                50%, #87D38580 
                                50%, #87D38580 100%)`
                            }}
                        >
                            <span
                                style={{
                                    color : 'white'
                                }}
                            >
                                {pair[0]}
                            </span>
                            <span
                                style={{
                                    color : 'white'
                                }}
                            >
                                {pair[1]}
                            </span>
                        </div>
                    )
                }

                if (index == 26) {
                    return (
                        <div
                            className="pair-row"
                            style={{
                                background : `linear-gradient(to left, #87D38580 0%, #87D38580
                                50%, #FFFFFF 
                                50%, #FFFFFF 100%)`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span
                                style={{
                                    color : 'white'
                                }}
                            >
                                {pair[1]}
                            </span>
                        </div>
                    )
                }
                
                if ( pair[0] > pair[1] ) {
                    const difference = pair[0] / (pair[0] + pair[1]) * 100;
                    
                    style={
                        background : `linear-gradient(to right, #FF9393 0%, #FF9393
                        ${difference}%, #FFFFFF 
                        ${difference}%, #FFFFFF 100%)`
                    }
                } 
                if ( pair[0] < pair[1] ) {
                    const difference = pair[1] / (pair[0] + pair[1]) * 100;
                    
                    style={
                        background : `linear-gradient(to left, #87D38580 0%, #87D38580
                        ${difference}%, #FFFFFF 
                        ${difference}%, #FFFFFF 100%)`
                    }
                }

                return (
                    <div
                        className="pair-row"
                        style={ style }
                    >
                        <span>
                            {pair[0]}
                        </span>
                        <span>
                            {pair[1]}
                        </span>
                    </div>
                )
            })
        )
    }

    const amountsParser = () => {

        const colorParser = data => {
            const amountsArr = data.map(pair => pair[0]);
            const amount = Math.max(...amountsArr) - Math.min(...amountsArr);

            return data.map(pair => {
                const percent = pair[0] / amount * 100;

                if ( percent <= 30 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : `linear-gradient(to right, #F8FAAC 0%, #F8FAAC
                                    ${percent}%, #FFFFFF00 
                                    ${percent}%, #FFFFFF00 100%)`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }
                
                if ( percent <= 50 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : `linear-gradient(to right, #FFBA88 0%, #FFBA88
                                    ${percent}%, #FFFFFF00 
                                    ${percent}%, #FFFFFF00 100%)`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }

                return (
                    <div
                        className='amount-pair'
                        style={{
                            background : `linear-gradient(to right, #B5CFF5 0%, #B5CFF5
                                ${percent}%, #FFFFFF00 
                                ${percent}%, #FFFFFF00 100%)`
                        }}
                    >
                        <span>
                            {pair[0]}
                        </span>
                        <span>
                            {pair[1]}
                        </span>
                    </div>
                );
            });
        }

        const colorParserv2 = (data, type) => {
            const amountsArr = data.map(pair => pair[0]);
            const amount = Math.max(...amountsArr) - Math.min(...amountsArr);

            return data.map(pair => {
                const percent = pair[0] / amount * 100;

                if ( percent <= 30 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : type == 'red' ? `#FFBEBE` : `#C3F4C1`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }
                
                if ( percent <= 50 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : type == 'red' ? `#FFB4B4` : `#A4F2A1`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }
                
                if ( percent <= 90 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : type == 'red' ? `#FFA9A9` : `#92E98F`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }

                return (
                    <div
                        className='amount-pair'
                        style={{
                            background : type == 'red' ? `#FF6B6B` : `#21C11B`
                        }}
                    >
                        <span>
                            {pair[0]}
                        </span>
                        <span>
                            {pair[1]}
                        </span>
                    </div>
                );
            });
        }

        const colorParserv3 = (data, type) => {
            const amountsArr = data.map(pair => pair[0]);
            const amount = Math.max(...amountsArr) - Math.min(...amountsArr);

            return data.map(pair => {
                const percent = pair[0] / amount * 100;

                if ( percent <= 30 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : type == 'red' ? 
                                    `linear-gradient(to right, #FFBEBE 0%, #FFBEBE
                                        ${percent}%, #FFFFFF00 
                                        ${percent}%, #FFFFFF00 100%)` : 
                                    `linear-gradient(to right, #C3F4C1 0%, #C3F4C1
                                        ${percent}%, #FFFFFF00 
                                        ${percent}%, #FFFFFF00 100%)`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }
                
                if ( percent <= 50 ) {
                    return (
                        <div
                            className='amount-pair'
                            style={{
                                background : type == 'red' ? 
                                    `linear-gradient(to right, #FFB4B4 0%, #FFB4B4
                                        ${percent}%, #FFFFFF00 
                                        ${percent}%, #FFFFFF00 100%)` : 
                                    `linear-gradient(to right, #A4F2A1 0%, #A4F2A1
                                        ${percent}%, #FFFFFF00 
                                        ${percent}%, #FFFFFF00 100%)`
                            }}
                        >
                            <span>
                                {pair[0]}
                            </span>
                            <span>
                                {pair[1]}
                            </span>
                        </div>
                    );
                }

                return (
                    <div
                        className='amount-pair'
                        style={{
                            background : type == 'red' ? 
                                `linear-gradient(to right, #FFA9A9 0%, #FFA9A9
                                    ${percent}%, #FFFFFF00 
                                    ${percent}%, #FFFFFF00 100%)` : 
                                `linear-gradient(to right, #92E98F 0%, #92E98F
                                    ${percent}%, #FFFFFF00 
                                    ${percent}%, #FFFFFF00 100%)`
                        }}
                    >
                        <span>
                            {pair[0]}
                        </span>
                        <span>
                            {pair[1]}
                        </span>
                    </div>
                );
            });
        }

        return (
            <div
                className="amount-pairs"
            >
                <div
                    className="sells-rows"
                    // style={{
                    //     background : "transparent"
                    // }}
                >
                    {colorParser(data2.slice(0, 25), 'red')}
                </div>
                <div
                    className="buys-rows"
                    // style={{
                    //     background : "transparent"
                    // }}
                >
                    {colorParser(data2.slice(25, 50), 'green')}
                </div>
            </div>
        )
    }

    return (
        <div
            className="block advanced-terminal"
        >   
            <div
                className="sell-buy-history"
            >
                <div
                    className="advanced-terminal-header"
                > 
                    <span>
                        {_l.sells}                        
                    </span>
                    <span>
                        {_l.buys}
                    </span>
                </div>
                <div
                    className="traiding-pairs"
                >
                    {sellBuyParser()}
                </div>
                <div
                    className="traiding-pairs-total"
                >
                    <span>
                        14200.12
                    </span>
                    <span
                        className="negative"
                    >
                        -228.14
                    </span>
                    <span>
                        22:28
                    </span>
                </div>
            </div>
            <div
                className="amounts"
            >
                <div
                    className="advanced-terminal-header"
                > 
                    <span>
                        {`${_l.value} (USDT)`}                        
                    </span>
                    <span>
                        {`${_l.price} (USDT)`}
                    </span>
                </div>
                {amountsParser()}
            </div>
        </div>
    )
}

export default AdvancedTerminal;