// Función para validar si una URL es válida
export const isValidURL = (url) => {
    try {
      // Verificar formato básico de URL usando expresión regular
      const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocolo (opcional)
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // dominio
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // O dirección IP
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // puerto y ruta
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragmento
        'i'
      );
      
      if (!urlPattern.test(url)) {
        return false;
      }
      
      // Intentar crear un objeto URL (esto validará estructura adicional)
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Función de validación y actualización para integrar en tu código
  export const updateButtonWithValidation = (buttonId, field, value) => {
    if (field === "url") {
      const isValid = isValidURL(value);
      
      // Actualiza el estado del botón con la nueva URL y su validez
      setButtons(prevButtons => 
        prevButtons.map(button => 
          button.id === buttonId 
            ? { 
                ...button, 
                [field]: value, 
                urlIsValid: isValid 
              } 
            : button
        )
      );
      
      // Si la URL no es válida, puedes mostrar un mensaje de error
      if (!isValid && value.trim() !== '') {
        setValidationErrors(prev => ({
          ...prev,
          [buttonId]: "La URL ingresada no es válida. Por favor ingrese una URL válida."
        }));
      } else {
        // Eliminar el error si existe y la URL ahora es válida
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[buttonId];
          return newErrors;
        });
      }
    } else {
      // Para otros campos que no necesitan validación
      setButtons(prevButtons => 
        prevButtons.map(button => 
          button.id === buttonId ? { ...button, [field]: value } : button
        )
      );
    }
  };