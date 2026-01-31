# 🎮 RIOT Profiles

Aplicação web para consulta de perfis de **League of Legends** e **Valorant**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)

---

## ✨ Funcionalidades

### League of Legends
- 🏆 Rank e divisão (Solo/Duo e Flex)
- 👤 Ícone de invocador e nível
- 🎯 Top 3 campeões com maestria
- 📊 Histórico de partidas ranqueadas

### Valorant
- 🏆 Rank competitivo e RR
- 👤 Card do jogador e nível
- 🎯 Top agentes jogados
- 📊 Histórico de partidas com KDA

---

## 📁 Estrutura do Projeto

```
RTG/
├── public/                         # Front-end
│   ├── index.html                  # Página inicial
│   ├── assets/
│   │   └── icons/
│   │       └── favicon.svg         # Ícone do site
│   ├── css/
│   │   ├── theme.css               # Variáveis de cores
│   │   ├── base.css                # Reset e estilos globais
│   │   ├── index.css               # Estilos da home
│   │   ├── lol-profile.css         # Estilos LOL
│   │   └── valorant-profile.css    # Estilos Valorant
│   ├── js/
│   │   ├── app.js                  # Script da home
│   │   ├── lol-profile.js          # Script LOL
│   │   └── valorant-profile.js     # Script Valorant
│   └── pages/
│       ├── lol.html                # Página de perfil LOL
│       └── valorant.html           # Página de perfil Valorant
├── src/
│   └── riot-proxy.php              # Proxy PHP (opcional)
├── start-server.bat                # Script para iniciar servidor
└── README.md
```

---

## 🚀 Como Usar

### Pré-requisitos

- **PHP 8.0+** instalado ([Download](https://www.php.net/downloads))

### Instalação do PHP (Windows)

A forma mais fácil é usar o **WinGet**:

```powershell
winget install PHP.PHP.8.3
```

Ou baixe manualmente em https://windows.php.net/download/

### Configuração das API Keys

1. Copie o arquivo de exemplo:
   ```bash
   cp public/js/config.example.js public/js/config.js
   ```

2. Edite `public/js/config.js` e adicione suas keys:

```javascript
var CONFIG = {
    RIOT_API_KEY: 'SUA_RIOT_KEY_AQUI',
    HENRIK_API_KEY: 'SUA_HENRIK_KEY_AQUI',
    // ...
};
```

#### Obtendo as Keys

| API | Portal | Observação |
|-----|--------|------------|
| RIOT Games | https://developer.riotgames.com/ | Keys de dev expiram em 24h |
| Henrik API | https://api.henrikdev.xyz/dashboard/ | Gratuita, sem expiração |

> ⚠️ **Importante**: O arquivo `config.js` está no `.gitignore`. Nunca commite suas keys!

### Rodando o Projeto

**Opção 1: Script Automático (Windows)**

```
Dê duplo clique em start-server.bat
```

**Opção 2: Terminal**

```bash
cd public
php -S localhost:8000
```

**Opção 3: VS Code**

1. Instale a extensão "PHP Server"
2. Clique com botão direito em `public/index.html`
3. Selecione "PHP Server: Serve Project"

### Acessando

Abra no navegador: **http://localhost:8000**

---

## 🔧 Configuração Avançada

### Extensão OpenSSL (necessária para HTTPS)

Se aparecer erro de SSL, ative a extensão no `php.ini`:

1. Encontre o arquivo `php.ini`:
   ```powershell
   php --ini
   ```

2. Edite e descomente a linha:
   ```ini
   extension=openssl
   ```

3. Verifique se o `extension_dir` está correto:
   ```ini
   extension_dir = "C:/Program Files/PHP/ext"
   ```

### Porta Diferente

Para usar outra porta:

```bash
php -S localhost:3000
```

---

## 🎨 Personalização

### Cores (theme.css)

```css
:root {
    --riot-gold: #c89b3c;      /* Dourado principal */
    --riot-blue: #0397ab;      /* Azul LOL */
    --riot-red: #ff4655;       /* Vermelho Valorant */
    --riot-dark: #010a13;      /* Fundo escuro */
}
```

---

## 📡 APIs Utilizadas

| Jogo | API | Autenticação |
|------|-----|--------------|
| League of Legends | [RIOT Games API](https://developer.riotgames.com/) | API Key (gratuita) |
| Valorant | [Henrik Dev API](https://docs.henrikdev.xyz/) | API Key (gratuita) |

### Endpoints LOL
- `/riot/account/v1/accounts/by-riot-id/{name}/{tag}` - Busca por Riot ID
- `/lol/summoner/v4/summoners/by-puuid/{puuid}` - Dados do invocador
- `/lol/league/v4/entries/by-puuid/{puuid}` - Ranked
- `/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}` - Maestrias
- `/lol/match/v5/matches/by-puuid/{puuid}/ids` - IDs das partidas

### Endpoints Valorant (Henrik)
- `/valorant/v2/account/{name}/{tag}` - Dados da conta
- `/valorant/v3/mmr/{region}/{name}/{tag}` - Rank competitivo
- `/valorant/v4/matches/{region}/{name}/{tag}` - Histórico de partidas

---

## 🐛 Problemas Comuns

### "PHP não reconhecido"
Adicione o PHP ao PATH do sistema ou use o caminho completo.

### "API Key expirada" (LOL)
Renove em https://developer.riotgames.com/ - keys de dev expiram em 24h.

### "Erro 401" (Valorant)
Verifique se a Henrik API Key está correta.

### "Jogador não encontrado"
- Verifique se o Riot ID está correto (Nome#Tag)
- Confirme a região selecionada

---

## 📝 Licença

Projeto educacional. Não afiliado à Riot Games.

---

## 🔗 Links Úteis

- [RIOT Developer Portal](https://developer.riotgames.com/)
- [Henrik API Docs](https://docs.henrikdev.xyz/)
- [Data Dragon (Assets LOL)](https://developer.riotgames.com/docs/lol#data-dragon)
- [Community Dragon](https://communitydragon.org/)
