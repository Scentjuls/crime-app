const getPostCodes = async (input: string) => {
  const url = "http://api.getthedata.com/postcode/" + input;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error in postcode fetch");
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
