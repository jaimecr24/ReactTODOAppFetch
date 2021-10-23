import React, { useState, useEffect } from "react";

import Task from "./task.jsx";

const fetchDEL = async () => {
	await fetch("https://assets.breatheco.de/apis/fake/todos/user/jaimecr24", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	});
};
//fetchDEL();

const TodoList = () => {
	const initialValue = [{ label: "initial task", done: false }];
	// we define list as a list of tasks. The initial value is []
	const [list, setList] = useState(initialValue);
	// inputValue is the value of tag <input>
	const [inputValue, setInputValue] = useState("");

	const fetchPOST = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/jaimecr24", {
			method: "POST",
			body: JSON.stringify([]),
			headers: {
				"Content-Type": "application/json"
			}
		});
	};

	const fetchGET = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/jaimecr24", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				if (resp.status === 404) fetchPOST();
				if (resp.ok) return resp.json();
			})
			.then(data => {
				if (Array.isArray(data)) setList(data);
			})
			.catch(error => alert(error));
	};

	// Initial fetch to GET data
	useEffect(() => fetchGET(), []);

	// Each time list changes we do a PUT
	useEffect(() => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/jaimecr24", {
			method: "PUT",
			body: JSON.stringify(list),
			headers: {
				"Content-Type": "application/json"
			}
		}).catch(error => alert(error));
	}, [list]);

	// we map list on listItems to do the html
	// each item has a Task container to represent the task.
	// we pass the list and setList function because Task will update the list of tasks.
	const listItems = list.map // If list.map != undefined we return the function list.map, else we return "".
		? list.map((value, index) => {
				if (index === 0) return "";
				return (
					<div key={index}>
						<Task
							strItem={value.label}
							fDelete={() =>
								setList(list.filter((e, i) => i !== index))
							}
						/>
						<hr />
					</div>
				);
		  })
		: "";

	return (
		<div className="container border border-danger bg-warning bg-opacity-25 p-2">
			<input
				className="mb-3 w-75"
				type="text"
				placeholder="Next task to do..."
				onChange={e => {
					setInputValue(e.target.value);
				}}
				value={inputValue}
				onKeyPress={e => {
					if (e.key === "Enter") {
						setList(
							list.concat({ label: inputValue, done: false })
						);
						setInputValue("");
					}
				}}
			/>
			<div className="px-3">{listItems}</div>
			<div className="text-start px-3 mb-3 fw-bold">
				{list.length ? list.length - 1 : 0} items left
			</div>
			<button onClick={() => setList(initialValue)}>Delete All</button>
		</div>
	);
};

export default TodoList;
