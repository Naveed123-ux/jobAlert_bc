import { ApifyClient } from "apify-client";
import dotenv from "dotenv";
import cron from "node-cron";
dotenv.config();
import User from "../models/user.model.js";
import {
  notifcationHtml,
  slackNotificationMessage,
  telegramNotificationMessage,
} from "../utils/notificationhtml.js";
import {
  sendNotification,
  sendSlackMessage,
  sendTelegramMessage,
} from "../utils/sendEmail.js";
import filterModel from "../models/filter.model.js";
import Notification from "../models/notifcation.model.js";
import axios from "axios";

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

// export async function scrapeData(req, res) {
//   try {
//     const users = await User.find({ isVerified: true });
//     for (const user of users) {
//       const filters = await filterModel.find({ userId: user._id });
//       const notifcation = await Notification.findOne({ userId: user._id });
//       for (const filter of filters) {
//         const input = {
//           query: filter.name,
//           categories: filter.categories,
//           searchTerms: filter.searchTerms,

//           hourly:
//             filter.projectType === "Hourly" || filter.projectType === "both"
//               ? true
//               : false,
//           fixed:
//             filter.projectType === "Fixed" || filter.projectType === "both"
//               ? true
//               : false,
//           hourly_min: filter.minHourlyRate,
//           hourly_max: filter.maxHourlyRate,
//           price_min: filter.minFixedPrice,
//           price_max: filter.maxFixedPrice,
//           tier: filter.experienceLevel,
//         };
//         const run = await client.actor("jupri/upwork").call(input);
//         const { items } = await client
//           .dataset(run.defaultDatasetId)
//           .listItems();
//         const currentTime = new Date();
//         const cutoffTime = new Date(currentTime - 7.5 * 60 * 60 * 1000);
//         const recentItems = items.filter((item) => {
//           const itemCreateTime = new Date(item.ts_create);
//           return itemCreateTime >= cutoffTime;
//         });
//         const body = notifcationHtml(recentItems, filter.name);
//         await sendNotification(notifcation.recievingEmail, "New jobs", body);
//       }
//     }

//     res.status(200).json({success:true,message:"Scraping completed successfully"});
//   } catch (err) {
//     console.error("Error scraping Upwork:", err.response?.data || err.message);
//     res.status(500).json({
//       error: "Failed to scrape data from Apify",
//       details: err.response?.data || err.message,
//     });
//   }
// }

export async function scrapeDataCronJob() {
  try {
    const users = await User.find({ isVerified: true });

    const allUserPromises = users.map(async (user) => {
      return new Promise(async (resolve, reject) => {
        if (!user.isSubscribed || user.trialEnd < Date.now()) {
          console.log(
            "User is not subscribed or trial period has ended:",
            user._id
          );
          return reject("user is not subscribed"); // Skip this user
        }

        try {
          const filters = await filterModel.find({ userId: user._id });
          const notification = await Notification.findOne({ userId: user._id });

          const filterPromises = filters.map(async (filter_1) => {
            console.log("filter_1", filter_1);

            const input = {
              sort: "newest",
              category: filter_1.categories,
              search: { any: filter_1.searchTerms.join(" ") },
              hourly:
                filter_1.projectType === "Hourly" ||
                filter_1.projectType === "both",
              fixed:
                filter_1.projectType === "Fixed" ||
                filter_1.projectType === "both",
              hourly_min: filter_1.minHourlyRate,
              hourly_max: filter_1.maxHourlyRate,
              price_min: filter_1.minFixedPrice,
              price_max: filter_1.maxFixedPrice,
              tier: filter_1.experienceLevel,
            };

            try {
              const run = await client.actor("jupri/upwork").call(input);
              const { items } = await client
                .dataset(run.defaultDatasetId)
                .listItems();

              console.log("items", items);

              const currentTime = new Date();
              const cutoffTime = new Date(currentTime - 7.5 * 60 * 60 * 1000); // last 7.5 hours

              const recentItems = items.filter((item) => {
                const itemCreateTime = new Date(item.ts_create);
                return itemCreateTime >= cutoffTime;
              });

              if (
                notification.emailNotifications &&
                notification.recievingEmail
              ) {
                const body = notifcationHtml(recentItems, filter_1.name);
                await sendNotification(
                  notification.recievingEmail,
                  "New jobs",
                  body
                );
              }

              if (
                notification.telegramChatId &&
                notification.telegramNotifications
              ) {
                const message = telegramNotificationMessage(
                  recentItems,
                  filter_1.name
                );
                await sendTelegramMessage(notification.telegramChatId, message);
              }

              if (
                notification.slackNotifications &&
                notification.slackWebHookUrl
              ) {
                const message = slackNotificationMessage(
                  recentItems,
                  filter_1.name
                );
                await sendSlackMessage(notification.slackWebHookUrl, message);
              }
            } catch (error) {
              console.error(
                `Error scraping filter "${filter_1.name}":`,
                error.message
              );
            }
          });

          const filterResults = await Promise.allSettled(filterPromises);
          resolve(filterResults);
        } catch (err) {
          console.error(`Error processing user ${user._id}:`, err.message);
          reject(err);
        }
      });
    });

    const userResults = await Promise.allSettled(allUserPromises);

    console.log("✅ Scraping completed successfully");
    console.log(userResults);
  } catch (err) {
    console.error("❌ Error scraping Upwork:", err.message);
  }
}

cron.schedule("0 */8 * * *", async () => {
  console.log("⏰ Running Upwork scraping cron job (every 8 hours)...");
  await scrapeDataCronJob();
});
