import {
  deleteDocument,
  getAllDocument,
  getDocument,
  uploadDocument,
} from "@/API/user/document/document";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const DOCUMENTS_QUERY_KEY = "documents";
const DocumentHook = () => {
  const queryClient = useQueryClient();
  const [file, setFile] = useState("");
  // user
  const uploadDocuments = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries([DOCUMENTS_QUERY_KEY]);
      toast.success(data?.message || "document created successfully!");
    },
  });

  const getDocumentById = useMutation({
    mutationFn: (documentId) => getDocument(documentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries([DOCUMENTS_QUERY_KEY]);
      setFile(data);
    },
  });

  const {
    data: getAllDocuments,
    isLoading: isDocumentLoadin,
    error: documentError,
    isError: isDocumentError,
  } = useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY],
    queryFn: getAllDocument,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const deleteDocuments = useMutation({
    mutationFn: deleteDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries([DOCUMENTS_QUERY_KEY]);
      toast.success(data?.message || "document deleted successfully!");
    },
  });

  return {
    uploadDocuments,
    deleteDocuments,
    getAllDocuments,
    isDocumentLoadin,
    documentError,
    isDocumentError,
    getDocumentById,
    file
  };
};

export default DocumentHook;
