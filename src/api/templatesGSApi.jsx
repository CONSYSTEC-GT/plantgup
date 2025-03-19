// Functions for interacting with the TalkMe templates API

import { getMediaType, showSnackbar } from '../utils/helpers';

/**
 * Saves template parameters to TalkMe backend
 */
const saveTemplateParams = async (ID_PLANTILLA, variables, variableExamples) => {
  const tipoDatoId = 1;

  try {
    const results = [];
    for (let i = 0; i < variables.length; i++) {
      const variableData = {
        ID_PLANTILLA: ID_PLANTILLA,
        ID_PLANTILLA_TIPO_DATO: tipoDatoId,
        NOMBRE: variableExamples[variables[i]] || '',
        PLACEHOLDER: variableExamples[variables[i]] || '',
        ORDEN: i + 1,
        CREADO_POR: "Sistema.TalkMe",
      };
      
      const response = await fetch('https://certificacion.talkme.pro/templatesGS/api/parametros/', {
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

/**
 * Saves template information to TalkMe backend
 */
export const saveTemplateToTalkMe = async (templateId, templateData, idNombreUsuarioTalkMe, variables = [], variableExamples = {}) => {
  const { templateName, selectedCategory, message, uploadedUrl } = templateData;
  
  const url = "https://certificacion.talkme.pro/templatesGS/api/plantillas/";
  const headers = {
    "Content-Type": "application/json",
  };

  // Convertir selectedCategory a ID_PLANTILLA_CATEGORIA
  let ID_PLANTILLA_CATEGORIA;
  if (selectedCategory === "MARKETING") {
    ID_PLANTILLA_CATEGORIA = 13;
  } else if (selectedCategory === "UTILITY") {
    ID_PLANTILLA_CATEGORIA = 14;
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
    MEDIA: getMediaType(uploadedUrl).toLowerCase(),
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
      await saveTemplateParams(result.ID_PLANTILLA, variables, variableExamples);
    }
    
    return result; // Retornar el resultado en caso de éxito
  } catch (error) {
    console.error("Error en el segundo request:", error);
    showSnackbar("❌ Error en el segundo request", "error");
    return null; // Retornar null en caso de error
  }
};

// Exportar ambas funciones
export { saveTemplateParams };