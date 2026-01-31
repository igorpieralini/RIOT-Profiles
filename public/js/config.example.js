/**
 * RTG - Configurações do Cliente
 * 
 * As API keys agora ficam no servidor (src/config.php)
 * Este arquivo contém apenas configurações públicas
 */

var CONFIG = {
    // Data Dragon Version (assets do LOL)
    // Veja versões em: https://ddragon.leagueoflegends.com/api/versions.json
    DDRAGON_VERSION: '15.2.1',

    // URLs públicas (sem keys)
    API_URLS: {
        DDRAGON: 'https://ddragon.leagueoflegends.com/cdn',
        PROXY: '../src/api-proxy.php'
    }
};
