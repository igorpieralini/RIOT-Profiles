// Usar proxy PHP (keys ficam no servidor)
var API_PROXY = CONFIG.API_URLS.PROXY;

var params = new URLSearchParams(window.location.search);
var playerName = params.get('player') || '';
var playerTag = params.get('tag') || '';
var region = params.get('region') || 'br';

var regionNames = {
    'br': 'Brasil',
    'na': 'América do Norte',
    'eu': 'Europa',
    'ap': 'Ásia-Pacífico',
    'kr': 'Coréia'
};

function showError(title, msg) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('error').style.display = 'flex';
    document.getElementById('errorTitle').textContent = title;
    document.getElementById('errorMsg').textContent = msg;
}

function showProfile() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('profile').style.display = 'block';
}

function fetchApi(action, params) {
    var queryParams = new URLSearchParams(params || {});
    queryParams.set('action', action);
    queryParams.set('region', region);
    queryParams.set('game', 'valorant');
    queryParams.set('name', playerName);
    queryParams.set('tag', playerTag);
    
    return fetch(API_PROXY + '?' + queryParams.toString())
        .then(function(r) { 
            if (!r.ok) throw new Error('API Error: ' + r.status);
            return r.json(); 
        })
        .then(function(data) {
            if (data.error) {
                return { error: true, message: data.message || 'Erro na API' };
            }
            return { error: false, data: data.data };
        })
        .catch(function(e) {
            return { error: true, message: e.message };
        });
}

function loadProfile() {
    if (!playerName || !playerTag) {
        showError('Dados incompletos', 'Informe o nome e tag do jogador');
        return;
    }

    var accountPromise = fetchApi('account');
    var mmrPromise = fetchApi('mmr');
    var matchesPromise = fetchApi('matches', { size: 5 });

    Promise.all([accountPromise, mmrPromise, matchesPromise])
        .then(function(results) {
            var account = results[0];
            var mmr = results[1];
            var matches = results[2];

            if (account.error) {
                throw new Error('Jogador não encontrado: ' + account.message);
            }

            var acc = account.data;
            document.getElementById('name').textContent = acc.name + '#' + acc.tag;
            document.getElementById('level').textContent = 'Nível ' + (acc.account_level || '?');
            document.getElementById('region').textContent = regionNames[acc.region] || acc.region;
            document.title = acc.name + ' - Valorant';

            if (acc.card && acc.card.small) {
                document.getElementById('playerCard').src = acc.card.small;
            }

            if (!mmr.error && mmr.data && mmr.data.current_data) {
                var ranked = mmr.data.current_data;
                document.getElementById('tier').textContent = ranked.currenttierpatched || 'Unranked';
                document.getElementById('rr').textContent = (ranked.ranking_in_tier || 0) + ' RR';
                
                if (ranked.images && ranked.images.small) {
                    document.getElementById('rankIcon').src = ranked.images.small;
                }

                // Stats do MMR
                if (mmr.data.wins !== undefined) {
                    document.getElementById('wins').textContent = mmr.data.wins || 0;
                }
            } else {
                document.getElementById('tier').textContent = 'Unranked';
                document.getElementById('rr').textContent = '0 RR';
            }

            if (!matches.error && matches.data && matches.data.length > 0) {
                var wins = 0, losses = 0, kills = 0, deaths = 0, assists = 0;
                var agentStats = {};

                matches.data.forEach(function(match) {
                    var player = null;
                    var allPlayers = match.players.all_players || [];
                    
                    for (var i = 0; i < allPlayers.length; i++) {
                        if (allPlayers[i].name.toLowerCase() === playerName.toLowerCase() && 
                            allPlayers[i].tag.toLowerCase() === playerTag.toLowerCase()) {
                            player = allPlayers[i];
                            break;
                        }
                    }

                    if (player) {
                        kills += player.stats.kills;
                        deaths += player.stats.deaths;
                        assists += player.stats.assists;

                        // Verificar vitória
                        var playerTeam = player.team.toLowerCase();
                        var teamWon = false;
                        
                        if (match.teams) {
                            if (playerTeam === 'red' && match.teams.red && match.teams.red.has_won) teamWon = true;
                            if (playerTeam === 'blue' && match.teams.blue && match.teams.blue.has_won) teamWon = true;
                        }

                        if (teamWon) wins++;
                        else losses++;

                        // Estatísticas por agente
                        var agent = player.character;
                        if (!agentStats[agent]) {
                            agentStats[agent] = { games: 0, kills: 0, deaths: 0, assists: 0, img: player.assets.agent.small };
                        }
                        agentStats[agent].games++;
                        agentStats[agent].kills += player.stats.kills;
                        agentStats[agent].deaths += player.stats.deaths;
                        agentStats[agent].assists += player.stats.assists;
                    }
                });

                // Atualizar stats
                document.getElementById('wins').textContent = wins;
                document.getElementById('losses').textContent = losses;
                
                var wr = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : 0;
                document.getElementById('winrate').textContent = wr + '%';
                
                var kd = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
                document.getElementById('kd').textContent = kd;

                // Renderizar agentes
                renderAgents(agentStats);

                // Renderizar partidas
                renderMatches(matches.data);
            } else {
                document.getElementById('agents').innerHTML = '<p style="color:var(--riot-text)">Sem dados de agentes</p>';
                document.getElementById('matches').innerHTML = '<p style="color:var(--riot-text)">Sem partidas recentes</p>';
            }

            showProfile();
        })
        .catch(function(err) {
            showError('Erro ao carregar', err.message);
        });
}

function renderAgents(agentStats) {
    var agents = Object.keys(agentStats).map(function(name) {
        var stats = agentStats[name];
        stats.name = name;
        stats.kd = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills.toFixed(2);
        return stats;
    });

    // Ordenar por jogos
    agents.sort(function(a, b) { return b.games - a.games; });

    var html = '';
    agents.slice(0, 5).forEach(function(agent, i) {
        html += '<div class="agent-card">' +
            '<img src="' + agent.img + '" alt="' + agent.name + '">' +
            '<div class="agent-info">' +
            '<p class="agent-name">' + agent.name + '</p>' +
            '<p class="agent-role">' + agent.games + ' partidas</p>' +
            '</div>' +
            '<div class="agent-stat">' +
            '<p class="agent-stat-label">K/D</p>' +
            '<p class="agent-stat-value">' + agent.kd + '</p>' +
            '</div>' +
            '</div>';
    });

    document.getElementById('agents').innerHTML = html || '<p style="color:var(--riot-text)">Sem dados</p>';
}

function renderMatches(matchesData) {
    var html = '';

    matchesData.forEach(function(match) {
        var player = null;
        var allPlayers = match.players.all_players || [];
        
        for (var i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i].name.toLowerCase() === playerName.toLowerCase() && 
                allPlayers[i].tag.toLowerCase() === playerTag.toLowerCase()) {
                player = allPlayers[i];
                break;
            }
        }

        if (!player) return;

        var playerTeam = player.team.toLowerCase();
        var teamWon = false;
        var isDraw = false;
        var score = '-';

        if (match.teams) {
            var redScore = match.teams.red ? match.teams.red.rounds_won : 0;
            var blueScore = match.teams.blue ? match.teams.blue.rounds_won : 0;
            
            if (playerTeam === 'red') {
                teamWon = match.teams.red && match.teams.red.has_won;
                score = redScore + ' - ' + blueScore;
            } else {
                teamWon = match.teams.blue && match.teams.blue.has_won;
                score = blueScore + ' - ' + redScore;
            }

            if (redScore === blueScore) isDraw = true;
        }

        var resultClass = isDraw ? 'draw' : (teamWon ? 'win' : 'loss');
        var resultText = isDraw ? '⚖️ EMPATE' : (teamWon ? '✓ VITÓRIA' : '✗ DERROTA');

        var kda = player.stats.kills + '/' + player.stats.deaths + '/' + player.stats.assists;
        var kdaRatio = ((player.stats.kills + player.stats.assists) / Math.max(player.stats.deaths, 1)).toFixed(1);
        var acs = Math.round(player.stats.score / (match.metadata.rounds_played || 1));
        var map = match.metadata.map || 'Unknown';

        html += '<div class="match-card ' + resultClass + '">' +
            '<div class="match-result"><p class="match-result-text">' + resultText + '</p></div>' +
            '<div class="match-details">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
            '<img src="' + player.assets.agent.small + '" style="width:40px;height:40px;border-radius:6px;">' +
            '<div>' +
            '<p class="match-agent">' + player.character + '</p>' +
            '<p class="match-kda">' + kda + ' • KDA: ' + kdaRatio + '</p>' +
            '<p class="match-map">' + map + '</p>' +
            '</div></div></div>' +
            '<div class="match-score">' +
            '<p class="match-score-value">' + score + '</p>' +
            '<p class="match-acs">' + acs + ' ACS</p>' +
            '</div></div>';
    });

    document.getElementById('matches').innerHTML = html || '<p style="color:var(--riot-text)">Sem partidas</p>';
}

// Iniciar
document.addEventListener('DOMContentLoaded', loadProfile);
