import { LibrarySymbolInfo } from 'charting_library/charting_library';
import { UUID } from 'lib/types/uuid';
import { TVInterval } from './types';

const socketMap = new Map<UUID, WebSocket>();

export function subscribeOnStream(symbolInfo: LibrarySymbolInfo, resolution: TVInterval, listenerGuid: UUID) {
    console.log(symbolInfo, resolution, listenerGuid);
    
}

export function unsubscribeFromStream() {
    // todo
}
