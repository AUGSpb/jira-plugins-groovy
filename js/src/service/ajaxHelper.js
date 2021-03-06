// eslint-disable-next-line import/no-extraneous-dependencies
import AJS from 'AJS';


export function getPluginBaseUrl(version) {
    return `${getBaseUrl()}/rest/my-groovy/${version || 'latest'}`;
}

export function getBaseUrl() {
    return AJS.contextPath();
}

export function ajaxGet(url) {
    return ajaxPromise(url, 'GET');
}

export function ajaxDelete(url) {
    return ajaxPromise(url, 'DELETE');
}

export function ajaxPost(url, data) {
    return ajaxPromise(url, 'POST', null, data);
}

export function ajaxPut(url, data) {
    return ajaxPromise(url, 'PUT', null, data);
}

export function ajaxPromise(url, method, _params, data) {
    return new Promise((resolve, reject) => {
        return AJS.$
            .ajax({
                url: url,
                type: method,
                contentType: method !== 'GET' ? 'application/json' : undefined,
                dataType: 'json',
                data: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(data) : undefined
            })
            .then(
                data => {
                    resolve(data);
                },
                error => {
                    let data = {error: `${error.status}: ${error.statusText}`};

                    if (error.responseText) {
                        try {
                            data = JSON.parse(error.responseText);
                        } catch (e) {
                            data = error.responseText;
                        }
                    }

                    reject({
                        response: {
                            ...error,
                            data: data
                        },
                        message: `${error.status}: ${error.statusText}`
                    });
                }
            );
    });
}
