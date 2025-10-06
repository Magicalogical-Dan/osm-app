-- Insert all news articles into the news_articles table
-- Run this script in your Supabase SQL editor

-- First, let's check what columns exist in the news_articles table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'news_articles' 
ORDER BY ordinal_position;

-- Insert the articles (removing excerpt column for now)
INSERT INTO news_articles (title, content, url, source, sport, league, club, competition, tags, published_at) VALUES

-- Article 1: Wigan Warriors Women Grand Final
('Wigan Warriors Women 16-12 St Helens: Wigan fight back to win Women''s Super League Grand Final and secure historic treble', 
'Wigan Warriors fought from behind to beat St Helens in Sunday''s Women''s Super League Grand Final 16-12, completing a historic treble in doing so. Anna Davies and Molly Jones scored two tries apiece for Wigan on the night, as three tries in eight second-half minutes saw them turn things around from 8-4 behind. Having fallen 4-0 behind, St Helens scored through Dani McGifford and Phoebe Hook to lead, while Hook grabbed her second late on to keep Saints in it until the end, only to fall short. Wigan''s Grand Final triumph sits alongside their Challenge Cup and League Leaders'' Shield successes already in 2025.', 
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
'Highlights from the Super League semi-final clash between Hull KR and St Helens. Hull KR secured their place in the Grand Final with a hard-fought victory over St Helens. The match showcased determination and skill from both teams as Hull KR booked their place in the Grand Final after defeating St Helens in a closely contested semi-final.', 
'https://www.skysports.com/rugby-league/video/12780/13444752/hull-kr-20-12-st-helens-super-league-semi-final-highlights', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Hull KR', 
'Semi-Final', 
ARRAY['Hull KR', 'St Helens', 'Super League', 'Semi-Final', 'Highlights'], 
NOW() - INTERVAL '4 hours'),

-- Article 3: Wigan Warriors Secure Grand Final Spot
('Wigan Warriors secure Super League Grand Final spot with 18-6 win over Leigh Leopards in play-off semi-finals', 
'Wigan Warriors secured their place in the Super League Grand Final with an 18-6 victory over Leigh Leopards in the play-off semi-finals. The match was a showcase of Wigan''s strength and determination as they proved too much for Leigh to secure their spot in the Grand Final. The victory demonstrates Wigan''s championship credentials as they head into the final.', 
'https://www.skysports.com/rugby-league/news/12196/13443428/wigan-warriors-secure-super-league-grand-final-spot-with-18-6-win-over-leigh-leopards-in-play-off-semi-finals', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Wigan Warriors', 
'Play-off Semi-Final', 
ARRAY['Wigan Warriors', 'Leigh Leopards', 'Super League', 'Play-off', 'Semi-Final'], 
NOW() - INTERVAL '6 hours'),

-- Article 4: Wigan vs Leigh Dispute
('Wigan Warriors vs Leigh Leopards: What caused the dispute ahead of Super League semi-final', 
'Ahead of the Super League semi-final between Wigan Warriors and Leigh Leopards, a dispute arose over ticket allocations. Wigan offered Leigh a choice between 4,600 unreserved seats or 5,400 reserved seats in the North Stand of the Brick Community Stadium. Leigh''s owner, Derek Beaumont, expressed dissatisfaction with the allocation, stating that initial communications suggested additional seats would be available if the initial allocation sold out. The disagreement led to tensions before the match but was resolved in time for the game to proceed.', 
'https://www.skysports.com/rugby-league/news/12196/13442833/wigan-warriors-vs-leigh-leopards-what-caused-the-dispute-ahead-of-super-league-semi-final', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Wigan Warriors', 
'Semi-Final', 
ARRAY['Wigan Warriors', 'Leigh Leopards', 'Dispute', 'Ticket Allocation', 'Semi-Final'], 
NOW() - INTERVAL '1 day'),

-- Article 5: Rugby League News Live Blog
('Rugby League News, Transfers and Rumours: Super League Latest and Highlights for 2025', 
'A comprehensive live blog covering the latest rugby league news, transfers, and rumours for 2025. This resource provides real-time information on team performances, player movements, and other relevant news in the rugby league world. The blog covers Super League updates, transfer news, and highlights from recent matches.', 
'https://www.skysports.com/rugby-league/live-blog/12196/13303427/rugby-league-news-transfers-and-rumours-super-league-latest-and-highlights-for-2025', 
'Sky Sports', 
'rugby_league', 
'Super League', 
'Multiple', 
'General News', 
ARRAY['Transfer News', 'Rumours', 'Super League', 'Live Blog', '2025'], 
NOW() - INTERVAL '2 days'),

-- Article 6: Rugby League No.1 sport
('Rugby League crowned Australia''s No.1 sport as GF smashes records', 
'After a record-breaking 2025 season, rugby league has been crowned the undisputed champion of Australian sport. The NRL Grand Final between the Brisbane Broncos and Melbourne Storm is the single biggest sporting event for 2025 with 4.46m Australians tuning in to watch, up 33% on audiences for the 2024 decider. The epic premiership decider, won 26-22 by the Broncos after a brilliant display by Clive Churchill Medallist Reece Walsh set a number of broadcast records, including the most-watched Grand Final in Australian sports history, Australia''s most streamed sporting event ever with 1.3m watching on 9Now, and the Grand Final reached a historic 6.4m Australians. The 2025 Grand Final was Australia''s No.1 most-watched program across key demographics and major markets, ranking No.1 among 16–39s and 25–54s, as well as in NSW, Queensland, Victoria and Western Australia.', 
'https://www.nrl.com/news/2025/10/01/rugby-league-no.1-across-2025-in-total-viewership-16-39s-and-digital-engagement/', 
'NRL.com', 
'rugby_league', 
'NRL', 
'Brisbane Broncos', 
'Grand Final', 
ARRAY['NRL', 'Grand Final', 'Brisbane Broncos', 'Melbourne Storm', 'Records', 'Viewership', 'Australia', 'Reece Walsh'], 
NOW() - INTERVAL '5 days'),

-- Article 7: 2025 Ashes Squad Announcement
('2025 Ashes squad announcement', 
'ARLC Chairman Peter V''landys AM, Isaah Yeo, and Kevin Walters chat to the media about the Kangaroos team announcement for the upcoming Ashes Series. The Australian Rugby League Commission announces the Kangaroos squad for the 2025 Ashes Series, marking an important milestone in international rugby league competition.', 
'https://www.nrl.com/news/2025/10/06/2025-ashes-squad-announcement/', 
'NRL.com', 
'rugby_league', 
'International', 
'Kangaroos', 
'Ashes Series', 
ARRAY['Ashes Series', 'Kangaroos', 'Squad Announcement', '2025', 'International', 'Peter V''landys'], 
NOW() - INTERVAL '1 day'),

-- Article 8: Madge ended Broncos drought
('''He''s a winner'': How Madge ended 19-year Broncos drought', 
'"You''ve been here before; your best half is about to come". That was the simple message from serial winner Michael Maguire to Brisbane players as they stared down a 22-12 halftime deficit in Sunday''s epic grand final against the Storm at Accor Stadium. The Broncos had come from behind to beat the minor premiers, Canberra, and four-time back-to-back premiers Penrith in successive finals matches and they did it again to triumph 26-22 and claim the club''s first premiership in 19-years. Maguire had been criticised for his brutal training methods after taking charge of Australia''s biggest sporting club at the end of last season but the superior fitness of the Broncos and the belief he instilled in the players delivered success. As superstar fullback Reece Walsh said: "He is a bloody winner, and I want to be a winner".', 
'https://www.nrl.com/news/2025/10/06/hes-a-winner-how-madge-ended-19-year-broncos-drought/', 
'NRL.com', 
'rugby_league', 
'NRL', 
'Brisbane Broncos', 
'Grand Final', 
ARRAY['Brisbane Broncos', 'Michael Maguire', 'Premiership', '2025 Season', 'Melbourne Storm', 'Reece Walsh', 'Coaching'], 
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
