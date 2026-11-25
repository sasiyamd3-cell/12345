const API_URL = "https://sasiya-1-fef7afab0723.herokuapp.com/pair";

// Set PAIR_API_TOKEN in Vercel Environment Variables before deploying.
const API_TOKEN = process.env.PAIR_API_TOKEN;

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const number = String(req.query.number || "").replace(/[\\s+()\\-]/g, "");

  if (!/^[1-9][0-9]{7,14}$/.test(number)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid international phone number with country code."
    });
  }

  if (!API_TOKEN) {
    return res.status(500).json({
      success: false,
      message: "Pair API token is not configured on the server."
    });
  }

  try {
    const endpoint = new URL(API_URL);
    endpoint.searchParams.set("number", number);
    endpoint.searchParams.set("token", API_TOKEN);

    const upstream = await fetch(endpoint.toString(), {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(30000)
    });

    const raw = await upstream.text();
    let apiData;

    try {
      apiData = JSON.parse(raw);
    } catch {
      apiData = raw;
    }

    if (!upstream.ok) {
      return res.status(502).json({
        success: false,
        message: "The upstream pairing API returned an error.",
        details: apiData
      });
    }

    return res.status(200).json({
      success: true,
      number,
      data: apiData
    });
  } catch (error) {
    console.error("Pair API request failed:", error.message);
    return res.status(502).json({
      success: false,
      message: "Could not connect to the pairing API. Please try again."
    });
  }
};
