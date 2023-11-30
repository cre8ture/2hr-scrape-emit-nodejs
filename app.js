const axios = require('axios');
const cheerio = require('cheerio');
const EventEmitter = require('events');


class WebScraper extends EventEmitter {
  constructor(targetUrl, interval = 5000) {
    super();
    this.targetUrl = targetUrl;
    this.interval = interval;
    this.currentData = '';

    // Start the scraping process
    this.startScraping();
  }

  async fetchData() {
    try {
      const response = await axios.get(this.targetUrl);
      return response.data;
    } catch (error) {
      this.emit('error', error);
    }
  }

  async scrape() {
    console.log("___________________")
    console.log("started: new date:", new Date())

    const newData = await this.fetchData();
    if (newData !== this.currentData) {
      // Emit an 'update' event when the data changes
      this.emit('update', newData);
      this.currentData = newData;
    }
  }

  startScraping() {
    // Periodically scrape the website
    this.scrapeInterval = setInterval(() => this.scrape(), this.interval);
  }

  stopScraping() {
    // Stop the scraping process
    clearInterval(this.scrapeInterval);
  }
}

// Example Usage
const targetUrl = 'https://www.nytimes.com/';
const scraper = new WebScraper(targetUrl);

// Listen for 'update' events
scraper.on('update', newData => {
  console.log('Data updated:', new Date());
});

// Listen for 'error' events
scraper.on('error', error => {
  console.error('Error:', error.message);
});

// Stop scraping after 20 seconds (for demonstration purposes)
setTimeout(() => {
  scraper.stopScraping();
  console.log('Scraping stopped.');
}, 21000);