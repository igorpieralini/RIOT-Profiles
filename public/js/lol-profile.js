var DDRAGON = CONFIG.API_URLS.DDRAGON + '/' + CONFIG.DDRAGON_VERSION;
var API_PROXY = CONFIG.API_URLS.PROXY;
var championsData = {};
var params = new URLSearchParams(window.location.search);
var summonerInput = params.get('summoner') || '';
var region = params.get('region') || 'br1';

var regionNames = {
    'br1': 'Brasil', 'na1': 'América do Norte', 'euw1': 'Europa Oeste',
    'eune1': 'Europa Leste', 'kr': 'Coréia', 'jp1': 'Japão', 'la1': 'LATAM Norte', 'la2': 'LATAM Sul'
};

// TAGS Padrões de Buscas
var commonTags = [
    'BR1', 'BR', 'BRUH', 'BRA', 'BRZL',
    '0000', '1234', '2381', '1111', '0001', '2222', '3333', '4444', '5555',
    '6666', '7777', '8888', '9999', '0123', '1000', '2000', '3000',
    'NA1', 'NA', 'EUW', 'LAN', 'LAS', 'KR', 'JP',
    'GG', 'LOL', 'RIOT', 'GAME', 'PRO', 'NOOB'
];

function generateNumericTags() {
    var tags = [];
    for (var i = 0; i <= 100; i++) {
        tags.push(String(i).padStart(4, '0'));
    }
    for (var i = 100; i <= 9999; i += 100) {
        tags.push(String(i).padStart(4, '0'));
    }
    return tags;
}

function showError(title, msg) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('error').style.display = 'block';
    document.getElementById('errorTitle').textContent = title;
    document.getElementById('errorMsg').textContent = msg;
}

function showProfile() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('profile').style.display = 'block';
}

function apiCall(action, params) {
    var queryParams = new URLSearchParams(params || {});
    queryParams.set('action', action);
    queryParams.set('region', region);
    queryParams.set('game', 'lol');
    
    return fetch(API_PROXY + '?' + queryParams.toString())
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.error) {
                return { error: true, code: data.code, message: data.message };
            }
            return { error: false, data: data.data };
        })
        .catch(function(e) {
            return { error: true, message: e.message };
        });
}

function formatNum(n) {
    return n >= 1000 ? (n/1000).toFixed(1) + 'K' : n;
}

function getChampName(id) {
    return championsData[id] ? championsData[id].name : 'Campeão ' + id;
}

function getChampImg(id) {
    var c = championsData[id];
    return c ? DDRAGON + '/img/champion/' + c.image : '';
}

function tryFindAccountBatch(gameName, tagsToTry, batchSize) {
    batchSize = batchSize || 5;
    var index = 0;
    
    function tryBatch() {
        if (index >= tagsToTry.length) {
            return Promise.reject(new Error('Jogador não encontrado. Digite o Riot ID completo (ex: ' + gameName + '#1234)'));
        }
        
        var batch = tagsToTry.slice(index, index + batchSize);
        document.getElementById('loading').querySelector('h2').textContent = 
            'Buscando ' + gameName + '... (' + Math.min(index + batchSize, tagsToTry.length) + '/' + tagsToTry.length + ' tentativas)';
        
        var promises = batch.map(function(tag) {
            return apiCall('account', { gameName: gameName, tagLine: tag })
                .then(function(res) {
                    if (res.error || !res.data || !res.data.puuid) return null;
                    return res;
                })
                .catch(function() { return null; });
        });
        
        return Promise.all(promises).then(function(results) {
            for (var i = 0; i < results.length; i++) {
                if (results[i] !== null) return results[i];
            }
            index += batchSize;
            return tryBatch();
        });
    }
    
    return tryBatch();
}

function loadProfile() {
    if (!summonerInput) {
        showError('Nome não informado', 'Digite o nome do jogador (ex: ScribowFire)');
        return;
    }

    var parts = summonerInput.split('#');
    var gameName = parts[0].trim();
    var tagLine = parts[1] ? parts[1].trim() : null;

    fetch(DDRAGON + '/data/pt_BR/champion.json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            for (var k in data.data) {
                var c = data.data[k];
                championsData[c.key] = { name: c.name, image: c.image.full };
            }
            
            if (tagLine) {
                return apiCall('account', { gameName: gameName, tagLine: tagLine });
            }
            var allTags = commonTags.concat(generateNumericTags());
            return tryFindAccountBatch(gameName, allTags, 5);
        })
        .then(function(res) {
            if (res.error || !res.data || !res.data.puuid) {
                throw new Error('Jogador não encontrado');
            }
            window.account = res.data;
            return apiCall('summoner', { puuid: res.data.puuid });
        })
        .then(function(res) {
            if (res.error || !res.data) throw new Error('Erro ao buscar summoner: ' + (res.message || JSON.stringify(res)));
            window.summoner = res.data;

            document.getElementById('name').textContent = window.account.gameName + '#' + window.account.tagLine;
            document.getElementById('level').textContent = 'Nível ' + (res.data.summonerLevel || '?');
            document.getElementById('region').textContent = regionNames[region] || region;
            
            // Ícone do invocador
            var iconId = res.data.profileIconId || 29;
            var iconUrl = DDRAGON + '/img/profileicon/' + iconId + '.png';
            
            var iconImg = document.getElementById('icon');
            iconImg.onerror = function() {
                this.src = DDRAGON + '/img/profileicon/29.png';
            };
            iconImg.src = iconUrl;
            
            document.title = window.account.gameName + ' - LOL';

            // Buscar ranked
            return apiCall('ranked', { puuid: res.data.puuid });
        })
        .then(function(res) {
            var solo = null;
            if (res.data && Array.isArray(res.data)) {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].queueType === 'RANKED_SOLO_5x5') solo = res.data[i];
                }
            }
            
            if (solo) {
                document.getElementById('tier').textContent = solo.tier;
                document.getElementById('rank').textContent = solo.rank;
                document.getElementById('lp').textContent = solo.leaguePoints + ' LP';
                document.getElementById('wins').textContent = solo.wins;
                document.getElementById('losses').textContent = solo.losses;
                var wr = ((solo.wins / (solo.wins + solo.losses)) * 100).toFixed(1);
                document.getElementById('winrate').textContent = wr + '%';
                document.getElementById('winrateBar').style.width = wr + '%';
                
                // Emblema de Ranked
                var rankImg = document.getElementById('rankIcon');
                if (rankImg) {
                    rankImg.src = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/' + solo.tier.toLowerCase() + '.png';
                }
            } else {
                document.getElementById('tier').textContent = 'Unranked';
                document.getElementById('rank').textContent = '';
                document.getElementById('lp').textContent = '0 LP';
            }
            return apiCall('mastery', { puuid: window.summoner.puuid, count: 5 });
        })
        .then(function(res) {
            var html = '';
            if (res.data && res.data.length) {
                for (var i = 0; i < res.data.length; i++) {
                    var m = res.data[i];
                    html += '<div class="champion-card">' +
                        '<img src="' + getChampImg(m.championId) + '">' +
                        '<div class="champion-info"><p class="champion-name">' + getChampName(m.championId) + '</p>' +
                        '<p class="champion-role">Maestria ' + m.championLevel + '</p></div>' +
                        '<span class="champion-rank">#' + (i+1) + '</span>' +
                        '<div class="champion-stat"><p class="champion-stat-label">Pontos</p>' +
                        '<p class="champion-stat-value">' + formatNum(m.championPoints) + '</p></div></div>';
                }
            } else {
                html = '<p style="color:var(--riot-text)">Sem dados de maestria</p>';
            }
            document.getElementById('champions').innerHTML = html;
            return apiCall('matches', { puuid: window.summoner.puuid, count: 5 });
        })
        .then(function(res) {
            if (!res.data || !res.data.length) {
                document.getElementById('matches').innerHTML = '<p style="color:var(--text-slate-400)">Sem partidas recentes</p>';
                showProfile();
                return;
            }
            var promises = res.data.map(function(id) {
                return apiCall('match', { matchId: id });
            });
            return Promise.all(promises);
        })
        .then(function(matchesData) {
            if (!matchesData) return;
            var html = '';
            for (var i = 0; i < matchesData.length; i++) {
                var m = matchesData[i];
                if (!m.data || !m.data.info) continue;
                var info = m.data.info;
                var p = null;
                for (var j = 0; j < info.participants.length; j++) {
                    if (info.participants[j].puuid === window.summoner.puuid) p = info.participants[j];
                }
                if (p) {
                    var kda = ((p.kills + p.assists) / Math.max(p.deaths, 1)).toFixed(1);
                    var dur = Math.floor(info.gameDuration / 60);
                    var champImg = DDRAGON + '/img/champion/' + p.championName + '.png';
                    html += '<div class="match-card ' + (p.win ? 'win' : 'loss') + '">' +
                        '<div class="match-result"><p class="match-result-text">' + (p.win ? '✓ VITÓRIA' : '✗ DERROTA') + '</p></div>' +
                        '<div class="match-details">' +
                        '<div style="display:flex;align-items:center;gap:12px;">' +
                        '<img src="' + champImg + '" style="width:48px;height:48px;border-radius:8px;border:2px solid ' + (p.win ? 'var(--accent-green)' : 'var(--primary-red)') + ';">' +
                        '<div><p class="match-champion">' + p.championName + '</p>' +
                        '<p class="match-kda">' + p.kills + '/' + p.deaths + '/' + p.assists + ' • KDA: ' + kda + '</p></div></div></div>' +
                        '<div class="match-score"><p class="match-score-value">' + (p.totalMinionsKilled + p.neutralMinionsKilled) + ' CS</p>' +
                        '<p style="font-size:0.8rem;color:var(--text-slate-400)">' + dur + 'min</p></div></div>';
                }
            }
            document.getElementById('matches').innerHTML = html || '<p style="color:var(--text-slate-400)">Sem partidas</p>';
            showProfile();
        })
        .catch(function(err) {
            showError('Erro', err.message || 'Não foi possível carregar os dados');
        });
}

document.addEventListener('DOMContentLoaded', loadProfile);
