import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { RiUploadCloud2Line } from "react-icons/ri";
import Upload from "../components/Upload";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import { fetchData } from "../services/api";

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [uploadId, setUploadId] = useState(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!uploadId) return;
    setLoading(true);
    try {
      const result = await fetchData({
        uploadId,
        page,
        pageSize: PAGE_SIZE,
        search,
        sortKey,
        sortDir,
      });
      setRows(result.rows || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [uploadId, page, search, sortKey, sortDir]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleUploaded(newUploadId) {
    setUploadId(newUploadId);
    setPage(1);
    setSearch("");
    setSortKey("");
    setSortDir("asc");
  }

  // Called when user clicks the X button in Upload
  function handleClear() {
    setUploadId(null);
    setRows([]);
    setTotal(0);
    setPage(1);
    setSearch("");
    setSortKey("");
    setSortDir("asc");
  }

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleSort(key, dir) {
    setSortKey(key);
    setSortDir(dir);
    setPage(1);
  }

  return (
    <>
      <Upload onUploaded={handleUploaded} onClear={handleClear} />

      {/* Pre-upload empty state */}
      {!uploadId && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <RiUploadCloud2Line />
          </div>
          <p className="empty-state-title">No data loaded yet</p>
          <p className="empty-state-sub">
            Upload a CSV or Excel file above to visualize your data
          </p>
        </div>
      )}

      {/* Table card — only visible after a successful upload */}
      {uploadId && (
        <div className="table-card">
          <div className="table-card-header">
            <span className="table-card-title">
              Active Data
              <span className="table-card-count">{total} rows</span>
            </span>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Skeleton loader */}
          {loading ? (
            <div className="skeleton-wrap">
              <div className="skeleton-header">
                {[40, 28, 36, 24, 32].map((w, i) => (
                  <div key={i} className="skeleton-cell skeleton-th" style={{ width: `${w}%` }} />
                ))}
              </div>
              {Array.from({ length: 7 }).map((_, ri) => (
                <div key={ri} className="skeleton-row">
                  {[40, 28, 36, 24, 32].map((w, ci) => (
                    <div
                      key={ci}
                      className="skeleton-cell"
                      style={{ width: `${w}%`, animationDelay: `${ri * 80}ms` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            /* Search returned no results */
            <div className="empty-state empty-state-inline">
              <div className="empty-state-icon empty-state-icon-sm">
                <RiUploadCloud2Line />
              </div>
              <p className="empty-state-title">No results found</p>
              <p className="empty-state-sub">
                Try a different search term or clear the search field
              </p>
            </div>
          ) : (
            <DataTable
              rows={rows}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )}

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </div>
      )}
    </>
  );
}