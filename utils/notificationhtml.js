export function notifcationHtml(scraped, name) {
  console.log(scraped, name);

  if (!scraped || scraped.length === 0) {
    return `<div style="background-color: #f4f4f4; padding: 20px;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p style="color: #555;">No new job postings found for your criteria.</p>
    </div>`;
  }

  let html = `<div style="background-color: #f4f4f4; padding: 20px;">
    <h2 style="color: #333;">Hello ${name},</h2>
    <p style="color: #555;">Here are the latest job postings that match your criteria:</p>
    <div style="background-color: #fff; padding: 20px; border-radius: 5px;">`;

  for (const data of scraped) {
    html += `<div style="margin-bottom: 10px;">
      <h3 style="color: #333;">${data?.title}</h3>
      <p style="color: #333;">${data?.type}</p>
      <p style="color: #333;">${data?.description}</p>
      <p style="color: #333;">Posted on: ${new Date(
        data?.ts_create
      ).toLocaleString()}</p>`;

    if (data?.type !== "FIXED") {
      html += `<p style="color: #333;">
        Budget: min: ${data?.hourly?.min} max: ${data?.hourly?.max}
      </p>`;
    }

    if (data?.type === "FIXED") {
      html += `<p style="color: #333;">
        Budget:  ${data?.fixed?.budget?.amount}
      </p>`;
    }

    html += `<p><a href="${data?.url}" style="color: #007BFF;">${data?.url}</a></p>
    </div>`;
  }

  html += `</div></div>`;

  return html;
}
export function slackNotificationMessage(scraped, name) {
  if (!scraped || scraped.length === 0) {
    return {
      text: `Hello ${name}, no new job postings were found for your criteria.`,
    };
  }
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `Hello ${name},`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Here are the latest job postings that match your criteria:",
      },
    },
    {
      type: "divider",
    },
  ];
  scraped.forEach((data) => {
    const createdTime = new Date(data?.ts_create).toLocaleString();
    let budgetText = "";
    if (data?.type !== "FIXED") {
      budgetText = `*Budget:* min: ${data?.hourly?.min} max: ${data?.hourly?.max}`;
    } else {
      budgetText = `*Budget:* ${data?.fixed?.budget?.amount}`;
    }
    const sectionText = `*${data?.title}*\n${data?.type}\n${data?.description}\n*Posted on:* ${createdTime}\n${budgetText}\n<${data?.url}|View Posting>`;
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: sectionText,
      },
    });
    blocks.push({
      type: "divider",
    });
  });
  return { blocks };
}
export function telegramNotificationMessage(scraped, name) {
  if (!scraped || scraped.length === 0) {
    return `👋 Hello ${name},\n\nNo new job postings were found for your criteria.`;
  }

  let message = ` Hello ${name},\n\nHere are the latest job postings that match your criteria:\n\n`;

  scraped.forEach((data) => {
    const createdTime = new Date(data?.ts_create).toLocaleString();
    let budgetText = "";

    if (data?.type !== "FIXED") {
      budgetText = `*Budget:* min: ${data?.hourly?.min} max: ${data?.hourly?.max}`;
    } else {
      budgetText = `*Budget:* ${data?.fixed?.budget?.amount}`;
    }

    message += `🔹 *${data?.title}*\n`;
    message += `${data?.type}\n`;
    message += `${data?.description}\n`;
    message += `*Posted on:* ${createdTime}\n`;
    message += `${budgetText}\n`;
    message += `[View Posting](${data?.url})\n\n`;
  });

  return message;
}
