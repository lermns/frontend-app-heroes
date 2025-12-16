import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroesStats } from "@/heroes/components/HeroesStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadCrumbs } from "@/components/custom/CustomBreadCrumbs";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") ?? undefined;
  const strength = searchParams.get("strength") ?? undefined;

  // TODO: useQuery traer la data de los heroes de la url
  const { data: heroData = [] } = useQuery({
    queryKey: ["search", { name, strength }],
    queryFn: () => searchHeroesAction({ name, strength }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  return (
    <>
      {/* Title and description */}
      <CustomJumbotron
        title="Universo de Heroes"
        description="Descubre, explora y admininistra super heroes y villanos"
      />

      {/* Breadcrumbs */}
      <CustomBreadCrumbs
        currentPage="Búsqueda"
        /*breadcrumbs={[
          { label: "Home_1", to: "/" },
          { label: "Home_2", to: "/" },
          { label: "Home_3", to: "/" },
        ]}*/
      />

      {/* Stats dashboard */}
      <HeroesStats />

      {/* filter and search */}
      <SearchControls />

      <HeroGrid heroes={heroData} />
    </>
  );
};

export default SearchPage;
