import { useEffect, useRef, useState } from "react";
import {
  uploadRoomImages,
  uploadRoomVideo,
  deleteRoomImage,
  deleteRoomVideo,
  getRoomImages,
  getRoomVideos,
} from "../../../services/roomMedia.api";
import { toast } from "react-toastify";

interface MediaItem {
  id: string;
  url: string;
}

interface Props {
  roomId: string;
  type: "image" | "video";
  onClose: () => void;
}

const RoomMediaModal: React.FC<Props> = ({ roomId, type, onClose }) => {
  const isImage = type === "image";
  const maxLimit = isImage ? 5 : 1;

  const [existingMedia, setExistingMedia] = useState<MediaItem[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const used = existingMedia.length;
  const remaining = maxLimit - used;
  const isLimitReached = remaining <= 0;

  /* ================= FETCH EXISTING MEDIA ================= */

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = isImage
          ? await getRoomImages(roomId)
          : await getRoomVideos(roomId);

        setExistingMedia(res.data.data.images || []);
      } catch {
        toast.error("Failed to load media");
      }
    };

    fetchMedia();
  }, [roomId, type]);

  /* ================= FILE SELECT ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);

    if (selected.length > remaining) return;

    setFiles(e.target.files);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  /* ================= UPLOAD ================= */

  const handleUpload = async () => {
    if (!files || isLimitReached) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      if (isImage) {
        await uploadRoomImages(roomId, Array.from(files));
      } else {
        await uploadRoomVideo(roomId, files[0]);
      }

      setUploadProgress(100);
      toast.success("Upload successful ✅");

      // Reset input
      setFiles(null);
      setPreview([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      toast.error("Upload failed ❌");
    } finally {
      setUploading(false);

      const res = isImage
        ? await getRoomImages(roomId)
        : await getRoomVideos(roomId);

      setExistingMedia(res.data.data.images || []);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      isImage ? await deleteRoomImage(id) : await deleteRoomVideo(id);
      toast.success("Deleted successfully 🗑️");

      setExistingMedia((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[420px] space-y-4">

        <h2 className="font-semibold text-lg">
          Manage {isImage ? "Images" : "Video"}
        </h2>

        {/* Count */}
        <p className="text-sm text-gray-600">
          {used}/{maxLimit} uploaded
        </p>

        {/* Existing Media */}
        <div className="grid grid-cols-3 gap-2">
          {existingMedia.map((item) =>
            isImage ? (
              <div key={item.id} className="relative group">
                <img
                  src={item.url}
                  className="h-20 w-full object-cover rounded"
                />

                {deletingId === item.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white 
                  rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 
                  cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div key={item.id} className="relative group col-span-3">
                <video src={item.url} controls className="w-full rounded" />

                {deletingId === item.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white 
                  rounded-full w-6 h-6 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>

        {/* File Input */}
        <input
          ref={inputRef}
          type="file"
          multiple={isImage}
          accept={isImage ? "image/*" : "video/*"}
          disabled={isLimitReached}
          onChange={handleFileChange}
          className={`w-full border rounded p-2 ${
            isLimitReached ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          }`}
        />

        {/* UX Message */}
        <p className="text-sm text-gray-500">
          {isLimitReached ? (
            <span className="text-red-500">
              Upload limit reached
            </span>
          ) : (
            `You can upload ${remaining} more ${
              isImage ? "images" : "video"
            }`
          )}
        </p>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {isImage ? (
              preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-20 object-cover rounded"
                />
              ))
            ) : (
              <video src={preview[0]} controls className="col-span-3 rounded" />
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-[#2f9a8a] h-2 rounded transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!files || isLimitReached || uploading}
            className={`px-4 py-2 rounded cursor-pointer ${
              !files || isLimitReached || uploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#2f9a8a] text-white hover:bg-[#278b7d]"
            }`}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomMediaModal;
