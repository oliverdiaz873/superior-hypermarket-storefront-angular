import { Product } from '@core/types/product.interface'

// 184 productos en total - completamente internacionalizados en ES e EN
export const products: Product[] = [

    //--Alimentos--//

    // Bebidas
    {
        id: "coca_cola",
        name: "Coca Cola",
        url: "/product/coca_cola",
        categoria: "bebidas",
        precio: 80, // número para carrito
        precioTexto: "Precio: $80 / 2 Litros", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/coca-cola.avif",
        unidad: "litro",
        quantity: 2
    },
    {
        id: "coca_cola_zero",
        name: "Coca Cola Zero",
        url: "/product/coca_cola_zero",
        categoria: "bebidas",
        precio: 80, // número para carrito
        precioTexto: "Precio: $80 / 2 Litros", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/coca-cola-zero.avif",
        unidad: "litro",
        quantity: 2
    },
    {
        id: "country_club_frambuesa",
        name: "Country Club Frambuesa",
        url: "/product/country_club_frambuesa",
        categoria: "bebidas",
        precio: 70, // número para carrito
        precioTexto: "Precio: $70 / 2 Litros", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/country-club-frambuesa.avif",
        unidad: "litro",
        quantity: 2
    },
    {
        id: "country_club_uva",
        name: "Country Club Uva",
        url: "/product/country_club_uva",
        categoria: "bebidas",
        precio: 70, // número para carrito
        precioTexto: "Precio: $70 / 2 Litros", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/refresco/country-club-uva.avif",
        unidad: "litro",
        quantity: 2
    },
    {
        id: "gatorade_uva",
        name: "Gatorade Uva",
        url: "/product/gatorade_uva",
        categoria: "bebidas",
        precio: 75, // número para carrito
        precioTexto: "Precio: $75", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/energizantes/gatorade-uva.avif"
    },
    {
        id: "jugo_de_naranja_rica",
        name: "Jugo de Naranja Rica",
        url: "/product/jugo_de_naranja_rica",
        categoria: "bebidas",
        precio: 55, // número para carrito
        precioTexto: "Precio: $55", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/jugo/jugo-naranja-rica.avif"
    },
    {
        id: "jugo_de_pera_santal",
        name: "Jugo de Pera Santal",
        url: "/product/jugo_de_pera_santal",
        categoria: "bebidas",
        precio: 30, // número para carrito
        precioTexto: "Precio: $30", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/jugo/jugo-pera-santal.avif"
    },
    {
        id: "red_bull",
        name: "Red Bull",
        url: "/product/red_bull",
        categoria: "bebidas",
        precio: 90, // número para carrito
        precioTexto: "Precio: $90", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/bebidas/energizantes/red-bull.avif"
    },

    //Carnes, pescados y mariscos
    {
        id: "camarones_crudos",
        name: "Camarones Crudos",
        url: "/product/camarones_crudos",
        categoria: "carnes-pescados-mariscos",
        precio: 350, // número para carrito
        precioTexto: "$350.00 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/carnes-pescados-mariscos/mariscos/camarones-crudos.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "camarones_precocidos",
        name: "Camarones Pre-cocidos",
        url: "/product/camarones_precocidos",
        categoria: "carnes-pescados-mariscos",
        precio: 400, // número para carrito
        precioTexto: "$400.00 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/carnes-pescados-mariscos/mariscos/camarones-pre-cocidos.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "carne_de_res_para_hamburguesas",
        name: "Carne de Res para Hamburguesas",
        url: "/product/carne_de_res_para_hamburguesas",
        categoria: "carnes-pescados-mariscos",
        precio: 370, // número para carrito
        precioTexto: "$370.00 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/carnes-pescados-mariscos/res/carne-de-res.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "chuleta_de_cerdo",
        name: "Chuleta de Cerdo",
        url: "/product/chuleta_de_cerdo",
        categoria: "carnes-pescados-mariscos",
        precio: 300, // número para carrito
        precioTexto: "$300.00 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/carnes-pescados-mariscos/cerdo/chuleta-de-cerdo.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "pollo_entero_don_pollo",
        name: "Pollo Entero Don Pollo",
        url: "/product/pollo_entero_don_pollo",
        categoria: "carnes-pescados-mariscos",
        precio: 300, // número para carrito
        precioTexto: "$300.00 / unidad", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/carnes-pescados-mariscos/pollo/pollo.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "tilapia_roja",
        name: "Tilapia Roja",
        url: "/product/tilapia_roja",
        categoria: "carnes-pescados-mariscos",
        precio: 250, // número para carrito
        precioTexto: "$250.00 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/carnes-pescados-mariscos/pescado/tilapia-roja.avif",
        unidad: "lb",
        quantity: 1
    },

    //Despensa
    {
        id: "aceite_crisol",
        name: "Aceite Crisol",
        url: "/product/aceite_crisol",
        categoria: "despensa",
        precio: 95, // número para carrito
        precioTexto: "$95.00", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/aceites/aceite-crisol.avif",
        unidad: "ml",
        quantity: 1890
    },
    {
        id: "aceite_oliva_extra_virgen",
        name: "Aceite de Oliva Extra Virgen",
        url: "/product/aceite_oliva_extra_virgen",
        categoria: "despensa",
        precio: 230, // número para carrito
        precioTexto: "$230.00", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/aceites/aceite-de-oliva-extra-virgen.avif",
        unidad: "ml",
        quantity: 500
    },
    {
        id: "mayonesa_baldom",
        name: "Mayonesa Baldom",
        url: "/product/mayonesa_baldom",
        categoria: "despensa",
        precio: 95, // número para carrito
        precioTexto: "$95", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/aderezos-y-salsas/mayonesa-baldom.avif",
        unidad: "ml",
        quantity: 473
    },
    {
        id: "sal_refisal",
        name: "Sal Marina Refisal",
        url: "/product/sal_refisal",
        categoria: "despensa",
        precio: 65, // número para carrito
        precioTexto: "$65.00", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/condimentos/sal-marina-refisal.jpg",
        unidad: "g",
        quantity: 465
    },
    {
        id: "sazon_completo_maggi",
        name: "Sazón Completo Maggi",
        url: "/product/sazon_completo_maggi",
        categoria: "despensa",
        precio: 80, // número para carrito
        precioTexto: "$80.00", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/condimentos/sazon-completo-maggi.avif"
    },
    {
        id: "sopita_dona_gallina",
        name: "Sopita Doña Gallina",
        url: "/product/sopita_dona_gallina",
        categoria: "despensa",
        precio: 150, // número para carrito
        precioTexto: "$150 / la caja", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/condimentos/sopita-dona-gallina.avif",
        unidad: "caja", quantity: 1
    },
    {
        id: "vinagre_baldom",
        name: "Vinagre Baldom",
        url: "/product/vinagre_baldom",
        categoria: "despensa",
        precio: 87, // número para carrito
        precioTexto: "$87 / botella", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/despensa/condimentos/vinagre-baldom.avif",
        unidad: "botella", quantity: 1
    },

    //Enlatados
    {
        id: "atun_dimar",
        name: "Atún Dimar",
        url: "/product/atun_dimar",
        categoria: "enlatados",
        precio: 120, // número para carrito
        precioTexto: "Precio: $120 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/atun-dimar.avif",
        unidad: "lata"
    },
    {
        id: "gandules_verdes_goya",
        name: "Gandules Verdes Goya",
        url: "/product/gandules_verdes_goya",
        categoria: "enlatados",
        precio: 180, // número para carrito
        precioTexto: "Precio: $180 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/gandules-verdes-goya.avif",
        unidad: "lata"
    },
    {
        id: "habichuelas_negras_goya",
        name: "Habichuelas Negras Goya",
        url: "/product/habichuelas_negras_goya",
        categoria: "enlatados",
        precio: 50, // número para carrito
        precioTexto: "Precio: $50 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/habichuelas-negras-goya.avif",
        unidad: "lata"
    },
    {
        id: "maiz_la_famosa",
        name: "Maíz La Famosa",
        url: "/product/maiz_la_famosa",
        categoria: "enlatados",
        precio: 45, // número para carrito
        precioTexto: "Precio: $45 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/maiz-la-famosa.avif",
        unidad: "lata"
    },
    {
        id: "salchichas_jaja",
        name: "Salchichas Jajá",
        url: "/product/salchichas_jaja",
        categoria: "enlatados",
        precio: 45, // número para carrito
        precioTexto: "Precio: $45 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/salchichas-jaja.avif",
        unidad: "lata"
    },
    {
        id: "sardinas_gord",
        name: "Sardinas Gord",
        url: "/product/sardinas_gord",
        categoria: "enlatados",
        precio: 85, // número para carrito
        precioTexto: "Precio: $85 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/sardinas-gord.avif",
        unidad: "lata"
    },
    {
        id: "tomates_pelados_la_famosa",
        name: "Tomates Pelados La Famosa",
        url: "/product/tomates_pelados_la_famosa",
        categoria: "enlatados",
        precio: 60, // número para carrito
        precioTexto: "Precio: $60 / 1 Lata", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/enlatados/tomates-pelados.avif",
        unidad: "lata"
    },

    //Frutas y Verduras
    {
        id: "ajies_morrones",
        name: "Ajíes Morrones",
        url: "/product/ajies_morrones",
        categoria: "frutas-y-verduras",
        precio: 80, // número para carrito
        precioTexto: "Precio: $80 la unidad", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/ajies-morron.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "cebollas_rojas",
        name: "Cebollas rojas",
        url: "/product/cebollas_rojas",
        categoria: "frutas-y-verduras",
        precio: 170, // número para carrito
        precioTexto: "Precio: $170 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/cebolla-roja.avif",
        unidad: "kg",
        quantity: 1
    },
    {
        id: "fresas",
        name: "Paquete de fresas",
        url: "/product/fresas",
        categoria: "frutas-y-verduras",
        precio: 250, // número para carrito
        precioTexto: "Precio: $250 1 paquete", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/fresas.avif",
        unidad: "paquete",
        quantity: 1
    },
    {
        id: "limones_persa",
        name: "Limones persa por libras",
        url: "/product/limones_persa",
        categoria: "frutas-y-verduras",
        precio: 200, // número para carrito
        precioTexto: "Precio: $200 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/limon-persa.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "mandarinas",
        name: "Mandarinas",
        url: "/product/mandarinas",
        categoria: "frutas-y-verduras",
        precio: 100, // número para carrito
        precioTexto: "Precio: $100 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/mandarinas.avif"
    },
    {
        id: "manzanas_amarillas",
        name: "Manzanas amarillas",
        url: "/product/manzanas_amarillas",
        categoria: "frutas-y-verduras",
        precio: 50, // número para carrito
        precioTexto: "Precio: $50 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/manzana-amarilla.avif",
        unidad: "kg",
        quantity: 1
    },
    {
        id: "manzanas_rojas",
        name: "Manzanas rojas",
        url: "/product/manzanas_rojas",
        categoria: "frutas-y-verduras",
        precio: 65, // número para carrito
        precioTexto: "Precio: $65 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/manzana-roja.avif",
        unidad: "kg",
        quantity: 1
    },
    {
        id: "manzanas_verdes",
        name: "Manzanas verdes por libras",
        url: "/product/manzanas_verdes",
        categoria: "frutas-y-verduras",
        precio: 45, // número para carrito
        precioTexto: "Precio: $45 / lb", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/manzana-verde.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "pepinos",
        name: "Pepinos",
        url: "/product/pepinos",
        categoria: "frutas-y-verduras",
        precio: 70, // número para carrito
        precioTexto: "Precio: $70 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/pepino.avif"
    },
    {
        id: "tomates_de_ensalada",
        name: "Tomates de ensalada",
        url: "/product/tomates_de_ensalada",
        categoria: "frutas-y-verduras",
        precio: 80, // número para carrito
        precioTexto: "Precio: $80 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/tomate-de-ensalada.avif"
    },
    {
        id: "uvas_moradas",
        name: "Uvas moradas",
        url: "/product/uvas_moradas",
        categoria: "frutas-y-verduras",
        precio: 350, // número para carrito
        precioTexto: "Precio: $350 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/uva-morada.avif"
    },
    {
        id: "zanahorias",
        name: "Zanahorias",
        url: "/product/zanahorias",
        categoria: "frutas-y-verduras",
        precio: 80, // número para carrito
        precioTexto: "Precio: $80 1KG", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/frutas-y-verduras/zanahoria.avif",
        unidad: "kg",
        quantity: 1
    },

    //Lácteos y huevos
    {
        id: "huevos_don_pancho",
        name: "Huevos Don Pancho",
        url: "/product/huevos_don_pancho",
        categoria: "lacteos-y-huevos",
        precio: 200, // número para carrito
        precioTexto: "Precio: $200 / 30 unidades", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/lacteos-y-huevos/huevos/huevos-30unidades.avif",
        unidad: "unidad"
    },
    {
        id: "leche_entera_rica",
        name: "Leche Entera Rica",
        url: "/product/leche_entera_rica",
        categoria: "lacteos-y-huevos",
        precio: 65, // número para carrito
        precioTexto: "$65.00", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/lacteos-y-huevos/leche/leche-entera-rica.avif",
        unidad: "litro",
        quantity: 1
    },
    {
        id: "queso_gorgonzola",
        name: "Queso Gorgonzola",
        url: "/product/queso_gorgonzola",
        categoria: "lacteos-y-huevos",
        precio: 350, // número para carrito
        precioTexto: "Precio: $350 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/lacteos-y-huevos/queso/queso-gorgonzola.avif",
        unidad: "lb",
        quantity: 1
    },
    {
        id: "queso_gouda",
        name: "Queso Gouda",
        url: "/product/queso_gouda",
        categoria: "lacteos-y-huevos",
        precio: 280, // número para carrito
        precioTexto: "Precio: $280 / 1 LB", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/lacteos-y-huevos/queso/queso-gouda.avif"
    },
    {
        id: "yogurt_fresa_yoka",
        name: "Yogurt de Fresa Yoka",
        url: "/product/yogurt_fresa_yoka",
        categoria: "lacteos-y-huevos",
        precio: 150, // número para carrito
        precioTexto: "Precio: $150", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/lacteos-y-huevos/yogurt/yogurt-de-fresa.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "yogurt_natural_rica",
        name: "Yogurt Natural Rica",
        url: "/product/yogurt_natural_rica",
        categoria: "lacteos-y-huevos",
        precio: 210, // número para carrito
        precioTexto: "Precio: $210 / 2 Litros", // texto para mostrar en resultados
        imagen: "/assets/images/productos/alimentos/lacteos-y-huevos/yogurt/yogurt-natural.avif",
        unidad: "litro",
        quantity: 2
    },

    //--Electrodomésticos--//

    //Climatización
    {
        id: "aire-acondicionado_tecnomaster",
        name: "Aire Acondicionado tecnomaster",
        url: "/product/aire-acondicionado_tecnomaster",
        categoria: "climatizacion",
        precio: 33000, // número para carrito
        precioTexto: "Precio: $33,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/climatizacion/aire-acondicionado/aire-acondicionado-tecnomaster.png",
        unidad: "unidad"
    },
    {
        id: "aire-acondicionado_whirlpool",
        name: "Aire Acondicionado whirlpool",
        url: "/product/aire-acondicionado_whirlpool",
        categoria: "climatizacion",
        precio: 40000, // número para carrito
        precioTexto: "Precio: $40,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/climatizacion/aire-acondicionado/aire-acondicionado-whirlpool.png",
        unidad: "unidad"
    },
    {
        id: "ventilador_daiwa",
        name: "Ventilador Daiwa",
        url: "/product/ventilador_daiwa",
        categoria: "climatizacion",
        precio: 15000, // número para carrito
        precioTexto: "Precio: $15,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/climatizacion/ventiladores/ventilador-daiwa.png",
        unidad: "unidad"
    },
    {
        id: "ventilador_kdk",
        name: "Ventilador KDK",
        url: "/product/ventilador_kdk",
        categoria: "climatizacion",
        precio: 6000, // número para carrito
        precioTexto: "Precio: $6,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/climatizacion/ventiladores/ventilador-kdk.avif",
        unidad: "unidad"
    },
    {
        id: "ventilador_pequeno",
        name: "Ventilador Pequeño",
        url: "/product/ventilador_pequeno",
        categoria: "climatizacion",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/climatizacion/ventiladores/ventilador-pequeno.png",
        unidad: "unidad"
    },
    {
        id: "ventilador_de_techo_kdk",
        name: "Ventilador de Techo KDK",
        url: "/product/ventilador_de_techo_kdk",
        categoria: "climatizacion",
        precio: 20000, // número para carrito
        precioTexto: "Precio: $20,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/climatizacion/ventiladores-de-techo/ventilador-de-techo-kdk.avif",
        unidad: "unidad"
    },

    //Cocina
    {
        id: "bebedero_tecnomaster",
        name: "Bebedero tecnomaster",
        url: "/product/bebedero_tecnomaster",
        categoria: "cocina",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/cocina/bebedero/bebedero-tecnomaster.avif",
        unidad: "unidad"
    },
    {
        id: "cilindro_de_gas_duragas",
        name: "Cilindro de gas Duragas",
        url: "/product/cilindro_de_gas_duragas",
        categoria: "cocina",
        precio: 5200, // número para carrito
        precioTexto: "Precio: $5,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/cocina/cilindros-de-gas/cilindro-de-gas-duragas.avif",
        unidad: "unidad"
    },
    {
        id: "estufa_lg",
        name: "Estufa LG",
        url: "/product/estufa_lg",
        categoria: "cocina",
        precio: 66000, // número para carrito
        precioTexto: "Precio: $66,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/cocina/estufas/estufa-lg.avif",
        unidad: "unidad"
    },
    {
        id: "extractor-de-grasa_drija",
        name: "Extractor de grasa drija",
        url: "/product/extractor-de-grasa_drija",
        categoria: "cocina",
        precio: 6000, // número para carrito
        precioTexto: "Precio: $6,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/cocina/extractor-de-grasa/extractor-de-grasa-drija.avif",
        unidad: "unidad"
    },
    {
        id: "freezer_7_pies",
        name: "Freezer 7 Pies",
        url: "/product/freezer_7_pies",
        categoria: "cocina",
        precio: 16500, // número para carrito
        precioTexto: "Precio: $16,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/cocina/freezer/freezer-7pies.png",
        unidad: "unidad"
    },
    {
        id: "nevera_lg",
        name: "Nevera LG Grande Moderna",
        url: "/product/nevera_lg",
        categoria: "cocina",
        precio: 80000, // número para carrito
        precioTexto: "Precio: $80,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/cocina/neveras/nevera-lg.png",
        unidad: "unidad"
    },

    //Lavado
    {
        id: "lavadora_dimensions",
        name: "Lavadora Dimensions",
        url: "/product/lavadora_dimensions",
        categoria: "lavado",
        precio: 10000, // número para carrito
        precioTexto: "Precio: $10,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/lavado/lavadora/lavadora-dimensions.png",
        unidad: "unidad"
    },
    {
        id: "lavadora_frigidaire",
        name: "Lavadora Frigidaire",
        url: "/product/lavadora_frigidaire",
        categoria: "lavado",
        precio: 35000, // número para carrito
        precioTexto: "Precio: $35,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/lavado/lavadora/lavadora-frigidaire.png",
        unidad: "unidad"
    },
    {
        id: "lavadora_lg",
        name: "Lavadora LG",
        url: "/product/lavadora_lg",
        categoria: "lavado",
        precio: 53000, // número para carrito
        precioTexto: "Precio: $53,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/lavado/lavadora/lavadora-lg.avif",
        unidad: "unidad"
    },
    {
        id: "lavadora-y-secadora_lg",
        name: "Lavadora y Secadora LG",
        url: "/product/lavadora-y-secadora_lg",
        categoria: "lavado",
        precio: 55000, // número para carrito
        precioTexto: "Precio: $55,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/lavado/lavadora-y-secadora/lavadora-y-secadora-lg.avif",
        unidad: "unidad"
    },
    {
        id: "lavadora-y-secadora_tecnomaster",
        name: "Lavadora y Secadora tecnomaster",
        url: "/product/lavadora-y-secadora_tecnomaster",
        categoria: "lavado",
        precio: 40000, // número para carrito
        precioTexto: "Precio: $40,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/electrodomesticos/lavado/lavadora-y-secadora/lavadora-y-secadora-tecnomaster.png",
        unidad: "unidad"
    },
    //--Farmacia--//

    //Analgésicos
    {
        id: "equate_analgesico",
        name: "Equate Analgésico",
        url: "/product/equate_analgesico",
        categoria: "analgesicos",
        precio: 1000, // número para carrito
        precioTexto: "Precio: $1000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/analgesicos/equate.avif",
        unidad: "unidad"
    },
    {
        id: "flanax",
        name: "Flanax Analgésico",
        url: "/product/flanax",
        categoria: "analgesicos",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/analgesicos/flanax.png",
        unidad: "unidad"
    },
    {
        id: "thera_gesic",
        name: "Thera-Gesic Analgésico",
        url: "/product/thera_gesic",
        categoria: "analgesicos",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/analgesicos/thera-gesic.avif",
        unidad: "unidad"
    },
    {
        id: "tylenol",
        name: "Tylenol Analgésico",
        url: "/product/tylenol",
        categoria: "analgesicos",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/analgesicos/tylenol.avif",
        unidad: "unidad"
    },
    {
        id: "vaporizing",
        name: "Vaporizing Analgésico",
        url: "/product/vaporizing",
        categoria: "analgesicos",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/analgesicos/vaporizing.avif",
        unidad: "unidad"
    },

    //Antigripales y resfriados
    {
        id: "antiflu_des",
        name: "Antiflu-Des",
        url: "/product/antiflu_des",
        categoria: "antigripales-y-resfriado",
        precio: 1000, // número para carrito
        precioTexto: "Precio: $1,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/antigripales/antiflu-des.avif"
    },
    {
        id: "coldyflu",
        name: "Coldyflu",
        url: "/product/coldyflu",
        categoria: "antigripales-y-resfriado",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/antigripales/coldyflu.avif"
    },
    {
        id: "mucinex",
        name: "Mucinex",
        url: "/product/mucinex",
        categoria: "antigripales-y-resfriado",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/antigripales/mucinex.avif"
    },
    {
        id: "nyquil",
        name: "NyQuil",
        url: "/product/nyquil",
        categoria: "antigripales-y-resfriado",
        precio: 3500, // número para carrito
        precioTexto: "Precio: $3,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/antigripales/nyquil.avif"
    },
    {
        id: "theraflu",
        name: "Theraflu",
        url: "/product/theraflu",
        categoria: "antigripales-y-resfriado",
        precio: 2200, // número para carrito
        precioTexto: "Precio: $2,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/antigripales/theraflu.avif"
    },

    //Dermocosmética
    {
        id: "acido_hialuronico",
        name: "Cerave Ácido Hialurónico",
        url: "/product/acido_hialuronico",
        categoria: "dermocosmetica",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/dermocosmetica/cerave-acido-hyaluronico.avif"
    },
    {
        id: "hidratante_cerave",
        name: "Hidratante Cerave",
        url: "/product/hidratante_cerave",
        categoria: "dermocosmetica",
        precio: 1500, // número para carrito
        precioTexto: "Precio: $1,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/dermocosmetica/hidratante-cerave.jpg"
    },
    {
        id: "hidratante_eucerin",
        name: "Hidratante Eucerin",
        url: "/product/hidratante_eucerin",
        categoria: "dermocosmetica",
        precio: 2200, // número para carrito
        precioTexto: "Precio: $2,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/dermocosmetica/hidratante-eucerin.avif"
    },
    {
        id: "hidratante_grande",
        name: "Hidratante Cerave Grande",
        url: "/product/hidratante_grande",
        categoria: "dermocosmetica",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/dermocosmetica/hidratante-cerave-grande.avif"
    },
    {
        id: "retinol",
        name: "Retinol",
        url: "/product/retinol",
        categoria: "dermocosmetica",
        precio: 1100, // número para carrito
        precioTexto: "Precio: $1,100", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/dermocosmetica/retinol.avif"
    },
    {
        id: "serum_vitaminac",
        name: "Serum Vitamina C",
        url: "/product/serum_vitaminac",
        categoria: "dermocosmetica",
        precio: 1400, // número para carrito
        precioTexto: "Precio: $1,400", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/dermocosmetica/serum-vitaminc.avif"
    },

    //Vitaminas y Minerales
    {
        id: "flintstones",
        name: "Flintstones Multivitamínico para niños",
        url: "/product/flintstones",
        categoria: "vitaminas-y-minerales",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/vitaminas-y-minerales/flintstones.avif"
    },
    {
        id: "multivitaminico",
        name: "Multivitamínico",
        url: "/product/multivitaminico",
        categoria: "vitaminas-y-minerales",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/vitaminas-y-minerales/multivitaminico.avif"
    },
    {
        id: "omega3",
        name: "Omega 3",
        url: "/product/omega3",
        categoria: "vitaminas-y-minerales",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/vitaminas-y-minerales/omega3.avif"
    },
    {
        id: "vitafusion",
        name: "Vitafusion",
        url: "/product/vitafusion",
        categoria: "vitaminas-y-minerales",
        precio: 1300, // número para carrito
        precioTexto: "Precio: $1,300", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/vitaminas-y-minerales/vitafusion.avif"
    },
    {
        id: "vitaminac",
        name: "Vitamina C",
        url: "/product/vitaminac",
        categoria: "vitaminas-y-minerales",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/farmacia/vitaminas-y-minerales/vitaminac.avif"
    },

    //--Ferretería--//

    //electricidad
    {
        id: "bombillas_led",
        name: "Bombillas LED",
        url: "/product/bombillas_led",
        categoria: "electricidad",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/electricidad/bombillas-led.avif"
    },
    {
        id: "bombillas",
        name: "Bombillas",
        url: "/product/bombillas",
        categoria: "electricidad",
        precio: 1500, // número para carrito
        precioTexto: "Precio: $1,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/electricidad/bombillas.avif"
    },
    {
        id: "extension",
        name: "Extensión Eléctrica",
        url: "/product/extension",
        categoria: "electricidad",
        precio: 3300, // número para carrito
        precioTexto: "Precio: $3,300", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/electricidad/extension-electrica.avif"
    },
    {
        id: "linterna",
        name: "Linterna",
        url: "/product/linterna",
        categoria: "electricidad",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/electricidad/linterna.png"
    },
    {
        id: "toma_corriente",
        name: "Toma Corriente",
        url: "/product/toma_corriente",
        categoria: "electricidad",
        precio: 5500, // número para carrito
        precioTexto: "Precio: $5,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/electricidad/toma-corriente.png"
    },

    //Herramientas Manuales
    {
        id: "destornillador",
        name: "Destornillador",
        url: "/product/destornillador",
        categoria: "herramientas-manuales",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/herramientas-manuales/destornillador.png"
    },
    {
        id: "llave_de_tuerca",
        name: "Llave de Tuerca",
        url: "/product/llave_de_tuerca",
        categoria: "herramientas-manuales",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/herramientas-manuales/llave-de-tuerca.png"
    },
    {
        id: "martillo",
        name: "Martillo",
        url: "/product/martillo",
        categoria: "herramientas-manuales",
        precio: 1500, // número para carrito
        precioTexto: "Precio: $1,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/herramientas-manuales/martillo.png"
    },
    {
        id: "pinza",
        name: "Pinza",
        url: "/product/pinza",
        categoria: "herramientas-manuales",
        precio: 500, // número para carrito
        precioTexto: "Precio: $500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/herramientas-manuales/pinza.avif"
    },
    {
        id: "sierra_de_mano",
        name: "Sierra de Mano",
        url: "/product/sierra_de_mano",
        categoria: "herramientas-manuales",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/herramientas-manuales/sierra-de-mano.avif"
    },

    //Pinturas y Acabados
    {
        id: "brocha",
        name: "Brocha",
        url: "/product/brocha",
        categoria: "pinturas-y-acabados",
        precio: 500, // número para carrito
        precioTexto: "Precio: $500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/pintura/brocha.avif"
    },
    {
        id: "kit_de_pintura",
        name: "Kit de Pintura",
        url: "/product/kit_de_pintura",
        categoria: "pinturas-y-acabados",
        precio: 1500, // número para carrito
        precioTexto: "Precio: $1,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/pintura/kit-de-pintura.avif"
    },
    {
        id: "pinturas_tropical",
        name: "Pinturas Tropical",
        url: "/product/pinturas_tropical",
        categoria: "pinturas-y-acabados",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/pintura/pinturas-tropical.avif"
    },
    {
        id: "pinturas_tucan",
        name: "Pinturas Tucán",
        url: "/product/pinturas_tucan",
        categoria: "pinturas-y-acabados",
        precio: 2700, // número para carrito
        precioTexto: "Precio: $2,700", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/pintura/pinturas-tucan.avif"
    },
    {
        id: "rodillo_de_pintura",
        name: "Rodillo de Pintura",
        url: "/product/rodillo_de_pintura",
        categoria: "pinturas-y-acabados",
        precio: 1400, // número para carrito
        precioTexto: "Precio: $1,400", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/pintura/rodillo-de-pintura.avif"
    },

    //Plomería
    {
        id: "grifo_moderno",
        name: "Grifo Moderno",
        url: "/product/grifo_moderno",
        categoria: "plomeria",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/plomeria/grifo-moderno.avif"
    },
    {
        id: "grifo",
        name: "Grifo",
        url: "/product/grifo",
        categoria: "plomeria",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/plomeria/grifo.avif"
    },
    {
        id: "manguera_de_jardin",
        name: "Manguera de Jardín",
        url: "/product/manguera_de_jardin",
        categoria: "plomeria",
        precio: 3100, // número para carrito
        precioTexto: "Precio: $3,100", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/plomeria/manguera-de-jardin.jpeg"
    },
    {
        id: "manguera",
        name: "Manguera",
        url: "/product/manguera",
        categoria: "plomeria",
        precio: 2400, // número para carrito
        precioTexto: "Precio: $2,400", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/plomeria/manguera.avif"
    },
    {
        id: "tubo",
        name: "Tubo de Drenaje",
        url: "/product/tubo",
        categoria: "plomeria",
        precio: 600, // número para carrito
        precioTexto: "Precio: $600", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ferreteria/plomeria/tubo-drenaje.avif"
    },

    //--Juguetes--//

    //juguetes para ninas
    {
        id: "muneca_baby_doll",
        name: "Muñeca Baby Doll",
        url: "/product/muneca_baby_doll",
        categoria: "juguetes-para-ninas",
        precio: 500, // número para carrito
        precioTexto: "Precio: $500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninas/baby-doll.avif"
    },
    {
        id: "muneca_barbie",
        name: "Muñeca Barbie",
        url: "/product/muneca_barbie",
        categoria: "juguetes-para-ninas",
        precio: 1000, // número para carrito
        precioTexto: "Precio: $1,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninas/barbie.avif"
    },
    {
        id: "juguetes_de_peluqueria",
        name: "Juguetes de Peluquería",
        url: "/product/juguetes_de_peluqueria",
        categoria: "juguetes-para-ninas",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninas/juguetes-de-peluqueria.avif"
    },
    {
        id: "kit_de_maquillaje",
        name: "Kit de Maquillaje",
        url: "/product/kit_de_maquillaje",
        categoria: "juguetes-para-ninas",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninas/kit-de-maquillaje.avif"
    },
    {
        id: "pinta_unas",
        name: "Pinta Uñas",
        url: "/product/pinta_unas",
        categoria: "juguetes-para-ninas",
        precio: 1400, // número para carrito
        precioTexto: "Precio: $1,400", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninas/pinta-unas.avif"
    },

    //juguetes para niños
    {
        id: "auto_azul",
        name: "Auto Azul",
        url: "/product/auto_azul",
        categoria: "juguetes-para-ninos",
        precio: 1800, // número para carrito
        precioTexto: "Precio: $1,800", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninos/auto-azul.avif",
        unidad: "unidad"
    },
    {
        id: "avion_de_juguete",
        name: "Avión de Juguete",
        url: "/product/avion_de_juguete",
        categoria: "juguetes-para-ninos",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninos/avion.avif",
        unidad: "unidad"
    },
    {
        id: "autos_hot_wheels",
        name: "Autos Hot Wheels",
        url: "/product/autos_hot_wheels",
        categoria: "juguetes-para-ninos",
        precio: 3500, // número para carrito
        precioTexto: "Precio: $3,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninos/autos-hot-wheels.avif",
        unidad: "paquete"
    },
    {
        id: "legos_de_creeper",
        name: "Legos de Creeper",
        url: "/product/legos_de_creeper",
        categoria: "juguetes-para-ninos",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninos/lego-creeper.avif",
        unidad: "unidad"
    },
    {
        id: "legos_de_minecraft",
        name: "Legos de Minecraft",
        url: "/product/legos_de_minecraft",
        categoria: "juguetes-para-ninos",
        precio: 6000, // número para carrito
        precioTexto: "Precio: $6,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/juguetes/juguetes-para-ninos/lego-minecraft.avif",
        unidad: "unidad"
    },

    //--Muebles y Decoración--//

    //Floreros
    {
        id: "florero_de_plantas",
        name: "Florero de Plantas",
        url: "/product/florero_de_plantas",
        categoria: "floreros",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/floreros/florero-de-plantas.avif",
        unidad: "unidad"
    },
    {
        id: "florero_de_vidrio",
        name: "Florero de Vidrio",
        url: "/product/florero_de_vidrio",
        categoria: "floreros",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/floreros/florero-de-vidrio.avif",
        unidad: "unidad"
    },
    {
        id: "jarron",
        name: "Jarrón",
        url: "/product/jarron",
        categoria: "floreros",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/floreros/jarron.avif",
        unidad: "unidad"
    },
    {
        id: "jarrones",
        name: "Jarrones",
        url: "/product/jarrones",
        categoria: "floreros",
        precio: 3500, // número para carrito
        precioTexto: "Precio: $3,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/floreros/jarrones.avif",
        unidad: "unidad"
    },
    {
        id: "tulipanes",
        name: "Tulipanes",
        url: "/product/tulipanes",
        categoria: "floreros",
        precio: 4200, // número para carrito
        precioTexto: "Precio: $4,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/floreros/tulipanes.avif",
        unidad: "unidad"
    },

    //Mesas
    {
        id: "mesa_de_madera",
        name: "Mesa de Madera",
        url: "/product/mesa_de_madera",
        categoria: "mesas",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/mesas/mesa-madera.avif",
        unidad: "unidad"
    },
    {
        id: "mesa_de_noche",
        name: "Mesa de Noche",
        url: "/product/mesa_de_noche",
        categoria: "mesas",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/mesas/mesa-de-noche.avif"
    },
    {
        id: "mesa_moderna",
        name: "Mesa Moderna",
        url: "/product/mesa_moderna",
        categoria: "mesas",
        precio: 6300, // número para carrito
        precioTexto: "Precio: $6,300", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/mesas/mesa-moderna.avif"
    },
    {
        id: "mesa_oscura",
        name: "Mesa Oscura",
        url: "/product/mesa_oscura",
        categoria: "mesas",
        precio: 8000, // número para carrito
        precioTexto: "Precio: $8,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/mesas/mesa-oscura.avif"
    },
    {
        id: "mesa_pequena",
        name: "Mesa Pequeña",
        url: "/product/mesa_pequena",
        categoria: "mesas",
        precio: 12500, // número para carrito
        precioTexto: "Precio: $12,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/mesas/mesa-pequena.avif"
    },

    //Sillones
    {
        id: "sillon_amarillo",
        name: "Sillón Amarillo",
        url: "/product/sillon_amarillo",
        categoria: "sillones",
        precio: 4500, // número para carrito
        precioTexto: "Precio: $4,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sillon/sillon-amarillo.avif",
        unidad: "unidad"
    },
    {
        id: "sillon_azul",
        name: "Sillón Azul",
        url: "/product/sillon_azul",
        categoria: "sillones",
        precio: 5500, // número para carrito
        precioTexto: "Precio: $5,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sillon/sillon-azul.avif",
        unidad: "unidad"
    },
    {
        id: "sillon_blanco",
        name: "Sillón Blanco",
        url: "/product/sillon_blanco",
        categoria: "sillones",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sillon/sillon-blanco.avif",
        unidad: "unidad"
    },
    {
        id: "sillon_gris",
        name: "Sillón Gris",
        url: "/product/sillon_gris",
        categoria: "sillones",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sillon/sillon-gris.avif",
        unidad: "unidad"
    },
    {
        id: "sillon_verde",
        name: "Sillón Verde",
        url: "/product/sillon_verde",
        categoria: "sillones",
        precio: 7000, // número para carrito
        precioTexto: "Precio: $7,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sillon/sillon-verde.avif",
        unidad: "unidad"
    },

    //Sofás
    {
        id: "sofa_cama_blanco",
        name: "Sofá Cama Blanco por unidad",
        url: "/product/sofa_cama_blanco",
        categoria: "sofas",
        precio: 9000, // número para carrito
        precioTexto: "Precio: $9,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sofa/sofa-cama-blanco.png",
        unidad: "unidad"
    },
    {
        id: "sofa_gris",
        name: "Sofá Gris",
        url: "/product/sofa_gris",
        categoria: "sofas",
        precio: 8000, // número para carrito
        precioTexto: "Precio: $8,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sofa/sofa-gris.avif",
        unidad: "unidad"
    },
    {
        id: "sofa_media_luna",
        name: "Sofá Media Luna",
        url: "/product/sofa_media_luna",
        categoria: "sofas",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sofa/sofa-media-luna.avif",
        unidad: "unidad"
    },
    {
        id: "sofa_negro",
        name: "Sofá Negro",
        url: "/product/sofa_negro",
        categoria: "sofas",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sofa/sofa-negro.avif"
    },
    {
        id: "sofa_verde",
        name: "Sofá Verde",
        url: "/product/sofa_verde",
        categoria: "sofas",
        precio: 14000, // número para carrito
        precioTexto: "Precio: $14,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/muebles-y-decoracion/sofa/sofa-verde.avif"
    },

    //--Ropa--//

    //Pantalones para Hombres
    {
        id: "pantalon_negro",
        name: "Pantalón Negro",
        url: "/product/pantalon_negro",
        categoria: "pantalones-para-hombres",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-hombres/pantalon-negro.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalones_de_golf",
        name: "Pantalones de Golf",
        url: "/product/pantalones_de_golf",
        categoria: "pantalones-para-hombres",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-hombres/pantalones-de-golf.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalones_deportivos_joggers",
        name: "Pantalones Deportivos Joggers",
        url: "/product/pantalones_deportivos_joggers",
        categoria: "pantalones-para-hombres",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-hombres/pantalones-deportivos-joggers.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalones_jeans",
        name: "Pantalones Jeans",
        url: "/product/pantalones_jeans",
        categoria: "pantalones-para-hombres",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-hombres/pantalones-jeans.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalones_joggers",
        name: "Pantalones Joggers",
        url: "/product/pantalones_joggers",
        categoria: "pantalones-para-hombres",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-hombres/pantalones-joggers.avif",
        unidad: "unidad",
        quantity: 1
    },

    // Pantalones para Mujeres

    {
        id: "leggings_de_licra",
        name: "Leggings de Licra",
        url: "/product/leggings_de_licra",
        categoria: "pantalones-para-mujeres",
        precio: 1500, // número para carrito
        precioTexto: "Precio: $1,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-mujeres/licra.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalon_acampanado",
        name: "Pantalón Acampanado",
        url: "/product/pantalon_acampanado",
        categoria: "pantalones-para-mujeres",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-mujeres/pantalon-acampanado.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalon_casual",
        name: "Pantalón Casual",
        url: "/product/pantalon_casual",
        categoria: "pantalones-para-mujeres",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-mujeres/pantalon-casual.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalon_jean",
        name: "Pantalón Jean",
        url: "/product/pantalon_jean",
        categoria: "pantalones-para-mujeres",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-mujeres/pantalon-jean-mujer.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalon_liso_mujer",
        name: "Pantalón Liso Mujer",
        url: "/product/pantalon_liso_mujer",
        categoria: "pantalones-para-mujeres",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-mujeres/pantalon-liso-mujer.avif",
        unidad: "unidad",
        quantity: 1
    },

    // Pantalones para niños
    {
        id: "jean_para_ninos",
        name: "Jean para niños",
        url: "/product/jean_para_ninos",
        categoria: "pantalones-para-ninos",
        precio: 1000, // número para carrito
        precioTexto: "Precio: $1,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-ninos/jean-ninos.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "licra_para_ninos",
        name: "Licra para niños",
        url: "/product/licra_para_ninos",
        categoria: "pantalones-para-ninos",
        precio: 1500, // número para carrito
        precioTexto: "Precio: $1,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-ninos/licra.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalon_deportivo",
        name: "Pantalón Deportivo",
        url: "/product/pantalon_deportivo",
        categoria: "pantalones-para-ninos",
        precio: 2300, // número para carrito
        precioTexto: "Precio: $2,300", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-ninos/pantalon-deportivo.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalon_liso",
        name: "Pantalón Liso",
        url: "/product/pantalon_liso",
        categoria: "pantalones-para-ninos",
        precio: 2000, // número para carrito
        precioTexto: "Precio: $2,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-ninos/pantalon-liso.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "pantalones_lisos_para_ninos",
        name: "Pantalones Lisos para niños",
        url: "/product/pantalones_lisos_para_ninos",
        categoria: "pantalones-para-ninos",
        precio: 2500, // número para carrito
        precioTexto: "Precio: $2,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/pantalones-para-ninos/pantalon-para-ninos.avif",
        unidad: "unidad",
        quantity: 1
    },

    // Trajes para Hombres
    {
        id: "traje_2_piezas",
        name: "Traje 2 Piezas",
        url: "/product/traje_2_piezas",
        categoria: "trajes-para-hombres",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/trajes-para-hombre/traje-2piezas.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "traje_azul",
        name: "Traje Azul",
        url: "/product/traje_azul",
        categoria: "trajes-para-hombres",
        precio: 4000, // número para carrito
        precioTexto: "Precio: $4,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/trajes-para-hombre/traje-azul.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "traje_completo",
        name: "Traje Completo",
        url: "/product/traje_completo",
        categoria: "trajes-para-hombres",
        precio: 3000, // número para carrito
        precioTexto: "Precio: $3,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/trajes-para-hombre/traje-completo.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "traje_elegante",
        name: "Traje Elegante",
        url: "/product/traje_elegante",
        categoria: "trajes-para-hombres",
        precio: 3500, // número para carrito
        precioTexto: "Precio: $3,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/trajes-para-hombre/traje-elegante.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "traje_negro",
        name: "Traje Negro",
        url: "/product/traje_negro",
        categoria: "trajes-para-hombres",
        precio: 4200, // número para carrito
        precioTexto: "Precio: $4,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/trajes-para-hombre/traje-negro.avif",
        unidad: "unidad",
        quantity: 1
    },

    //Vestidos
    {
        id: "vestido_ajustado",
        name: "Vestido Ajustado",
        url: "/product/vestido_ajustado",
        categoria: "vestidos",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/vestido-de-mujer/vestido-ajustado.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "vestido_cuello_cuadrado",
        name: "Vestido de Cuello Cuadrado",
        url: "/product/vestido_cuello_cuadrado",
        categoria: "vestidos",
        precio: 4500, // número para carrito
        precioTexto: "Precio: $4,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/vestido-de-mujer/vestido-cuello-cuadrado.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "vestido_de_invierno",
        name: "Vestido de Invierno",
        url: "/product/vestido_de_invierno",
        categoria: "vestidos",
        precio: 6000, // número para carrito
        precioTexto: "Precio: $6,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/vestido-de-mujer/vestido-de-invierno.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "vestido_elegante",
        name: "Vestido Elegante",
        url: "/product/vestido_elegante",
        categoria: "vestidos",
        precio: 3500, // número para carrito
        precioTexto: "Precio: $3,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/vestido-de-mujer/vestido-elegante.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "vestido_negro",
        name: "Vestido Negro",
        url: "/product/vestido_negro",
        categoria: "vestidos",
        precio: 4200, // número para carrito
        precioTexto: "Precio: $4,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/ropa/vestido-de-mujer/vestido-negro.avif",
        unidad: "unidad",
        quantity: 1
    },

    //--Tecnología--//

    //Bocinas
    {
        id: "bocina_aiwa",
        name: "Bocina Aiwa",
        url: "/product/bocina_aiwa",
        categoria: "bocinas",
        precio: 5000, // número para carrito
        precioTexto: "Precio: $5000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/bocina/bocina-aiwa.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "bocina_lg",
        name: "Bocina LG",
        url: "/product/bocina_lg",
        categoria: "bocinas",
        precio: 4500, // número para carrito
        precioTexto: "Precio: $4,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/bocina/bocina-lg.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "bocina_samsung",
        name: "Bocina Samsung",
        url: "/product/bocina_samsung",
        categoria: "bocinas",
        precio: 6000, // número para carrito
        precioTexto: "Precio: $6,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/bocina/bocina-samsung.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "bocina_stage",
        name: "Bocina Stage",
        url: "/product/bocina_stage",
        categoria: "bocinas",
        precio: 5500, // número para carrito
        precioTexto: "Precio: $5,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/bocina/bocina-stage.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "bocina_tecnomaster",
        name: "Bocina tecnomaster",
        url: "/product/bocina_tecnomaster",
        categoria: "bocinas",
        precio: 9000, // número para carrito
        precioTexto: "Precio: $9,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/bocina/bocina-tecnomaster.avif",
        unidad: "unidad",
        quantity: 1
    },

    //Celulares
    {
        id: "celular_samsung_a26",
        name: "Celular Samsung A26",
        url: "/product/celular_samsung_a26",
        categoria: "celulares",
        precio: 40000, // número para carrito
        precioTexto: "Precio: $40,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/celulares/celular-samsung-a26.png",
        unidad: "unidad"
    },
    {
        id: "celular_samsung_a35",
        name: "Celular Samsung A35",
        url: "/product/celular_samsung_a35",
        categoria: "celulares",
        precio: 23000, // número para carrito
        precioTexto: "Precio: $23,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/celulares/celular-samsung-a35.png",
        unidad: "unidad"
    },
    {
        id: "celular_s24_ultra",
        name: "Celular S24 Ultra",
        url: "/product/celular_s24_ultra",
        categoria: "celulares",
        precio: 55000, // número para carrito
        precioTexto: "Precio: $55,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/celulares/celular-s24ultra.png",
        unidad: "unidad"
    },
    {
        id: "iphone_14",
        name: "iPhone 14",
        url: "/product/iphone_14",
        categoria: "celulares",
        precio: 35000, // número para carrito
        precioTexto: "Precio: $35,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/celulares/iphone14.avif",
        unidad: "unidad"
    },
    {
        id: "iphone_14_pro",
        name: "iPhone 14 Pro",
        url: "/product/iphone_14_pro",
        categoria: "celulares",
        precio: 42000, // número para carrito
        precioTexto: "Precio: $42,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/celulares/iphone14pro.webp",
        unidad: "unidad"
    },

    //Laptops
    {
        id: "laptop_asus",
        name: "Laptop Asus",
        url: "/product/laptop_asus",
        categoria: "laptops",
        precio: 45000, // número para carrito
        precioTexto: "Precio: $45,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/laptops/laptop-asus.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "laptop_dell",
        name: "Laptop Dell",
        url: "/product/laptop_dell",
        categoria: "laptops",
        precio: 48000, // número para carrito
        precioTexto: "Precio: $48,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/laptops/laptop-dell.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "laptop_dragonx",
        name: "Laptop DragonX",
        url: "/product/laptop_dragonx",
        categoria: "laptops",
        precio: 54000, // número para carrito
        precioTexto: "Precio: $54,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/laptops/laptop-dragonx.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "laptop_hp",
        name: "Laptop HP",
        url: "/product/laptop_hp",
        categoria: "laptops",
        precio: 56000, // número para carrito
        precioTexto: "Precio: $56,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/laptops/laptop-hp.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "laptop_lenovo",
        name: "Laptop Lenovo",
        url: "/product/laptop_lenovo",
        categoria: "laptops",
        precio: 70000, // número para carrito
        precioTexto: "Precio: $70,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/laptops/laptop-lenovo.png",
        unidad: "unidad",
        quantity: 1
    },

    //Tablets
    {
        id: "tablet_apple",
        name: "Tablet Apple",
        url: "/product/tablet_apple",
        categoria: "tablets",
        precio: 30000, // número para carrito
        precioTexto: "Precio: $30,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/tablets/tablet-apple.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "tablet_rted",
        name: "Tablet RTED",
        url: "/product/tablet_rted",
        categoria: "tablets",
        precio: 23000, // número para carrito
        precioTexto: "Precio: $23,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/tablets/tablet-rted.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "tablet_samsung",
        name: "Tablet Samsung",
        url: "/product/tablet_samsung",
        categoria: "tablets",
        precio: 26000, // número para carrito
        precioTexto: "Precio: $26,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/tablets/tablet-samsung.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "tablet_tcl",
        name: "Tablet TCL",
        url: "/product/tablet_tcl",
        categoria: "tablets",
        precio: 15000, // número para carrito
        precioTexto: "Precio: $15,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/tablets/tablet-tcl.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "tablet_tecnomaster",
        name: "Tablet tecnomaster",
        url: "/product/tablet_tecnomaster",
        categoria: "tablets",
        precio: 22000, // número para carrito
        precioTexto: "Precio: $22,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/tablets/tablet-tecnomaster.avif",
        unidad: "unidad",
        quantity: 1
    },

    //Televisores
    {
        id: "televisor_led_50",
        name: "Televisor LED 50 Pulgadas",
        url: "/product/televisor_led_50",
        categoria: "televisores",
        precio: 36500, // número para carrito
        precioTexto: "Precio: $36,500", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/televisores/tv-led-50pulgadas.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "televisor_led_lg",
        name: "Televisor LED LG",
        url: "/product/televisor_led_lg",
        categoria: "televisores",
        precio: 57000, // número para carrito
        precioTexto: "Precio: $57,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/televisores/tv-led-lg.png",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "televisor_led_samsung",
        name: "Televisor LED Samsung",
        url: "/product/televisor_led_samsung",
        categoria: "televisores",
        precio: 56000, // número para carrito
        precioTexto: "Precio: $56,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/televisores/tv-led-samsung.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "televisor_led_tecnomaster",
        name: "Televisor LED tecnomaster",
        url: "/product/televisor_led_tecnomaster",
        categoria: "televisores",
        precio: 55200, // número para carrito
        precioTexto: "Precio: $55,200", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/televisores/tv-led-tecnomaster.avif",
        unidad: "unidad",
        quantity: 1
    },
    {
        id: "televisor_samsung_75_pulgadas",
        name: "Televisor Samsung 75 pulgadas",
        url: "/product/televisor_samsung_75_pulgadas",
        categoria: "televisores",
        precio: 44000, // número para carrito
        precioTexto: "Precio: $44,000", // texto para mostrar en resultados
        imagen: "/assets/images/productos/tecnologia/televisores/tv-samsung.png",
        unidad: "unidad",
        quantity: 1
    },
];



















































































































































