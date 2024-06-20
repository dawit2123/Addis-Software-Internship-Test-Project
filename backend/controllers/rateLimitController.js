import { createClient } from "redis"; // Updated import for Redis

export const handleRateLimitExceeded = async (req, res, next) => {
  const ip = req.ip;

  try {
    // Store the IP in a Redis set
    await redisClient.sAdd("exceeded_ips", ip);
    // Fetch all IPs that have exceeded the rate limit
    const exceededIPs = await redisClient.sMembers("exceeded_ips");

    console.log("Excedded IPs:", exceededIPs);
  } catch (err) {
    console.error("Error storing exceeded IP in Redis:", err);
  }

  // Send rate limit exceeded response
  res
    .status(429)
    .json({ message: "Too many requests from this IP, please try again!" });
};
// Setup Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
