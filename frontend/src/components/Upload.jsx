import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { RiUpload2Line, RiFileExcel2Line, RiCloseLine } from "react-icons/ri";
import { uploadRows } from "../services/api";

export default function Upload({ onUploaded, onClear }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFile(file) {
    if (!file) return;

    const isValid =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv");

    if (!isValid) {
      toast.error("Please upload a .xlsx or .csv file");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (rows.length === 0) {
        toast.error("File is empty or has no data rows");
        setLoading(false);
        return;
      }

      const uploadId = `upload_${Date.now()}`;
      await uploadRows(rows, uploadId);

      toast.success(`Uploaded ${rows.length} rows successfully`);
      onUploaded(uploadId);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Check your file and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear(e) {
    // Stop click from bubbling up to the upload box (which would open file picker)
    e.stopPropagation();
    setFileName("");
    // Reset the file input so the same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
    // Tell the parent to reset all data
    if (onClear) onClear();
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
    // Reset input so same file can be re-uploaded after clearing
    e.target.value = "";
  }

  return (
    <div
      className={`upload-area${isDragging ? " dragging" : ""}`}
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      {loading ? (
        <>
          <div className="upload-spinner" />
          <p className="upload-sublabel">Uploading...</p>
        </>
      ) : (
        <>
          <div className="upload-icon-wrap">
            <RiUpload2Line />
          </div>
          <div>
            <p className="upload-label">Upload CSV or Excel File</p>
            <p className="upload-sublabel">Drag &amp; Drop or Click</p>
          </div>

          {/* File tag with clear button — only shows after a file is selected */}
          {fileName && (
            <div className="upload-file-tag">
              <RiFileExcel2Line style={{ flexShrink: 0 }} />
              <span className="upload-file-name">{fileName}</span>
              <button
                className="upload-clear-btn"
                onClick={handleClear}
                aria-label="Remove file"
                title="Remove file"
              >
                <RiCloseLine />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}