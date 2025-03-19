// Functions for interacting with the Gupshup API

/**
 * Sends a request to create a template in Gupshup
 */
export const createTemplateGupshup = async (appId, authCode, templateData, validateFn) => {
    // Validar campos antes de enviar la solicitud
    if (validateFn && !validateFn()) {
      return null; // Detener la ejecución si hay errores
    }
  
    const {
      templateName,
      selectedCategory,
      languageCode,
      templateType,
      vertical,
      message,
      header,
      footer,
      mediaId,
      buttons,
      example
    } = templateData;
  
    const url = `https://partner.gupshup.io/partner/app/${appId}/templates`;
    const headers = {
      Authorization: authCode,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  
    const data = new URLSearchParams();
    data.append("elementName", templateName);
    data.append("category", selectedCategory.toUpperCase());
    data.append("languageCode", languageCode);
    data.append("templateType", templateType.toUpperCase());
    data.append("vertical", vertical);
    data.append("content", message);
  
    if (header) {
      data.append("header", header);
    }
  
    if (footer) { 
      data.append("footer", footer);
    }
  
    if (mediaId) {
      data.append("exampleMedia", mediaId);
    }
  
    const formattedButtons = buttons.map((button) => {
      const buttonData = {
        type: button.type,
        text: button.title,
      };
  
      if (button.type === "URL") {
        buttonData.url = button.url;
      } else if (button.type === "PHONE_NUMBER") {
        buttonData.phone_number = button.phoneNumber;
      }
  
      return buttonData;
    });
  
    data.append("buttons", JSON.stringify(formattedButtons));
    data.append("example", example);
    data.append("enableSample", true);
    data.append("allowTemplateCategoryChange", false);
  
    console.log("Request enviado:", JSON.stringify(Object.fromEntries(data.entries()), null, 2));
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: data,
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Error response:", errorResponse);
        showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
        return null; // Retornar null en caso de error
      }
  
      const result = await response.json();
      showSnackbar("✅ Plantilla creada exitosamente", "success");
      console.log("Response: ", result);
      return result; // Retornar el resultado
    } catch (error) {
      console.error("Error en la solicitud:", error);
      showSnackbar("❌ Error al crear la plantilla", "error");
      return null; // Retornar null en caso de error
    }
  };