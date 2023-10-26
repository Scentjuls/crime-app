import React, {
  useState,
  useEffect,
  ReactElement,
  PropsWithChildren,
} from "react";
import errorImage from "../../assets/error.jpeg";
import { useNavigate } from "react-router-dom";

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

export const ErrorBoundary = (
  props: PropsWithChildren<ErrorBoundaryProps>
): ReactElement => {
  const { children } = props;
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("error", error);
      setHasError(true);
    };

    // Add an error event listener to the window
    window.addEventListener("error", errorHandler);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <>
        <div className="bg-gray-200 flex h-screen min-h-full justify-center items-center">
          <div className="text-center">
            <h1 className="text-7xl text-black">500 - Internal Server Error</h1>
            <p className="not-found-text text-gray-500 mt-5 text-2xl">
              Oops! The page you are looking for might be in another galaxy.
            </p>
            <button
              className="mx-auto block m-2 btn-background-purple hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded mb-5"
              onClick={() => navigate("/")}
            >
              Go Back
            </button>
            <img
              src={errorImage}
              alt="500 Error with man kneeling in front of several servers"
              className="m-auto"
            />
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
};
