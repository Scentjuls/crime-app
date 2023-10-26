import { ReactElement, useState } from "react";

export const SearchBar = (): ReactElement => {
  const [search, setSearch] = useState<string>("");
  const handleSubmit = () => {};
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
    </div>
  );
};
