
import { showSnackbar } from "../utils/Snackbar";
import { saveTemplateLog } from "./templatesGSLog";

// PLANTILLAS NORMALES
export const createTemplateGupshup = async (appId, authCode, templateData, idNombreUsuarioTalkMe, urlTemplatesGS, validateFn) => {
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
    //uploadedUrl,
    buttons,
    example,
    exampleHeader
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
  data.append("exampleHeader", exampleHeader);
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

      // Agregar log antes de enviar para verificar los datos
      console.log("Datos que se enviarán:", {
        ...templateData,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });
      // Guardar log de error
      await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });

      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();

    // Guardar log exitoso
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        GUPSHUP_TEMPLATE_ID: result.template.id,
        urlTemplatesGS,
        STATUS: "CREATED",
        REJECTION_REASON: null,
        CREADO_POR: idNombreUsuarioTalkMe,
      });

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

    // Guardar log de error
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });

    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};

export const editTemplateGupshup = async (appId, authCode, templateData, idTemplate, validateFn) => {
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


  const url = `https://partner.gupshup.io/partner/app/${appId}/templates/${idTemplate}`;
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
      throw new Error(errorResponse.message || "Error al editar la plantilla");
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla editada exitosamente", "success");
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

// PLANTILLAS CATALOGO
export const createTemplateCatalogGupshup = async (appId, authCode, templateData, idNombreUsuarioTalkMe, urlTemplatesGS, validateFn) => {
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

      // Agregar log antes de enviar para verificar los datos
      console.log("Datos que se enviarán:", {
        ...templateData,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });
      // Guardar log de error
      await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });

      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();

    // Guardar log exitoso
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        GUPSHUP_TEMPLATE_ID: result.template.id,
        urlTemplatesGS,
        STATUS: "CREATED",
        REJECTION_REASON: null,
        CREADO_POR: idNombreUsuarioTalkMe,
      });

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

    // Guardar log de error
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });


    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};

export const editTemplateCatalogGupshup = async (appId, authCode, templateData, idTemplate, idNombreUsuarioTalkMe, urlTemplatesGS, validateFn) => {
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


  const url = `https://partner.gupshup.io/partner/app/${appId}/templates/${idTemplate}`;
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

      // Agregar log antes de enviar para verificar los datos
      console.log("Datos que se enviarán:", {
        ...templateData,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });

      // Guardar log de error
      await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });


      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al editar la plantilla");
    }

    const result = await response.json();

    // Guardar log exitoso
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        GUPSHUP_TEMPLATE_ID: result.template.id,
        urlTemplatesGS,
        STATUS: "CREATED",
        REJECTION_REASON: null,
        CREADO_POR: idNombreUsuarioTalkMe,
      });


    showSnackbar("✅ Plantilla editada exitosamente", "success");
    console.log("Response: ", result);
    return result; // Retornar el resultado
  } catch (error) {
    console.error("Error en la solicitud:", error);
    console.error("Error detallado:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Guardar log de error
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });


    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};

// PLANTILLAS CARRUSEL
export const createTemplateCarouselGupshup = async (appId, authCode, templateData, idNombreUsuarioTalkMe, urlTemplatesGS, validateFn) => {
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

      // Agregar log antes de enviar para verificar los datos
      console.log("Datos que se enviarán:", {
        ...templateData,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });
      // Guardar log de error
      await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        CARDS: templateData.carousel,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });


      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      throw new Error(errorResponse.message || "Error al crear la plantilla");
    }

    const result = await response.json();

    // Guardar log exitoso
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        CARDS: templateData.carousel,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        GUPSHUP_TEMPLATE_ID: result.template.id,
        urlTemplatesGS,
        STATUS: "CREATED",
        REJECTION_REASON: null,
        CREADO_POR: idNombreUsuarioTalkMe,
      });


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

    // Guardar log de error
    await saveTemplateLog({
        TEMPLATE_NAME: templateData.templateName,
        APP_ID: appId,
        CATEGORY: templateData.selectedCategory,
        LANGUAGE_CODE: templateData.languageCode,
        TEMPLATE_TYPE: templateData.templateType,
        VERTICAL: templateData.vertical,
        CONTENT: templateData.message,
        CARDS: templateData.carousel,
        HEADER: templateData.header,
        FOOTER: templateData.footer,
        MEDIA_ID: templateData.mediaId,
        BUTTONS: JSON.stringify(templateData.buttons), // Probablemente necesita ser string
        EXAMPLE: templateData.example,
        EXAMPLE_HEADER: templateData.exampleHeader,
        ENABLE_SAMPLE: true,
        ALLOW_TEMPLATE_CATEGORY_CHANGE: false,
        urlTemplatesGS,
        CREADO_POR: idNombreUsuarioTalkMe,
        STATUS: "ERROR",
        REJECTION_REASON: errorResponse.message || "Solicitud inválida"
      });

      
    showSnackbar("❌ Error al crear la plantilla", "error");
    return null; // Retornar null en caso de error
  }
};

export const editTemplateCarouselGupshup = async (appId, authCode, templateData, idTemplate, validateFn) => {
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


  const url = `https://partner.gupshup.io/partner/app/${appId}/templates/${idTemplate}`;
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
  data.append("cards", carousel);


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
      throw new Error(errorResponse.message || "Error al editar la plantilla");
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla editada exitosamente", "success");
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

