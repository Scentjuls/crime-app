import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type HistoricSearchProps = {
  postcodesArray: string[];
};

// styled component
const Header = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const Span = styled.span`
  margin-right: 30px;
`;

export const HistoricSearch = (props: HistoricSearchProps): ReactElement => {
  const { postcodesArray } = props;

  const [searchedPostcodes, setSearchedPostcodes] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load searched postcodes from localStorage on component mount
  useEffect(() => {
    if (postcodesArray) {
      setSearchedPostcodes(postcodesArray);
    }
  }, [postcodesArray]);

  // Save searched postcodes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "searchedPostcodes",
      JSON.stringify(searchedPostcodes)
    );
  }, [searchedPostcodes]);

  const handleRemovePostcode = (postcodeToRemove: string) => {
    const updatedPostcodes = searchedPostcodes.filter(
      (postcode) => postcode !== postcodeToRemove
    );
    setSearchedPostcodes(updatedPostcodes);

    // Call a function to update the query string (explained in the next step)
    updateQueryString(updatedPostcodes);
  };

  const updateQueryString = (postcodes: string[]) => {
    const searchParams = new URLSearchParams();
    searchParams.set("postcode", postcodes.join(","));

    // Replace the current state in the browser history with an empty query string
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  const handlePostcodeClick = (postcode: string) => {
    // Update query string and navigate to Data View screen
    navigate(`/?postcode=${postcode}`);
  };

  return (
    <>
      {searchedPostcodes ? (
        <div>
          <Header>Historic Searches</Header>
          <ul>
            {searchedPostcodes.map((postcode, index) => (
              <li className="mt-3" key={index}>
                <Span
                  onClick={() => handlePostcodeClick(postcode)}
                  style={{ cursor: "pointer" }}
                >
                  {postcode}
                </Span>
                <button onClick={() => handleRemovePostcode(postcode)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>There is no recent history search</p>
      )}
    </>
  );
};
