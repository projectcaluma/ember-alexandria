export const FILE_TYPES = {
  // Specific types that need to match a fixed set of mime types
  pdf: { icon: "file-pdf", mimeTypes: ["application/pdf"] },
  word: {
    icon: "file-word",
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
      "application/vnd.ms-word.document.macroEnabled.12",
      "application/vnd.ms-word.template.macroEnabled.12",
    ],
  },
  excel: {
    icon: "file-excel",
    mimeTypes: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.ms-excel.template.macroEnabled.12",
      "application/vnd.ms-excel.addin.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    ],
  },
  powerpoint: {
    icon: "file-powerpoint",
    mimeTypes: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.template",
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      "application/vnd.ms-powerpoint.addin.macroEnabled.12",
      "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
      "application/vnd.ms-powerpoint.template.macroEnabled.12",
      "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
    ],
  },
  // Fallback types taken from the first part of the mime type
  image: { icon: "file-image", match: /image\// },
  video: { icon: "file-video", match: /video\// },
  text: { icon: "file-lines", match: /text\// },
  audio: { icon: "file-audio", match: /audio\// },
};

export function getIcon(fileType, additionalFileTypes = {}) {
  const allFileTypes = { ...additionalFileTypes, ...FILE_TYPES };

  return allFileTypes[fileType]?.icon ?? "file";
}

export function getFileType(mimeType, additionalFileTypes = {}) {
  if (!mimeType) {
    return null;
  }

  const allFileTypes = { ...additionalFileTypes, ...FILE_TYPES };

  const match = Object.entries(allFileTypes).find(([, config]) => {
    if (config.mimeTypes) {
      return config.mimeTypes?.includes(mimeType);
    } else if (config.match) {
      return mimeType.search(config.match) > -1;
    }

    return false;
  });

  return match?.[0] ?? null;
}
