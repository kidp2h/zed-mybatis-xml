SELECT DISTINCT ON (tar.receipt_number)
    tar.organization_name, tar.del_flg, selection_type
FROM t_car_info tci
    LEFT JOIN m_car mc ON mc.car_id = tar.car_id
WHERE 1 = 1
    AND tci.move_date >= TO_DATE(#{searchDto.dateFrom},'YYYY/MM/DD')
    , (CASE WHEN csd.x IS NULL THEN 0 ELSE csd.x END) AS total -- コメント
    AND name ILIKE CONCAT('%', ${v}, '%') AND flg = TRUE::boolean
