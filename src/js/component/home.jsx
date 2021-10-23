import React from "react";

import TodoList from "./todolist.jsx";

const Home = () => {
	return (
		<div className="text-center fs-5 mt-5">
			<h1>todos</h1>
			<TodoList />
		</div>
	);
};

export default Home;
