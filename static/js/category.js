async function populateCategories() {
    const accessToken = localStorage.getItem("accessToken");
    const categoryDropdown = document.getElementById("category");
    const categoryPlaceholder = document.getElementById("category-placeholder");

    try {
      const response = await axios.get("http://api.cobraspace.xyz/api/post/categories/",{
        headers: {
            "Authorization": `Bearer ${accessToken}` // Include the access token in the request headers
        }
      });
      const categories = response.data;

      // Remove the placeholder option
      categoryDropdown.removeChild(categoryPlaceholder);

      // Populate the dropdown with categories
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  }

  // Call the function to populate categories when the page loads
window.addEventListener("DOMContentLoaded", populateCategories);