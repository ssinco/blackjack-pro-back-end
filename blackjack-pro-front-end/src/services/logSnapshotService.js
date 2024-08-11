const BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;


// Show all of the game logs for the user
const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}/game/count-snapshot`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// Create a record of the game
const create = async (formData) => {
    try {
    console.log('create function')
      const res = await fetch(`${BASE_URL}/game/count-snapshot`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  export {
    index,
    create,
  }