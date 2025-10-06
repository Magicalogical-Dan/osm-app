-- Simple insert script for news articles
-- Run this AFTER creating the news_articles table

INSERT INTO news_articles (title, content, url, source, sport, league, club, competition, tags, published_at) VALUES

-- Article 1: Wigan Warriors Women Grand Final
('Wigan Warriors Women 16-12 St Helens: Wigan fight back to win Women''s Super League Grand Final and secure historic treble', 
'Wigan Warriors fought from behind to beat St Helens in Sunday''s Women''s Super League Grand Final 16-12, completing a historic treble in doing so. Anna Davies and Molly Jones scored two tries apiece for Wigan on the night, as three tries in eight second-half minutes saw them turn things around from 8-4 behind.', 
'https://www.skysports.com/rugby-league/wigan-vs-st-helens/report/61691', 
'Sky Sports', 
'rugby_league', 
'Women''s Super League', 
'Wigan Warriors', 
'Grand Final', 
ARRAY['Wigan Warriors', 'St Helens', 'Women''s Super League', 'Grand Final', 'Treble'], 
NOW() - INTERVAL '2 hours'),

-- Article 2: Hull KR Semi-Final Highlights
('Hull KR 20-12 St Helens | Super League Semi-Final Highlights', 
'Highlights from the Super League semi-final clash between Hull KR and St Helens. Hull KR secured their place in the Grand Final with a hard-fought victory over St Helens.', 
'https://www.skysports.com/rugby-league/video/12780/13444752/hull-kr-20-12-st-helens-super-league-semi-final-highlights', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Hull KR', 
'Semi-Final', 
ARRAY['Hull KR', 'St Helens', 'Super League', 'Semi-Final', 'Highlights'], 
NOW() - INTERVAL '4 hours'),

-- Article 3: Wigan Warriors Secure Grand Final Spot
('Wigan Warriors secure Super League Grand Final spot with 18-6 win over Leigh Leopards', 
'Wigan Warriors secured their place in the Super League Grand Final with an 18-6 victory over Leigh Leopards in the play-off semi-finals.', 
'https://www.skysports.com/rugby-league/news/12196/13443428/wigan-warriors-secure-super-league-grand-final-spot-with-18-6-win-over-leigh-leopards-in-play-off-semi-finals', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Wigan Warriors', 
'Play-off Semi-Final', 
ARRAY['Wigan Warriors', 'Leigh Leopards', 'Super League', 'Play-off', 'Semi-Final'], 
NOW() - INTERVAL '6 hours'),

-- Article 4: Rugby League News Live Blog
('Rugby League News, Transfers and Rumours: Super League Latest for 2025', 
'A comprehensive live blog covering the latest rugby league news, transfers, and rumours for 2025.', 
'https://www.skysports.com/rugby-league/live-blog/12196/13303427/rugby-league-news-transfers-and-rumours-super-league-latest-and-highlights-for-2025', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Multiple', 
'General News', 
ARRAY['Transfer News', 'Rumours', 'Super League', 'Live Blog', '2025'], 
NOW() - INTERVAL '2 days'),

-- Article 5: Rugby League No.1 sport
('Rugby League crowned Australia''s No.1 sport as GF smashes records', 
'After a record-breaking 2025 season, rugby league has been crowned the undisputed champion of Australian sport. The NRL Grand Final between the Brisbane Broncos and Melbourne Storm set broadcast records.', 
'https://www.nrl.com/news/2025/10/01/rugby-league-no.1-across-2025-in-total-viewership-16-39s-and-digital-engagement/', 
'NRL.com', 
'rugby_league', 
'NRL', 
'Brisbane Broncos', 
'Grand Final', 
ARRAY['NRL', 'Grand Final', 'Brisbane Broncos', 'Melbourne Storm', 'Records', 'Viewership'], 
NOW() - INTERVAL '5 days'),

-- Article 6: 2025 Ashes Squad Announcement
('2025 Ashes squad announcement', 
'The Australian Rugby League Commission announces the Kangaroos squad for the 2025 Ashes Series.', 
'https://www.nrl.com/news/2025/10/06/2025-ashes-squad-announcement/', 
'NRL.com', 
'rugby_league', 
'International', 
'Kangaroos', 
'Ashes Series', 
ARRAY['Ashes Series', 'Kangaroos', 'Squad Announcement', '2025', 'International'], 
NOW() - INTERVAL '1 day'),

-- Article 7: Madge ended Broncos drought
('''He''s a winner'': How Madge ended 19-year Broncos drought', 
'Michael Maguire guides the Brisbane Broncos to their first NRL premiership since 2006 with a 26-22 victory over Melbourne Storm.', 
'https://www.nrl.com/news/2025/10/06/hes-a-winner-how-madge-ended-19-year-broncos-drought/', 
'NRL.com', 
'rugby_league', 
'NRL', 
'Brisbane Broncos', 
'Grand Final', 
ARRAY['Brisbane Broncos', 'Michael Maguire', 'Premiership', '2025 Season', 'Melbourne Storm'], 
NOW() - INTERVAL '1 day');

-- Verify the inserts
SELECT 
    title, 
    source, 
    league, 
    club, 
    url,
    published_at
FROM news_articles 
ORDER BY published_at DESC;
