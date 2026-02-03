# 🎮 RIOT Profiles

Web application for querying **League of Legends** and **Valorant** profiles.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat\&logo=javascript\&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat\&logo=php\&logoColor=white)

---

## ✨ Features

### League of Legends

* 🏆 Rank and division (Solo/Duo and Flex)
* 👤 Summoner icon and level
* 🎯 Top 3 champions by mastery
* 📊 Ranked match history

### Valorant

* 🏆 Competitive rank and RR
* 👤 Player card and level
* 🎯 Top played agents
* 📊 Match history with KDA

---

## 📁 Project Structure

```
RTG/
├── public/                         # Front-end
│   ├── index.html                  # Home page
│   ├── assets/
│   │   └── icons/
│   │       └── favicon.svg         # Site icon
│   ├── css/
│   │   ├── theme.css               # Color variables
│   │   ├── base.css                # Reset and global styles
│   │   ├── index.css               # Home styles
│   │   ├── lol-profile.css         # LOL styles
│   │   └── valorant-profile.css    # Valorant styles
│   ├── js/
│   │   ├── app.js                  # Home script
│   │   ├── lol-profile.js          # LOL script
│   │   └── valorant-profile.js     # Valorant script
│   └── pages/
│       ├── lol.html                # LOL profile page
│       └── valorant.html           # Valorant profile page
├── src/
│   └── riot-proxy.php              # PHP proxy (optional)
├── start-server.bat                # Script to start server
└── README.md
```

---

## 🚀 How to Use

### Requirements

* **PHP 8.0+** installed ([Download](https://www.php.net/downloads))

### Installing PHP (Windows)

The easiest way is using **WinGet**:

```powershell
winget install PHP.PHP.8.3
```

Or download manually from [https://windows.php.net/download/](https://windows.php.net/download/)

### API Key Configuration

1. Copy the example file:

   ```bash
   cp public/js/config.example.js public/js/config.js
   ```

2. Edit `public/js/config.js` and add your keys:

```javascript
var CONFIG = {
    RIOT_API_KEY: 'YOUR_RIOT_KEY_HERE',
    HENRIK_API_KEY: 'YOUR_HENRIK_KEY_HERE',
    // ...
};
```

#### Getting the Keys

| API        | Portal                                                                       | Notes                     |
| ---------- | ---------------------------------------------------------------------------- | ------------------------- |
| RIOT Games | [https://developer.riotgames.com/](https://developer.riotgames.com/)         | Dev keys expire every 24h |
| Henrik API | [https://api.henrikdev.xyz/dashboard/](https://api.henrikdev.xyz/dashboard/) | Free, no expiration       |

> ⚠️ **Important**: The `config.js` file is in `.gitignore`. Never commit your keys!

### Running the Project

**Option 1: Automatic Script (Windows)**

```
Double-click start-server.bat
```

**Option 2: Terminal**

```bash
cd public
php -S localhost:8000
```

**Option 3: VS Code**

1. Install the "PHP Server" extension
2. Right-click `public/index.html`
3. Select "PHP Server: Serve Project"

### Accessing

Open in your browser: **[http://localhost:8000](http://localhost:8000)**

---

## 🔧 Advanced Configuration

### OpenSSL Extension (required for HTTPS)

If you get SSL errors, enable the extension in `php.ini`:

1. Find the `php.ini` file:

   ```powershell
   php --ini
   ```

2. Edit and uncomment:

   ```ini
   extension=openssl
   ```

3. Make sure `extension_dir` is correct:

   ```ini
   extension_dir = "C:/Program Files/PHP/ext"
   ```

### Custom Port

To use a different port:

```bash
php -S localhost:3000
```

---

## 🎨 Customization

### Colors (theme.css)

```css
:root {
    --riot-gold: #c89b3c;      /* Main gold */
    --riot-blue: #0397ab;      /* LOL blue */
    --riot-red: #ff4655;       /* Valorant red */
    --riot-dark: #010a13;      /* Dark background */
}
```

---

## 📡 APIs Used

| Game              | API                                                | Authentication |
| ----------------- | -------------------------------------------------- | -------------- |
| League of Legends | [RIOT Games API](https://developer.riotgames.com/) | API Key (free) |
| Valorant          | [Henrik Dev API](https://docs.henrikdev.xyz/)      | API Key (free) |

### LOL Endpoints

* `/riot/account/v1/accounts/by-riot-id/{name}/{tag}` – Riot ID lookup
* `/lol/summoner/v4/summoners/by-puuid/{puuid}` – Summoner data
* `/lol/league/v4/entries/by-puuid/{puuid}` – Ranked data
* `/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}` – Mastery data
* `/lol/match/v5/matches/by-puuid/{puuid}/ids` – Match IDs

### Valorant Endpoints (Henrik)

* `/valorant/v2/account/{name}/{tag}` – Account data
* `/valorant/v3/mmr/{region}/{name}/{tag}` – Competitive rank
* `/valorant/v4/matches/{region}/{name}/{tag}` – Match history

---

## 🐛 Common Issues

### "PHP not recognized"

Add PHP to your system PATH or use the full executable path.

### "API Key expired" (LOL)

Renew it at [https://developer.riotgames.com/](https://developer.riotgames.com/) – dev keys expire every 24h.

### "401 Error" (Valorant)

Check if the Henrik API Key is correct.

### "Player not found"

* Make sure the Riot ID is correct (Name#Tag)
* Confirm the selected region

---

## 📝 License

Educational project. Not affiliated with Riot Games.

---

## 🔗 Useful Links

* [RIOT Developer Portal](https://developer.riotgames.com/)
* [Henrik API Docs](https://docs.henrikdev.xyz/)
* [Data Dragon (LOL Assets)](https://developer.riotgames.com/docs/lol#data-dragon)
* [Community Dragon](https://communitydragon.org/)
