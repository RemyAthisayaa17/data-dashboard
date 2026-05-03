exports.buildQuery = ({ search, sortBy, order, page, limit }) => {
  let query = `SELECT * FROM uploads WHERE 1=1`;

  if (search) {
    query += ` AND data LIKE '%${search}%'`;
  }

  query += ` ORDER BY id ${order || "DESC"}`;

  const offset = (page - 1) * limit;

  query += ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;

  return query;
};