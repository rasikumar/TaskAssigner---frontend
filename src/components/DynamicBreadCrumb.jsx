import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router"; // Ensure you are using the correct router package

const DynamicBreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="border-b w-full ">
      <BreadcrumbList>
        {/* Home link */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathnames.map((name, index) => {
          const isLast = index === pathnames.length - 1;
          const pathTo = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <BreadcrumbItem key={name}>
              {!isLast ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbLink href={pathTo}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </BreadcrumbLink>
                </>
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </BreadcrumbPage>
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadCrumb;
