import Compressor from "compressorjs";

const COMPRESS_IMAGE_MAX_DIMENSION = 1920;
const COMPRESS_IMAGE_QUALITY = 0.85;
const COMPRESS_IMAGE_MIN_SIZE_BYTES = 500 * 1024;
const COMPRESSIBLE_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const compressImage = (
  file: File,
  options?: Partial<Compressor.Options>,
): Promise<File> => {
  if (!file || !COMPRESSIBLE_IMAGE_MIME_TYPES.has(file.type))
    return Promise.resolve(file);
  if (file.size < COMPRESS_IMAGE_MIN_SIZE_BYTES) return Promise.resolve(file);

  const logFallback = (error: unknown) => {
    console.warn("compressImage: falling back to original file", {
      name: file.name,
      type: file.type,
      size: file.size,
      error,
    });
  };

  return new Promise<File>((resolve) => {
    try {
      new Compressor(file, {
        maxWidth: COMPRESS_IMAGE_MAX_DIMENSION,
        maxHeight: COMPRESS_IMAGE_MAX_DIMENSION,
        quality: COMPRESS_IMAGE_QUALITY,
        convertTypes: [],
        ...options,
        success: (result) => {
          if (result.size >= file.size) {
            resolve(file);
            return;
          }
          const compressed =
            result instanceof File
              ? result
              : new File([result], file.name, {
                  type: result.type,
                  lastModified: file.lastModified,
                });
          resolve(compressed);
        },
        error: (error) => {
          logFallback(error);
          resolve(file);
        },
      });
    } catch (error) {
      logFallback(error);
      resolve(file);
    }
  });
};
