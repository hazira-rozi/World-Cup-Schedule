const DATA_URL = "https://raw.githubusercontent.com/openfootball/world-cup/master/2026/cup.json";

// Database Cadangan 12 Grup Komplit (Format Baru 48 Negara)
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

// Konstruksi Struktur Data Lengkap Fase Gugur dari Babak 32 Besar Hingga Final Grand
const dataFaseGugur = [
    { babak: "R32 - MATCH 73", t1: "Juara Grup A", t2: "Peringkat 3 C/D", tgl: "28 Jun", jam: "02:00" },
    { babak: "R32 - MATCH 74", t1: "Juara Grup B", t2: "Runner-up Grup F", tgl: "28 Jun", jam: "08:00" },
    { babak: "R32 - MATCH 75", t1: "Juara Grup C", t2: "Peringkat 3 A/B", tgl: "29 Jun", jam: "05:00" },
    { babak: "R32 - MATCH 76", t1: "Juara Grup D", t2: "Runner-up Grup E", tgl: "29 Jun", jam: "21:00" },
    
    { babak: "R16 - MATCH 89", t1: "Pemenang M73", t2: "Pemenang M74", tgl: "04 Jul", jam: "02:00" },
    { babak: "R16 - MATCH 90", t1: "Pemenang M75", t2: "Pemenang M76", tgl: "04 Jul", jam: "05:00" },
    { babak: "R16 - MATCH 91", t1: "Pemenang M77", t2: "Pemenang M78", tgl: "05 Jul", jam: "02:00" },
    { babak: "R16 - MATCH 92", t1: "Pemenang M79", t2: "Pemenang M80", tgl: "05 Jul", jam: "21:00" },
    
    { babak: "QUARTER FINAL - M97", t1: "Pemenang M89", t2: "Pemenang M90", tgl: "10 Jul", jam: "02:00" },
    { babak: "QUARTER FINAL - M98", t1: "Pemenang M91", t2: "Pemenang M92", tgl: "10 Jul", jam: "08:00" },
    { babak: "QUARTER FINAL - M99", t1: "Pemenang M93", t2: "Pemenang M94", tgl: "11 Jul", jam: "05:00" },
    { babak: "QUARTER FINAL - M100", t1: "Pemenang M95", t2: "Pemenang M96", tgl: "11 Jul", jam: "21:00" },
    
    { babak: "SEMI FINAL - M101", t1: "Pemenang M97", t2: "Pemenang M98", tgl: "15 Jul", jam: "02:00" },
    { babak: "SEMI FINAL - M102", t1: "Pemenang M99", t2: "Pemenang M100", tgl: "16 Jul", jam: "02:00" },
    
    { babak: "BRONZE FINAL (PLACE 3)", t1: "Kalah M101", t2: "Kalah M102", tgl: "18 Jul", jam: "05:00" },
    { babak: "WORLD CUP FINAL", t1: "Pemenang M101", t2: "Pemenang M102", tgl: "19 Jul", jam: "02:00" }
];

let listSemuaPertandingan = [];

async function inisialisasiTracker() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("Gagal mengambil data API");
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
            
            html += `
                <tr>
                    <td class="col-tgl">${m.date || "12 Jun"} - ${jam}</td>
                    <td class="col-match text-truncate">${m.team1} vs ${m.team2}</td>
                    <td class="col-skor">
                        <div class="skor-container">
                            <input type="number" min="0" class="input-skor" id="m-${matchId}-a" oninput="hitungPoinGrup('${huruf}')">
                            <input type="number" min="0" class="input-skor" id="m-${matchId}-b" oninput="hitungPoinGrup('${huruf}')">
                        </div>
                    </td>
                    <td class="col-tv">${badgeTv}</td>
                </tr>`;
            
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
                <div class="card card-ko h-100 shadow-sm">
                    <div class="card-header ko-title py-1 px-2 d-flex justify-content-between align-items-center">
                        <span>${ko.babak}</span>
                        <span>${ko.tgl} - ${ko.jam} WIB</span>
                    </div>
                    <div class="card-body p-2">
                        <table class="table table-dark table-ko">
                            <tr>
                                <td class="text-start text-truncate" style="max-width:120px;">${ko.t1}</td>
                                <td style="width:30px; padding:2px;"><input type="number" min="0" class="input-skor w-100"></td>
                            </tr>
                            <tr>
                                <td class="text-start text-truncate" style="max-width:120px;">${ko.t2}</td>
                                <td style="width:30px; padding:2px;"><input type="number" min="0" class="input-skor w-100"></td>
                            </tr>
                        </table>
                    </div>
                    <div class="card-footer py-1 px-2 border-0 text-end">${badgeTv}</div>
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
        return `<span class="badge-tv chan-simulcast">SIMULCAST</span>`;
    }
    return index % 2 === 0 
        ? `<span class="badge-tv chan-nasional">TVRI NASIONAL</span>` 
        : `<span class="badge-tv chan-sport">TVRI SPORT</span>`;
}

function buatCardGrupHeader(namaGrup) {
    return `
        <div class="col-md-6 col-xl-4">
            <div class="card bg-dark bg-opacity-10 border-secondary h-100 shadow-sm">
                <div class="card-header bg-dark bg-opacity-40 border-secondary py-1 px-2 fw-bold text-warning small text-uppercase">
                    ${namaGrup}
                </div>
                <div class="card-body p-0 d-flex flex-column justify-content-between">
                    <table class="table table-dark table-striped table-jadwal">
                        <tbody>`;
}

function buatTabelKlasemenFooter(grup, tims) {
    let footer = `
                        </tbody>
                    </table>
                    <table class="table table-dark table-striped table-sm mini-table m-0 border-top border-secondary">
                        <thead>
                            <tr>
                                <th class="ps-2 py-1">Negara Pool ${grup}</th>
                                <th class="text-center py-1 text-warning" style="width:45px">Poin</th>
                            </tr>
                        </thead>
                        <tbody>`;
    tims.forEach(tim => {
        footer += `
                            <tr>
                                <td class="ps-2 py-0.5 align-middle text-truncate" style="max-width:150px;">${tim}</td>
                                <td class="text-pts py-0.5 align-middle" id="pts-${grup}-${tim.replace(/\s+/g, '')}">0</td>
                            </tr>`;
    });
    footer += `</tbody></table></div></div></div>`;
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
            { team1: dataLokalGrup[grupLetter][0], team2: dataLokalGrup[grupLetter][1], date: "12 Jun" },
            { team1: dataLokalGrup[grupLetter][2], team2: dataLokalGrup[grupLetter][3], date: "13 Jun" },
            { team1: dataLokalGrup[grupLetter][0], team2: dataLokalGrup[grupLetter][2], date: "17 Jun" },
            { team1: dataLokalGrup[grupLetter][1], team2: dataLokalGrup[grupLetter][3], date: "18 Jun" }
        ]
    }));
    renderFaseGrup(dataTransform);
}

window.onload = function() {
    inisialisasiTracker();
};
