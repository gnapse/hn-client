const cache = {
  key(key) {
    return `hn:${key}`;
  },

  get(key) {
    const rawValue = localStorage.getItem(cache.key(key));
    return JSON.parse(rawValue);
  },

  set(key, value) {
    localStorage.setItem(cache.key(key), JSON.stringify(value));
  },

  has(key) {
    return localStorage.getItem(cache.key(key)) != null;
  },

  clear() {
    localStorage.clear();
  },
};

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export function fetchHN(path, { force = false, timeout = 5000, ...opts } = {}) {
  const promise =
    cache.has(path) && !force
      ? Promise.resolve(cache.get(path))
      : fetchWithTimeout(`${BASE_URL}${path}.json`, { timeout, ...opts }).then(
          response => {
            if (!response.ok) return Promise.reject(response);
            return response.json();
          }
        );
  return promise.then(
    value => {
      cache.set(path, value);
      return value;
    },
    error => {
      if (cache.has(path)) {
        return cache.get(path);
      }
      return Promise.reject(error);
    }
  );
}

function fetchWithTimeout(url, { timeout, ...opts } = {}) {
  if (!timeout) {
    return fetch(url, opts);
  }
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      console.warn('request timeout', url);
      timer = undefined;
      reject('TIMEOUT');
    }, timeout);
    const handler = callback => result => {
      if (timer !== undefined) {
        clearTimeout(timer);
        callback(result);
      }
    };
    fetch(url, opts).then(handler(resolve), handler(reject));
  });
}
