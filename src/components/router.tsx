import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import { Header } from "./header";

export const Router = () => {
	return (
    <>
      <Header />
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</>
	);
};
