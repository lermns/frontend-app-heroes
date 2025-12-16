import { useQuery } from "@tanstack/react-query";
import { getHeroesByPage } from "../actions/get-heroes-by-page.action";

export const usePaginatedHero = (
  page: number,
  limit: number,
  category = "all"
) => {
  return useQuery({
    // queryKey es el identificador unico de la consulta
    queryKey: ["heroes", { page, limit, category }],
    // queryFn es la funcion que va a ejecutar la peticion pasandole los valores de page y limit.
    queryFn: () => getHeroesByPage(+page, +limit, category),
    // staleTiem determina el tiempo que los datos se consideran frescos
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
