const { google } = require("googleapis");

// Replace with your service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile: "path/to/your/service-account-key.json", // Path to your service account key file
  scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const analyticsreporting = google.analyticsreporting({
  version: "v4",
  auth: auth,
});

async function getAnalyticsData() {
  const viewId = "433536615"; // Replace with your Google Analytics View ID
  const request = {
    resource: {
      reportRequests: [
        {
          viewId: viewId,
          dateRanges: [{ startDate: "today", endDate: "today" }],
          metrics: [{ expression: "ga:activeUsers" }], // Metric to retrieve (e.g., active users)
        },
      ],
    },
  };

  try {
    const response = await analyticsreporting.reports.batchGet(request);
    console.log(response.data.reports[0].data.rows); // Process the data
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
  }
}

// Run the function periodically (e.g., using setInterval)
setInterval(getAnalyticsData, 60000); // Every minute
