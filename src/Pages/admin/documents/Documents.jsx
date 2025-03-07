import CreateDocuments from "./CreateDocuments";
import AdminDocumentHook from "@/hooks/document/AdminDocumentHook";
// import { useNavigate } from "react-router";
// const filepathUrl = import.meta.env.VITE_FILE_PATH;

function Documents() {
  const { getAllDocumentsAdmin } = AdminDocumentHook();
  console.log(getAllDocumentsAdmin);
  const handleDocumentClick = (fileUrl) => {
    window.open(`http://192.168.20.11:4001${fileUrl}`, "_blank");
  };

  return (
    <div>
      <div className="mb-5">
        <CreateDocuments />
      </div>
      {getAllDocumentsAdmin?.files?.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getAllDocumentsAdmin?.files?.map((doc) => (
            <div
              key={doc._id}
              className="p-4 bg-white border border-gray-300 rounded shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div
                onClick={() => handleDocumentClick(doc?.attachments?.file_url)}
              >
                <h3 className="m-0 text-xl font-semibold text-gray-800">
                  {doc.title}
                </h3>
                <p className="my-2 text-gray-600">{doc.description}</p>
              </div>
              <a
                className="text-blue-500 hover:underline"
                // href={`http://192.168.20.11:4001/${doc?.attachments?.file_url}`}
                // target="_blank"
                download
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Documents;
