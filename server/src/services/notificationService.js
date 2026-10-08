const db = require('../db');
const { getDistanceKm } = require('../ai/clusters');

// SSE Clients map: userId -> Set of express res objects
const sseClients = new Set();

function addSseClient(res) {
  sseClients.add(res);
  res.on('close', () => {
    sseClients.delete(res);
  });
}

function broadcastSse(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

/**
 * Dispatch notifications when a report is High risk or when an outbreak cluster is detected
 */
async function notifyHighRiskCase(report, hotspotId = null) {
  try {
    // 1. Notify Veterinarians
    const vets = await db('users').where('role', 'vet');
    const newNotifications = [];

    for (const vet of vets) {
      newNotifications.push({
        user_id: vet.id,
        role_target: 'vet',
        report_id: report.id,
        hotspot_id: hotspotId,
        title: `🚨 High-Risk Case Alert: ${report.species.toUpperCase()} (${report.report_number})`,
        message: `High-risk case reported at ${report.village || 'nearby village'} requiring immediate review: ${report.ai_reason?.slice(0, 120)}...`,
        type: 'high_risk_alert',
        is_read: false,
        created_at: new Date()
      });
    }

    // 2. Notify Farmers in proximity (within 5 km)
    if (report.latitude && report.longitude) {
      const farmers = await db('users').where('role', 'farmer');
      for (const farmer of farmers) {
        // If farmer has an animal in proximity or is the reporter
        const isReporter = farmer.id === report.user_id;
        newNotifications.push({
          user_id: farmer.id,
          role_target: 'farmer',
          report_id: report.id,
          hotspot_id: hotspotId,
          title: isReporter
            ? `⚠️ Your Report ${report.report_number} Flagged for High Priority`
            : `⚠️ Biosecurity Advisory: High Risk Case in Your Vicinity`,
          message: isReporter
            ? `Your livestock health report has been assessed as High Risk. A local veterinarian has been notified for urgent consultation.`
            : `A high-risk ${report.species} case was recorded in ${report.village || 'the area'}. Practice preventative hygiene and monitor your animals.`,
          type: 'high_risk_alert',
          is_read: false,
          created_at: new Date()
        });
      }
    }

    if (newNotifications.length > 0) {
      await db('notifications').insert(newNotifications);
    }

    // Broadcast SSE to live clients
    broadcastSse({
      event: 'new_high_risk_alert',
      reportId: report.id,
      reportNumber: report.report_number,
      species: report.species,
      village: report.village,
      riskLevel: report.risk_level,
      timestamp: new Date().toISOString()
    });

    console.log(`[Notification Service] Dispatched ${newNotifications.length} high-risk alerts.`);
  } catch (err) {
    console.error('[Notification Service] Error creating notifications:', err);
  }
}

/**
 * Dispatch notification when an outbreak cluster is detected or updated
 */
async function notifyHotspotDetected(hotspot) {
  try {
    const users = await db('users').select('id', 'role');
    const newNotifications = users.map(u => ({
      user_id: u.id,
      role_target: u.role,
      hotspot_id: hotspot.id || null,
      title: `⚡ Outbreak Cluster Detected: ${hotspot.name}`,
      message: `Surveillance engine identified an active cluster with ${hotspot.total_reports} cases (${hotspot.high_risk_reports} high-risk) within ${hotspot.radius_km || 5} km radius.`,
      type: 'hotspot_warning',
      is_read: false,
      created_at: new Date()
    }));

    if (newNotifications.length > 0) {
      await db('notifications').insert(newNotifications);
    }

    broadcastSse({
      event: 'hotspot_detected',
      hotspotName: hotspot.name,
      totalReports: hotspot.total_reports,
      highRiskCount: hotspot.high_risk_reports,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[Notification Service] Error creating hotspot notification:', err);
  }
}

module.exports = {
  addSseClient,
  broadcastSse,
  notifyHighRiskCase,
  notifyHotspotDetected
};
