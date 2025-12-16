import { useSearchParams } from "react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroesStats } from "@/heroes/components/HeroesStats";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomBreadCrumbs } from "@/components/custom/CustomBreadCrumbs";
import { use, useMemo } from "react";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext";

export default function HomePage() {
  // Asigna valores a los parametros de la url
  // Usar useSearchParams hace que tu "estado" viva en la URL, no solo en React.
  // Entonces no desaparece cuando refrescas la página.
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoriteCount, favorites } = use(FavoriteHeroContext);
  // recupera el valor del parametro tab, en caso no encontrarlo recupera all
  const activeTab = searchParams.get("tab") ?? "all";
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "6";
  const category = searchParams.get("category") ?? "all";

  // memoriza el valor de activeTab y si este se incluye en el arreglo devuelve el mismo y si no uno predeterminado.
  const selectedTab = useMemo(() => {
    const validTabs = ["all", "favorites", "heroes", "villains"];
    return validTabs.includes(activeTab) ? activeTab : "all";
  }, [activeTab]);

  // evitar usar  use state para estados que necesitemos al refrescar la web
  // const [activetab, setActivetab] = useState<
  //   "all" | "favorites" | "heroes" | "villains"
  // >("all");

  // El problema que tiene es que hace la peticion cada vez que se renderiza el componente
  /*{useEffect(() => {
     getHeroesByPage().then();
    }, []);}*/

  // usamos tantstack query para manejar el estado de las peticiones
  const { data: dataResponseHeroes } = usePaginatedHero(
    parseInt(page),
    parseInt(limit),
    category
  );

  // llevamos nuestra peticion http con tanstak query a un hook para su reutilizacion sin repetir código innescesario
  const { data: summary } = useHeroSummary();

  return (
    <>
      {/* Header */}
      <CustomJumbotron
        title="El Universo de los Super Héroes"
        description="Descubre, explora y admininistra super heroes y villanos"
      />

      <CustomBreadCrumbs
        currentPage="Inicio"
        breadcrumbs={[{ label: "Búsqueda", to: "/search" }]}
      />

      {/* Stats Dashboard */}
      <HeroesStats />

      {/* Controls */}
      {/* <SearchControls /> */}

      {/* Tabs */}
      <Tabs value={selectedTab} className="mb-8 p-1">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2">
          <TabsTrigger
            value="all"
            onClick={() => {
              // Al hacer click en las imágenes se establece que la variable tab es igual a all
              setSearchParams((prev) => {
                prev.set("tab", "all");
                prev.set("category", "all");
                prev.set("page", "1");
                return prev;
              });
            }}
          >
            Todos los Personajes ({summary?.totalHeroes})
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="flex items-center gap-2"
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("tab", "favorites");
                return prev;
              });
            }}
          >
            Favoritos ({favoriteCount})
          </TabsTrigger>
          <TabsTrigger
            value="heroes"
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("tab", "heroes");
                prev.set("category", "hero");
                prev.set("page", "1");
                return prev;
              });
            }}
          >
            Heroes ({summary?.heroCount})
          </TabsTrigger>
          <TabsTrigger
            value="villains"
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("tab", "villains");
                prev.set("category", "villain");
                prev.set("page", "1");
                return prev;
              });
            }}
          >
            Villanos ({summary?.villainCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tabs Cards Heroes */}
      <Tabs value={selectedTab} className="mb-8 p-3">
        <TabsContent value="all">
          {/* Mostrar todos los personajes */}
          <HeroGrid heroes={dataResponseHeroes?.heroes ?? []} />
        </TabsContent>
        <TabsContent value="favorites">
          {/* Mostrar todos los favoritos */}
          <HeroGrid heroes={favorites} />
        </TabsContent>
        <TabsContent value="heroes">
          {/* Mostrar todos los heroes */}
          <HeroGrid heroes={dataResponseHeroes?.heroes ?? []} />
        </TabsContent>
        <TabsContent value="villains">
          {/* Mostrar todos los vaillanos */}
          <HeroGrid heroes={dataResponseHeroes?.heroes ?? []} />
        </TabsContent>
      </Tabs>

      {/* Recogemos el valor de pages del response, este lo calcula el backend y lo tenemos a disposición */}
      {selectedTab !== "favorites" && (
        <CustomPagination totalPages={dataResponseHeroes?.pages ?? 1} />
      )}
    </>
  );
}
