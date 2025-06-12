import { module, test } from "qunit";

import { getIcon, getFileType } from "ember-alexandria/utils/file-type";

module("Unit | Utility | file-type", function () {
  test.each(
    "determines file type and icon by mime type",
    [
      ["image/png", "image", "file-image"],
      ["video/mp4", "video", "file-video"],
      ["text/plain", "text", "file-lines"],
      ["audio/mpeg", "audio", "file-audio"],
      ["application/pdf", "pdf", "file-pdf"],
      [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "word",
        "file-word",
      ],
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "excel",
        "file-excel",
      ],
      [
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "powerpoint",
        "file-powerpoint",
      ],
      // Custom definition
      ["application/json", "json", "file-code"],
    ],
    function (assert, [mimeType, expectedFileType, expectedIcon]) {
      const additionalFileTypes = {
        json: {
          icon: "file-code",
          mimeTypes: ["application/json"],
        },
      };

      const fileType = getFileType(mimeType, additionalFileTypes);

      assert.strictEqual(fileType, expectedFileType);
      assert.strictEqual(getIcon(fileType, additionalFileTypes), expectedIcon);
    },
  );
});
