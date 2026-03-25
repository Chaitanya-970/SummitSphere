import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Loader2 } from 'lucide-react';


const TREK_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&q=80",
  "https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=1200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&q=80",
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&q=80",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80",
  "https://images.unsplash.com/photo-1465311440653-ba3b0d2d31fac?w=1200&q=80",
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1200&q=80",
];
const getTrekImage = (trekName, originalImage) => {
  if (!originalImage || originalImage.includes('1522199710521')) {
    let hash = 0;
    for (let i = 0; i < trekName.length; i++) hash = trekName.charCodeAt(i) + ((hash << 5) - hash);
    return TREK_IMAGES[Math.abs(hash) % TREK_IMAGES.length];
  }
  return originalImage;
};

const TrekPDF = ({ trek }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const getBase64ImageFromURL = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        c.getContext('2d').drawImage(img, 0, 0);
        resolve(c.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = url;
    });

  const generatePDF = async () => {
    if (!trek) return;
    setIsGenerating(true);

    const doc  = new jsPDF();
    const W    = doc.internal.pageSize.getWidth();
    const H    = doc.internal.pageSize.getHeight();
    const forest    = [45, 106, 79];
    const darkGreen = [13, 26, 20];
    const ink       = [26, 18, 8];
    const muted     = [140, 123, 101];
    const parchment = [242, 237, 228];
    const white     = [255, 255, 255];

    const footer = (pageNum, total) => {
      doc.setFillColor(...parchment);
      doc.rect(0, H - 10, W, 10, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(`SummitSphere  ·  ${trek.name}  ·  ${new Date().toLocaleDateString('en-IN')}`, 14, H - 3);
      doc.text(`${pageNum} / ${total}`, W - 14, H - 3, { align: 'right' });
    };

    const pageHeader = (title) => {
      doc.setFillColor(...darkGreen);
      doc.rect(0, 0, W, 26, 'F');
      doc.setFillColor(...forest);
      doc.rect(0, 26, W, 2.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(160, 210, 180);
      doc.text('SUMMITSPHERE  ·  OFFICIAL EXPEDITION MANUAL', 14, 10);
      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(16);
      doc.setTextColor(...white);
      doc.text(title, 14, 21);
    };

    const pill = (x, y, w, label, value) => {
      doc.setFillColor(...parchment);
      doc.roundedRect(x, y, w, 17, 2.5, 2.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(...muted);
      doc.text(label, x + w / 2, y + 5.5, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...ink);
      doc.text(String(value), x + w / 2, y + 13, { align: 'center' });
    };

    const rule = (y) => {
      doc.setDrawColor(...forest);
      doc.setLineWidth(0.3);
      doc.line(14, y, W - 14, y);
    };

    try {

      try {
        const b64 = await getBase64ImageFromURL(getTrekImage(trek.name, trek.imageUrl));
        doc.addImage(b64, 'JPEG', 0, 0, W, 96, undefined, 'FAST');
      } catch (e) { console.warn('Image skipped', e); }

      doc.setFillColor(...darkGreen);
      for (let i = 0; i < 36; i++) {
        doc.setGState(new doc.GState({ opacity: i / 36 }));
        doc.rect(0, 60 + i, W, 1, 'F');
      }
      doc.setGState(new doc.GState({ opacity: 1 }));


      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(28);
      doc.setTextColor(...white);
      doc.text(trek.name.toUpperCase(), 14, 83);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(190, 225, 205);
      doc.text(`${trek.state}  ·  ${trek.difficulty}  ·  ${trek.duration} Days  ·  ${trek.maxAltitude} ft`, 14, 92);

      doc.setFillColor(...forest);
      doc.rect(0, 96, W, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...white);
      doc.text('SUMMITSPHERE', 14, 101.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(190, 225, 205);
      doc.text(`OFFICIAL EXPEDITION FIELD MANUAL  ·  REF: ${trek._id?.slice(-8).toUpperCase() || 'SSPM'}`, 54, 101.5);

      const pillW = (W - 28 - 9) / 4;
      [
        { label: 'MAX ALTITUDE', value: `${trek.maxAltitude} ft` },
        { label: 'DURATION',     value: `${trek.duration} Days` },
        { label: 'DIFFICULTY',   value: trek.difficulty },
        { label: 'STATE',        value: trek.state.split(' ')[0] },
      ].forEach((s, i) => pill(14 + i * (pillW + 3), 108, pillW, s.label, s.value));

      let y = 135;
      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(13);
      doc.setTextColor(...ink);
      doc.text('The Expedition', 14, y);
      rule(y + 2);
      y += 10;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(80, 68, 52);
      const descText = trek.description || 'An unforgettable Himalayan adventure awaits.';
      const descLines = doc.splitTextToSize(descText, W - 28);
      doc.text(descLines, 14, y);
      y += descLines.length * 5.2 + 10;

      doc.setFont('helvetica', 'bolditalic');
      doc.setFontSize(13);
      doc.setTextColor(...ink);
      doc.text('At a Glance', 14, y);
      rule(y + 2);
      y += 10;

      const glances = [
        { label: 'ALTITUDE', text: `Peak altitude of ${trek.maxAltitude?.toLocaleString()} ft above sea level` },
        { label: 'DURATION', text: `${trek.duration}-day expedition — perfectly paced for acclimatisation` },
        { label: 'LOCATION', text: `Located in ${trek.state} — ${trek.startPoint ? `starting from ${trek.startPoint}` : 'accessible from major Himalayan base towns'}` },
        { label: 'GROUP',    text: trek.groupSize ? `Recommended group size: ${trek.groupSize}` : 'Small-batch groups for a premium experience' },
      ];

      const cardW = (W - 28 - 6) / 2;
      glances.forEach((g, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = 14 + col * (cardW + 6);
        const cy = y + row * 18;

        doc.setFillColor(...parchment);
        doc.roundedRect(cx, cy, cardW, 15, 2, 2, 'F');
        // Accent left border
        doc.setFillColor(...forest);
        doc.roundedRect(cx, cy, 2.5, 15, 1, 1, 'F');
        // Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...muted);
        doc.text(g.label, cx + 6, cy + 5);
        // Value text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...ink);
        const cardLines = doc.splitTextToSize(g.text, cardW - 10);
        doc.text(cardLines[0], cx + 6, cy + 11); // only first line to stay within card height
      });
      y += Math.ceil(glances.length / 2) * 18 + 6;

      if (trek.startPoint || trek.endPoint || trek.groupSize) {
        y += 4;
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(13);
        doc.setTextColor(...ink);
        doc.text('Trip Details', 14, y);
        rule(y + 2);
        y += 10;

        const details = [];
        if (trek.startPoint) details.push(['Start Point', trek.startPoint]);
        if (trek.endPoint)   details.push(['End Point',   trek.endPoint]);
        if (trek.groupSize)  details.push(['Group Size',  trek.groupSize]);

        // Two-column inline layout
        const detailColW = (W - 28 - 6) / 2;
        details.forEach((d, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const dx  = 14 + col * (detailColW + 6);
          const dy  = y + row * 13;

          doc.setFillColor(248, 245, 240);
          doc.roundedRect(dx, dy, detailColW, 11, 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(6.5);
          doc.setTextColor(...muted);
          doc.text(d[0].toUpperCase(), dx + 5, dy + 4.5);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...ink);
          doc.text(String(d[1]), dx + 5, dy + 9);
        });
      }

      doc.addPage();
      pageHeader('DAY-BY-DAY ITINERARY');

      const itinerary = Array.isArray(trek.itinerary) ? trek.itinerary : [];

      if (itinerary.length === 0) {
        let iy = 40;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(...muted);
        doc.text('Itinerary details pending.', 14, iy);
      } else {
        let iy = 36;
        itinerary.forEach((item, i) => {
          const title = typeof item === 'object' ? (item.title || `Stage ${i + 1}`) : `Stage ${i + 1}`;
          const desc  = typeof item === 'object' ? (item.description || '') : String(item);
          const rowH  = desc ? 22 : 14;

          // Check page overflow
          if (iy + rowH > H - 16) { doc.addPage(); pageHeader('DAY-BY-DAY ITINERARY (CONT.)'); iy = 36; }

          // Alternating row background
          if (i % 2 === 0) {
            doc.setFillColor(...parchment);
            doc.roundedRect(14, iy - 1, W - 28, rowH, 2, 2, 'F');
          }

          // Day badge
          doc.setFillColor(...forest);
          doc.roundedRect(14, iy, 18, 10, 2, 2, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(...white);
          doc.text(`Day ${i + 1}`, 23, iy + 7, { align: 'center' });

          // Title
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(...ink);
          doc.text(title, 36, iy + 7);

          // Description
          if (desc) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...muted);
            const dLines = doc.splitTextToSize(desc, W - 28 - 24);
            doc.text(dLines, 36, iy + 13);
            iy += rowH + 4;
          } else {
            iy += rowH;
          }
        });
      }


      doc.addPage();
      pageHeader('WHAT TO PACK');

      const packingList = [
        { cat: 'BAGS & HARDWARE',   items: ['65L rucksack (main)', '20L day pack', 'Head torch + spare batteries', 'Trekking poles', 'Water bottle (1L min)', 'Dry bags for electronics'] },
        { cat: 'CLOTHING',          items: ['2× quick-dry t-shirts', 'Upper & lower thermals', '2× trek trousers (no jeans)', '3× woollen socks', 'Thermal leggings'] },
        { cat: 'INSULATION',        items: ['Down jacket (rated -10°C)', 'Fleece mid-layer', 'Waterproof poncho / shell', 'Warm gloves + liner', 'Balaclava or buff gaiter'] },
        { cat: 'FOOTWEAR',          items: ['Waterproof ankle boots (broken in)', 'Camp sandals', 'Microspikes (snow mandatory)', 'Gaiters'] },
        { cat: 'SHELTER & SLEEP',   items: ['Sleeping bag (-10°C rated)', 'Sleeping mat', 'Emergency space blanket', 'Multi-tool / pocket knife'] },
        { cat: 'PERSONAL CARE',     items: ['SPF 50+ sunscreen', 'Lip balm', 'Insect repellent', 'Biodegradable soap', 'Quick-dry towel', 'Wet wipes'] },
        { cat: 'NAVIGATION & DOCS', items: ['Phone + offline maps', 'Power bank (20,000 mAh)', 'Whistle', 'Emergency contact card', 'ID / permit copies'] },
      ];

      let py = 36;
      packingList.forEach((section) => {
        if (py + 30 > H - 16) { doc.addPage(); pageHeader('WHAT TO PACK (CONT.)'); py = 36; }

        // Section header bar
        doc.setFillColor(...darkGreen);
        doc.roundedRect(14, py, W - 28, 10, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...white);
        doc.text(section.cat, 19, py + 7);
        py += 12;

        // Items in two columns
        const colW2 = (W - 28 - 6) / 2;
        section.items.forEach((item, ii) => {
          const col = ii % 2;
          const row = Math.floor(ii / 2);
          const ix  = 14 + col * (colW2 + 6);
          const iy2 = py + row * 9;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(...ink);
          // Bullet dot
          doc.setFillColor(...forest);
          doc.roundedRect(ix + 2, iy2 + 2, 2, 2, 0.5, 0.5, 'F');
          doc.text(item, ix + 7, iy2 + 5);
        });
        py += Math.ceil(section.items.length / 2) * 9 + 6;
      });

      doc.addPage();
      pageHeader('SAFETY & MEDICAL');

      autoTable(doc, {
        startY: 36,
        head: [['MEDICATION', 'PURPOSE']],
        body: [
          ['Diamox (125 mg)',       'AMS prevention. Take 12 hrs before ascent above 3000 m.'],
          ['Paracetamol / Crocin',  'Headache and mild fever at altitude. Max 3× daily.'],
          ['Combiflam / Ibuprofen', 'Anti-inflammatory for sprains. Avoid on empty stomach.'],
          ['Avomine',               'Motion sickness on mountain roads. Take 30 min before travel.'],
          ['Digene / Antacids',     'High-altitude acidity and indigestion. After meals.'],
          ['ORS Sachets ×6',        'Rehydration after heavy sweating. Mix in 1 L water.'],
          ['Betadine + Bandages',   'Wound cleaning and blister dressing.'],
          ['Volini / Moov Spray',   'Muscle cramps and joint pain. Topical only.'],
        ],
        headStyles: { fillColor: forest, textColor: white, fontSize: 9, fontStyle: 'bold', cellPadding: 5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 5, textColor: [70, 60, 45] },
        alternateRowStyles: { fillColor: parchment },
        columnStyles: { 0: { cellWidth: 44, fontStyle: 'bold', textColor: ink } },
        margin: { left: 14, right: 14, bottom: 14 },
        theme: 'striped',
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['EMERGENCY SCENARIO', 'REQUIRED ACTION']],
        body: [
          ['Acute Mountain Sickness', 'DESCEND 300 m immediately. Administer Diamox. Do not sleep at current altitude.'],
          ['Hypothermia',            'Shelter. Remove wet clothing. Add dry layers. Hot fluids. Share body heat.'],
          ['Zero Visibility',        'STOP. Shelter in place. Blow 3 whistle blasts every 3 min (universal SOS).'],
          ['Injury / Fracture',      'Immobilise. Do not move if spinal injury suspected. Signal for rescue.'],
          ['Getting Separated',      'Stay put. Whistle 3×. Open offline map. Move to open ground for visibility.'],
        ],
        headStyles: { fillColor: ink, textColor: white, fontSize: 9, fontStyle: 'bold', cellPadding: 5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 6, textColor: [70, 60, 45] },
        alternateRowStyles: { fillColor: parchment },
        columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold', textColor: [170, 25, 15] } },
        margin: { left: 14, right: 14, bottom: 14 },
        theme: 'striped',
      });

      doc.addPage();
      pageHeader('RESPONSIBLE TREKKING');

      const ethics = [
        ['Leave No Trace',   'Pack out ALL waste — food scraps, wrappers, batteries. Use designated toilet areas. Carry extra bags.'],
        ['Wildlife & Flora', 'Do not pick flowers or feed wildlife. Stay on marked trails to protect fragile alpine meadows.'],
        ['Water Sources',    'Keep a 50 m buffer from streams when washing. Use biodegradable soap only. No waste near water.'],
        ['Cultural Respect', 'Remove footwear at temples. Circle religious structures clockwise. Ask before photographing locals.'],
        ['Fire Safety',      'Open fires prohibited above treeline. Use stove only. Never leave fire unattended.'],
        ['Altitude Ethics',  'Yield to ascending trekkers. Horses and mules always have right of way on narrow paths.'],
        ['Noise & Light',    'Keep voices low at camp after 9 PM. Use red-light mode on headtorch to preserve night vision.'],
      ];

      let ey = 36;
      ethics.forEach((e, i) => {
        if (ey + 20 > H - 16) { doc.addPage(); pageHeader('RESPONSIBLE TREKKING (CONT.)'); ey = 36; }
        if (i % 2 === 0) {
          doc.setFillColor(...parchment);
          doc.roundedRect(14, ey - 1, W - 28, 19, 2, 2, 'F');
        }
        doc.setFillColor(...forest);
        doc.roundedRect(14, ey + 3, 3, 12, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...ink);
        doc.text(e[0], 20, ey + 7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...muted);
        const eLines = doc.splitTextToSize(e[1], W - 28 - 10);
        doc.text(eLines, 20, ey + 13);
        ey += 20;
      });

      const total = doc.internal.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        footer(i, total);
      }

      doc.save(`${trek.name.replace(/\s+/g, '_')}_Field_Manual.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        padding: '12px 18px', borderRadius: '12px', width: '100%',
        background: isGenerating ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.09)',
        color: isGenerating ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.14)',
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '11px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: isGenerating ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (!isGenerating) { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}}
      onMouseLeave={e => { e.currentTarget.style.background = isGenerating ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
    >
      {isGenerating
        ? <><Loader2 size={14} style={{ animation: 'spin 0.9s linear infinite' }} /> Generating...</>
        : <><FileText size={14} /> Download Field Manual</>
      }
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
};

export default TrekPDF;
