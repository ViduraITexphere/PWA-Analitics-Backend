const express = require("express");
const http = require("http");
const cors = require("cors");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
propertyId = "433536615";

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

const serviceAccountCredentials = {
  client_email:
    "starting-account-gblrcquq2x1l@g-analytics-api--1715164463157.iam.gserviceaccount.com",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCPYiRECuJ0iv5l\n7saovy4u6O+D30RebnEhMju1QpHIzT5VhgpHsGJB789ptByo7p8X21GV/jQ3kv8i\neHmlbz7kPbcAicdCJ0W8Em1GbobEJ7tGciG5Du0zPteOT7IDv1bfY5zDeqWT2w//\n7FVjYqvrWzmw7A+03Jim50bAf15PNAxs5MjUFfWvLEG2YrEFytYhyrAhpaJPC0vX\nyMQzmKV2Qf3G4Rco9O3Gyv43eZRIeS0h2vO7Owb54gS8nSHP1YBzfxqvf6IbFZlW\nmwjjYIpeUSMqCioFD1VF7W6N/4qSukLD9y57N/tKuLHp5xhjx3HHYiGGJEa70llz\ne1IVZRubAgMBAAECggEAOfMw9B0wFGk+04TTXs1SBZyYfURl9gKOD5wlXKeIk088\nk8VGb13/AGZDfpXQhYhX3YUDLuucQB/VpSFrDO1uzkGRLpMA6SBFQ3NxHee66Rmj\ny5+COLCrNqx942Mbb/9LxaKVb74ooJ8Hkuh6RF5TXJ60rOhjmrYTrlVIF7ICtGCa\ne8usnsfriPEGwHdS88ylV+muOL96y5FaNh1qa66pNCkjwuEF9hglnX4JVIQMb6Sp\n4v8/cZ6c30HEDakDxbRf3WNJ89lw097fpM1gWDeVAg1zzi4H0yJU4A0K/8bJuL+h\n34g+RhXzas2jD5xIXsxjtfJWEUYJz9c93QejGwZYTQKBgQDFTX7P7xVqvMDDQvHC\ngj3jrnVJ1InSCBDdP8wkVgaDeVHT6eyxkSZvUpfSr/yKqfPsbzAxd75m66BqOJJR\norDMuegxoPEAGEn3o0/tv0tLVmit8rD5/iRADG2e7oDgSs+/eykhqJD1GfmqTch/\nzjTiVZ3wXOuO3rbGxa+v4JktVwKBgQC6CirzBMjte3kSQcM796yAcAI1FonZNQsl\nEqXrhFB5oaPL+kysT2kNuIKbnO5nJRvO1+oVhgPNzlEJFVgfqJ3IoK+xXIBGHRs1\nL4MEKWKKE+wEFP73IzrvPNqRslpm/4R25HFsV9QIpJH+EDYe5GvfGrk3pSdtRBx6\nwC7XxwSVXQKBgQCIwehuVHfx3hd2wMY2XnRrhpdBr5JABNs7oGbtoLsvEj6HtpMb\nmVKcwxD9NoLD0n2Cmqc7Apb1W8l7Fu9EqpIFta6eB8JEoJFUltxmHLwh4ij4uUm2\nXlPeGT86dHLcBL7vKH0gGWkwmuqVAwlAnTvGzjWFT8Lu6qyiJpBaRkGmTQKBgBMQ\nj64vw1dy28lfK96tVuQilldSY/X6VZYK/y3PdV/BjMOOduUBjkZ1rgy8XEH9r4fW\n4IosHZ+tkOhZY5p68RBqRxbp38tPmEYvBEIc65gyynDwpeA1oAh8N/nOSS1c6fo1\nFtp/dZ8dHkjm6GTqC5PlbS2ioxOzcyexIhvCrVmRAoGAeWvuPqn8sM2iQdB8VoVN\nM1w3OC7+caEIHEapOTkh0f5dsDp67EthHL2/6sNc2twvuJstcoa3Firl/vyRFtwl\nk3bTv1EC+5l7YVxFbIWT70mZV44t+bvLoL3HYBnBMdEOE1PZV4rsorebMoE1PhLW\nIt2AkRpvdCad7xP/mJ++dg4=\n-----END PRIVATE KEY-----\n",
};

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: serviceAccountCredentials,
});

async function runRealtimeReport(socket) {
  try {
    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
    });
    printRunReportResponse(response, socket);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function printRunReportResponse(response, socket) {
  console.log(`${response.rowCount} rows received`);
  // socket.emit("realtimeData", response); // Emit the real-time data to the client
  response.dimensionHeaders.forEach((dimensionHeader) => {
    console.log(`Dimension header name: ${dimensionHeader.name}`);
  });
}

// Initial call
runRealtimeReport();

// // Route to send real-time user count updates
// app.get("/user-count", async (req, res) => {
//   try {
//     const [response] = await analyticsDataClient.runRealtimeReport({
//       property: `properties/${propertyId}`,
//       dimensions: [{ name: "country" }],
//       metrics: [{ name: "activeUsers" }],
//     });
//     const userCount =
//       response.rowCount > 0 ? response.rows[0][0].int64Value : 0;
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.write(`data: ${JSON.stringify({ userCount })}\n\n`);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).send("Error fetching data");
//   }
// });

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
