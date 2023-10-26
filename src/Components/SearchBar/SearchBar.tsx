import { ReactElement, useEffect, useState } from "react";
import { CrimeData } from "../../types";
import { searchCrimeData } from "../../Api/client-api";
import { DataView } from "../../Pages/DataView/DataView";
import { HistoricSearch } from "../HistoricSearch/HistoricSearch";

export const SearchBar = (): ReactElement => {
  const [search, setSearch] = useState<string>("");
  const [postcodesArray, setPostcodesArray] = useState<string[]>([]);
  const [crimeData, setCrimeData] = useState<CrimeData[] | []>([]);
  const [combinedPostcodes, setCombinedPostcodes] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postcodesParam = params.get("postcode");
    if (postcodesParam) {
      const parsedPostcodes = postcodesParam.split(",");
      setPostcodesArray(parsedPostcodes);
      performSearch(parsedPostcodes);
    }
  }, []);

  const performSearch = async (postcodes: string[]) => {
    try {
      const data = await searchCrimeData(postcodes);
      setCrimeData(data);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const handleSubmit = async () => {
    const newPostcodesArray: string[] = search
      .split(",")
      .map((postcode) => postcode.trim());

    // Load existing postcodes from local storage
    const existingPostcodesString = localStorage.getItem("searchedPostcodes");
    const existingPostcodes: string[] = existingPostcodesString
      ? JSON.parse(existingPostcodesString)
      : [];

    // Combine existing and new postcodes, remove duplicates
    const combinedPostcodesSet = new Set([
      ...existingPostcodes,
      ...newPostcodesArray,
    ]);

    // Convert the Set back to an array using the spread operator
    setCombinedPostcodes([...combinedPostcodesSet]);

    // Store the combined postcodes in local storage
    localStorage.setItem(
      "searchedPostcodes",
      JSON.stringify(combinedPostcodes)
    );

    if (newPostcodesArray.length > 0) {
      const data = await searchCrimeData(newPostcodesArray);
      setCrimeData(data);

      // Update query string with new postcodes
      const searchParams = new URLSearchParams();
      searchParams.set("postcode", newPostcodesArray.join(","));
      const queryString = searchParams.toString();
      const newUrl = window.location.pathname + "?" + queryString;
      window.history.pushState({}, "", newUrl);

      // Update state to reflect the new postcodes
      setPostcodesArray(newPostcodesArray);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label
          className=" text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          htmlFor="name"
        >
          Search Postcode:
        </label>
        <input
          className="bg-gray-200 appearance-none border-2 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="name"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="enter postcode"
        />
      </form>
      <div className="mt-5 mb-5">
        <DataView crimeData={crimeData} postCode={search} />
      </div>
      <HistoricSearch postcodesArray={postcodesArray} />
    </div>
  );
};
