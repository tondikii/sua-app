CREATE OR REPLACE VIEW user_follow_counts AS
SELECT
    u.id                                                             AS user_id,
    COUNT(DISTINCT f_in.follower_id)                                 AS followers_count,
    COUNT(DISTINCT f_out.following_id)                               AS following_count
FROM users u
LEFT JOIN follows f_in  ON f_in.following_id  = u.id
LEFT JOIN follows f_out ON f_out.follower_id  = u.id
GROUP BY u.id;
