const NodeCache = require("node-cache");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const cache = new NodeCache();

const fetchData = async () => {
  console.time("Time to Fetch Data");
  const url = "https://jsonplaceholder.typicode.com/todos/1";
  const cacheKey = "todos_1";

  let data = cache.get(cacheKey);

  if (data == undefined) {
    console.log("Cache miss - fetching data from API...");
    const response = await fetch(url);
    data = await response.json();
    //cache data with expiry period of 5 minutes
    cache.set(cacheKey, data, { ttl: 5 * 60 });
  } else {
    console.log("Cache hit - fetching data from cache...");
  }

  console.log(data);
  console.timeEnd("Time to Fetch Data");
};

async function main() {
  // First call to fetchData
  await fetchData();

  // Second call to fetchData
  await fetchData();

  // Retrieve cache statistics
  const stats = cache.getStats();
  console.log(stats);
}

main();
