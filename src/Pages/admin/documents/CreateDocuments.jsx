import { useState } from "react";
import { FaUpload, FaTimes, FaFileAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { GrDocumentPdf } from "react-icons/gr";
import Modal from "@/components/customUi/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import AdminDocumentHook from "@/hooks/document/AdminDocumentHook";

const CreateDocuments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    file: false,
  });

  const { AdminUploadDocuments } = AdminDocumentHook();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: false }));
    } else {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: true }));
      toast.error("Only PDF files are allowed.");
    }
    setPreview(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    let newErrors = {
      title: title.length < 10,
      description: description.length < 20,
      file: !file || file.type !== "application/pdf",
    };
    setErrors(newErrors);

    if (newErrors.title || newErrors.description || newErrors.file) {
      if (newErrors.title) toast.error("Title must be at least 10 characters.");
      if (newErrors.description)
        toast.error("Description must be at least 20 characters.");
      if (newErrors.file) toast.error("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    AdminUploadDocuments.mutate(formData);
    setIsOpen(false);
    setFile(null);
    setTitle("");
    setDescription("");
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
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: false }));
    } else {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: true }));
      toast.error("Only PDF files are allowed.");
    }
    setPreview(null);
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
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: false }));
            }}
            className={`w-full p-2 mb-4 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: false }));
            }}
            className={`w-full p-2 mb-4 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          <Label
            className={`w-full h-48 border ${
              errors.file ? "border-red-500" : "border-gray-300"
            } text-center flex items-center justify-center cursor-pointer relative ${
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

export default CreateDocuments;
