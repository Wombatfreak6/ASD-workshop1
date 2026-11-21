const cache = new Map();

const TTL = 60 * 1000;

const markMiss = (res, next) => {
  res.set("X-Cache", "MISS");
  return next();
};

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);

  if (!cached) {
    return markMiss(res, next);
  }

  if (Date.now() - cached.createdAt > TTL) {
    cache.delete(key);
    return markMiss(res, next);
  }

  res.set("X-Cache", "HIT");
  return res.json(cached.data);
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    createdAt: Date.now()
  });
};

const invalidateCache = () => {
  cache.clear();
};

module.exports = {
  cache,
  cacheMiddleware,
  setCache,
  invalidateCache
};
