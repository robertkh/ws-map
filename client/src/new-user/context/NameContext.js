//?
import React, { useContext, useState } from "react";
const NameContext = React.createContext();

// todo - 1
export const useNameContext = () => {
	return useContext(NameContext);
};

// todo - 2
export const NameContextProvider = ({ children }) => {
	//
	const [name, setName] = useState("");

	//
	return (
		<NameContext.Provider value={[name, setName]}>
			{children}
		</NameContext.Provider>
	);
};
