const DATA_URL = "https://raw.githubusercontent.com/openfootball/world-cup/master/2026/cup.json";

const dataLokalGrup = {
    'A': ['Meksiko', 'Afrika Selatan', 'Korea Selatan', 'Ceko'],
    'B': ['Kanada', 'Bosnia & Herz.', 'Qatar', 'Swiss'],
    'C': ['Brasil', 'Maroko', 'Swedia', 'Jamaika'],
    'D': ['Amerika Serikat', 'Paraguay', 'Ghana', 'Aljazair'],
    'E': ['Argentina', 'Arab Saudi', 'Irlandia', 'Australia'],
    'F': ['Prancis', 'Jepang', 'Kamerun', 'Ekuador'],
    'G': ['Jerman', 'Iran', 'Kosta Rika', 'Skotlandia'],
    'H': ['Spanyol', 'Tunisia', 'Cile', 'Selandia Baru'],
    'I': ['Inggris', 'Nigeria', 'Peru', 'Uzbekistan'],
    'J': ['Italia', 'Mesir', 'Kolombia', 'Kanada'],
    'K': ['Belgia', 'Uruguay', 'Senegal', 'Oman'],
    'L': ['Portugal', 'Kroasia', 'Maroko', 'Honduras']
};

let listSemuaPertandingan = [];

async function muatDataJadwal() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();
        renderJadwal(data.groups);
    } catch (error) {
        console.log("Mengaktifkan mode data lokal:", error.message);
        renderJadwalDariLokal();
    }
}

function renderJadwal(groupsFromApi) {
    const container = document.getElementById('fase-grup-container');
    container.innerHTML = "";
    let globalCounter = 1;

    groupsFromApi.forEach((g) => {
        const hurufGrup = g.name.replace("Group ", "");
        const daftarTim = g.teams;
        
        let htmlGrup = buatKotakGrupHeader(g.name, hurufGrup);

        g.matches.forEach((m) => {
            const jamWib = tentukanJamWib(globalCounter);
            const badgeTvri = dapatkanBadgeTvri(jamWib, globalCounter);
            
            htmlGrup += buatBarisPertandinganHTML(globalCounter, m.date, jamWib, m.team1, m.team2, hurufGrup, badgeTvri);
            
            listSemuaPertandingan.push({ id: globalCounter, team1: m.team1, team2: m.team2, grup: hurufGrup });
            globalCounter++;
        });

        htmlGrup += buatTabelKlasemenFooter(hurufGrup, daftarTim.map(t => t.name || t));
        container.innerHTML += htmlGrup;
    });
}

function tentukanJamWib(id) {
    const listJam = ["02:00", "05:00", "08:00", "21:00", "23:30"];
    return listJam[id % listJam.length];
}

function dapatkanBadgeTvri(jam, index) {
    if (jam === "02:00" || jam === "05:00") {
        return `<span class="badge badge-simulcast align-self-center ms-auto">SIMULCAST</span>`;
    }
    return index % 2 === 0 
        ? `<span class="badge badge-nasional align-self-center ms-auto">TVRI Nasional</span>` 
        : `<span class="badge badge-sport align-self-center ms-auto">TVRI Sport</span>`;
}

// Implementasi Elemen Struktur Grid dan Komponen Card Bootstrap 5
function buatKotakGrupHeader(namaGrup, huruf) {
    return `
        <div class="col-md-6">
            <div class="card bg-dark bg-opacity-20 border-secondary h-100 shadow-sm">
                <div class="card-header bg-dark bg-opacity-50 border-secondary d-flex justify-content-between py-2">
                    <span class="fw-bold text-info small">${namaGrup.toUpperCase()}</span>
                    <span class="badge bg-secondary text-uppercase align-self-center" style="font-size:9px">Grup</span>
                </div>
                <div class="card-body p-2 d-flex flex-column justify-content-between">
                    <div>`;
}

function buatBarisPertandinganHTML(id, tgl, jam, t1, t2, grup, badge) {
    return `
        <div class="d-flex align-items-center py-1 match-row">
            <div class="match-time text-truncate">${tgl} - ${jam}</div>
            <div class="match-team text-end text-truncate">${t1}</div>
            <div class="match-score-input mx-1"><input type="number" min="0" class="form-control form-control-sm text-center p-0 rounded shadow-sm" id="m-${id}-a" oninput="hitungPoinGrup('${grup}')"></div>
            <div class="text-muted small px-1">vs</div>
            <div class="match-score-input mx-1"><input type="number" min="0" class="form-control form-control-sm text-center p-0 rounded shadow-sm" id="m-${id}-b" oninput="hitungPoinGrup('${grup}')"></div>
            <div class="match-team text-start text-truncate">${t2}</div>
            ${badge}
        </div>`;
}

function buatTabelKlasemenFooter(grup, tims) {
    let footer = `
                    </div>
                    <table class="table table-dark table-striped table-sm mini-table m-0 mt-3 border-secondary">
                        <thead>
                            <tr>
                                <th class="border-secondary py-1 ps-2">Negara</th>
                                <th class="border-secondary text-center py-1 text-warning" style="width:75px">Poin</th>
                            </tr>
                        </thead>
                        <tbody>`;
    tims.forEach(tim => {
        footer += `
                            <tr>
                                <td class="ps-2 align-middle">${tim}</td>
                                <td class="text-center align-middle fw-bold text-warning" id="pts-${tim.replace(/\s+/g, '')}">0</td>
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
        const targetId = `pts-${tim.replace(/\s+/g, '')}`;
        const cell = document.getElementById(targetId);
        if (cell) cell.innerText = pointMap[tim];
    }
}

function renderJadwalDariLokal() {
    const dataTransform = Object.keys(dataLokalGrup).map(grupLetter => ({
        name: `Group ${grupLetter}`,
        teams: dataLokalGrup[grupLetter],
        matches: [
            { team1: dataLokalGrup[grupLetter][0], team2: dataLokalGrup[grupLetter][1], date: "12 Juni 2026" },
            { team1: dataLokalGrup[grupLetter][2], team2: dataLokalGrup[grupLetter][3], date: "13 Juni 2026" },
            { team1: dataLokalGrup[grupLetter][0], team2: dataLokalGrup[grupLetter][2], date: "17 Juni 2026" },
            { team1: dataLokalGrup[grupLetter][1], team2: dataLokalGrup[grupLetter][3], date: "18 Juni 2026" }
        ]
    }));
    renderJadwal(dataTransform);
}

window.onload = muatDataJadwal;
