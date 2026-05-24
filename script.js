// Jalur API data olahraga terbuka global
const DATA_URL = "https://raw.githubusercontent.com/openfootball/world-cup/master/2026/cup.json";

// Data Lokal Terstruktur untuk 12 Grup Utama (48 Negara)
const dataLokalGrup = {
    'A': ['Meksiko', 'Afrika Selatan', 'Korea Selatan', 'Ceko'],
    'B': ['Kanada', 'Bosnia & H.', 'Qatar', 'Swiss'],
    'C': ['Brasil', 'Maroko', 'Swedia', 'Jamaika'],
    'D': ['Amerika S.', 'Paraguay', 'Ghana', 'Aljazair'],
    'E': ['Argentina', 'Arab Saudi', 'Irlandia', 'Australia'],
    'F': ['Prancis', 'Jepang', 'Kamerun', 'Ekuador'],
    'G': ['Jerman', 'Iran', 'Kosta Rika', 'Skotlandia'],
    'H': ['Spanyol', 'Tunisia', 'Cile', 'Selandia Baru'],
    'I': ['Inggris', 'Nigeria', 'Peru', 'Uzbekistan'],
    'J': ['Italia', 'Mesir', 'Kolombia', 'Wales'],
    'K': ['Belgia', 'Uruguay', 'Senegal', 'Oman'],
    'L': ['Portugal', 'Kroasia', 'Ukraina', 'Honduras']
};

// Struktur Data Konstruksi Lengkap Fase Gugur (M32 s.d Final)
const dataFaseGugur = [
    { babak: "ROUND OF 32 - M73", t1: "Juara Grup A", t2: "Peringkat 3 C/D", tgl: "28 Juni 2026", jam: "02:00" },
    { babak: "ROUND OF 32 - M74", t1: "Juara Grup B", t2: "Runner-up Grup F", tgl: "28 Juni 2026", jam: "08:00" },
    { babak: "ROUND OF 16 - M89", t1: "Pemenang M73", t2: "Pemenang M74", tgl: "04 Juli 2026", jam: "02:00" },
    { babak: "ROUND OF 16 - M90", t1: "Pemenang M75", t2: "Pemenang M76", tgl: "04 Juli 2026", jam: "05:00" },
    { babak: "QUARTER FINALS - M97", t1: "Pemenang M89", t2: "Pemenang M90", tgl: "10 Juli 2026", jam: "02:00" },
    { babak: "QUARTER FINALS - M98", t1: "Pemenang M91", t2: "Pemenang M92", tgl: "10 Juli 2026", jam: "08:00" },
    { babak: "SEMI FINALS - M101", t1: "Pemenang M97", t2: "Pemenang M98", tgl: "15 Juli 2026", jam: "02:00" },
    { babak: "SEMI FINALS - M102", t1: "Pemenang M99", t2: "Pemenang M100", tgl: "16 Juli 2026", jam: "02:00" },
    { babak: "BRONZE FINAL (PLACE 3)", t1: "Kalah M101", t2: "Kalah M102", tgl: "18 Juli 2026", jam: "05:00" },
    { babak: "WORLD CUP FINAL", t1: "Pemenang M101", t2: "Pemenang M102", tgl: "19 Juli 2026", jam: "02:00" }
];

let listSemuaPertandingan = [];

async function inisialisasiTracker() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("Gagal mengunduh API");
        const data = await response.json();
        renderFaseGrup(data.groups);
    } catch (e) {
        renderFaseGrupLokal();
    }
    renderFaseGugurKomplit();
}

function renderFaseGrup(groupsFromApi) {
    const container = document.getElementById('fase-grup-container');
    container.innerHTML = "";
    let matchId = 1;

    groupsFromApi.forEach((g) => {
        const huruf = g.name.replace("Group ", "");
        const tims = g.teams.map(t => t.name || t);
        
        let html = buatCardGrupHeader(g.name);

        g.matches.forEach((m) => {
            const jam = tentukanJamWib(matchId);
            const badgeTv = dapatkanKanalTvri(jam, matchId);
            html += buatBarisPertandinganHTML(matchId, m.date, jam, m.team1, m.team2, huruf, badgeTv);
            
            listSemuaPertandingan.push({ id: matchId, team1: m.team1, team2: m.team2, grup: huruf });
            matchId++;
        });

        html += buatTabelKlasemenFooter(huruf, tims);
        container.innerHTML += html;
    });
}

function renderFaseGugurKomplit() {
    const container = document.getElementById('fase-gugur-container');
    container.innerHTML = "";
    
    dataFaseGugur.forEach((ko, index) => {
        const badgeTv = dapatkanKanalTvri(ko.jam, index);
        const htmlNode = `
            <div class="col-sm-6 col-md-4 col-xl-3">
                <div class="card card-knockout shadow-sm h-100">
                    <div class="card-header ko-header py-1 px-2 d-flex justify-content-between align-items-center">
                        <span>${ko.babak}</span>
                        ${badgeTv}
                    </div>
                    <div class="card-body p-2">
                        <div class="d-flex align-items-center justify-content-between mb-1">
                            <span class="small fw-semibold text-truncate text-start" style="max-width:130px;">${ko.t1}</span>
                            <div class="match-score-box"><input type="number" min="0" class="form-control form-control-sm"></div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="small fw-semibold text-truncate text-start" style="max-width:130px;">${ko.t2}</span>
                            <div class="match-score-box"><input type="number" min="0" class="form-control form-control-sm"></div>
                        </div>
                    </div>
                    <div class="card-footer ko-footer py-1 px-2 bg-transparent border-0 border-top border-dark text-end">
                        ${ko.tgl} - ${ko.jam} WIB
                    </div>
                </div>
            </div>`;
        container.innerHTML += htmlNode;
    });
}

function tentukanJamWib(id) {
    const listJam = ["02:00", "05:00", "08:00", "21:00", "23:30"];
    return listJam[id % listJam.length];
}

function dapatkanKanalTvri(jam, index) {
    if (jam === "02:00" || jam === "05:00") {
        return `<span class="badge-chan bg-simulcast">TVRI / SPORT</span>`;
    }
    return index % 2 === 0 
        ? `<span class="badge-chan bg-nasional">TVRI Nasional</span>` 
        : `<span class="badge-chan bg-sport">TVRI Sport</span>`;
}

function buatCardGrupHeader(namaGrup) {
    return `
        <div class="col-xl-6 col-xxl-4">
            <div class="card bg-dark bg-opacity-20 border-secondary h-100 shadow-sm">
                <div class="card-header bg-dark bg-opacity-40 border-secondary py-1 px-2">
                    <span class="fw-bold text-warning small">${namaGrup.toUpperCase()}</span>
                </div>
                <div class="card-body p-2 d-flex flex-column justify-content-between">
                    <div>`;
}

function buatBarisPertandinganHTML(id, tgl, jam, t1, t2, grup, badge) {
    return `
        <div class="d-flex align-items-center match-row px-1">
            <div class="match-time">${tgl} - ${jam}</div>
            <div class="match-team-left ms-auto">${t1}</div>
            <div class="match-score-box mx-1"><input type="number" min="0" id="m-${id}-a" oninput="hitungPoinGrup('${grup}')"></div>
            <div class="match-vs-label">vs</div>
            <div class="match-score-box mx-1"><input type="number" min="0" id="m-${id}-b" oninput="hitungPoinGrup('${grup}')"></div>
            <div class="match-team-right me-auto">${t2}</div>
            ${badge}
        </div>`;
}

function buatTabelKlasemenFooter(grup, tims) {
    let footer = `
                    </div>
                    <table class="table table-dark table-striped table-sm mini-table m-0 mt-2 border-secondary shadow-sm">
                        <thead>
                            <tr>
                                <th class="border-secondary py-0.5 ps-2">Team Group ${grup}</th>
                                <th class="border-secondary text-center py-0.5 text-warning" style="width:50px">Pts</th>
                            </tr>
                        </thead>
                        <tbody>`;
    tims.forEach(tim => {
        footer += `
                            <tr>
                                <td class="ps-2 align-middle py-0.5">${tim}</td>
                                <td class="text-center align-middle fw-bold text-warning py-0.5" id="pts-${grup}-${tim.replace(/\s+/g, '')}">0</td>
                            </tr>`;
    });
    footer += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    return footer;
}

function hitungPoinGrup(grup) {
    let pointMap = {};
    listSemuaPertandingan.forEach((match) => {
        if (match.grup !== grup) return;

        const val1 = parseInt(document.getElementById(`m-${match.id}-a`).value);
        const val2 = parseInt(document.getElementById(`m-${match.id}-b`).value);

        if (!pointMap[match.team1]) pointMap[match.team1] = 0;
        if (!pointMap[match.team2]) pointMap[match.team2] = 0;

        if (!isNaN(val1) && !isNaN(val2)) {
            if (val1 > val2) pointMap[match.team1] += 3;
            else if (val1 < val2) pointMap[match.team2] += 3;
            else { pointMap[match.team1] += 1; pointMap[match.team2] += 1; }
        }
    });

    for (let tim in pointMap) {
        const targetId = `pts-${grup}-${tim.replace(/\s+/g, '')}`;
        const cell = document.getElementById(targetId);
        if (cell) cell.innerText = pointMap[tim];
    }
}

function renderFaseGrupLokal() {
    const dataTransform = Object.keys(dataLokalGrup).map(grupLetter => ({
        name: `Group ${grupLetter}`,
        teams: dataLokalGrup[grupLetter],
        matches: [
            { team1: dataLokalGrup[grupLetter][0], team2: dataLokalGrup[grupLetter][1], date: "12 Juni 2026" },
            { team1: dataLokalGrup[grupLetter][2], team2: dataLokalGrup[grupLetter][3], date: "13 Juni 2026" }
        ]
    }));
    renderFaseGrup(dataTransform);
}

function cekStatusFaseTurnamen() {
    const waktuSekarang = new Date();
    const batasFaseGrup = new Date("2026-06-27T23:59:59");
    const sectionGugur = document.getElementById('fase-gugur-section');
    
    if (sectionGugur && waktuSekarang > batasFaseGrup) {
        sectionGugur.classList.add('fase-gugur-active');
        setTimeout(() => {
            sectionGugur.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 800);
    }
}

window.onload = function() {
    inisialisasiTracker().then(() => {
        setTimeout(cekStatusFaseTurnamen, 1200);
    });
};
