
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
  const url = 'http://localhost:3004/api/tarjetas/';
  const headers = {
    "Content-Type": "application/json",
  };

  for (const card of cards) {
    const { title, mediaUrl, body, buttons = [] } = card;

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
      BOTON_0_TEXTO: buttons[0]?.text || null,
      BOTON_0_COMANDO: buttons[0]?.text || null,
      BOTON_1_TEXTO: buttons[1]?.text || null,
      BOTON_1_COMANDO: buttons[1]?.text || null,
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
  const { templateName, selectedCategory, message, uploadedUrl } = templateData;

  const url = 'https://dev.talkme.pro/templatesGS/api/plantillas/';
  const headers = {
    "Content-Type": "application/json",
  };
  //13 y 14 son en certi
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

  // Crear un objeto con los datos
  const data = {
    ID_PLANTILLA: null,
    ID_PLANTILLA_CATEGORIA: ID_PLANTILLA_CATEGORIA,
    ID_BOT_REDES: 149,
    ID_INTERNO: templateId,
    NOMBRE: templateName,
    MENSAJE: message,
    TIPO_PLANTILLA: 0,
    MEDIA: getMediaType(uploadedUrl) ?? null,
    URL: uploadedUrl,
    PANTALLAS: 0,
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

export { saveTemplateParams };