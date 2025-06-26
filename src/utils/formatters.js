/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
  };
};

// Using css pointer-event to disable pointer events on elements with class "interceptor-loading"
export const interceptorLoadingElements = (calling) => {
  // DOM get all elements with className "interceptor-loading"
  const elements = document.querySelectorAll(".interceptor-loading");
  for (let i = 0; i < elements.length; i++) {
    // When waitting for the API response, set opacity to 0.5 and disable pointer events
    if (calling) {
      elements[i].style.opacity = "0.5";
      elements[i].style.pointerEvents = "none";
    } else {
      // When the API response is received, set opacity to initial and enable pointer events
      elements[i].style.opacity = "initial";
      elements[i].style.pointerEvents = "initial";
    }
  }
};
