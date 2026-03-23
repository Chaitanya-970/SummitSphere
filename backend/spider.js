require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs'); 

// Ensure these match your folder structure
const Trek = require('./models/Trek');
const User = require('./models/User');

const PER_SECTOR_LIMIT = 5;
const SITEMAP_URL = 'https://indiahikes.com/sitemap.xml';

async function fetchHtml(url) {
  // Reduced timeout to 8 seconds so it doesn't hang on bad links
  const res = await axios.get(url, { timeout: 8000 });
  return res.data;
}

async function scrapeExpeditions() {
  console.log("🛰️  SATELLITE LINK: Initializing Radar-Enabled Harvester...");

  try {
    const sectors = ["Uttarakhand", "Himachal Pradesh", "Sikkim", "Jammu & Kashmir", "Lahaul and Spiti"];
    const sectorCounts = { "Uttarakhand": 0, "Himachal Pradesh": 0, "Sikkim": 0, "Jammu & Kashmir": 0, "Lahaul and Spiti": 0 };
    const finalData = [];
    const seenNames = new Set();

    console.log(`🗺️  Downloading sitemap: ${SITEMAP_URL}...`);
    const sitemapXml = await fetchHtml(SITEMAP_URL);

    // Grab URLs from the sitemap
    let urls = [];
    const re = /<loc>(https:\/\/indiahikes\.com\/[^<]+)<\/loc>/g;
    let match;
    while ((match = re.exec(sitemapXml)) !== null) {
      urls.push(match[1]);
    }

    // 9 CGPA: THE STRICT SITEMAP FILTER
    // We instantly delete any URL that isn't obviously a trek.
    urls = urls.filter(u => 
        (u.includes('-trek') || u.includes('/trek/')) && 
        !u.includes('/blog') && 
        !u.includes('/category') && 
        !u.includes('/tag')
    );

    console.log(`🎯 Sitemap filtered down to ${urls.length} pure trek targets. Commencing scan...\n`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      // STOP COMMAND: If all sectors have 5 treks, end the loop instantly.
      if (Object.values(sectorCounts).every(count => count >= PER_SECTOR_LIMIT)) {
          console.log("\n✅ ALL SECTORS AT MAXIMUM CAPACITY. Terminating scan.");
          break;
      }

      // RADAR PING: So you know the script isn't stuck!
      console.log(`   -> [${i + 1}/${urls.length}] Inspecting: ${url.split('/').pop()}`);

      try {
        const html = await fetchHtml(url);
        
        const jsonMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
        if (!jsonMatch) continue;

        const nextData = JSON.parse(jsonMatch[1]);
        const searchData = nextData?.props?.pageProps?.searchData;
        let index = Array.isArray(searchData) ? searchData : (searchData?.treks || searchData?.allTreks || []);

        if (!index.length) continue;

        for (const item of index) {
          if (Object.values(sectorCounts).every(count => count >= PER_SECTOR_LIMIT)) break;

          const name = item.name || item.title || item.trekName;
          const state = item.state || item.region;

          if (!name || !state || name.length < 3 || seenNames.has(name)) continue;

          // Match the state
          const matchedSector = sectors.find(s => state.toLowerCase().includes(s.toLowerCase().replace(' & ', ' and ')));
          if (!matchedSector || sectorCounts[matchedSector] >= PER_SECTOR_LIMIT) continue;

          // Distribution Logic
          const idx = sectorCounts[matchedSector];
          let difficulty = idx === 0 ? "Easy" : (idx === 4 ? "Hard" : "Moderate");
          let duration = idx === 0 ? 3 : (idx === 4 ? 9 : 6);

          seenNames.add(name);
          sectorCounts[matchedSector]++;

          const cleanName = name.replace(/\s+trek$/i, '').trim();

          finalData.push({
            name: cleanName,
            state: matchedSector,
            difficulty,
            duration,
            maxAltitude: difficulty === 'Hard' ? 15200 : (difficulty === 'Easy' ? 9500 : 12100),
            price: 4500 + (duration * 1200),
            description: `A master-class ${difficulty} expedition in ${matchedSector}.`,
            imageUrl: 'https://images.unsplash.com/photo-1522199710521-72d69614c702',
            startPoint: 'Regional Basecamp',
            endPoint: cleanName.split(' ')[0] + ' Summit',
            groupSize: '8-12',
            rating: (4.3 + (Math.random() * 0.6)).toFixed(1),
            itinerary: Array.from({ length: duration }, (_, dIdx) => ({
              day: dIdx + 1,
              title: dIdx === 0 ? "Briefing" : (dIdx === duration - 1 ? "Summit" : `Day ${dIdx + 1}`),
              description: "Tactical movement across high-altitude terrain."
            })),
            geometry: { type: 'Point', coordinates: [78.0322, 30.3165] }
          });
          
          console.log(`      ✔️  LOCKED: ${cleanName} (${matchedSector})`);
        }
      } catch (e) { 
          console.log(e);
      }
    }

    // --- THE SEED GENERATOR ---
    const jsonOutput = JSON.stringify(finalData, null, 2);
    const outputPath = './scraped-treks-seed.json';
    fs.writeFileSync(outputPath, jsonOutput);
    console.log(`\n💾 SEED DATA SAVED: Check your backend folder for '${outputPath}'!`);

    // DATABASE INJECTION
    if (finalData.length > 0) {
      await mongoose.connect(process.env.MONGO_URI);
      const admin = await User.findOne();
      
      console.log("🧹 NUKE INITIATED: Wiping the database clean...");
      await Trek.deleteMany({});
      await Trek.insertMany(finalData.map(t => ({ ...t, user_id: admin._id })));
      
      console.log(`🎉 MISSION SUCCESS: ${finalData.length} BACKDOOR expeditions live!`);
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("🚨 CRITICAL FAILURE:", error.message);
  }
}

scrapeExpeditions();