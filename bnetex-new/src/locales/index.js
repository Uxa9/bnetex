import LocalizedStrings from 'react-localization';

import ru from './russian.json';
import en from './english.json';

let _l =  new LocalizedStrings({
    ru : ru,
    // en : en,
});

const russianLocales = [
    'ru_RU',
];

if ( !russianLocales.includes(_l.getInterfaceLanguage()) ) {
    _l.setLanguage('en');
}

_l.setLanguage('ru'); //remove on deploy

export default _l;
