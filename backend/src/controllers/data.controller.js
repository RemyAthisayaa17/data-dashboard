const { getPool, sql } = require("../config/db");

// Make sure the table exists
async function ensureTable(pool) {
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM sysobjects WHERE name='dataforge_rows' AND xtype='U'
    )
    CREATE TABLE dataforge_rows (
      id INT IDENTITY(1,1) PRIMARY KEY,
      upload_id NVARCHAR(100),
      row_data NVARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE()
    )
  `);
}

// Upload: receive rows, store each as JSON
async function uploadData(req, res) {
  try {
    const { rows, uploadId } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "No rows provided" });
    }

    const pool = await getPool();
    await ensureTable(pool);

    // Delete previous upload with same uploadId if re-uploading
    await pool
      .request()
      .input("uploadId", sql.NVarChar, uploadId)
      .query("DELETE FROM dataforge_rows WHERE upload_id = @uploadId");

    // Insert each row as JSON string
    for (const row of rows) {
      await pool
        .request()
        .input("uploadId", sql.NVarChar, uploadId)
        .input("rowData", sql.NVarChar(sql.MAX), JSON.stringify(row))
        .query(
          "INSERT INTO dataforge_rows (upload_id, row_data) VALUES (@uploadId, @rowData)"
        );
    }

    return res.json({ message: "Data uploaded successfully", count: rows.length });
  } catch (err) {
    console.error("uploadData error:", err);
    return res.status(500).json({ error: "Failed to upload data" });
  }
}

// Fetch: paginate, search, sort all in SQL
async function getData(req, res) {
  try {
    const {
      uploadId,
      page = 1,
      pageSize = 10,
      search = "",
      sortKey = "",
      sortDir = "asc",
    } = req.query;

    if (!uploadId) {
      return res.status(400).json({ error: "uploadId is required" });
    }

    const pool = await getPool();
    await ensureTable(pool);

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // Build search filter using JSON_VALUE is complex; instead filter with LIKE on raw JSON string
    let whereClause = "WHERE upload_id = @uploadId";
    if (search) {
      whereClause += " AND row_data LIKE @search";
    }

    // Count total
    const countQuery = `SELECT COUNT(*) AS total FROM dataforge_rows ${whereClause}`;
    const countRequest = pool.request().input("uploadId", sql.NVarChar, uploadId);
    if (search) {
      countRequest.input("search", sql.NVarChar, `%${search}%`);
    }
    const countResult = await countRequest.query(countQuery);
    const total = countResult.recordset[0].total;

    // Fetch page
    // Sorting by a JSON key: use JSON_VALUE if sortKey provided
    let orderClause = "ORDER BY id ASC";
    if (sortKey) {
      const dir = sortDir === "desc" ? "DESC" : "ASC";
      orderClause = `ORDER BY JSON_VALUE(row_data, '$.${sortKey}') ${dir}`;
    }

    const dataQuery = `
      SELECT row_data FROM dataforge_rows
      ${whereClause}
      ${orderClause}
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;

    const dataRequest = pool
      .request()
      .input("uploadId", sql.NVarChar, uploadId)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit);

    if (search) {
      dataRequest.input("search", sql.NVarChar, `%${search}%`);
    }

    const dataResult = await dataRequest.query(dataQuery);
    const rows = dataResult.recordset.map((r) => JSON.parse(r.row_data));

    return res.json({ rows, total, page: parseInt(page), pageSize: parseInt(pageSize) });
  } catch (err) {
    console.error("getData error:", err);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}

module.exports = { uploadData, getData };