
import { showSnackbar } from '../utils/Snackbar';
import { getMediaType } from '../utils/validarUrl';

/* Guardo la información de los parametros de la plantilla */
const saveTemplateParams = async (ID_PLANTILLA, variables, variableDescriptions) => {
  const tipoDatoId = 1;

  try {
    const results = [];
    for (let i = 0; i < variables.length; i++) {
      const variableData = {
        ID_PLANTILLA: ID_PLANTILLA,
        ID_PLANTILLA_TIPO_DATO: tipoDatoId,
        NOMBRE: variableDescriptions[variables[i]] || '',
        PLACEHOLDER: variableDescriptions[variables[i]] || '',
        ORDEN: i + 1,
        CREADO_POR: "Sistema.TalkMe",
      };


      const response = await fetch('https://dev.talkme.pro/templatesGS/api/parametros/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variableData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error al guardar la variable ${variables[i]}: ${errorMessage}`);
      }

      const result = await response.json();
      results.push(result);
    }

    console.log('Variables guardadas:', results);
    showSnackbar("✅ Variables guardadas exitosamente", "success");
    return results;
  } catch (error) {
    console.error('Error:', error);
    showSnackbar("❌ Error al guardar las variables", "error");
    throw error;
  }
};

const saveCardsTemplate = async ({ ID_PLANTILLA, cards = [] }, idNombreUsuarioTalkMe) => {
  const url = 'https://dev.talkme.pro/templatesGS/api/tarjetas/';
  const headers = {
    "Content-Type": "application/json",
  };

  for (const card of cards) {
    // Adaptamos la estructura a lo que espera el API
    const mediaUrl = card?.fileData?.url || null;
    const body = card.messageCard;
    const buttons = card.buttons || [];
    

    if (!mediaUrl && !body) {
      console.warn("Tarjeta ignorada: no tiene contenido (mediaUrl o body)");
      continue;
    }

    const data = {
      ID_PLANTILLA_WHATSAPP_TARJETA: null,
      ID_PLANTILLA: ID_PLANTILLA,
      ID_MEDIA: null,
      DESCRIPCION: body,
      LINK: mediaUrl || null,
      BOTON_0_TEXTO: buttons[0]?.title || '',
      BOTON_0_COMANDO: buttons[0]?.title || '',
      BOTON_1_TEXTO: buttons[1]?.title || '',
      BOTON_1_COMANDO: buttons[1]?.title || '',
      CREADO_POR: idNombreUsuarioTalkMe,
    };

    console.log("Enviando tarjeta:", data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error al guardar tarjeta:", errorResponse);
        showSnackbar(`❌ Error guardando tarjeta: ${errorResponse.message || "Solicitud inválida"}`, "error");
        continue;
      }

      const result = await response.json();
      console.log("Tarjeta guardada exitosamente:", result);
      showSnackbar("✅ Tarjeta guardada correctamente", "success");
    } catch (error) {
      console.error("Error en la petición de tarjeta:", error);
      showSnackbar("❌ Error en la petición de tarjeta", "error");
    }
  }
};


/* Guardo la información de la plantilla*/
export const saveTemplateToTalkMe = async (templateId, templateData, idNombreUsuarioTalkMe, variables = [], variableDescriptions = {}, cards = []) => {
  const { templateName, selectedCategory, message, uploadedUrl, templateType } = templateData;

  const url = 'https://dev.talkme.pro/templatesGS/api/plantillas/';
  const headers = {
    "Content-Type": "application/json",
  };
  //13 y 14 son en certi igual que 149 en bot redes
  let ID_PLANTILLA_CATEGORIA;
  if (selectedCategory === "MARKETING") {
    ID_PLANTILLA_CATEGORIA = 17;
  } else if (selectedCategory === "UTILITY") {
    ID_PLANTILLA_CATEGORIA = 18;
  } else {
    console.error("Categoría no válida:", selectedCategory);
    showSnackbar("❌ Categoría no válida", "error");
    return null; // Retornar null si la categoría no es válida
  }

  let TIPO_PLANTILLA;
  let PANTALLAS;
  if (templateType === "CAROUSEL"){
    TIPO_PLANTILLA = 1;
    PANTALLAS = 4;
  } else {
    TIPO_PLANTILLA = 0;
    PANTALLAS = 0;
  }

  const mediaMap = {
    IMAGE: "image",
    VIDEO: "video",
    DOCUMENT: "document",
    CAROUSEL: "image",
    CATALOG: "image"
  };
  
  const MEDIA = mediaMap[templateType] || null;
  

  // Crear un objeto con los datos
  const data = {
    ID_PLANTILLA: null,
    ID_PLANTILLA_CATEGORIA: ID_PLANTILLA_CATEGORIA,
    ID_BOT_REDES: 721,
    ID_INTERNO: templateId,
    NOMBRE: templateName,
    MENSAJE: message,
    TIPO_PLANTILLA: TIPO_PLANTILLA,
    MEDIA: MEDIA,
    URL: uploadedUrl,
    PANTALLAS: PANTALLAS,
    ESTADO: 1,
    AUTORIZADO: 1,
    ELIMINADO: 0,
    SEGUIMIENTO_EDC: 0,
    CREADO_POR: idNombreUsuarioTalkMe,
  };

  // Imprimir el segundo request
  console.log("Segundo request enviado:", {
    url: url,
    headers: headers,
    body: data,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response:", errorResponse);
      showSnackbar(`❌ Error en el segundo request: ${errorResponse.message || "Solicitud inválida"}`, "error");
      return null; // Retornar null en caso de error
    }

    const result = await response.json();
    showSnackbar("✅ Segundo request completado exitosamente", "success");
    console.log("Response del segundo request: ", result);

    // Si tenemos variables, hacer el tercer request
    if (result && result.ID_PLANTILLA && variables && variables.length > 0) {
      await saveTemplateParams(result.ID_PLANTILLA, variables, variableDescriptions);
    }

    if (result && result.ID_PLANTILLA && cards  && cards.length > 0) {
      await saveCardsTemplate(
        {
          ID_PLANTILLA: result.ID_PLANTILLA,
          cards: cards 
        },
        idNombreUsuarioTalkMe
      );
    }

    return result; // Retornar el resultado en caso de éxito
  } catch (error) {
    console.error("Error en el segundo request:", error);
    showSnackbar("❌ Error en el segundo request", "error");
    return null; // Retornar null en caso de error
  }
};

export const editTemplateToTalkMe = async (idTemplate, templateData, idNombreUsuarioTalkMe, variables = [], variableDescriptions = {}, cards = []) => {
  const { templateName, selectedCategory, message, uploadedUrl, templateType } = templateData;

  // URL para actualizar plantilla por ID_INTERNO
  const url = `https://dev.talkme.pro/templatesGS/api/plantillas/${idTemplate}`;
  const headers = {
    "Content-Type": "application/json",
  };

  // Mapeo de categorías
  let ID_PLANTILLA_CATEGORIA;
  if (selectedCategory === "MARKETING") {
    ID_PLANTILLA_CATEGORIA = 17;
  } else if (selectedCategory === "UTILITY") {
    ID_PLANTILLA_CATEGORIA = 18;
  } else {
    console.error("Categoría no válida:", selectedCategory);
    showSnackbar("❌ Categoría no válida", "error");
    return null;
  }

  // Configuración de tipo de plantilla
  let TIPO_PLANTILLA;
  let PANTALLAS;
  if (templateType === "CAROUSEL") {
    TIPO_PLANTILLA = 1;
    PANTALLAS = 4;
  } else {
    TIPO_PLANTILLA = 0;
    PANTALLAS = 0;
  }

  // Mapeo de tipos de media
  const mediaMap = {
    IMAGE: "image",
    VIDEO: "video",
    DOCUMENT: "document",
    CAROUSEL: "image",
    CATALOG: "image"
  };
  
  const MEDIA = mediaMap[templateType] || null;
  
  // Crear un objeto con los datos actualizados
  const data = {
    ID_INTERNO: idTemplate, // ID de la plantilla de GupShup
    ID_PLANTILLA_CATEGORIA: ID_PLANTILLA_CATEGORIA,
    ID_BOT_REDES: 721,
    NOMBRE: templateName,
    MENSAJE: message,
    TIPO_PLANTILLA: TIPO_PLANTILLA,
    MEDIA: MEDIA,
    URL: uploadedUrl,
    PANTALLAS: PANTALLAS,
    ESTADO: 1,
    AUTORIZADO: 1,
    ELIMINADO: 0,
    SEGUIMIENTO_EDC: 0,
    MODIFICADO_POR: idNombreUsuarioTalkMe,
    FECHA_MODIFICACION: new Date().toISOString()
  };

  // Log para seguimiento
  console.log("Request de edición enviado:", {
    url: url,
    headers: headers,
    body: data,
  });

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response:", errorResponse);
      showSnackbar(`❌ Error al editar la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      return null;
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla actualizada exitosamente", "success");
    console.log("Response de la edición: ", result);

    // Para actualizar los parámetros y tarjetas, necesitamos el ID_PLANTILLA
    // que viene en la respuesta del servidor
    const talkmeId = result.ID_PLANTILLA;

    // Actualizar variables si existen
    if (talkmeId && variables && variables.length > 0) {
      try {
        await deleteTemplateParams(talkmeId);
        await saveTemplateParams(talkmeId, variables, variableDescriptions);
      } catch (error) {
        console.error("Error al actualizar los parámetros:", error);
        showSnackbar("⚠️ Error al actualizar los parámetros", "warning");
      }
    }

    // Para las tarjetas, usaremos un enfoque diferente ya que no existe el endpoint DELETE
    if (talkmeId && cards && cards.length > 0) {
      try {
        // 1. Primero obtenemos todas las tarjetas existentes para esta plantilla
        const tarjetasExistentesResponse = await fetch(`https://dev.talkme.pro/templatesGS/api/plantillas/cards/plantilla/${talkmeId}`);
        
        if (tarjetasExistentesResponse.ok) {
          const tarjetasExistentes = await tarjetasExistentesResponse.json();
          
          // 2. Eliminamos manualmente cada tarjeta existente
          for (const tarjeta of tarjetasExistentes) {
            const deleteResponse = await fetch(`https://dev.talkme.pro/templatesGS/api/plantillas/cards/${tarjeta.ID_PLANTILLA_WHATSAPP_TARJETA}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              }
            });
            
            if (!deleteResponse.ok) {
              console.warn(`No se pudo eliminar la tarjeta ${tarjeta.ID_PLANTILLA_WHATSAPP_TARJETA}`);
            }
          }
        } else {
          console.warn("No se pudieron obtener las tarjetas existentes");
        }
        
        // 3. Ahora agregamos las nuevas tarjetas
        for (const card of cards) {
          await saveCardTemplate({
            ID_PLANTILLA: talkmeId,
            ...card
          }, idNombreUsuarioTalkMe);
        }
        
      } catch (cardError) {
        console.error("Error al gestionar las tarjetas:", cardError);
        
        // 4. Plan B: Si el enfoque anterior falla, simplemente agregamos las nuevas tarjetas
        try {
          await saveCardsTemplate(
            {
              ID_PLANTILLA: talkmeId,
              cards: cards 
            },
            idNombreUsuarioTalkMe
          );
          console.log("Se agregaron nuevas tarjetas (posiblemente duplicadas)");
        } catch (saveError) {
          console.error("Error al guardar las tarjetas:", saveError);
          showSnackbar("⚠️ La plantilla se actualizó pero hubo un problema con las tarjetas", "warning");
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error al editar la plantilla:", error);
    showSnackbar("❌ Error al editar la plantilla", "error");
    return null;
  }
};

// Función para guardar una sola tarjeta
const saveCardTemplate = async (cardData, idNombreUsuarioTalkMe) => {
  try {
    const url = 'https://dev.talkme.pro/templatesGS/api/plantillas/cards/';
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cardData,
        CREADO_POR: idNombreUsuarioTalkMe
      })
    });

    if (!response.ok) {
      throw new Error(`Error al guardar la tarjeta: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error guardando tarjeta:", error);
    throw error;
  }
};


export { saveTemplateParams };