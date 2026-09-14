import { useEffect, useState } from "react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/**
 * Image picker shared by the Add and Edit menu forms.
 *
 * The parent owns the chosen File (and, when editing, the "clear it" flag);
 * this component only handles picking, validating and previewing.
 */
export default function MenuImageField({
  currentImageUrl,
  file,
  onFileChange,
  onClear,
  cleared,
}) {
  const [objectUrl, setObjectUrl] = useState("");
  const [error, setError] = useState("");

  // Preview the freshly picked file, and release the blob URL afterwards.
  useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (!ACCEPTED.includes(picked.type)) {
      setError("Please choose a JPG, PNG or WEBP image.");
      e.target.value = "";
      onFileChange(null);
      return;
    }

    setError("");
    onFileChange(picked);
  };

  // A newly picked file wins; otherwise show the saved one unless it is cleared.
  const preview = objectUrl || (cleared ? "" : currentImageUrl || "");
  const showClear = Boolean(file || (currentImageUrl && !cleared));

  return (
    <div className="image-field">
      <label htmlFor="menu-image">Menu Item Image</label>

      <input
        id="menu-image"
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
      />

      {error && <p className="image-error">{error}</p>}

      {preview ? (
        <div className="image-preview">
          <img src={preview} alt="Menu item preview" />
          <span className="image-preview-caption">
            {file ? "New image (not saved yet)" : "Current image"}
          </span>
        </div>
      ) : (
        <p className="image-empty">
          {cleared ? "Image will be removed when you save." : "No image selected."}
        </p>
      )}

      {showClear && (
        <button
          type="button"
          className="image-clear-btn"
          onClick={() => {
            setError("");
            const input = document.getElementById("menu-image");
            if (input) input.value = "";
            onClear();
          }}
        >
          Remove image
        </button>
      )}
    </div>
  );
}
