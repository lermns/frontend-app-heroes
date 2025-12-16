import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface BreadCrumbs {
  label: string;
  to: string;
}

interface Props {
  currentPage: string;
  breadcrumbs?: BreadCrumbs[];
}

export const CustomBreadCrumbs = ({ currentPage, breadcrumbs }: Props) => {
  return (
    <Breadcrumb className="my-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className={currentPage === "Inicio" ? cn("text-black") : ""}
          >
            <Link to="/">Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {breadcrumbs?.map((crumbs) => (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={crumbs.to}>{crumbs.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}

        {currentPage !== "Inicio" && (
          <BreadcrumbItem>
            <BreadcrumbLink className="text-black">
              {currentPage}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
