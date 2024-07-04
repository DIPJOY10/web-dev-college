// JavaScript program to print all
// paths from a source to
// destination.

var v;
var arr = [];
let adjList = [];

// A directed graph using
// adjacency list representation
function Graph(vertices) {
	// initialise vertex count
	v = vertices;

	// initialise adjacency list
	initAdjList();
}

// utility method to initialise
// adjacency list
function initAdjList() {
	adjList = new Array(v);

	for (let i = 0; i < v; i++) {
		adjList[i] = [];
	}
}

// add edge from u to v
function addEdge(u, v) {
	// Add v to u's list.
	// console.log("list = ", adjList, u);
	adjList[u].push(v);
}

// Prints all paths from
// 's' to 'd'
function printAllPaths(s, d) {
	let isVisited = new Array(v);
	for (let i = 0; i < v; i++) isVisited[i] = false;
	let pathList = [];

	// add source to path[]
	pathList.push(s);

	// Call recursive utility
	printAllPathsUtil(s, d, isVisited, pathList);
}

// A recursive function to print
// all paths from 'u' to 'd'.
// isVisited[] keeps track of
// vertices in current path.
// localPathList<> stores actual
// vertices in the current path
function printAllPathsUtil(u, d, isVisited, localPathList) {
	if (u == d) {
		// console.log(localPathList);
		arr = [...arr, [...localPathList]];
		// if match found then no need to
		// traverse more till depth
		return;
	}

	// Mark the current node
	isVisited[u] = true;

	// Recur for all the vertices
	// adjacent to current vertex
	for (let i = 0; i < adjList[u].length; i++) {
		if (!isVisited[adjList[u][i]]) {
			// store current node
			// in path[]
			localPathList.push(adjList[u][i]);
			printAllPathsUtil(adjList[u][i], d, isVisited, localPathList);

			// remove current node
			// in path[]
			localPathList.splice(localPathList.indexOf(adjList[u][i]), 1);
		}
	}

	// Mark the current node
	isVisited[u] = false;
}

// Driver program
// Create a sample graph
export default function dfs(nodes) {
	// console.log("nodes = here = ", nodes);
	arr = [];
	let issues = nodes.map((obj) => {
		return {
			_id: obj?.issue?._id,
			source: obj?.connectedToStart
				? ["start", ...obj?.source]
				: [...obj?.source],
			destination: obj?.connectedToEnd
				? ["finish", ...obj?.destination]
				: [...obj?.destination],
		};
	});
	let end = issues.length + 1;
	var issueDict = { start: 0, finish: end };
	var issueReverseDict = { 0: "start", end: "finish" };
	const initialEdges = [
		issues.map((Obj, indexid) => {
			issueDict[Obj._id] = indexid + 1;
			issueReverseDict[indexid + 1] = Obj._id;
			return [
				...Obj.source.map((sid, index) => {
					return {
						source: sid,
						target: Obj._id,
					};
				}),
				...Obj.destination.map((did, idx) => {
					return {
						source: Obj._id,
						target: did,
					};
				}),
			];
		}),
	].flat(3);
	// console.log("edges = ", initialEdges);
	let newinitialEdges = initialEdges.filter(
		(value, index, self) =>
			index ===
			self.findIndex(
				(t) => t.source === value.source && t.target === value.target
			)
	);
	// console.log("edge= ", newinitialEdges);
	Graph(issues.length + 2);
	// make dictionary of key = issueid and
	newinitialEdges.map((obj) => {
		addEdge(issueDict[obj.source], issueDict[obj.target]);
	});

	// arbitrary source
	let s = 0;

	// arbitrary destination
	let d = issues.length + 1;

	printAllPaths(s, d);
	return { arr, issueReverseDict };
}

// This code is contributed by avanitrachhadiya2155
