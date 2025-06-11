import React from "react";
import ReactDOM from "react-dom";
import FileUpload from "./components/FileUpload";

function App() {
  const handleResult = (result) => {
    console.log("Server returned:", result);
    // e.g. update chat context or display parsed plan
  };
  console.log("API base URL:", process.env.REACT_APP_API_BASE);
  return (
    <div className="App">
      {/* your existing UI */}
      <section style={{ marginTop: "2rem" }}>
        <h2 className="text-2xl font-semibold text-center">
          Upload New Flight Plan
        </h2>
        <FileUpload onFileProcessed={handleResult} />
      </section>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
