import { evaluateTheme } from 'lib/utils/evaluateAppColors';

export const getOverrides = () => {
    const colors = evaluateTheme();

    return {
        'paneProperties.background': colors.grayscale.card,
        'paneProperties.backgroundType': 'solid',
        'paneProperties.backgroundGradientStartColor': colors.grayscale.card,
        'paneProperties.backgroundGradientEndColor' : colors.grayscale.card,
        'paneProperties.vertGridProperties.color': colors.grayscale[4],
        'paneProperties.horzGridProperties.color': colors.grayscale[4],

        // 'scalesProperties.axisHighlightColor': 'red',
        // 'scalesProperties.axisLineToolLabelBackgroundColorActive': 'red',
        // 'scalesProperties.axisLineToolLabelBackgroundColorCommon': 'red',
        // 'scalesProperties.backgroundColor': 'red',
        'scalesProperties.lineColor': colors.grayscale[6],
        'scalesProperties.textColor': colors.grayscale[11],

        // 'sessions.vertlines.sessBreaks.color': 'red',

        // 'mainSeriesProperties.priceLineColor': colors.accent.green[2],
        // 'mainSeriesProperties.baseLineColor': 'red',
        // 'mainSeriesProperties.prevClosePriceLineColor': 'red',

        // 'mainSeriesProperties.candleStyle.upColor': colors.accent.green[3],
        // 'mainSeriesProperties.candleStyle.downColor': colors.accent.red[3],
        // 'mainSeriesProperties.candleStyle.borderColor': 'rgba( 0, 0, 0, 0 )',
        // 'mainSeriesProperties.candleStyle.borderUpColor': 'rgba( 0, 0, 0, 0 )',
        // 'mainSeriesProperties.candleStyle.borderDownColor': 'rgba( 0, 0, 0, 0 )',
        // 'mainSeriesProperties.candleStyle.wickColor': 'blue', // не понятное
        // 'mainSeriesProperties.candleStyle.wickUpColor': colors.accent.green[4],
        // 'mainSeriesProperties.candleStyle.wickDownColor': colors.accent.red[4],

        // 'mainSeriesProperties.hollowCandleStyle.upColor': colors.accent.green[3],
        // 'mainSeriesProperties.hollowCandleStyle.downColor': 'rgba( 0, 0, 0, 0 )',
        // 'mainSeriesProperties.hollowCandleStyle.borderColor': 'rgba( 55, 134, 88, 1)',
        // 'mainSeriesProperties.hollowCandleStyle.borderUpColor': colors.accent.green[3],
        // 'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.accent.red[3],
        // 'mainSeriesProperties.hollowCandleStyle.wickColor': 'rgba( 115, 115, 117, 1)',
        // 'mainSeriesProperties.hollowCandleStyle.wickUpColor': colors.accent.green[4],
        // 'mainSeriesProperties.hollowCandleStyle.wickDownColor': colors.accent.red[4],

        // 'mainSeriesProperties.haStyle.upColor': colors.accent.green[3],
        // 'mainSeriesProperties.haStyle.downColor': colors.accent.red[3],
        // 'mainSeriesProperties.haStyle.borderColor': 'rgba( 55, 134, 88, 1)',
        // 'mainSeriesProperties.haStyle.borderUpColor': colors.accent.green[3],
        // 'mainSeriesProperties.haStyle.borderDownColor': colors.accent.red[3],
        // 'mainSeriesProperties.haStyle.wickColor': 'rgba( 115, 115, 117, 1)',
        // 'mainSeriesProperties.haStyle.wickUpColor': colors.accent.green[4],
        // 'mainSeriesProperties.haStyle.wickDownColor': colors.accent.red[4],

        // 'mainSeriesProperties.barStyle.upColor': colors.accent.green[3],
        // 'mainSeriesProperties.barStyle.downColor': colors.accent.red[3],


        'mainSeriesProperties.lineStyle.color': colors.accent.accent[3],

        'mainSeriesProperties.areaStyle.color1': 'rgba(142, 19, 236, 0.25)',
        'mainSeriesProperties.areaStyle.color2': colors.accent.accent[3],
        'mainSeriesProperties.areaStyle.linecolor': colors.accent.accent[3],

        // 'mainSeriesProperties.hiloStyle.color': 'red',
        // 'mainSeriesProperties.hiloStyle.borderColor': 'blue',
        // 'mainSeriesProperties.hiloStyle.labelColor': 'green',

        // 'mainSeriesProperties.kagiStyle.upColor': 'blue',
        // 'mainSeriesProperties.kagiStyle.downColor': 'blue',
        // 'mainSeriesProperties.kagiStyle.upColorProjection': 'blue',
        // 'mainSeriesProperties.kagiStyle.downColorProjection': 'blue',

        // 'mainSeriesProperties.rangeStyle.upColor': 'blue',
        // 'mainSeriesProperties.rangeStyle.downColor': 'blue',
        // 'mainSeriesProperties.rangeStyle.upColorProjection': 'blue',
        // 'mainSeriesProperties.rangeStyle.downColorProjection': 'blue',

    };
};
