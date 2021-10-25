import React, { useState, useEffect } from "react";

import Task from "./task.jsx";

let isReadyForPUT = false; // with this variable we prevent the first GET from causing a PUT

const TodoList = () => {
	const initialValue = [{ label: "initial task", done: false }];
	// we define list as a list of tasks. The 'inital task' is invisible.
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
		}).catch(error => alert(error));
	};

	const fetchGET = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/jaimecr24", {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				if (resp.status === 404) fetchPOST(); // user doesn't exists
				if (resp.ok) return resp.json();
			})
			.then(data => {
				if (Array.isArray(data)) {
					setList(data); // list modification !!
					isReadyForPUT = false; // To avoid causing a PUT
				}
			})
			.catch(error => alert(error));
	};

	const fetchDEL = () => {
		fetch("https://assets.breatheco.de/apis/fake/todos/user/jaimecr24", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		});
	};

	// Initial fetch to GET data
	useEffect(() => fetchGET(), []);

	// Each time list changes we do a PUT
	useEffect(() => {
		if (isReadyForPUT) {
			// We prevent the fetch from executing when GET modifies the list
			fetch(
				"https://assets.breatheco.de/apis/fake/todos/user/jaimecr24",
				{
					method: "PUT",
					body: JSON.stringify(list),
					headers: {
						"Content-Type": "application/json"
					}
				}
			)
				.then(resp => {
					if (resp.status === 404) {
						// user doesn't exists, then we send a POST
						fetch(
							"https://assets.breatheco.de/apis/fake/todos/user/jaimecr24",
							{
								method: "POST",
								body: JSON.stringify([]),
								headers: {
									"Content-Type": "application/json"
								}
							}
						)
							.then(resp => {
								if (resp.ok) {
									// if POST is ok, we send another time the PUT
									fetch(
										"https://assets.breatheco.de/apis/fake/todos/user/jaimecr24",
										{
											method: "PUT",
											body: JSON.stringify(list),
											headers: {
												"Content-Type":
													"application/json"
											}
										}
									).catch(error => alert(error)); // if error in PUT
								}
							})
							.catch(error => alert(error)); // if error in POST
					}
				})
				.catch(error => alert(error)); // if error in PUT
		} else {
			isReadyForPUT = true; // The following changes will be updated
		}
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
			<button
				onClick={() => {
					isReadyForPUT = false; // The next call to setList musn't cause a PUT
					setList(initialValue);
					fetchDEL(); // Deletes user and all his list.
				}}>
				Delete All
			</button>
		</div>
	);
};

export default TodoList;
