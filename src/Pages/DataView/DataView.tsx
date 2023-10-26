import { ReactElement, useEffect, useState } from "react";
import { CrimeData } from "../../types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { searchCrimeData } from "../../Api/client-api";

type DataViewProps = {
  crimeData: CrimeData[];
  postCode: string;
};

// styled component
const Button = styled.button`
  border: none;
  background-color: #6a35d0;
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: flex;
`;

export const DataView = (props: DataViewProps): ReactElement => {
  const { crimeData, postCode } = props;

  const [postcode, setPostcode] = useState<string | null>(null);
  const [groupedCrimeData, setGroupedCrimeData] = useState<{
    [category: string]: any[];
  }>({});
  const [crimeDataAvaialble, setCrimeDataAvailable] = useState<boolean>(true);

  useEffect(() => {
    // Group the crime data by category
    if (crimeData.length > 0) {
      setCrimeDataAvailable(false);
      const updatedGroupedCrimeData: { [category: string]: any[] } = {}; // Create a new object to store the updated data

      if (Array.isArray(crimeData)) {
        crimeData.forEach((crimeCategory) => {
          if (Array.isArray(crimeCategory)) {
            crimeCategory.forEach((eachCrime) => {
              const category = eachCrime.category;
              if (!updatedGroupedCrimeData[category]) {
                updatedGroupedCrimeData[category] = []; // Initialize if the category doesn't exist
              }
              updatedGroupedCrimeData[category].push(eachCrime);
            });
          } else {
            console.error(
              "Invalid data structure: crimeCategory is not an array"
            );
          }
        });
      } else {
        console.error("Invalid data structure: crimeData is not an array");
      }

      setGroupedCrimeData(updatedGroupedCrimeData);
    } else {
      setCrimeDataAvailable(true);
    }
  }, [crimeData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postcodesParam = params.get("postcode");
    setPostcode(postcodesParam);
    const newPostcodesArray: any = [postcodesParam];

    if (newPostcodesArray.length > 0) {
      searchCrimeData(newPostcodesArray);

      // Update query string with new postcodes
      const searchParams = new URLSearchParams();
      searchParams.set("postcode", newPostcodesArray.join(","));
      const queryString = searchParams.toString();
      const newUrl = window.location.pathname + "?" + queryString;
      window.history.pushState({}, "", newUrl);

      // Update state to reflect the new postcodes
      // setPostcodesArray(newPostcodesArray);
    }
  }, []);

  return (
    <>
      {crimeDataAvaialble && <p>There are no crimes in this area</p>}
      {groupedCrimeData ? (
        <>
          <Button>
            <Link to="/map">Go to Map View</Link>
          </Button>
          <div className="flex flex-col">
            {Object.keys(groupedCrimeData).map((category, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{category}</h2>
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Postcode
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Date of crime
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Approximate street name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Outcome status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedCrimeData[category].map(
                      (crime: CrimeData, crimeIndex: number) => (
                        <tr
                          key={crimeIndex}
                          className="border-b dark:border-neutral-500"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {crimeIndex + 1}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {postCode || postcode}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {crime.month}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {crime.location.street.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {crime.outcome_status?.category || "On Going"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};
