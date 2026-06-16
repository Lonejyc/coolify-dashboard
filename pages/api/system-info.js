export default async function handler(req, res) {
  const agentUrl =
    process.env.MONITOR_AGENT_URL || "http://10.0.1.11:5000/api/stats";

  console.log(`[API System-Info] Tentative vers : ${agentUrl}`);

  try {
    const response = await fetch(agentUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 0 },
    });

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(`[API System-Info] Erreur : ${error.message}`);
    res
      .status(500)
      .json({ error: "Agent injoignable", details: error.message });
  }
}
