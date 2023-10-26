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

export const searchCrimeData = async (inputs: string | string[]) => {
  const crimeDataArray: any = [];

  if (Array.isArray(inputs)) {
    try {
      await Promise.all(
        inputs.map(async (input) => {
          try {
            const postcodesData = await getPostCodes(input);
            if (postcodesData.data?.latitude === undefined) {
              return;
            }
            const url = `https://data.police.uk/api/crimes-at-location?&lat=${postcodesData.data?.latitude}&lng=${postcodesData.data?.longitude}`;
            const crimeDataResponse = await fetch(url);

            if (!crimeDataResponse.ok) {
              throw new Error("Error in crime data fetch");
            }

            const crimeData = await crimeDataResponse.json();
            crimeDataArray.push(crimeData);
          } catch (error: any) {
            console.error(error.message);
          }
        })
      );

      return crimeDataArray;
    } catch (error) {
      console.error("Error fetching crime data:", error);
    }
  }
};
