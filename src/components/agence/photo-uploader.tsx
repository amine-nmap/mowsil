"use client";

import { useRef, useState } from "react";
import { Upload, X, Image } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  value: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  error?: string;
  multiple?: boolean;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUploader({ value, onChange, error, multiple }: Props) {
  const t = useTranslations("vehicles");
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>(() => {
    if (!value) return [];
    if (multiple) return (value as File[]).map((f) => URL.createObjectURL(f));
    return value ? [URL.createObjectURL(value as File)] : [];
  });

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE);
    if (valid.length === 0) return;

    if (multiple) {
      const current = (value as File[]) ?? [];
      const updated = [...current, ...valid];
      onChange(updated);
      setPreviews(updated.map((f) => URL.createObjectURL(f)));
    } else {
      onChange(valid[0]);
      setPreviews([URL.createObjectURL(valid[0])]);
    }
  }

  function handleRemove(index: number) {
    if (multiple) {
      const current = (value as File[]) ?? [];
      const updated = current.filter((_, i) => i !== index);
      onChange(updated.length > 0 ? updated : null);
      setPreviews(updated.map((f) => URL.createObjectURL(f)));
    } else {
      onChange(null);
      setPreviews([]);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  const files = multiple ? (value as File[]) ?? [] : value ? [value as File] : [];

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, i) => (
            <div key={i} className="relative rounded-lg overflow-hidden border border-mowsil-card-border aspect-[4/3]">
              <img src={preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {multiple && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-mowsil-card-border rounded-lg flex items-center justify-center aspect-[4/3] hover:border-mowsil-green transition-colors cursor-pointer"
            >
              <Upload size={20} className="text-mowsil-legend" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-mowsil-card-border rounded-lg p-6 text-center hover:border-mowsil-green transition-colors cursor-pointer"
        >
          <Upload size={24} className="mx-auto text-mowsil-legend mb-2" />
          <p className="text-xs text-mowsil-legend">
            {multiple ? t("photosUpload") : t("photosMin")}
          </p>
        </button>
      )}

      {error && <p className="text-xs text-mowsil-error">{error}</p>}
    </div>
  );
}
