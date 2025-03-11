"use client";

import React from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";

const CoverLetterPreview = ({ content }) => {
  return (
    <div className="py-4">
      <MarkdownEditor value={content} preview="preview" height={700} />
    </div>
  );
};

export default CoverLetterPreview;
