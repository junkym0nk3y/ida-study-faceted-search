export function scrollbarWidth() {
    if (typeof document === 'undefined') {
        return 0;
    }

    const div = document.createElement('div');

    div.style.position = 'fixed';
    div.style.left = 0;
    div.style.visibility = 'hidden';
    div.style.overflowY = 'scroll';

    document.body.appendChild(div);
    const width = div.getBoundingClientRect().right;
    document.body.removeChild(div);

    return width;
}

let lockBodyLastPosition = null;

export function lockBody(isFixed, timeout = 0) {
    lockBodyLastPosition = window?.scrollY;
    const lock = () => {
        document.documentElement.style.height = 'auto';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        if (isFixed) {
            document.body.style.position = 'fixed';
        }
        document.body.style.paddingRight = `${scrollbarWidth()}px`;

    };

    if (timeout) {
        setTimeout(lock, timeout);
    } else {
        lock();
    }
}

export function unlockBody(timeout = 0) {
    const unlock = () => {
        document.documentElement.style.height = '';
        document.documentElement.style.overflow = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.position = '';

        if (lockBodyLastPosition && window) {
            window.scrollTo(0, lockBodyLastPosition);
        }
    };

    if (timeout) {
        setTimeout(unlock, timeout);
    } else {
        unlock();
    }
}

export function getOffset(el) {
    let rect = el.getBoundingClientRect();

    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: rect.width,
        height: rect.height,
    };
}

export const webpIsSupported = async () => {
    // If the browser doesn't has the method createImageBitmap, you can't display webp format
    if (!self.createImageBitmap) return false;

    // Base64 representation of a white point image
    const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';

    // Retrieve the Image in Blob Format
    const blob = await fetch(webpData).then(r => r.blob());

    // If the createImageBitmap method succeeds, return true, otherwise false
    return createImageBitmap(blob).then(() => true, () => false);
};


export function roundToThousands(num) {
    if (num === undefined || num === null) {
        console.warn('[roundToMillions] Wrong Number ', num);
        return '';
    }

    return (Number(num) / 1000).toFixed(0);
}

export function roundToMillions(num, accuracy = 1) {
    if (num === undefined || num === null) {
        console.warn('[roundToMillions] Wrong Number ', num);
        return '';
    }

    return (Number(num) / 1000000).toFixed(accuracy);
}


export function objectToQuery(obj) {
    let qs = '';
    for (let name in obj) {
        if (obj[name]) {
            if (Array.isArray(obj[name])) {
                obj[name].forEach(val => {
                    if (val) {
                        qs += `${name}=${val}&`;
                    }
                });
            } else {
                qs += `${name}=${obj[name]}&`;
            }
        }
    }
    return qs.slice(0, -1);
}

export function applyQuery(defaulValues, queryValues) {
    let values = {...defaulValues};


    if (typeof defaulValues !== 'object') {
        console.warn('defaulValues must be an object');
        return;
    }
    if (typeof queryValues !== 'object') {
        console.warn('queryValues must be an object');
        return;
    }
    if (!Object.keys(queryValues).length) {
        return values;
    }

    for (let name in queryValues) {
        if (Object.prototype.hasOwnProperty.call(values, name)) {
            if (Array.isArray(values[name])) {
                if (Array.isArray(queryValues[name])) {
                    values[name] = queryValues[name].map(i => {
                        if (i === 'true') {
                            return true;
                        } else if (i === 'false') {
                            return false;
                        } else return i;
                    });
                } else {
                    values[name] = [queryValues[name] === 'true' ? true : queryValues[name] === 'false' ? false : queryValues[name]];
                }
            } else {
                if (Array.isArray(queryValues[name])) {
                    values[name] = queryValues[name][0] === 'true' ? true : queryValues[name][0] === 'false' ? false : queryValues[name][0];
                } else {
                    values[name] = queryValues[name] === 'true' ? true : queryValues[name] === 'false' ? false : queryValues[name];
                }
            }
        }
    }

    // console.log('applyQuery result__', values);

    return values;
}

export function applyQueryFlats(query = {}) {
    if (typeof query !== 'object') {
        console.warn('utils.applyQuery: query должен быть объктом (this.$router.query)');
        return {};
    }

    const newQuery = {};

    for (let key in query) {
        const val = query[key];

        // if (val === 'true' || val === 'false') {
        //     newQuery[key] = Boolean(val);
        // }
        if (val === 'true') {
            newQuery[key] = true;
        } else if (val === 'false') {
            newQuery[key] = false;
        } else if (key.includes('_max')) {
            const newKey = key.replace('_max', '');
            if (!newQuery[newKey]) {
                newQuery[newKey] = {};
            }

            newQuery[newKey].max = isNaN(val) ? val : Number(val);
        } else if (key.includes('_min')) {
            const newKey = key.replace('_min', '');
            if (!newQuery[newKey]) {
                newQuery[newKey] = {};
            }

            newQuery[newKey].min = isNaN(val) ? val : Number(val);
        } else {
            newQuery[key] = isNaN(val) ? val : Number(val);
        }
    }

    return newQuery;
}

export function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function scrollTo(id = false, offset = 0, force = false) {
    if (!id) {
        window.scroll({top: 0, left: 0, behavior: force ? 'instant' : 'smooth'});
    } else {
        const target = document.getElementById(id);
        if (target) {
            const position =
                target.getBoundingClientRect().top + window.pageYOffset;
            window.scroll({
                top: position - offset,
                left: 0,
                behavior: force ? 'instant' : 'smooth',
            });
        }
    }
}

export function debounce(func, wait, immediate) {
    let timeout;

    return function executedFunction() {
        // eslint-disable-next-line
        const context = this;
        const args = arguments;

        function later() {
            timeout = null;

            if (!immediate) {
                func.apply(context, args);
            }
        }

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}

/* eslint-disable */
