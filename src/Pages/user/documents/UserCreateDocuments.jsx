import { useState } from "react";
import { FaUpload, FaTimes, FaFileAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GrDocumentPdf } from "react-icons/gr";
import Modal from "@/components/customUi/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import DocumentHook from "@/hooks/document/documentHook";

const UserCreateDocuments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const { uploadDocuments } = DocumentHook();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    uploadDocuments.mutate(formData);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const selectedFile = e.dataTransfer.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 w-fit"
      >
        Upload Document <GrDocumentPdf />
      </Button>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen((prev) => !prev)}
          title="Upload A Document"
        >
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <Label
            className={`w-full h-48 border border-gray-300 text-center flex items-center justify-center cursor-pointer relative ${
              dragActive ? "bg-gray-200" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file && (
              <span className="inline-flex flex-col items-center gap-2 text-sm">
                <FaUpload size={30} />
                Drag And drop
              </span>
            )}
            <Input type="file" onChange={handleFileChange} className="hidden" />
            {file && (
              <>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <FaFileAlt size={50} />
                    <span>{file.name}</span>
                  </div>
                )}
                <FaTimes
                  size={20}
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={handleRemoveFile}
                />
              </>
            )}
          </Label>
          <Button className="mt-4" onClick={handleUpload}>
            Upload
          </Button>
        </Modal>
      )}
      <ToastContainer />
    </>
  );
};

export default UserCreateDocuments;
