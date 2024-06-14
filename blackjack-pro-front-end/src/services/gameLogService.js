const BASE_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;



const create = async (formData) => {
    try {
    console.log('create function')
      const res = await fetch(`${BASE_URL}/game/count-single`, {
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
    create,

  }