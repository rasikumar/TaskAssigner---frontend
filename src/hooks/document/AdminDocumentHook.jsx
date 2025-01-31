import {
  getAllDocumentAdmin,
  uploadDocumentAdmin,
} from "@/API/admin/document/document";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ADMIN_DOCUMENTS_QUERY_KEY = "adminDocuments";
const AdminDocumentHook = () => {
  const queryClient = useQueryClient();

  // admin
  const AdminUploadDocuments = useMutation({
    mutationFn: uploadDocumentAdmin,
    onSuccess: (data) => {
      queryClient.invalidateQueries([ADMIN_DOCUMENTS_QUERY_KEY]);
      // console.log(data?.message)
      toast.success(data?.message || "document created successfully!");
    },
  });

  const {
    data: getAllDocumentsAdmin,
    isLoading: isDocumentLoadinAdmin,
    error: documentErrorAdmin,
    isError: isDocumentErrorAdmin,
  } = useQuery({
    queryKey: [ADMIN_DOCUMENTS_QUERY_KEY],
    queryFn: getAllDocumentAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    AdminUploadDocuments,
    getAllDocumentsAdmin,
    isDocumentLoadinAdmin,
    documentErrorAdmin,
    isDocumentErrorAdmin,
  };
};

export default AdminDocumentHook;
