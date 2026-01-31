<?php

$API_KEY = 'RGAPI-0273f1bf-d5dc-4d76-9a43-c43332bfe6ea';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$regionToApi = [
    'br1' => ['platform' => 'br1.api.riotgames.com', 'regional' => 'americas.api.riotgames.com'],
    'na1' => ['platform' => 'na1.api.riotgames.com', 'regional' => 'americas.api.riotgames.com'],
    'euw1' => ['platform' => 'euw1.api.riotgames.com', 'regional' => 'europe.api.riotgames.com'],
    'eune1' => ['platform' => 'eun1.api.riotgames.com', 'regional' => 'europe.api.riotgames.com'],
    'kr' => ['platform' => 'kr.api.riotgames.com', 'regional' => 'asia.api.riotgames.com'],
    'jp1' => ['platform' => 'jp1.api.riotgames.com', 'regional' => 'asia.api.riotgames.com'],
    'la1' => ['platform' => 'la1.api.riotgames.com', 'regional' => 'americas.api.riotgames.com'],
    'la2' => ['platform' => 'la2.api.riotgames.com', 'regional' => 'americas.api.riotgames.com'],
];

function fetchRiotApi($url, $apiKey) {
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "X-Riot-Token: $apiKey\r\nAccept: application/json\r\n",
            'ignore_errors' => true,
            'timeout' => 30
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ];
    
    $context = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);
    
    $httpCode = 0;
    if (isset($http_response_header[0])) {
        preg_match('/HTTP\/\d+\.\d+\s+(\d+)/', $http_response_header[0], $matches);
        $httpCode = isset($matches[1]) ? (int)$matches[1] : 0;
    }
    
    if ($response === false) {
        return ['error' => true, 'message' => 'Falha na requisição', 'code' => 500];
    }
    
    return [
        'error' => $httpCode >= 400,
        'code' => $httpCode,
        'data' => json_decode($response, true)
    ];
}

// Parâmetros
$action = $_GET['action'] ?? '';
$region = $_GET['region'] ?? 'br1';
$gameName = $_GET['gameName'] ?? '';
$tagLine = $_GET['tagLine'] ?? '';
$puuid = $_GET['puuid'] ?? '';
$summonerId = $_GET['summonerId'] ?? '';
$matchId = $_GET['matchId'] ?? '';
$count = $_GET['count'] ?? 5;

if (!isset($regionToApi[$region])) {
    echo json_encode(['error' => true, 'message' => 'Região inválida']);
    exit;
}

$platform = $regionToApi[$region]['platform'];
$regional = $regionToApi[$region]['regional'];

switch ($action) {
    case 'account':
        if (!$gameName || !$tagLine) {
            echo json_encode(['error' => true, 'message' => 'Nome e tag são obrigatórios']);
            exit;
        }
        $url = "https://{$regional}/riot/account/v1/accounts/by-riot-id/" . urlencode($gameName) . "/" . urlencode($tagLine);
        break;
    
    case 'account-by-puuid':
        if (!$puuid) {
            echo json_encode(['error' => true, 'message' => 'PUUID é obrigatório']);
            exit;
        }
        $url = "https://{$regional}/riot/account/v1/accounts/by-puuid/{$puuid}";
        break;
        
    case 'summoner':
        if (!$puuid) {
            echo json_encode(['error' => true, 'message' => 'PUUID é obrigatório']);
            exit;
        }
        $url = "https://{$platform}/lol/summoner/v4/summoners/by-puuid/{$puuid}";
        break;
        
    case 'ranked':
        if (!$summonerId) {
            echo json_encode(['error' => true, 'message' => 'Summoner ID é obrigatório']);
            exit;
        }
        $url = "https://{$platform}/lol/league/v4/entries/by-summoner/{$summonerId}";
        break;
        
    case 'mastery':
        if (!$puuid) {
            echo json_encode(['error' => true, 'message' => 'PUUID é obrigatório']);
            exit;
        }
        $url = "https://{$platform}/lol/champion-mastery/v4/champion-masteries/by-puuid/{$puuid}/top?count={$count}";
        break;
        
    case 'matches':
        if (!$puuid) {
            echo json_encode(['error' => true, 'message' => 'PUUID é obrigatório']);
            exit;
        }
        $url = "https://{$regional}/lol/match/v5/matches/by-puuid/{$puuid}/ids?start=0&count={$count}";
        break;
        
    case 'match':
        if (!$matchId) {
            echo json_encode(['error' => true, 'message' => 'Match ID é obrigatório']);
            exit;
        }
        $url = "https://{$regional}/lol/match/v5/matches/{$matchId}";
        break;
        
    default:
        echo json_encode(['error' => true, 'message' => 'Ação inválida']);
        exit;
}

$result = fetchRiotApi($url, $API_KEY);
echo json_encode($result);
