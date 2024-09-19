
const hourInMs = 900000; // 15 min in milliseconds

function fetchWeather(url: string) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Send the response back to the main thread
      postMessage({ status: 'success', data });
    })
    .catch(error => {
      // Send error back to the main thread
      console.log(error)
      postMessage({ status: 'error', error });
    });
}

self.onmessage = (e) => {
  if (e.data?.url) {
    const { url } = e.data;
    fetchWeather(url);
    // Start making HTTP requests every 15 min
    setInterval(() => {
      fetchWeather(url);
    }, hourInMs);
  }
};
