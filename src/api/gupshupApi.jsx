
import { showSnackbar } from "../utils/Snackbar";

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

    console.log("Status code:", response.status);
    console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      const errorText = await response.text();
      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
        console.error("Error response (JSON):", errorResponse);
      } catch (e) {
        errorResponse = { message: "Error no JSON", raw: errorText };
        console.error("Error response (texto):", errorText);
      }
      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla creada exitosamente", "success");
    console.log("Response: ", result);
    return result; // Retornar el resultado
  } catch (error) {
    console.error("Error en la solicitud:", error);
    console.error("Error detallado:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};

export const createTemplateCatalogGupshup = async (appId, authCode, templateData, validateFn) => {
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

    console.log("Status code:", response.status);
    console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      const errorText = await response.text();
      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
        console.error("Error response (JSON):", errorResponse);
      } catch (e) {
        errorResponse = { message: "Error no JSON", raw: errorText };
        console.error("Error response (texto):", errorText);
      }
      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla creada exitosamente", "success");
    console.log("Response: ", result);
    return result; // Retornar el resultado
  } catch (error) {
    console.error("Error en la solicitud:", error);
    console.error("Error detallado:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};

export const createTemplateCarouselGupshup = async (appId, authCode, templateData, validateFn) => {
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
    example,
    carousel
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
  data.append("example", example);
  data.append("enableSample", true);
  data.append("allowTemplateCategoryChange", false);
  data.append("cards", carousel)

  console.log("Request enviado:", JSON.stringify(Object.fromEntries(data.entries()), null, 2));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });

    console.log("Status code:", response.status);
    console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      const errorText = await response.text();
      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
        console.error("Error response (JSON):", errorResponse);
      } catch (e) {
        errorResponse = { message: "Error no JSON", raw: errorText };
        console.error("Error response (texto):", errorText);
      }
      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla creada exitosamente", "success");
    console.log("Response: ", result);
    return result; // Retornar el resultado
  } catch (error) {
    console.error("Error en la solicitud:", error);
    console.error("Error detallado:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};  

export const editTemplateCarouselGupshup = async (appId, authCode, templateData, validateFn) => {
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
    example,
    carousel
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
  data.append("example", example);
  data.append("enableSample", "true");
  data.append("allowTemplateCategoryChange", "false");
  data.append("cards", JSON.stringify(carousel));


  console.log("Request enviado:", JSON.stringify(Object.fromEntries(data.entries()), null, 2));
  

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: data,
    });

    console.log("Status code:", response.status);
    console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));

    if (!response.ok) {
      const errorText = await response.text();
      let errorResponse;
      try {
        errorResponse = JSON.parse(errorText);
        console.error("Error response (JSON):", errorResponse);
      } catch (e) {
        errorResponse = { message: "Error no JSON", raw: errorText };
        console.error("Error response (texto):", errorText);
      }
      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla creada exitosamente", "success");
    console.log("Response: ", result);
    return result; // Retornar el resultado
  } catch (error) {
    console.error("Error en la solicitud:", error);
    console.error("Error detallado:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};  