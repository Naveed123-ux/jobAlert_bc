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
