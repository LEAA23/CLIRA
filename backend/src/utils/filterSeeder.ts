import { Filters } from "../models/Filters";
import  FilterCategories from "../models/FilterCategories";

export const seedFilters = async () => {
    const filters = [
        { name: "si", categoryName: "Completados" },
        { name: "no", categoryName: "Completados" },
        { name: "cabeza", categoryName: "Extremidad" },
        { name: "pulmones", categoryName: "Extremidad" },
        { name: "adulto", categoryName: "Paciente" },
        { name: "menor", categoryName: "Paciente" },
        { name: "facil", categoryName: "Dificultad" },
        { name: "medio", categoryName: "Dificultad" },
        { name: "dificil", categoryName: "Dificultad" },
    ];

    for (const filter of filters) {
        const category = await FilterCategories.findOne({
            where: { name: filter.categoryName },
        });

        if (!category) {
            throw new Error(
                `No existe la categoría "${filter.categoryName}"`
            );
        }

        const [, created] = await Filters.findOrCreate({
            where: {
                name: filter.name,
                category_id: category.id,
            },
            defaults: {
                name: filter.name,
                category_id: category.id,
            },
        });
    }
};

export const seedFilterCategories = async () => {
    const categories = [
        "Completados",
        "Extremidad",
        "Paciente",
        "Dificultad"
    ];

    for (const name of categories) {
        await FilterCategories.findOrCreate({
            where: { name },
            defaults: { name },
        });
    }
};