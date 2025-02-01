import {
  deleteDocument,
  getAllDocument,
  uploadDocument,
} from "@/API/user/document/document";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const DOCUMENTS_QUERY_KEY = "documents";
const DocumentHook = () => {
  const queryClient = useQueryClient();

  // user
  const uploadDocuments = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries([DOCUMENTS_QUERY_KEY]);
      // console.log(data?.message)
      toast.success(data?.message || "document created successfully!");
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
  };
};

export default DocumentHook;
