import { render, screen } from "@testing-library/react";
import { HistoricSearch } from "../HistoricSearch";
import { BrowserRouter } from "react-router-dom";

const HistoricSearchProps = {
  postcodesArray: ["b28 8es", "ha0 2qh"],
};

describe("HistoricSearch", () => {
  it("should render without any errors", () => {
    render(
      <BrowserRouter>
        <HistoricSearch {...HistoricSearchProps} />
      </BrowserRouter>
    );

    const historicSearchText = screen.getByRole("heading", {
      name: /Historic Searches/i,
    });
    expect(historicSearchText).toBeInTheDocument();
  });
});
