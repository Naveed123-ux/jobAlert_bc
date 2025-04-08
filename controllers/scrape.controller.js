import { ApifyClient } from "apify-client";
import dotenv from "dotenv";
dotenv.config();

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

export async function scrapeData(req, res) {
  try {
    const input = {
      query: "python",
      limit: 5,
    };

    const run = await client.actor("jupri/upwork").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log("Scraped items:", items);
    res.json(items);
  } catch (err) {
    console.error("Error scraping Upwork:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to scrape data from Apify",
      details: err.response?.data || err.message,
    });
  }
}
