import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export interface RedirectionSource {
    from?: string;
}

/**
 * Преобразует объект в url строку (не использует urlEncode)
 * @param obj
 */
export function getUrlString(obj: any) {
    if (!obj) return '';
    let params = '';
    params = '?';
    let isFirst = true;
    Object.keys(obj).forEach(key => {
        if (isFirst) {
            params = `${params}${key}=${obj[key]}`;
            isFirst = false;
        } else {
            params = `${params}&${key}=${obj[key]}`;
        }
    });
    return params;
}

/**
 * Преобразует путь в абсолютный
 * @param path
 */
export function resolvePathAsAbsolute(path: string) {
    return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Возвращает имя пути без '/'
 * @param path
 */
export function getPathName(path: string) {
    // убираем начальный / из пути
    path = path.substring(1);
    return path.lastIndexOf('/') === path.length - 1 ? path.substring(0, path.length - 1) : path;
}


export function useGoToState() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathName = useMemo(() => getPathName(location.pathname), [location.pathname]);

    /**
     * Перенаправление на уровень выше в url
     */
    function goUp(times = 1) {
        navigate('..'.repeat(times));
    }

    function goToState(url: string, params: any = null, notAbsolute = false, options?: NavigateOptions) {
        const _params = getUrlString(params);
        url = notAbsolute ? url : resolvePathAsAbsolute(url);
        let source = options?.state as RedirectionSource;
        if (!source || !source.from) source = { from: `/${pathName}` };
        navigate({ pathname: url, search: _params }, { ...options, state: source });
    }

    /**
     * Вернуться к тому роуту, с которого сюда перешли. Если переход отсутствует, то в defaultValue
     * @param defaultValue
     */
    function navigateBack(defaultValue: string) {
        const redirectionSource = location.state as RedirectionSource;
        navigate(redirectionSource?.from ?? resolvePathAsAbsolute(defaultValue));
    }

    return {
        goToState,
        goUp,
        pathName,
        navigateBack,
    };
}
