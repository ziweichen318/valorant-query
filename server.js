const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 請將你的 Riot API 金鑰存放在環境變數中（或暫時直接使用字串，但上線前請移除）
const API_KEY = process.env.RIOT_API_KEY || 'RGAPI-d5aa29fb-e9f7-42d9-8b6c-be2b1f037785';

// 提供靜態檔案（前端頁面）
app.use(express.static(path.join(__dirname, 'public')));

// 範例：查詢平台狀態（採用 Asia Pacific 區域，依官方文件調整）
app.get('/api/status', async (req, res) => {
  const url = 'https://ap.api.riotgames.com/val/status/v1/platform-data';
  try {
    const response = await axios.get(url, {
      headers: { 'X-Riot-Token': API_KEY.trim() }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching status data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching status data' });
  }
});

// 範例：查詢排行榜，需提供 actId 參數（依官方文件調整）
app.get('/api/leaderboards', async (req, res) => {
  const actId = req.query.actId;
  if (!actId) {
    return res.status(400).json({ error: 'Missing actId parameter' });
  }
  const url = `https://ap.api.riotgames.com/val/ranked/v1/leaderboards/by-act/${encodeURIComponent(actId)}`;
  try {
    const response = await axios.get(url, {
      headers: { 'X-Riot-Token': API_KEY.trim() }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching leaderboards:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching leaderboards' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
